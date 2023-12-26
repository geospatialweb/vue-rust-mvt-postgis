#![cfg_attr(rustfmt, rustfmt_skip)]

use dotenvy::dotenv;
use salvo::catcher::Catcher;
use salvo::conn::rustls::{Keycert, RustlsConfig};
use salvo::prelude::{Listener, Server, Service, TcpListener};
use tracing::error;

use lib::database;
use lib::env::Config;
use lib::router;

#[tokio::main]
#[tracing::instrument]
async fn main() {
    tracing_subscriber::fmt().init();
    if let Err(err) = dotenv() {
        return error!("dotenv error: {}", err);
    }
    database::set_pool().await;
    let env: Config = Default::default();
    let host = format!("{}:{}", env.server_host, env.server_port);
    if env.app_mode == env.app_mode_dev {
        let acceptor = TcpListener::new(&host).bind().await;
        let service = Service::new(router::new())
            .catcher(Catcher::default()
                .hoop(router::cors())
        );
        Server::new(acceptor).serve(service).await;
    }
    if env.app_mode == env.app_mode_prod {
        let config = RustlsConfig::new(
            Keycert::new()
                .cert(env.ssl_cert)
                .key(env.ssl_key)
        );
        let acceptor = TcpListener::new(&host)
            .rustls(config)
            .bind()
            .await;
        let service = Service::new(router::new())
            .catcher(Catcher::default()
                .hoop(router::cors())
        );
        Server::new(acceptor).serve(service).await;
    }
}
