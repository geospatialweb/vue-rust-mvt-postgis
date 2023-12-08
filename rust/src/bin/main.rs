use dotenvy::dotenv;
use lib::env::Config;
use lib::router;
use salvo::prelude::*;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt().init();
    if let Err(err) = dotenv() {
        println!("dotenv error: {}", err);
        return;
    }
    let env: Config = Default::default();
    let acceptor = TcpListener::new(format!("{}:{}", env.server_host, env.server_port)).bind().await;
    let router = router::new();
    Server::new(acceptor).serve(router).await;
}
