#![cfg_attr(rustfmt, rustfmt_skip)]

use chrono::{Duration, Utc};
use jsonwebtoken::{EncodingKey, Header};
use salvo::jwt_auth::{ConstDecoder, HeaderFinder};
use salvo::prelude::JwtAuth;
use serde::{Deserialize, Serialize};
use std::fmt::{Debug, Formatter};

use super::env::Env;
use super::model::TextPassword;
use super::response::ResponseError;

/// HS256 hashed password.
#[derive(Clone, PartialEq)]
pub struct HashedPassword(String);
impl HashedPassword {
    /// Create new HashedPassword.
    pub fn new(password: &str) -> Self {
        Self(password.to_owned())
    }

    // Return the string slice representation of HashedPassword.
    pub fn as_str(&self) -> &str {
        self.0.as_str()
    }
}
impl Debug for HashedPassword {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("HashedPassword")
         .field("password", &"<hidden>")
         .finish()
    }
}

/// HS256 password hash.
#[derive(PartialEq)]
pub struct Credential {
    pub hashed_password: HashedPassword,
}
impl Credential {
    /// Create new Credential.
    pub fn new(hashed_password: &HashedPassword) -> Self {
        Self {
            hashed_password: hashed_password.to_owned(),
        }
    }
}
impl Debug for Credential {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("Credential")
         .field("password", &"<hidden>")
         .finish()
    }
}

/// Auth jwt token and expiry.
#[derive(Debug, Deserialize, Serialize)]
pub struct Jwt {
    pub token: String,
    expiry: i64,
}

/// Jwt claims issuer, subject and expiry.
#[derive(Debug, Deserialize, Serialize)]
pub struct JwtClaims {
    iss: String,
    sub: String,
    exp: i64,
}

/// Generate HS256 hashed password from text password.
pub fn generate_hashed_password_from_password(password: &TextPassword) -> Result<HashedPassword, ResponseError> {
    let hashed_password = bcrypt::hash(password.as_str(), bcrypt::DEFAULT_COST)?;
    Ok(HashedPassword(hashed_password))
}

/// Return JWT token and expiry.
pub fn get_jwt(username: &str) -> Result<Jwt, ResponseError> {
    let env = Env::get_env();
    let minutes = env.jwt_claims_expiry.parse::<i64>()?;
    let expiry = (Utc::now() + Duration::minutes(minutes)).timestamp();
    let issuer = &env.jwt_claims_issuer;
    let secret = env.jwt_secret.as_bytes();
    let jwt_claims = JwtClaims {
        iss: issuer.to_owned(),
        sub: username.to_owned(),
        exp: expiry,
    };
    let token = jsonwebtoken::encode(
        &Header::default(), // HS256
        &jwt_claims,
        &EncodingKey::from_secret(secret),
    )?;
    Ok(Jwt { token, expiry })
}

/// Router authentication middleware.
pub fn handle_auth() -> JwtAuth<JwtClaims, ConstDecoder> {
    let env = Env::get_env();
    let secret = env.jwt_secret.as_bytes();
    JwtAuth::new(ConstDecoder::from_secret(secret))
        .finders(vec![Box::new(HeaderFinder::new())])
        .force_passed(true)
}

/// Verify password submitted by user at login with HS256 hashed password stored in db.
pub fn verify_password_and_hashed_password(password: &TextPassword, hashed_password: &HashedPassword
) -> Result<(), ResponseError> {
    bcrypt::verify(password.as_str(), hashed_password.as_str())?;
    Ok(())
}

#[cfg(test)]
mod test {
    use super::*;

    fn test_init() {
        dotenvy::dotenv().unwrap();
        Env::set_env().unwrap();
    }

    #[test]
    fn auth_get_jwt_ok() {
        test_init();
        let username = "foo@bar.com";
        let result = get_jwt(username);
        assert!(result.is_ok());
    }

    #[test]
    fn generate_hashed_password_from_password_ok() {
        let password = "secretPassword";
        let text_password = TextPassword::new(password);
        let result = generate_hashed_password_from_password(&text_password);
        assert!(result.is_ok());
    }

    #[test]
    fn verify_password_and_hashed_password_ok() {
        let password = "secretPassword";
        let text_password = TextPassword::new(password);
        let hashed_password = generate_hashed_password_from_password(&text_password).unwrap();
        let result = verify_password_and_hashed_password(&text_password, &hashed_password);
        assert!(result.is_ok());
    }

    #[test]
    fn verify_password_and_hashed_password_err() {
        let password = "secretPassword";
        let text_password = TextPassword::new(password);
        let hashed_password = String::from("$2a$12$BSul3QNaH9FahdqlxfnejuM7Y0Ptm8q9kcBSpuJqWjS0j4DCwTdzb");
        let result = verify_password_and_hashed_password(&text_password, &HashedPassword(hashed_password));
        assert!(matches!(result, Err(ResponseError::Bcrypt(_))));
    }
}
