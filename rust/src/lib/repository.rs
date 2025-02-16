use sqlx::PgPool;

use super::model::{Layer, User};
use super::postgres::Pool;

/// LayerRepository SQL statements.
pub trait LayerRepositorySQL {
    fn get_json_features_sql(layer: &Layer) -> String;
}

/// UserRepository SQL statements.
pub trait UserRepositorySQL {
    fn get_user_sql() -> String;
    fn delete_user_sql() -> String;
    fn insert_user_sql() -> String;
    fn get_password_sql() -> String;
    fn update_password_sql() -> String;
}

/// Layer Repository Pattern struct.
#[derive(Debug)]
pub struct LayerRepository {
    pub layer: Layer,
    pub sql: String,
    pub pool: PgPool,
}

impl LayerRepository {
    /// Create new LayerRepository.
    pub fn new(layer: &Layer, sql: &str) -> Self {
        let pool = Pool::get_pool();
        Self {
            layer: layer.to_owned(),
            sql: sql.to_owned(),
            pool: pool.to_owned(),
        }
    }
}

impl LayerRepositorySQL for LayerRepository {
    /// LayerRepository `get json features` SQL statement.
    fn get_json_features_sql(layer: &Layer) -> String {
        format!(
            "SELECT ST_AsGeoJSON(feature.*) AS feature FROM (SELECT {} FROM {}) AS feature",
            layer.columns, layer.table
        )
    }
}

/// User Repository Pattern struct.
#[derive(Debug)]
pub struct UserRepository {
    pub user: User,
    pub sql: String,
    pub pool: PgPool,
}

impl UserRepository {
    /// Create new UserRepository.
    pub fn new(user: &User, sql: &str) -> Self {
        let pool = Pool::get_pool();
        Self {
            user: user.to_owned(),
            sql: sql.to_owned(),
            pool: pool.to_owned(),
        }
    }
}

impl UserRepositorySQL for UserRepository {
    /// UserRepository `get user` SQL statement.
    fn get_user_sql() -> String {
        String::from("SELECT username, role FROM users WHERE username = $1")
    }

    /// UserRepository `delete user` SQL statement.
    fn delete_user_sql() -> String {
        String::from("DELETE FROM users WHERE username = $1 RETURNING username")
    }

    /// UserRepository `insert user` SQL statement.
    fn insert_user_sql() -> String {
        String::from("INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING username")
    }

    /// UserRepository `get password` SQL statement.
    fn get_password_sql() -> String {
        String::from("SELECT password FROM users WHERE username = $1")
    }

    /// UserRepository `update password` SQL statement.
    fn update_password_sql() -> String {
        String::from("UPDATE users SET password = $2 WHERE username = $1 RETURNING username")
    }
}
