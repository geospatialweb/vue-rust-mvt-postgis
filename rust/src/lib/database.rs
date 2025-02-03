use once_cell::sync::OnceCell;
use sqlx::{Error, PgPool};
use tracing::info;

use super::env::Env;
use super::geojson::JsonFeature;
use super::model::User;
use super::password::HashedPassword;
use super::query;
use super::request::LayerParams;
use super::response::ResponseError;


pub struct Repo {
    pool: PgPool,
}

trait Repository {
    async fn get_json_features(params: &LayerParams) -> Result<Vec<JsonFeature>, ResponseError>;
    async fn get_user(username: &str) -> Result<User, ResponseError>;
    async fn delete_user(username: &str) -> Result<User, ResponseError>;
    async fn insert_user(username: &str, password: &HashedPassword, role: &str) -> Result<User, ResponseError>;
    async fn get_password(username: &str) -> Result<HashedPassword, ResponseError>;
    async fn update_password(username: &str, password: &HashedPassword) -> Result<User, ResponseError>;
}

impl Repository for Repo {
    async fn get_json_features(params: &LayerParams) -> Result<Vec<JsonFeature>, ResponseError> {
        let features = query::get_json_features(params).await?;
        Ok(features)
    }
    async fn get_user(username: &str) -> Result<User, ResponseError> {
        query::get_user(username).await
    }
    async fn delete_user(username: &str) -> Result<User, ResponseError> {
        query::delete_user(username).await
    }
    async fn insert_user(username: &str, password: &HashedPassword, role: &str) -> Result<User, ResponseError> {
        query::insert_user(username, password, role).await
    }
    async fn get_password(username: &str) -> Result<HashedPassword, ResponseError> {
        query::get_password(username).await
    }
    async fn update_password(username: &str, password: &HashedPassword) -> Result<User, ResponseError> {
        query::update_password(username, password).await
    }
}

static POOL: OnceCell<PgPool> = OnceCell::new();

/// Pool struct with PgPool field.
#[derive(Debug)]
pub struct Pool {}

impl Pool {
    /// Get pool connection from static POOL and return PgPool static lifetime reference.
    pub fn get_pool() -> &'static PgPool {
        POOL.get().unwrap()
    }

    /// Set pool connection and set static POOL.
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
