use once_cell::sync::OnceCell;
use sqlx::{Error, PgPool};
use tracing::{error, info};

use super::env::Config;

pub static PG_POOL: OnceCell<PgPool> = OnceCell::new();

#[inline]
pub fn get_pool() -> &'static PgPool {
    PG_POOL.get().unwrap()
}

#[tracing::instrument]
pub async fn set_pool() {
    let pool = connect_pool().await;
    match pool {
        Ok(pool) => {
            let _ = PG_POOL.set(pool);
            info!("PgPool creation success");
        },
        Err(err) => error!("PgPool creation failure: {}", err),
    }
}

async fn connect_pool() -> Result<PgPool, Error> {
    let env: Config = Default::default();
    let pool = PgPool::connect(&env.database_url).await?;
    Ok(pool)
}
