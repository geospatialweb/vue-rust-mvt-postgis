use bcrypt::BcryptError;
use geojson::Error as GeoJsonError;
use jsonwebtoken::errors::Error as JwtError;
use salvo::{
    http::{ParseError, Response, StatusCode},
    Scribe,
};
use serde::Serialize;
use serde_json::json;
use sqlx::Error as DatabaseError;
use std::num::ParseIntError;
use thiserror::Error;

/// Response generic types.
#[derive(Debug, Serialize)]
#[serde(untagged)]
pub enum ResponseType<T> {
    Type(T),
}
impl<T> From<T> for ResponseType<T> {
    fn from(r#type: T) -> Self {
        ResponseType::Type(r#type)
    }
}

/// ResponseType<T> payload and response status code.
#[derive(Debug)]
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
#[rustfmt::skip]
impl<T: Serialize> Scribe for ResponsePayload<T> {
    /// Write response payload and status code.
    fn render(self, res: &mut Response) {
        res.status_code(self.status_code)
           .render(json!(&self.payload).to_string());
    }
}

/// Response error types.
#[derive(Debug, Error)]
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
impl ResponseError {
    /// Set response status code for each response error type.
    fn as_status_code(&self) -> StatusCode {
        match self {
            Self::Bcrypt(_) => StatusCode::UNAUTHORIZED,
            Self::Database(_) => StatusCode::INTERNAL_SERVER_ERROR,
            Self::GeoJson(_) => StatusCode::INTERNAL_SERVER_ERROR,
            Self::Jwt(_) => StatusCode::UNAUTHORIZED,
            Self::Parse(_) => StatusCode::BAD_REQUEST,
            Self::ParseInt(_) => StatusCode::INTERNAL_SERVER_ERROR,
            Self::JwtForbidden => StatusCode::FORBIDDEN,
            Self::JwtUnauthorized => StatusCode::UNAUTHORIZED,
            Self::LayerParamsValidation => StatusCode::BAD_REQUEST,
            Self::UserValidation => StatusCode::BAD_REQUEST,
        }
    }
}
#[rustfmt::skip]
impl Scribe for ResponseError {
    /// Write response status code and response error message.
    fn render(self, res: &mut Response) {
        res.status_code(self.as_status_code())
           .render(json!(format!("{}", self)).to_string());
    }
}
