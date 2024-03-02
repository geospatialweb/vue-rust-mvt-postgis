use garde::Validate;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Deserialize, FromRow, PartialEq, Serialize, Validate)]
/// User struct containing username and password fields.
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

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn new_user_password() {
        let username = "foobar.com";
        let password = "secretPassword";
        let user = User {
            username: username.to_owned(),
            password: Some(password.to_string()),
        };
        let result = User::new(username, &Some(password.to_string()));
        assert_eq!(result, user, "should be the same field values");
    }

    #[test]
    fn new_user_no_password() {
        let username = "foobar.com";
        let user = User {
            username: username.to_owned(),
            password: None,
        };
        let result = User::new(username, &None);
        assert_eq!(result, user, "should be the same field values");
    }
}
