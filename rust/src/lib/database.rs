use sqlx::{Error, PgPool};
use tracing::info;

use super::env::Env;

/// Set Postgres connection pool.
pub async fn set_pool() -> Result<PgPool, Error> {
    let env = Env::get_env();
    let uri = &env.postgres_uri;
    let pool = create_pool_connection(uri).await?;
    Ok(pool)
}

/// Create Postgres pool connection.
pub async fn create_pool_connection(uri: &str) -> Result<PgPool, Error> {
    let pool = PgPool::connect(uri).await?;
    info!("pool connection ok");
    Ok(pool)
}

#[cfg(test)]
mod test {
    use super::*;

    #[tokio::test]
    async fn set_pool_ok() {
        let env = Env::get_env();
        let uri = &env.postgres_uri;
        let result = create_pool_connection(uri).await;
        assert!(result.is_ok());
    }

    #[tokio::test]
    async fn create_pool_connection_err() {
        let env = Env::get_env();
        let uri = &env.postgres_test_uri;
        let result = create_pool_connection(uri).await;
        assert!(matches!(result, Err(_)));
    }
}
