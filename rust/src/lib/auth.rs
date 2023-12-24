use chrono::{Duration, Utc};
use jsonwebtoken::{self, EncodingKey};
use jsonwebtoken::errors::Error;
use serde::{Deserialize, Serialize};

use super::env::Config;
use super::model::User;

#[derive(Debug, Deserialize, Serialize)]
pub struct JwtClaims {
    admin: bool,
    audience: String,
    issuer: String,
    name: String,
    subject: String,
    expiry: i64,
}

#[derive(Debug, Serialize)]
pub struct Jwt {
    token: String,
    expiry: i64,
}

pub fn get_jwt(user: &User) -> Result<Jwt, Error> {
    let env: Config = Default::default();
    let jwt_expiry = env.jwt_expiry.parse::<i64>().unwrap();
    let expiry = (Utc::now() + Duration::minutes(jwt_expiry)).timestamp();
    let jwt_claims = JwtClaims {
        admin: false,
        audience: env.jwt_domain.to_owned(),
        issuer: env.jwt_domain.to_owned(),
        name: user.username.to_owned(),
        subject: user.username.to_owned(),
        expiry,
    };
    let token = jsonwebtoken::encode(
        &jsonwebtoken::Header::default(),
        &jwt_claims,
        &EncodingKey::from_secret(env.jwt_secret.as_bytes()),
    )?;
    Ok(Jwt { token, expiry })
}
