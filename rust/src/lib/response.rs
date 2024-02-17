#![cfg_attr(rustfmt, rustfmt_skip)]

use bcrypt::BcryptError;
use jsonwebtoken::errors::Error as JwtError;
use salvo::http::{ParseError, Response, StatusCode};
use salvo::Scribe;
use serde::Serialize;
use serde_json::json;
use sqlx::Error as QueryError;
use thiserror::Error;

#[derive(Debug, Serialize)]
#[serde(untagged)]
/// Handler response data type.
pub enum HandlerResponseType<T> {
    Type(T),
}
impl<T> From<T> for HandlerResponseType<T> {
    fn from(r#type: T) -> Self {
        HandlerResponseType::Type(r#type)
    }
}

#[derive(Debug)]
pub struct HandlerResponse<T> {
    response: HandlerResponseType<T>,
    status_code: StatusCode,
}
impl<T> HandlerResponse<T> {
    /// Create new HandlerResponse.
    pub fn new(response: HandlerResponseType<T>, status_code: &StatusCode) -> Self {
        Self {
            response,
            status_code: status_code.to_owned(),
        }
    }
}
impl<T: Serialize> Scribe for HandlerResponse<T> {
    /// Write handler response and status code.
    fn render(self, res: &mut Response) {
        res.status_code(self.status_code)
           .render(json!(&self.response).to_string());
    }
}

#[derive(Debug, Error)]
/// Handler response error types.
pub enum HandlerError {
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
impl Scribe for HandlerError {
    /// Write handler error and status code.
    fn render(self, res: &mut Response) {
        match self {
            HandlerError::Bcrypt(_) => {
                res.status_code(StatusCode::UNAUTHORIZED)
                   .render(json!(format!("{}", &self)).to_string());
            }
            HandlerError::Jwt(_) => {
                res.status_code(StatusCode::UNAUTHORIZED)
                   .render(json!(format!("{}", &self)).to_string());
            }
            HandlerError::Parse(_) => {
                res.status_code(StatusCode::BAD_REQUEST)
                   .render(json!(format!("{}", &self)).to_string());
            }
            HandlerError::Query(_) => {
                res.status_code(StatusCode::BAD_REQUEST)
                   .render(json!(format!("{}", &self)).to_string());
            }
            HandlerError::JwtForbidden => {
                res.status_code(StatusCode::FORBIDDEN)
                   .render(json!(format!("{}", &self)).to_string());
            }
            HandlerError::JwtUnauthorized => {
                res.status_code(StatusCode::UNAUTHORIZED)
                   .render(json!(format!("{}", &self)).to_string());
            }
            HandlerError::LayerParamsValidation => {
                res.status_code(StatusCode::BAD_REQUEST)
                   .render(json!(format!("{}", &self)).to_string());
            }
            HandlerError::UserValidation => {
                res.status_code(StatusCode::BAD_REQUEST)
                   .render(json!(format!("{}", &self)).to_string());
            }
        }
    }
}
