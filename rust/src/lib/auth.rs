use chrono::{Duration, Utc};
use jsonwebtoken::{self, EncodingKey};
use jsonwebtoken::errors::Error;
use serde::{Deserialize, Serialize};

use super::env::Config;
use super::model::User;

#[derive(Debug, Deserialize, Serialize)]
pub struct JwtClaims {
    aud: String,
    iss: String,
    name: String,
    sub: String,
    exp: i64,
}

#[derive(Debug, Serialize)]
pub struct Jwt {
    token: String,
    expiry: i64,
}

pub fn get_jwt_token(user: &User) -> Result<Jwt, Error> {
    let env: Config = Default::default();
    let jwt_expiry = env.jwt_expiry.parse::<i64>().unwrap();
    let expiry = (Utc::now() + Duration::minutes(jwt_expiry)).timestamp();
    let jwt_claims = JwtClaims {
        aud: env.jwt_domain.to_owned(),
        iss: env.jwt_domain.to_owned(),
        name: user.username.to_owned(),
        sub: user.username.to_owned(),
        exp: expiry,
    };
    let token = jsonwebtoken::encode(
        &jsonwebtoken::Header::default(),
        &jwt_claims,
        &EncodingKey::from_secret(env.jwt_secret.as_bytes()),
    )?;
    Ok(Jwt { token, expiry })
}
