use garde::Validate;
use serde::Deserialize;
use std::fmt::{Debug, Formatter, Result};

/// Plain text password.
#[derive(Clone, Deserialize, PartialEq, Validate)]
pub struct TextPassword(#[garde(ascii)] String);

impl TextPassword {
    /// Create new TextPassword.
    pub fn new(password: &str) -> Self {
        Self(password.to_owned())
    }

    /// Return the string slice representation of TextPassword.
    pub fn as_str(&self) -> &str {
        self.0.as_str()
    }
}

/// Manually implement Debug to prevent password leakage into logs.
#[rustfmt::skip]
impl Debug for TextPassword {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
        f.debug_struct("TextPassword")
         .field("password", &"<hidden>")
         .finish()
    }
}

/// HS256 hashed password.
#[derive(Clone, PartialEq)]
pub struct HashedPassword(String);

impl HashedPassword {
    /// Create new HashedPassword.
    pub fn new(password: &str) -> Self {
        Self(password.to_owned())
    }

    /// Return the string slice representation of HashedPassword.
    pub fn as_str(&self) -> &str {
        self.0.as_str()
    }
}

/// Manually implement Debug to prevent password leakage into logs.
#[rustfmt::skip]
impl Debug for HashedPassword {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
       f.debug_struct("HashedPassword")
        .field("password", &"<hidden>")
        .finish()
    }
}
