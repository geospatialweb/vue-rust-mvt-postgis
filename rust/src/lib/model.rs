use garde::Validate;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use std::fmt::{Debug, Formatter, Result};

use super::password::TextPassword;

/// Username and password.
#[derive(Deserialize, FromRow, PartialEq, Serialize, Validate)]
pub struct User {
    #[garde(email)]
    pub username: String,
    #[garde(skip)]
    pub password: Option<TextPassword>,
}

impl User {
    /// Create new User.
    pub fn new(username: &str, password: &Option<&TextPassword>) -> Self {
        Self {
            username: username.to_owned(),
            password: password.cloned(),
        }
    }
}

/// Manually implement Debug to prevent password leakage into logs.
#[rustfmt::skip]
impl Debug for User {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
        f.debug_struct("User")
         .field("password", &"<hidden>")
         .finish()
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn new_user_password() {
        let username = "foobar.com";
        let password = "secretPassword";
        let text_password = TextPassword::new(password);
        let user = User {
            username: String::from(username),
            password: Some(text_password.clone()),
        };
        let result = User::new(username, &Some(&text_password));
        assert_eq!(result, user);
    }

    #[test]
    fn new_user_no_password() {
        let username = "foobar.com";
        let user = User {
            username: String::from(username),
            password: None,
        };
        let result = User::new(username, &None);
        assert_eq!(result, user);
    }
}
