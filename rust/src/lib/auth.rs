use chrono::{Duration, Utc};
use jsonwebtoken::{EncodingKey, Header};
use serde::{Deserialize, Serialize};

use super::env::Env;
use super::response::ResponseError;

/// JWT struct with token and expiry fields.
#[derive(Debug, PartialEq, Serialize)]
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

/// JWT claims struct with expiry, issuer, roles and subject fields.
#[derive(Debug, Deserialize, PartialEq, Serialize)]
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

    fn test_init() {
        dotenvy::dotenv().unwrap();
        Env::set_env().unwrap();
    }

    #[test]
    fn auth_create_jwt_ok() {
        test_init();
        let role = "user";
        let username = "foo@bar.com";
        let result = create_jwt(username, role);
        assert!(result.is_ok());
    }

    #[test]
    fn auth_new_jwt() {
        let expiry = 30;
        let jwt_expiry = expiry as i64;
        let jwt_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3Mzg4NzE0NzMsImlzcyI6Imdlb3NwYXRpYWx3ZWIuY2EiLCJyb2xlcyI6InVzZXIiLCJzdWIiOiJmb29AYmFyLmNvbSJ9.9yzeOAb8R8z8woQSi44NXtKS2uZhBQ7qOnAqmg5XYTo";
        let jwt = Jwt {
            jwt_expiry,
            jwt_token: jwt_token.to_owned(),
        };
        let result = Jwt::new(&jwt_expiry, jwt_token);
        assert_eq!(result, jwt);
    }

    #[test]
    fn auth_new_jwt_claims() {
        let minutes = 30;
        let expiry = (Utc::now() + Duration::minutes(minutes)).timestamp();
        let issuer = "bar.com";
        let roles = "user";
        let subject = "foo@bar.com";
        let jwt_claims = JwtClaims {
            exp: expiry,
            iss: issuer.to_owned(),
            roles: roles.to_owned(),
            sub: subject.to_owned(),
        };
        let result = JwtClaims::new(&expiry, issuer, roles, subject);
        assert_eq!(result, jwt_claims);
    }
}
