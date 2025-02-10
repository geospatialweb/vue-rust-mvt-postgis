use garde::Validate;
use serde::{Deserialize, Serialize};
use std::fmt::{Debug, Formatter, Result};

use super::password::TextPassword;

/// Layer query URL params with `garde` validation.
#[derive(Debug, Clone, Deserialize, PartialEq, Validate)]
pub struct Layer {
    #[garde(ascii)]
    pub columns: String,
    #[garde(ascii)]
    pub table: String,
    #[garde(ascii)]
    pub role: String,
}

impl Layer {
    /// Create new Layer.
    pub fn new(columns: &str, table: &str, role: &str) -> Self {
        Self {
            columns: columns.to_owned(),
            table: table.to_owned(),
            role: role.to_owned(),
        }
    }
}

/// User struct with username, password and role fields with `garde` validation.
#[derive(Clone, Deserialize, PartialEq, Serialize, Validate)]
pub struct User {
    #[garde(email)]
    pub username: Option<String>,
    #[garde(skip)]
    pub password: Option<TextPassword>,
    #[garde(ascii)]
    pub role: String,
}

impl User {
    /// Create new User.
    pub fn new(username: &Option<&String>, password: &Option<&TextPassword>, role: &str) -> Self {
        Self {
            username: username.cloned(),
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
    fn new_layer() {
        let columns = "name,description,geom";
        let table = "office";
        let role = "user";
        let layer = Layer {
            columns: columns.to_owned(),
            table: table.to_owned(),
            role: role.to_owned(),
        };
        let result = Layer::new(columns, table, role);
        assert_eq!(result, layer);
    }

    #[test]
    fn new_user_with_password() {
        let role = "user";
        let username = String::from("foo@bar.com");
        let password = "secretPassword";
        let text_password = TextPassword::new(password);
        let user = User {
            username: Some(username.to_owned()),
            password: Some(text_password.to_owned()),
            role: role.to_owned(),
        };
        let result = User::new(&Some(&username), &Some(&text_password), role);
        assert_eq!(result, user);
    }

    #[test]
    fn new_user_without_password() {
        let role = "user";
        let username = String::from("foo@bar.com");
        let user = User {
            username: Some(username.to_owned()),
            password: None,
            role: role.to_owned(),
        };
        let result = User::new(&Some(&username), &None, role);
        assert_eq!(result, user);
    }
}
