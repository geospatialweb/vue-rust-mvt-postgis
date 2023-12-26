#![cfg_attr(rustfmt, rustfmt_skip)]

use sqlx::{Error, Row};

use super::database::get_pool;
use super::geojson::JsonFeature;
use super::handler::LayerParams;
use super::model::User;

#[tracing::instrument]
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
pub async fn get_user(user: &User) -> Result<User, Error> {
    let query = "
        SELECT username
        FROM users
        WHERE username = $1";
    let row = sqlx::query(query).bind(&user.username)
        .fetch_one(get_pool())
        .await?;
    let user = User {
        username: row.get("username"),
        password: None,
    };
    Ok(user)
}

#[tracing::instrument]
pub async fn delete_user(user: &User) -> Result<User, Error> {
    let query = "
        DELETE FROM users
        WHERE username = $1
        RETURNING username";
    let row = sqlx::query(query)
        .bind(&user.username)
        .fetch_one(get_pool())
        .await?;
    let user = User {
        username: row.get("username"),
        password: None,
    };
    Ok(user)
}

#[tracing::instrument]
pub async fn insert_user(user: &User) -> Result<User, Error> {
    let query = "
        INSERT INTO users (password, username)
        VALUES ($1, $2)
        RETURNING username";
    let row = sqlx::query(query)
        .bind(&user.password)
        .bind(&user.username)
        .fetch_one(get_pool())
        .await?;
    let user = User {
        username: row.get("username"),
        password: None,
    };
    Ok(user)
}

#[tracing::instrument]
pub async fn update_password(user: &User) -> Result<User, Error> {
    let query = "
        UPDATE users
        SET password = $1
        WHERE username = $2
        RETURNING password, username";
    let row = sqlx::query(query)
        .bind(&user.password)
        .bind(&user.username)
        .fetch_one(get_pool())
        .await?;
    let user = User {
        username: row.get("username"),
        password: row.get("password"),
    };
    Ok(user)
}
