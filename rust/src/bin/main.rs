use dotenvy::dotenv;
use lib::database;
use lib::env::Config;
use lib::router;
use salvo::conn::openssl::{Keycert, OpensslConfig};
use salvo::prelude::*;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt().init();
    if let Err(err) = dotenv() {
        return println!("dotenv error: {}", err);
    }
    database::set_pool().await;
    let env: Config = Default::default();
    let host = format!("{}:{}", env.server_host, env.server_port);
    if env.app_mode == env.app_mode_dev {
        let acceptor = TcpListener::new(&host).bind().await;
        Server::new(acceptor).serve(router::new()).await;
    }
    if env.app_mode == env.app_mode_prod {
        let config = OpensslConfig::new(
            Keycert::new()
                .with_cert(env.ssl_cert)
                .with_key(env.ssl_key)
        );
        let acceptor = TcpListener::new(&host).openssl(config).bind().await;
        Server::new(acceptor).serve(router::new()).await;
    }
}
