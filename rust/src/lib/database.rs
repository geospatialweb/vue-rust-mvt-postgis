use once_cell::sync::OnceCell;
use sqlx::{Error, PgPool};
use tracing::info;

use super::env::Env;

pub static PG_POOL: OnceCell<PgPool> = OnceCell::new();

#[inline]
/// Get database pool.
pub fn get_pool() -> &'static PgPool {
    PG_POOL.get().unwrap()
}

#[tracing::instrument]
/// Set database pool.
pub async fn set_pool() -> Result<(), Error> {
    let pool = connect_pool().await;
    match pool {
        Ok(pool) => {
            info!("set_pool ok");
            PG_POOL.set(pool).unwrap();
            Ok(())
        }
        Err(err) => Err(err),
    }
}

#[tracing::instrument]
/// Connect to database pool.
async fn connect_pool() -> Result<PgPool, Error> {
    let env: Env = Default::default();
    let pool = PgPool::connect(&env.postgres_uri).await;
    match pool {
        Ok(pool) => {
            info!("connect_pool ok");
            Ok(pool)
        }
        Err(err) => Err(err),
    }
}
