use dotenvy::dotenv;
use tracing::error;

use lib::database::set_pool;
use lib::server::start_server;

#[tokio::main]
#[tracing::instrument]
async fn main() {
    tracing_subscriber::fmt().init();
    if let Err(err) = dotenv() {
        return error!("dotenv error: {}", &err);
    }
    if let Err(err) = set_pool().await {
        return error!("set_pool database error: {}", &err);
    }
    start_server().await;
}
