mod error;

use error::{ProxyCheckerError, Result};
use futures::stream::FuturesUnordered;
use itertools::Itertools;
use rayon::prelude::*;
use regex::Regex;
use serde::Serialize;

use std::fmt;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

#[derive(Clone, Serialize)]
pub enum EventStatus {
    Success,
    Error,
}

#[derive(Clone)]
#[cfg_attr(test, derive(Debug, PartialEq))]
pub struct Proxy {
    // Perhaps it's better to make `protocol` as enum
    protocol: String,
    login: Option<String>,
    password: Option<String>,
    ip: String,
    port: String,
    pattern: String,
}

impl Proxy {
    fn new<T: Into<String>>(
        protocol: T,
        login: Option<T>,
        password: Option<T>,
        ip: T,
        port: T,
        pattern: T,
    ) -> Self {
        Self {
            protocol: protocol.into(),
            login: login.map(|l| l.into()),
            password: password.map(|p| p.into()),
            ip: ip.into(),
            port: port.into(),
            pattern: pattern.into(),
        }
    }

    fn protocol(&self) -> &str {
        &self.protocol
    }

    fn login(&self) -> Option<&str> {
        self.login.as_deref()
    }

    fn password(&self) -> Option<&str> {
        self.password.as_deref()
    }

    fn ip(&self) -> &str {
        &self.ip
    }

    fn port(&self) -> &str {
        &self.port
    }

    fn pattern(&self) -> &str {
        &self.pattern
    }

    fn from_string(pattern: &str, proxy: &str, default_protocol: &str) -> Result<Self> {
        // It might be better to throw `ProxyCheckerError::Regex` not in an event
        let re = Regex::new(&build_regex(pattern))?;
        let caps = re
            .captures(proxy)
            .ok_or(ProxyCheckerError::RegexPatternMismatch {
                proxy: proxy.to_owned(),
                pattern: pattern.to_owned(),
            })?;

        Ok(Self::new(
            caps.name("protocol")
                .map_or(default_protocol, |m| m.as_str()),
            caps.name("login").map(|m| m.as_str()),
            caps.name("password").map(|m| m.as_str()),
            caps.name("ip")
                .ok_or(ProxyCheckerError::RegexMissingIp(proxy.to_owned()))?
                .as_str(),
            caps.name("port")
                .ok_or(ProxyCheckerError::RegexMissingPort(proxy.to_owned()))?
                .as_str(),
            pattern,
        ))
    }

    fn get_reqwest_proxy(&self) -> Result<reqwest::Proxy> {
        let mut proxy = reqwest::Proxy::all(format!(
            "{}://{}:{}",
            self.protocol(),
            self.ip(),
            self.port()
        ))?;

        if let (Some(login), Some(password)) = (self.login(), self.password()) {
            proxy = proxy.basic_auth(login, password);
        }

        Ok(proxy)
    }

    async fn send_request(self, url: &str, timeout: u64) -> Result<ProxyWithLatency> {
        let proxy = self.get_reqwest_proxy()?;

        let client = reqwest::Client::builder()
            .proxy(proxy)
            .timeout(Duration::from_millis(timeout))
            .build()?;

        let start = Instant::now();

        client.get(url).send().await?;

        Ok(ProxyWithLatency::new(self, start.elapsed()))
    }
}

impl fmt::Display for Proxy {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let string = self
            .pattern()
            .replace("protocol", self.protocol())
            // It doesn't affect anything, but `unwrap_or_default` is not the best solution (match is better)
            .replace("login", self.login().unwrap_or_default())
            .replace("password", self.password().unwrap_or_default())
            .replace("ip", self.ip())
            .replace("port", self.port());
        write!(f, "{string}")
    }
}

struct ProxyWithLatency {
    proxy: Proxy,
    latancy: Duration,
}

impl ProxyWithLatency {
    fn new(proxy: Proxy, latancy: Duration) -> Self {
        Self { proxy, latancy }
    }
}

fn build_regex(pattern: &str) -> String {
    pattern
        .replace("protocol", r"(?P<protocol>\w+)")
        .replace("login", r"(?P<login>[^:@]+)")
        .replace("password", r"(?P<password>[^:@]+)")
        .replace("ip", r"(?P<ip>(?:\d{1,3}\.){3}\d{1,3})")
        .replace("port", r"(?P<port>\d+)")
}

pub fn parse_and_filter_proxies<F>(
    proxies: String,
    pattern: String,
    default_protocol: String,
    event_handler: F,
) -> (Vec<Proxy>, usize)
where
    F: Fn(EventStatus, String) + Sync,
{
    let lines = proxies
        .trim()
        .lines()
        .map(str::trim)
        .unique()
        .collect::<Vec<_>>();

    let proxies = lines
        .into_par_iter()
        .filter_map(|proxy| {
            Proxy::from_string(&pattern, proxy, &default_protocol)
                .map_err(|e| event_handler(EventStatus::Error, format!("Error parsing proxy: {e}")))
                .ok()
        })
        .collect::<Vec<_>>();

    let length = proxies.len();

    (proxies, length)
}

