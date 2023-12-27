use garde::Validate;
use salvo::macros::Extractible;
use serde::{Deserialize,Serialize};
use sqlx::FromRow;

#[derive(Debug, Extractible, FromRow, Deserialize, Serialize, Validate)]
#[salvo(extract(default_source(from = "query"), default_source(from = "body")))]
pub struct User {
    #[garde(email)]
    pub username: String,
    #[garde(ascii)]
    pub password: Option<String>,
}
impl User {
    pub fn new(username: &str, password: &Option<String>) -> Self {
        Self {
            username: username.to_owned(),
            password: password.to_owned(),
        }
    }
}
