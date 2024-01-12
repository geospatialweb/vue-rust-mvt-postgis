#![cfg_attr(rustfmt, rustfmt_skip)]

use bcrypt::BcryptError;
use jsonwebtoken::errors::Error as JwtError;
use salvo::http::{ParseError, StatusCode};
use salvo::prelude::{Response, Scribe};
use serde::Serialize;
use serde_json::json;
use sqlx::Error as QueryError;
use thiserror::Error;

#[derive(Debug, Serialize)]
#[serde(untagged)]
pub enum ResponseType<T> {
    Type(T),
}
impl<T> From<T> for ResponseType<T> {
    fn from(res: T) -> Self {
        ResponseType::Type(res)
    }
}
impl<T: Serialize> Scribe for ResponseType<T> {
    fn render(self, res: &mut Response) {
        res.status_code(StatusCode::OK)
           .render(json!(&self).to_string());
    }
}

#[derive(Debug, Error)]
pub enum ResponseError {
    #[error("bcrypt error: {0}")]
    Bcrypt(#[from] BcryptError),

    #[error("jwt error: {0}")]
    Jwt(#[from] JwtError),

    #[error("parse error: {0}")]
    Parse(#[from] ParseError),

    #[error("query error: {0}")]
    Query(#[from] QueryError),

    #[error("jwt forbidden")]
    JwtForbidden,

    #[error("jwt unauthorized")]
    JwtUnauthorized,

    #[error("layer query params validation error")]
    LayerParamsValidation,

    #[error("user query params validation error")]
    UserValidation,
}
impl Scribe for ResponseError {
    fn render(self, res: &mut Response) {
        match self {
            ResponseError::Bcrypt(_) => {
                res.status_code(StatusCode::UNAUTHORIZED)
                   .render(json!(format!("{}", &self)).to_string());
            }
            ResponseError::Jwt(_) => {
                res.status_code(StatusCode::UNAUTHORIZED)
                   .render(json!(format!("{}", &self)).to_string());
            }
            ResponseError::Parse(_) => {
                res.status_code(StatusCode::BAD_REQUEST)
                   .render(json!(format!("{}", &self)).to_string());
            }
            ResponseError::Query(_) => {
                res.status_code(StatusCode::BAD_REQUEST)
                   .render(json!(format!("{}", &self)).to_string());
            }
            ResponseError::JwtForbidden => {
                res.status_code(StatusCode::FORBIDDEN)
                   .render(json!(format!("{}", &self)).to_string());
            }
            ResponseError::JwtUnauthorized => {
                res.status_code(StatusCode::UNAUTHORIZED)
                   .render(json!(format!("{}", &self)).to_string());
            }
            ResponseError::LayerParamsValidation => {
                res.status_code(StatusCode::BAD_REQUEST)
                   .render(json!(format!("{}", &self)).to_string());
            }
            ResponseError::UserValidation => {
                res.status_code(StatusCode::BAD_REQUEST)
                   .render(json!(format!("{}", &self)).to_string());
            }
        }
    }
}
