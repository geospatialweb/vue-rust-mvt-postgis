#![cfg_attr(rustfmt, rustfmt_skip)]

use garde::Validate;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use std::fmt::{Debug, Formatter, Result};

/// Plain text password.
#[derive(Clone, Deserialize, PartialEq, Serialize, Validate)]
pub struct PlainTextPassword(#[garde(ascii)] String);
impl PlainTextPassword {
    /// Create new PlainTextPassword.
    pub fn new(password: &str) -> Self {
        Self(password.to_owned())
    }

    // Return the string representation of PlainTextPassword.
    pub fn as_string(&self) -> String {
        self.0.to_string()
    }
}
impl Debug for PlainTextPassword {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
        f.debug_struct("PlainTextPassword")
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
    pub plain_text_password: Option<PlainTextPassword>,
}
impl User {
    /// Create new User.
    pub fn new(username: &str, plain_text_password: &Option<PlainTextPassword>) -> Self {
        Self {
            username: username.to_owned(),
            plain_text_password: plain_text_password.to_owned(),
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
        let plain_text_password = PlainTextPassword::new(password);
        let user = User {
            username: String::from(username),
            plain_text_password: Some(plain_text_password.clone()),
        };
        let result = User::new(username, &Some(plain_text_password.clone()));
        assert_eq!(result, user);
    }

    #[test]
    fn new_user_no_password() {
        let username = "foobar.com";
        let user = User {
            username: String::from(username),
            plain_text_password: None,
        };
        let result = User::new(username, &None);
        assert_eq!(result, user);
    }
}
