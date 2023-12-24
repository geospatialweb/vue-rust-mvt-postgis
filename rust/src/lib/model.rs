use garde::Validate;
use salvo::macros::Extractible;
use serde::Deserialize;
use sqlx::FromRow;

#[derive(Debug, Deserialize, Extractible, FromRow, Validate)]
#[salvo(extract(default_source(from = "query"), default_source(from = "body")))]
pub struct User {
    #[garde(email)]
    pub username: String,
    #[garde(ascii)]
    pub password: Option<String>,
}
