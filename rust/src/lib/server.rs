#![cfg_attr(rustfmt, rustfmt_skip)]

use salvo::{
    catcher::Catcher,
    conn::rustls::{Keycert, RustlsConfig},
    prelude::{Listener, TcpListener},
    server::{Server, ServerHandle},
    Error, Service,
};
use tokio::signal::{self, unix};
use tracing::{error, info};

use super::env::Env;
use super::router;

/// Start server host with http request service.
pub async fn start() -> Result<(), Error> {
    let env = Env::get_env();
    let service = Service::new(router::new())
        .catcher(Catcher::default()
            .hoop(router::handle_cors())
        );
    if env.app_mode == env.app_mode_dev {
        let host = format!("{}:{}", &env.server_host_dev, &env.server_port);
        start_http_server(&host, service).await;
    } else if env.app_mode == env.app_mode_prod {
        let host = format!("{}:{}", &env.server_host_prod, &env.server_port);
        start_https_server(&host, service, &env.server_tls_cert, &env.server_tls_key).await?;
    } else {
        error!("app mode set incorrctly: {}", &env.app_mode);
    }
    Ok(())
}

// Start development HTTP/1.1 server.
async fn start_http_server(host: &str, service: Service) {
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
async fn start_https_server(host: &str, service: Service, tls_cert: &str, tls_key: &str) -> Result<(), Error> {
    let tls_config = RustlsConfig::new(
        Keycert::new()
            .cert_from_path(tls_cert)?
            .key_from_path(tls_key)?
    );
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
    Ok(())
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
