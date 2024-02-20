#![cfg_attr(rustfmt, rustfmt_skip)]

use salvo::catcher::Catcher;
use salvo::conn::rustls::{Keycert, RustlsConfig};
use salvo::prelude::{Listener, Server, Service, TcpListener};

use super::env::Env;
use super::router;

/// Start development HTTP/1.1 / production HTTPS/1.1 server.
pub async fn start() {
    let env = Env::get_env();
    let host = format!("{}:{}", &env.server_host, &env.server_port);
    let service = Service::new(router::new())
        .catcher(Catcher::default()
            .hoop(router::handle_cors())
    );
    if env.app_mode == env.app_mode_dev {
        let acceptor = TcpListener::new(&host)
            .bind()
            .await;
        Server::new(acceptor)
            .serve(service)
            .await;
    } else if env.app_mode == env.app_mode_prod {
        let config = RustlsConfig::new(
            Keycert::new()
                .cert(env.ssl_cert.as_str())
                .key(env.ssl_key.as_str())
        );
        let acceptor = TcpListener::new(&host)
            .rustls(config)
            .bind()
            .await;
        Server::new(acceptor)
            .serve(service)
            .await;
    }
}
