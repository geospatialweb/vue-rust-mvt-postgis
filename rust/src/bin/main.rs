use dotenvy::dotenv;
use lib::env::Config;
use lib::router;
use salvo::prelude::*;

#[tokio::main]
async fn main() {
    if let Err(err) = dotenv() {
        println!("dotenv: {}", err);
        return;
    }
    let env: Config = Default::default();
    let acceptor = TcpListener::new(format!("{}:{}", env.server_host, env.server_port))
        .bind()
        .await;
    println!("{} {}://{}:{}", env.server_message, env.server_protocol, env.server_host, env.server_port);
    Server::new(acceptor).serve(router::new()).await;
}
