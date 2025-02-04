use garde::Validate;
use serde::{Deserialize, Serialize};
use std::fmt::{Debug, Formatter, Result};

use super::password::TextPassword;

/// User struct with username, password and role fields.
#[derive(Clone, Deserialize, PartialEq, Serialize, Validate)]
pub struct User {
    #[garde(email)]
    pub username: String,
    #[garde(skip)]
    pub password: Option<TextPassword>,
    #[garde(ascii)]
    pub role: String,
}

impl User {
    /// Create new User.
    pub fn new(username: &str, password: &Option<&TextPassword>, role: &str) -> Self {
        Self {
            username: username.to_owned(),
            password: password.cloned(),
            role: role.to_owned(),
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
        let role = "user";
        let username = "foobar.com";
        let password = "secretPassword";
        let text_password = TextPassword::new(password);
        let user = User {
            username: username.to_owned(),
            password: Some(text_password.to_owned()),
            role: role.to_owned(),
        };
        let result = User::new(username, &Some(&text_password), role);
        assert_eq!(result, user);
    }

    #[test]
    fn new_user_no_password() {
        let role = "user";
        let username = "foobar.com";
        let user = User {
            username: username.to_owned(),
            password: None,
            role: role.to_owned(),
        };
        let result = User::new(username, &None, role);
        assert_eq!(result, user);
    }
}