pub async fn check_proxies<F>(
    proxies: Vec<Proxy>,
    url: String,
    timeout: u64,
    event_handler: F,
) -> Vec<String>
where
    F: Fn(EventStatus, String) + Send + 'static,
{
    let event_handler = Arc::new(Mutex::new(event_handler));
    let tasks = proxies
        .into_iter()
        .map(|proxy| {
            let proxy_string = proxy.to_string();
            let url = url.clone();
            let event_handler = event_handler.clone();

            tokio::spawn(async move {
                match proxy.send_request(&url, timeout).await {
                    Ok(proxy) => {
                        event_handler.lock().unwrap()(
                            EventStatus::Success,
                            format!("Success: {proxy_string} ({} ms)", proxy.latancy.as_millis()),
                        );
                        Ok(proxy)
                    }
                    Err(err) => {
                        event_handler.lock().unwrap()(
                            EventStatus::Error,
                            format!("Error: {proxy_string} ({err})"),
                        );
                        Err(err)
                    }
                }
            })
        })
        .collect::<FuturesUnordered<_>>();

    let result = futures::future::join_all(tasks).await;

    // This can be refactored
    result
        .into_iter()
        .filter_map(|join_result| match join_result {
            Ok(Ok(proxy)) => Some(proxy),
            _ => None,
        })
        .sorted_by_key(|proxy| proxy.latancy)
        .map(|proxy| proxy.proxy.to_string())
        .collect::<Vec<_>>()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn setup() -> Vec<Proxy> {
        vec![
            Proxy::new(
                "http",
                Some("test"),
                Some("test"),
                "1.1.1.1",
                "80",
                "protocol://login:password@ip:port",
            ),
            Proxy::new("http", None, None, "1.1.1.1", "80", "protocol://ip:port"),
            Proxy::new("socks5", None, None, "1.1.1.1", "80", "ip:port"),
        ]
    }

    #[test]
    fn test_proxy_new() {
        let proxies = setup();

        let expected_proxy0 = Proxy {
            protocol: "http".to_owned(),
            login: Some("test".to_owned()),
            password: Some("test".to_owned()),
            ip: "1.1.1.1".to_owned(),
            port: "80".to_owned(),
            pattern: "protocol://login:password@ip:port".to_owned(),
        };

        assert_eq!(proxies[0], expected_proxy0);

        let expected_proxy1 = Proxy {
            protocol: "http".to_owned(),
            login: None,
            password: None,
            ip: "1.1.1.1".to_owned(),
            port: "80".to_owned(),
            pattern: "protocol://ip:port".to_owned(),
        };

        assert_eq!(proxies[1], expected_proxy1);

        let expected_proxy2 = Proxy {
            protocol: "socks5".to_owned(),
            login: None,
            password: None,
            ip: "1.1.1.1".to_owned(),
            port: "80".to_owned(),
            pattern: "ip:port".to_owned(),
        };

        assert_eq!(proxies[2], expected_proxy2);
    }

    #[test]
    fn test_proxy_from_string() {
        let proxies = setup();

        let test_cases = vec![
            (
                "protocol://login:password@ip:port",
                "http://test:test@1.1.1.1:80",
                "http",
                proxies[0].clone(),
            ),
            (
                "protocol://ip:port",
                "http://1.1.1.1:80",
                "http",
                proxies[1].clone(),
            ),
            ("ip:port", "1.1.1.1:80", "socks5", proxies[2].clone()),
        ];

        for (pattern, proxy_string, default_protocol, expected_proxy) in test_cases {
            let proxy = Proxy::from_string(pattern, proxy_string, default_protocol).unwrap();
            assert_eq!(proxy, expected_proxy);
        }
    }

    #[test]
    fn test_proxy_to_string() {
        let proxies = setup();
        let expected = vec![
            "http://test:test@1.1.1.1:80",
            "http://1.1.1.1:80",
            "1.1.1.1:80",
        ];

        for (proxy, expected) in proxies.into_iter().zip(expected.into_iter()) {
            assert_eq!(proxy.to_string(), *expected);
        }
    }

    fn emit_new_log_event(status: EventStatus, message: String) {
        match status {
            EventStatus::Success => println!("{}", message),
            EventStatus::Error => eprintln!("{}", message),
        };
    }

    #[test]
    fn test_parse_and_filter_proxies() {
        let proxies = "1.1.1.1:80\n2.2.2.2:80".to_owned();
        let pattern = "ip:port".to_owned();
        let default_protocol = "http".to_owned();

        let (proxies, length) =
            parse_and_filter_proxies(proxies, pattern, default_protocol, emit_new_log_event);

        let expected_proxy0 = Proxy::new("http", None, None, "1.1.1.1", "80", "ip:port");
        let expected_proxy1 = Proxy::new("http", None, None, "2.2.2.2", "80", "ip:port");

        assert_eq!(proxies[0], expected_proxy0);
        assert_eq!(proxies[1], expected_proxy1);
        assert_eq!(length, 2);
    }

    #[tokio::test]
    async fn test_check_proxies() {
        let proxies = setup();
        let url = "http://example.com".to_owned();
        let timeout = 5000;

        let results = check_proxies(proxies, url, timeout, emit_new_log_event).await;

        assert_eq!(results.len(), 2);
    }
}
