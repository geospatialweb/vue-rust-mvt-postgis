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

/// Set http request service.
pub async fn set_service() -> Result<(), Error> {
    let router = router::new();
    let handle_cors = router::handle_cors();
    let service = Service::new(router)
        .catcher(Catcher::default()
            .hoop(handle_cors)
        );
    set_server_host(service).await?;
    Ok(())
}

/// Set server host with http request service.
async fn set_server_host(service: Service) -> Result<(), Error> {
    let env = Env::get_env();
    if env.app_mode == env.app_mode_dev {
        let host = format!("{}:{}", &env.server_host_dev, &env.server_port);
        start_http_server(&host, service).await;
    } else if env.app_mode == env.app_mode_prod {
        let host = format!("{}:{}", &env.server_host_prod, &env.server_port);
        let tls_cert = &env.tls_cert;
        let tls_key = &env.tls_key;
        start_https_server(&host, service, tls_cert, tls_key).await?;
    } else {
        error!("app mode set incorrctly: {}", &env.app_mode);
    }
    Ok(())
}

/// Start development HTTP/1.1 server.
async fn start_http_server(host: &str, service: Service) {
    let acceptor = TcpListener::new(host)
        .bind()
        .await;
    let server = Server::new(acceptor);
    let server_handle = server.handle();
    tokio::spawn(listen_shutdown_signal(server_handle));
    server
        .serve(service)
        .await;
}

/// Start production HTTPS/1.1 server.
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

    fn get_host() -> String {
        let env = Env::get_env();
        format!("{}:{}", &env.server_host_prod, &env.server_port)
    }

    fn get_service() -> Service {
        Service::new(router::new())
            .catcher(Catcher::default()
                .hoop(router::handle_cors())
            )
    }

    #[tokio::test]
    async fn tls_cert_err() {
        let host = get_host();
        let service = get_service();
        let tls_cert = "/etc/letsencrypt/fullchain.pem";
        let tls_key = "/etc/letsencrypt/live/geospatialweb.ca/privkey.pem";
        let result = start_https_server(&host, service, tls_cert, tls_key).await;
        assert!(matches!(result, Err(_)));
    }

    #[tokio::test]
    async fn tls_key_err() {
        let host = get_host();
        let service = get_service();
        let tls_cert = "/etc/letsencrypt/live/geospatialweb.ca/cert.pem";
        let tls_key = "/etc/letsencrypt/privkey.pem";
        let result = start_https_server(&host, service, tls_cert, tls_key).await;
        assert!(matches!(result, Err(_)));
    }
}
