use sqlx::PgPool;

use super::model::{Layer, User};
use super::postgres::Pool;

/// Layer Repository Pattern struct.
#[derive(Debug)]
pub struct LayerRepository {
    pub layer: Layer,
    pub pool: PgPool,
}

impl LayerRepository {
    /// Create new LayerRepository.
    pub fn new(layer: &Layer) -> Self {
        let pool = Pool::get_pool();
        Self {
            layer: layer.to_owned(),
            pool: pool.to_owned(),
        }
    }
}

/// User Repository Pattern struct.
#[derive(Debug)]
pub struct UserRepository {
    pub user: User,
    pub pool: PgPool,
}

impl UserRepository {
    /// Create new UserRepository.
    pub fn new(user: &User) -> Self {
        let pool = Pool::get_pool();
        Self {
            user: user.to_owned(),
            pool: pool.to_owned(),
        }
    }
}
