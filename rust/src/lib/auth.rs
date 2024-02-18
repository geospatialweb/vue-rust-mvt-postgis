use chrono::{Duration, Utc};
use jsonwebtoken::{EncodingKey, Header};
use salvo::jwt_auth::{ConstDecoder, HeaderFinder};
use salvo::prelude::JwtAuth;
use serde::{Deserialize, Serialize};

use super::env::Env;
use super::response::ResponseError;

#[derive(Debug)]
pub struct Credential {
    pub password: String,
}
impl Credential {
    /// Create new Credential.
    pub fn new(password: &str) -> Self {
        Self {
            password: password.to_owned(),
        }
    }
}

#[derive(Debug, Serialize)]
pub struct Jwt {
    token: String,
    expiry: i64,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct JwtClaims {
    iss: String,
    sub: String,
    exp: i64,
}

/// Generate HS256 password hash from text password.
pub fn generate_hash_from_password(password: &str) -> Result<String, ResponseError> {
    let hash = bcrypt::hash(password, bcrypt::DEFAULT_COST)?;
    Ok(hash)
}

/// Return JWT token and expiry.
pub fn get_jwt(username: &str) -> Result<Jwt, ResponseError> {
    let env = Env::get_env();
    let minutes = env.jwt_claims_expiry.parse::<i64>()?;
    let expiry = (Utc::now() + Duration::minutes(minutes)).timestamp();
    let jwt_claims = JwtClaims {
        iss: env.jwt_claims_issuer.to_owned(),
        sub: username.to_owned(),
        exp: expiry,
    };
    let secret = env.jwt_claims_secret.as_bytes();
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
    let secret = env.jwt_claims_secret.as_bytes();
    JwtAuth::new(ConstDecoder::from_secret(secret))
        .finders(vec![Box::new(HeaderFinder::new())])
        .force_passed(true)
}

/// Verify HS256 password hash stored in db with text password submitted by user.
pub fn verify_password_and_hash(password: &str, hash: &str) -> Result<(), ResponseError> {
    bcrypt::verify(password, hash)?;
    Ok(())
}
