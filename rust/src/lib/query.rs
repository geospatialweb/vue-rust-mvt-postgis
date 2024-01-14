#![cfg_attr(rustfmt, rustfmt_skip)]

use sqlx::{Error, Row};

use super::auth::Credential;
use super::database::get_pool;
use super::geojson::JsonFeature;
use super::handler::LayerParams;
use super::model::User;

#[tracing::instrument]
/// Return vector of json strings formatted as GeoJSON features.
pub async fn get_features(params: &LayerParams) -> Result<Vec<JsonFeature>, Error> {
    let query = format!("
        SELECT ST_AsGeoJSON(feature.*)
        AS feature
        FROM (SELECT {} FROM {})
        AS feature",
        params.columns,
        params.table);
    let features = sqlx::query_as::<_, JsonFeature>(&query)
        .fetch_all(get_pool())
        .await?;
    Ok(features)
}

#[tracing::instrument]
/// Return user password.
pub async fn get_password(username: &str) -> Result<Credential, Error> {
    let query = "
        SELECT password
        FROM users
        WHERE username = $1";
    let row = sqlx::query(query)
        .bind(username)
        .fetch_one(get_pool())
        .await?;
    Ok(Credential::new(row.get("password")))
}

#[tracing::instrument]
/// Return user.
pub async fn get_user(username: &str) -> Result<User, Error> {
    let query = "
        SELECT username
        FROM users
        WHERE username = $1";
    let row = sqlx::query(query)
        .bind(username)
        .fetch_one(get_pool())
        .await?;
    Ok(User::new(row.get("username"), &None))
}

#[tracing::instrument]
/// Delete user returning username.
pub async fn delete_user(username: &str) -> Result<User, Error> {
    let query = "
        DELETE FROM users
        WHERE username = $1
        RETURNING username";
    let row = sqlx::query(query)
        .bind(username)
        .fetch_one(get_pool())
        .await?;
    Ok(User::new(row.get("username"), &None))
}

#[tracing::instrument]
/// Insert user returning username.
pub async fn insert_user(user: &User) -> Result<User, Error> {
    let query = "
        INSERT INTO users (username, password)
        VALUES ($1, $2)
        RETURNING username";
    let row = sqlx::query(query)
        .bind(&user.username)
        .bind(&user.password)
        .fetch_one(get_pool())
        .await?;
    Ok(User::new(row.get("username"), &None))
}

#[tracing::instrument]
/// Update user password returning username and hashed password.
pub async fn update_password(user: &User) -> Result<User, Error> {
    let query = "
        UPDATE users
        SET password = $2
        WHERE username = $1
        RETURNING username, password";
    let row = sqlx::query(query)
        .bind(&user.username)
        .bind(&user.password)
        .fetch_one(get_pool())
        .await?;
    Ok(User::new(row.get("username"), &Some(row.get("password"))))
}
