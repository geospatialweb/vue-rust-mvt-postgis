#![cfg_attr(rustfmt, rustfmt_skip)]

use garde::Validate;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use std::fmt::{Debug, Formatter, Result};

/// Plain text password.
#[derive(Clone, Deserialize, PartialEq, Serialize, Validate)]
pub struct TextPassword(#[garde(ascii)] String);
impl TextPassword {
    /// Create new TextPassword.
    pub fn new(password: &str) -> Self {
        Self(password.to_owned())
    }

    // Return the string slice representation of TextPassword.
    pub fn as_str(&self) -> &str {
        self.0.as_str()
    }
}
impl Debug for TextPassword {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
        f.debug_struct("TextPassword")
         .field("password", &"<hidden>")
         .finish()
    }
}

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
    pub fn new(username: &str, password: &Option<TextPassword>) -> Self {
        Self {
            username: username.to_owned(),
            password: password.to_owned(),
        }
    }
}
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
        let result = User::new(username, &Some(text_password.clone()));
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
