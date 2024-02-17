use tracing::error;

use lib::database;
use lib::env;
use lib::server;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt().init();
    if let Err(err) = dotenvy::dotenv() {
        return error!("dotenv error: {}", &err);
    }
    if let Err(err) = env::Env::set_env() {
        return error!("set_env error: {}", &err);
    }
    if let Err(err) = database::set_pool().await {
        return error!("set_pool error: {}", &err);
    }
    server::start().await;
}
