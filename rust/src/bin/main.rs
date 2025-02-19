use tracing::error;

use lib::env::Env;
use lib::postgres::Pool;
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
    let env = Env::get_env();
    if let Err(err) = Pool::set_pool(env).await {
        return error!("postgres error: {}", &err);
    }
    if let Err(err) = server::set_server(env).await {
        return error!("server error: {}", &err);
    }
}
