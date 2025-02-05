use once_cell::sync::OnceCell;
use sqlx::{Error, PgPool};
use tracing::info;

use super::env::Env;

static POOL: OnceCell<PgPool> = OnceCell::new();

/// Postgres Pool unit struct.
#[derive(Debug)]
pub struct Pool {}

impl Pool {
    /// Get Postgres pool connection from static POOL and return PgPool static lifetime reference.
    pub fn get_pool() -> &'static PgPool {
        POOL.get().unwrap()
    }

    /// Set Postgres pool connection as a static POOL.
    pub async fn set_pool() -> Result<(), Error> {
        let env = Env::get_env();
        let dsn = env.postgres_dsn.as_str();
        let pool = create_pool_connection(dsn).await?;
        POOL.set(pool).ok();
        Ok(())
    }
}

/// Create Postgres pool connection.
async fn create_pool_connection(dsn: &str) -> Result<PgPool, Error> {
    let pool = PgPool::connect(dsn).await?;
    info!("database pool connection ok");
    Ok(pool)
}

#[cfg(test)]
mod test {
    use super::*;

    #[tokio::test]
    async fn set_pool_ok() {
        let result = Pool::set_pool().await;
        assert!(result.is_ok());
    }

    #[tokio::test]
    async fn create_pool_connection_err() {
        let env = Env::get_env();
        let dsn = env.postgres_test_dsn.as_str();
        let result = create_pool_connection(dsn).await;
        assert!(matches!(result, Err(_)));
    }
}
