use sqlx::{Error, PgPool};
use tracing::info;

use super::env::Env;

/// Get postgres connection pool.
pub async fn get_pool() -> Result<PgPool, Error> {
    let pool = set_pool().await?;
    Ok(pool)
}

/// Set uri for postgres connection pool.
pub async fn set_pool() -> Result<PgPool, Error> {
    let env = Env::get_env();
    let uri = &env.postgres_uri;
    let pool = connect(uri).await?;
    Ok(pool)
}

/// Create postgres pool connection.
pub async fn connect(uri: &str) -> Result<PgPool, Error> {
    let pool = PgPool::connect(uri).await?;
    info!("pool connection ok");
    Ok(pool)
}

#[cfg(test)]
mod test {
    use super::*;

    #[tokio::test]
    async fn get_pool_ok() {
        let result = set_pool().await;
        assert!(result.is_ok());
    }

    #[tokio::test]
    async fn get_pool_err() {
        let env = Env::get_env();
        let uri = &env.postgres_test_uri;
        let result = connect(uri).await;
        assert!(matches!(result, Err(_)));
    }
}
