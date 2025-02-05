use chrono::{Duration, Utc};
use jsonwebtoken::{EncodingKey, Header};
use serde::{Deserialize, Serialize};

use super::env::Env;
use super::response::ResponseError;

/// Auth JWT token and expiry.
#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Jwt {
    jwt_expiry: i64,
    pub jwt_token: String,
}

impl Jwt {
    /// Create new JWT.
    fn new(jwt_expiry: &i64, jwt_token: &str) -> Self {
        Self {
            jwt_expiry: jwt_expiry.to_owned(),
            jwt_token: jwt_token.to_owned(),
        }
    }
}

/// JWT claims issuer, subject and expiry.
#[derive(Debug, Deserialize, Serialize)]
pub struct JwtClaims {
    exp: i64,
    iss: String,
    roles: String,
    sub: String,
}

impl JwtClaims {
    /// Create new JwtClaims.
    fn new(exp: &i64, iss: &str, roles: &str, sub: &str) -> Self {
        Self {
            exp: exp.to_owned(),
            iss: iss.to_owned(),
            roles: roles.to_owned(),
            sub: sub.to_owned(),
        }
    }
}

/// Return JWT HS256 token and expiry.
pub fn create_jwt(username: &str, role: &str) -> Result<Jwt, ResponseError> {
    let env = Env::get_env();
    let minutes = env.jwt_expiry.parse::<i64>()?;
    let jwt_expiry = (Utc::now() + Duration::minutes(minutes)).timestamp();
    let jwt_issuer = env.jwt_issuer.as_str();
    let jwt_claims = JwtClaims::new(&jwt_expiry, jwt_issuer, role, username);
    let jwt_secret = env.jwt_secret.as_bytes();
    let jwt_token = jsonwebtoken::encode(&Header::default(), &jwt_claims, &EncodingKey::from_secret(jwt_secret))?;
    let jwt = Jwt::new(&jwt_expiry, &jwt_token);
    Ok(jwt)
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::database::Pool;

    #[tokio::main]
    async fn test_init() {
        dotenvy::dotenv().unwrap();
        Env::set_env().unwrap();
        Pool::set_pool().await.unwrap();
    }

    #[test]
    fn auth_create_jwt_ok() {
        test_init();
        let role = "user";
        let username = "foo@bar.com";
        let result = create_jwt(username, role);
        assert!(result.is_ok());
    }
}
