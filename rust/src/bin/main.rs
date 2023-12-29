#![cfg_attr(rustfmt, rustfmt_skip)]

use dotenvy::dotenv;
use salvo::catcher::Catcher;
use salvo::conn::rustls::{Keycert, RustlsConfig};
use salvo::prelude::{Listener, Server, Service, TcpListener};
use tracing::error;

use lib::database::set_pool;
use lib::env::Config;
use lib::router;

#[tokio::main]
#[tracing::instrument]
async fn main() {
    tracing_subscriber::fmt().init();
    if let Err(err) = dotenv() {
        return error!("dotenv error: {}", err);
    }
    if let Err(err) = set_pool().await {
        return error!("set_pool database error: {}", &err);
    }
    let env: Config = Default::default();
    let host = format!("{}:{}", &env.server_host, &env.server_port);
    let service = Service::new(router::new())
        .catcher(Catcher::default()
            .hoop(router::cors())
    );
    if env.app_mode == env.app_mode_dev {
        Server::new(TcpListener::new(&host)
            .bind()
            .await
        )
            .serve(service)
            .await
    } else if env.app_mode == env.app_mode_prod {
        let config = RustlsConfig::new(
            Keycert::new()
                .cert(env.ssl_cert)
                .key(env.ssl_key)
        );
        Server::new(TcpListener::new(&host)
            .rustls(config)
            .bind()
            .await
        )
            .serve(service)
            .await;
    }
}
