#![cfg_attr(rustfmt, rustfmt_skip)]

use salvo::{
    Error,
    catcher::Catcher,
    conn::rustls::{Keycert, RustlsConfig},
    prelude::{Listener, Service, TcpListener},
    server::{Server, ServerHandle},
};
use tokio::signal::{self, unix};
use tracing::{error, info};

use super::env::Env;
use super::router;

/// Create http request service.
fn create_service() -> Service {
    let router = router::new();
    let handle_cors = router::handle_cors();
    Service::new(router)
        .catcher(Catcher::default()
            .hoop(handle_cors)
        )
}

/// Set server host with http request service.
pub async fn set_server(env: &Env) -> Result<(), Error> {
    let host = format!("{}:{}", &env.server_host, &env.server_port);
    let service = create_service();
    if env.app_env == env.dev_env {
        set_http_server(&host, service).await?;
    } else if env.app_env == env.prod_env {
        let tls_cert = env.tls_cert.as_str();
        let tls_key = env.tls_key.as_str();
        set_https_server(&host, service, tls_cert, tls_key).await?;
    } else {
        error!("app environment set incorrctly: {}", &env.app_env);
    }
    Ok(())
}

/// Set development HTTP/1.1 server.
async fn set_http_server(host: &str, service: Service) -> Result<(), Error> {
    let acceptor = TcpListener::new(host)
        .bind()
        .await;
    let server = Server::new(acceptor);
    let server_handle = server.handle();
    tokio::spawn(listen_shutdown_signal(server_handle));
    server
        .serve(service)
        .await;
    Ok(())
}

/// Set production HTTPS/1.1 server.
async fn set_https_server(host: &str, service: Service, tls_cert: &str, tls_key: &str) -> Result<(), Error> {
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
    let server_handle = server.handle();
    tokio::spawn(listen_shutdown_signal(server_handle));
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

#[cfg(test)]
mod test {
    use super::*;

    #[tokio::test]
    async fn tls_cert_err() {
        let env = Env::get_env();
        let host = format!("{}:{}", &env.server_host, &env.server_port);
        let service = create_service();
        let tls_cert = "/etc/letsencrypt/fullchain.pem";
        let result = set_https_server(&host, service, tls_cert, env.tls_key.as_str()).await;
        assert!(matches!(result, Err(_)));
    }

    #[tokio::test]
    async fn tls_key_err() {
        let env = Env::get_env();
        let host = format!("{}:{}", &env.server_host, &env.server_port);
        let service = create_service();
        let tls_key = "/etc/letsencrypt/privkey.pem";
        let result = set_https_server(&host, service, env.tls_cert.as_str(), tls_key).await;
        assert!(matches!(result, Err(_)));
    }
}
