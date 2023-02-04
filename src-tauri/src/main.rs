#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use checker_library::{check_proxies, parse_and_filter_proxies, EventStatus, Proxy};
use log::{error, info};
use serde::Serialize;
use uuid::Uuid;

use std::cmp;
use std::sync::{Arc, Mutex};

#[derive(Clone, Serialize)]
struct LogPayload {
    key: Uuid,
    status: EventStatus,
    message: String,
}

impl LogPayload {
    fn new(status: EventStatus, message: String) -> Self {
        Self {
            key: Uuid::new_v4(),
            status,
            message,
        }
    }
}

struct Proxies(Arc<Mutex<Vec<Proxy>>>);
struct WorkingProxies(Mutex<Vec<String>>);

#[tauri::command]
fn parse_and_filter_proxies_command(
    window: tauri::Window,
    state: tauri::State<Proxies>,
    proxies: String,
    pattern: String,
    default_protocol: String,
) -> usize {
    let (proxies, length) =
        parse_and_filter_proxies(proxies, pattern, default_protocol, |status, message| {
            emit_new_log_event(&window, status, message);
        });

    *state.0.lock().unwrap() = proxies;

    length
}

#[tauri::command]
async fn check_proxies_command(
    window: tauri::Window,
    state: tauri::State<'_, Proxies>,
    success: tauri::State<'_, WorkingProxies>,
    url: String,
    timeout: u64,
    threads: usize,
) -> Result<(), ()> {
    let proxies = state.0.lock().unwrap().to_vec();

    let result = check_proxies(proxies, url, timeout, move |status, message| {
        emit_new_log_event(&window, status, message);
    }, threads)
    .await;

    *success.0.lock().unwrap() = result;

    Ok(())
}

fn emit_new_log_event(window: &tauri::Window, status: EventStatus, message: String) {
    match status {
        EventStatus::Success => info!("{}", message),
        EventStatus::Error => error!("{}", message),
    };

    if let Err(err) = window.emit("new-log", Some(LogPayload::new(status, message))) {
        error!("Error emitting new-log event: {}", err)
    }
}

#[tauri::command]
async fn download_proxies_command(success: tauri::State<'_, WorkingProxies>) -> Result<String, ()> {
    let proxies = success.0.lock().unwrap();
    let proxies = proxies.join("\n");

    Ok(proxies)
}

fn main() {
    env_logger::init();
    // Half of the threads are used to reduce the CPU load
    let num_threads = cmp::max(1, num_cpus::get() / 2);

    rayon::ThreadPoolBuilder::new()
        .num_threads(num_threads)
        .build_global()
        .unwrap();

    tauri::Builder::default()
        .manage(Proxies(Arc::new(Mutex::new(Vec::new()))))
        .manage(WorkingProxies(Mutex::new(Vec::new())))
        .invoke_handler(tauri::generate_handler![
            parse_and_filter_proxies_command,
            check_proxies_command,
            download_proxies_command,
        ])
        .plugin(tauri_plugin_store::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
