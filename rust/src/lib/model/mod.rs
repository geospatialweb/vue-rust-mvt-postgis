use salvo::macros::Extractible;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Extractible, Deserialize, Serialize)]
#[salvo(extract(default_source(from = "query")))]
pub struct LayerParams {
    columns: String,
    table: String,
}

#[derive(Debug, Extractible, FromRow, Deserialize, Serialize)]
#[salvo(extract(default_source(from = "query"), default_source(from = "body")))]
pub struct User {
    password: Option<String>,
    pub username: String,
}
impl User {
    pub fn new(password: &str, username: &str) -> Self {
        Self {
            password: Some(password.to_owned()),
            username: username.to_owned(),
        }
    }
}
