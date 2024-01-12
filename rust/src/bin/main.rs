use std::path::Path;
use tracing::error;

use lib::database;
use lib::server;

#[tokio::main]
#[tracing::instrument]
async fn main() {
    tracing_subscriber::fmt().init();
    let env_path = Path::new("./rust/.env");
    if let Err(err) = dotenvy::from_path(env_path) {
        return error!("dotenv error: {}", &err);
    }
    if let Err(err) = database::set_pool().await {
        return error!("database set_pool error: {}", &err);
    }
    server::start().await;
}
