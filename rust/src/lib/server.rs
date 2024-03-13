#![cfg_attr(rustfmt, rustfmt_skip)]

use salvo::{
    catcher::Catcher,
    conn::rustls::{Keycert, RustlsConfig},
    prelude::{Listener, TcpListener},
    server::{Server, ServerHandle},
    Service,
};
use tokio::signal::{self, unix};
use tracing::{error, info};

use super::env::Env;
use super::router;

/// Set server host to service http requests.
pub async fn set_server() {
    let env = Env::get_env();
    let host = format!("{}:{}", &env.server_host, &env.server_port);
    let service = get_service();
    if env.app_mode == env.app_mode_dev {
        start_development_http_server(&host, service).await;
    } else if env.app_mode == env.app_mode_prod {
        start_production_https_server(&host, service).await;
    } else {
        return error!("app mode set incorrctly: {}", &env.app_mode);
    }
}

/// Instantiate router and CORS service to handle http requests.
fn get_service() -> Service {
    Service::new(router::new())
        .catcher(Catcher::default()
            .hoop(router::handle_cors())
        )
}

/// Return configuration for the tls server.
fn get_tls_config() -> RustlsConfig {
    let env = Env::get_env();
    RustlsConfig::new(
        Keycert::new()
            .cert(env.ssl_cert.as_bytes())
            .key(env.ssl_key.as_bytes())
    )
}

// Start development HTTP/1.1 server.
async fn start_development_http_server(host: &str, service: Service) {
    let acceptor = TcpListener::new(host)
        .bind()
        .await;
    let server = Server::new(acceptor);
    let handle = server.handle();
    tokio::spawn(listen_shutdown_signal(handle));
    server
        .serve(service)
        .await;
}

// Start production HTTPS/1.1 server.
async fn start_production_https_server(host: &str, service: Service) {
    let tls_config = get_tls_config();
    let acceptor = TcpListener::new(host)
        .rustls(tls_config)
        .bind()
        .await;
    let server = Server::new(acceptor);
    let handle = server.handle();
    tokio::spawn(listen_shutdown_signal(handle));
    server
        .serve(service)
        .await;
}

/// Listen for shutdown signal.
async fn listen_shutdown_signal(handle: ServerHandle) {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };
    let terminate = async {
        unix::signal(unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };
    tokio::select! {
        _ = ctrl_c => info!("ctrl_c signal received"),
        _ = terminate => info!("terminate signal received"),
    };
    handle.stop_graceful(None);
}
