use dotenvy::dotenv;
use lib::env::Config;
use lib::router;
use once_cell::sync::OnceCell;
use salvo::conn::openssl::{Keycert, OpensslConfig};
use salvo::prelude::*;
use sqlx::{PgPool, Pool};

pub static PG_POOL: OnceCell<PgPool> = OnceCell::new();

// #[inline]
pub fn get_pg_pool() -> &'static PgPool {
    // unsafe { PG_POOL.get_unchecked() }
    PG_POOL.get().unwrap()
}

#[tokio::main]
async fn main() {
    if let Err(err) = dotenv() {
        println!("dotenv error: {}", err);
        return;
    }
    tracing_subscriber::fmt().init();
    let env: Config = Default::default();
    let host = format!("{}:{}", env.server_host, env.server_port);
    let pool = Pool::connect(&env.postgres_dsn).await.unwrap();
    PG_POOL.set(pool).unwrap();
    if env.app_mode == env.app_mode_dev {
        let router = router::new();
        let acceptor = TcpListener::new(&host).bind().await;
        Server::new(acceptor).serve(router).await;
    }
    if env.app_mode == env.app_mode_prod {
        let router = router::new();
        let config = OpensslConfig::new(Keycert::new().with_cert(env.ssl_cert).with_key(env.ssl_key));
        let acceptor = TcpListener::new(&host).openssl(config).bind().await;
        Server::new(acceptor).serve(router).await;
    }
}
