#![cfg_attr(rustfmt, rustfmt_skip)]

use bcrypt::BcryptError;
use geojson::Error as GeoJsonError;
use jsonwebtoken::errors::Error as JwtError;
use salvo::http::{ParseError, Response, StatusCode};
use salvo::Scribe;
use serde::Serialize;
use serde_json::json;
use sqlx::Error as DatabaseError;
use std::num::ParseIntError;
use thiserror::Error;

#[derive(Debug, Serialize)]
#[serde(untagged)]
/// Response generic types.
pub enum ResponseType<T> {
    Type(T),
}
impl<T> From<T> for ResponseType<T> {
    fn from(r#type: T) -> Self {
        ResponseType::Type(r#type)
    }
}

#[derive(Debug)]
/// Response struct containing ResponseType<T> payload and response status code fields.
pub struct ResponsePayload<T> {
    payload: ResponseType<T>,
    status_code: StatusCode,
}
impl<T> ResponsePayload<T> {
    /// Create new ResponsePayload.
    pub fn new(payload: ResponseType<T>, status_code: &StatusCode) -> Self {
        Self {
            payload,
            status_code: status_code.to_owned(),
        }
    }
}
impl<T: Serialize> Scribe for ResponsePayload<T> {
    /// Write response payload and status code.
    fn render(self, res: &mut Response) {
        res.status_code(self.status_code)
           .render(json!(&self.payload).to_string());
    }
}

#[derive(Debug, Error)]
/// Response error types.
pub enum ResponseError {
    #[error("bcrypt error: {0}")]
    Bcrypt(#[from] BcryptError),

    #[error("database error: {0}")]
    Database(#[from] DatabaseError),

    #[error("geojson error: {0}")]
    GeoJson(#[from] GeoJsonError),

    #[error("jwt error: {0}")]
    Jwt(#[from] JwtError),

    #[error("parse error: {0}")]
    Parse(#[from] ParseError),

    #[error("parse int error: {0}")]
    ParseInt(#[from] ParseIntError),

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
    /// Write response error and status code.
    fn render(self, res: &mut Response) {
        match self {
            ResponseError::Bcrypt(_) => {
                res.status_code(StatusCode::UNAUTHORIZED)
                   .render(json!(format!("{}", &self)).to_string());
            }
            ResponseError::Database(_) => {
                res.status_code(StatusCode::INTERNAL_SERVER_ERROR)
                   .render(json!(format!("{}", &self)).to_string());
            }
            ResponseError::GeoJson(_) => {
                res.status_code(StatusCode::INTERNAL_SERVER_ERROR)
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
            ResponseError::ParseInt(_) => {
                res.status_code(StatusCode::INTERNAL_SERVER_ERROR)
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
