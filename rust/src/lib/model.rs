use garde::Validate;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Deserialize, FromRow, Serialize, Validate)]
pub struct User {
    #[garde(email)]
    pub username: String,
    #[garde(ascii)]
    pub password: Option<String>,
}
impl User {
    /// Create new User.
    pub fn new(username: &str, password: &Option<String>) -> Self {
        Self {
            username: username.to_owned(),
            password: password.to_owned(),
        }
    }
}
