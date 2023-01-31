use thiserror::Error;

pub type Result<T> = std::result::Result<T, ProxyCheckerError>;

#[derive(Error, Debug)]
pub enum ProxyCheckerError {
    #[error("given invalid expression for Regex::new(re: &str)")]
    Regex(#[from] regex::Error),
    #[error("proxy '{proxy}' does not match pattern '{pattern}'")]
    RegexPatternMismatch { proxy: String, pattern: String },
    #[error("ip is a required field for '{0}'")]
    RegexMissingIp(String),
    #[error("port is a required field for '{0}'")]
    RegexMissingPort(String),
    // Or just #[error(transparent)]
    #[error("request processing error: '{0}'")]
    Reqwest(#[from] reqwest::Error),
}
