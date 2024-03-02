use tracing::error;

use lib::database;
use lib::env::Env;
use lib::server;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt().init();
    if let Err(err) = dotenvy::dotenv() {
        return error!("dotenv error: {}", &err);
    }
    if let Err(err) = Env::set_env() {
        return error!("env error: {}", &err);
    }
    if let Err(err) = database::set_pool().await {
        return error!("database connection error: {}", &err);
    }
    server::start().await;
}
