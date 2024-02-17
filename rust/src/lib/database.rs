use once_cell::sync::OnceCell;
use sqlx::{Error, PgPool};
use tracing::info;

use super::env::Env;

static PG_POOL: OnceCell<PgPool> = OnceCell::new();

#[inline]
/// Get database connection pool.
pub fn get_pool() -> &'static PgPool {
    PG_POOL.get().unwrap()
}

/// Set database connection pool.
pub async fn set_pool() -> Result<(), Error> {
    let pool = connect_pool().await?;
    let _ = PG_POOL.set(pool);
    info!("set_pool ok");
    Ok(())
}

/// Create database pool connection.
async fn connect_pool() -> Result<PgPool, Error> {
    let env = Env::get_env();
    let pool = PgPool::connect(&env.postgres_uri).await?;
    Ok(pool)
}
