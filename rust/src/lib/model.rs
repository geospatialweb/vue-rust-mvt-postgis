use salvo::macros::Extractible;
use serde::Deserialize;
use sqlx::FromRow;

#[derive(Deserialize, Extractible, FromRow)]
#[salvo(extract(default_source(from = "query"), default_source(from = "body")))]
pub struct User {
    pub username: String,
    pub password: Option<String>,
}
