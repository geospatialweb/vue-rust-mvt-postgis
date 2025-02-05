use tracing::error;

use lib::database::Pool;
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
    if let Err(err) = Pool::set_pool().await {
        return error!("database error: {}", &err);
    }
    if let Err(err) = server::set_server().await {
        return error!("server error: {}", &err);
    }
}
