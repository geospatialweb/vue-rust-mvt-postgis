use garde::Validate;
use serde::{Deserialize, Serialize};
use std::fmt::{Debug, Formatter, Result};

/// Plain text password struct.
#[derive(Clone, Deserialize, PartialEq, Serialize, Validate)]
pub struct TextPassword(#[garde(ascii)] String);

impl TextPassword {
    /// Create new TextPassword.
    pub fn new(password: &str) -> Self {
        Self(password.to_owned())
    }

    /// Return string slice representation of TextPassword.
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

/// HS256 hashed password struct.
#[derive(PartialEq)]
pub struct HashedPassword(String);

impl HashedPassword {
    /// Create new HashedPassword.
    pub fn new(password: &str) -> Self {
        Self(password.to_owned())
    }

    /// Return string slice representation of HashedPassword.
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

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn new_text_password() {
        let password = "secretPassword";
        let user = TextPassword(password.to_owned());
        let result = TextPassword::new(password);
        assert_eq!(result, user);
    }

    #[test]
    fn new_hashed_password() {
        let password = "$argon2id$v=19$m=19456,t=2,p=1$bnVMV1RsQVpxTks5c3hNQQ$r4g+fMtNBV5srD2zgiVsTU/8EkWREGgy6epi7Ux6d+c";
        let user = HashedPassword(password.to_owned());
        let result = HashedPassword::new(password);
        assert_eq!(result, user);
    }
}
