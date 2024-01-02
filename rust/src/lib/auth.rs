use bcrypt::{BcryptError, DEFAULT_COST};
use chrono::{Duration, Utc};
use jsonwebtoken::errors::Error;
use jsonwebtoken::{DecodingKey, EncodingKey, Header, Validation};
use salvo::jwt_auth::{ConstDecoder, HeaderFinder};
use salvo::prelude::{Depot, JwtAuth, JwtAuthDepotExt};
use serde::{Deserialize, Serialize};

use super::env::Env;

#[derive(Debug)]
pub struct Credential {
    pub hash: String,
}
impl Credential {
    pub fn new(password: &str) -> Self {
        Self {
            hash: password.to_owned(),
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

pub fn auth() -> JwtAuth<JwtClaims, ConstDecoder> {
    let env: Env = Default::default();
    JwtAuth::new(ConstDecoder::from_secret(env.jwt_claims_secret.as_bytes()))
        .finders(vec![Box::new(HeaderFinder::new())])
        .force_passed(true)
}

pub fn generate_hash_from_password(password: &str) -> Result<String, BcryptError> {
    let hash = bcrypt::hash(password, DEFAULT_COST)?;
    Ok(hash)
}

pub fn verify_password_and_hash(password: &str, hash: &str) -> Result<bool, BcryptError> {
    let verify = bcrypt::verify(password, hash)?;
    Ok(verify)
}

pub fn get_jwt(username: &str) -> Result<Jwt, Error> {
    let env: Env = Default::default();
    let minutes = env.jwt_claims_expiry.parse::<i64>().unwrap();
    let expiry = (Utc::now() + Duration::minutes(minutes)).timestamp();
    let jwt_claims = JwtClaims {
        iss: env.jwt_claims_issuer.to_owned(),
        sub: username.to_owned(),
        exp: expiry.to_owned(),
    };
    let token = jsonwebtoken::encode(
        &Header::default(), // HS256
        &jwt_claims,
        &EncodingKey::from_secret(env.jwt_claims_secret.as_ref()),
    )?;
    Ok(Jwt { token, expiry })
}

#[rustfmt::skip]
pub fn validate_jwt_claims_issuer(depot: &mut Depot) -> bool {
    match depot.jwt_auth_token() {
        Some(token) => {
            let env: Env = Default::default();
            let jwt_claims = jsonwebtoken::decode::<JwtClaims>(
                token,
                &DecodingKey::from_secret(env.jwt_claims_secret.as_ref()),
                &Validation::default(), // HS256
            ).unwrap();
            if jwt_claims.claims.iss != env.jwt_claims_issuer {
                return false;
            }
            true
        }
        None => false,
    }
}
