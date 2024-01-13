use dotenvy::dotenv;
use tracing::error;

use lib::database;
use lib::server;

#[tokio::main]
#[tracing::instrument]
async fn main() {
    tracing_subscriber::fmt().init();
    if let Err(err) = dotenv() {
        return error!("dotenv error: {}", &err);
    }
    if let Err(err) = database::set_pool().await {
        return error!("database set_pool error: {}", &err);
    }
    server::start().await;
}
