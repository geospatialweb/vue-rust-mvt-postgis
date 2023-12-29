use chrono::{Duration, Utc};
use jsonwebtoken::errors::Error;
use jsonwebtoken::{self, EncodingKey};
use salvo::jwt_auth::{ConstDecoder, HeaderFinder};
use salvo::prelude::JwtAuth;
use serde::{Deserialize, Serialize};

use super::env::Config;
use super::model::User;

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

pub fn auth() -> JwtAuth<JwtClaims, ConstDecoder> {
    let env: Config = Default::default();
    JwtAuth::new(ConstDecoder::from_secret(env.jwt_secret.as_bytes()))
        .finders(vec![Box::new(HeaderFinder::new())])
        .force_passed(true)
}

pub fn get_jwt(user: &User) -> Result<Jwt, Error> {
    let env: Config = Default::default();
    let jwt_expiry = env.jwt_expiry.parse::<i64>().unwrap();
    let expiry = (Utc::now() + Duration::minutes(jwt_expiry)).timestamp();
    let claims = JwtClaims {
        iss: env.jwt_domain.to_owned(),
        sub: user.username.to_owned(),
        exp: expiry,
    };
    let token = jsonwebtoken::encode(
        &jsonwebtoken::Header::default(),
        &claims,
        &EncodingKey::from_secret(env.jwt_secret.as_bytes()),
    )?;
    Ok(Jwt { token, expiry })
}
