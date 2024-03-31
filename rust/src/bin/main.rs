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
    if let Err(err) = database::get_pool().await {
        return error!("database pool connection error: {}", &err);
    }
    if let Err(err) = server::set_service().await {
        return error!("server tsl error: {}", &err);
    }
}
