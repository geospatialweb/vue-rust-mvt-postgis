#![cfg_attr(rustfmt, rustfmt_skip)]

use bcrypt::BcryptError;
use jsonwebtoken::errors::Error as JwtError;
use salvo::http::{ParseError, StatusCode};
use salvo::prelude::{async_trait, Depot, Request, Response, Writer};
use serde_json::json;
use sqlx::Error as QueryError;
use thiserror::Error;

use AppError::{Bcrypt, Jwt, JwtClaimsValidation, LayerParamsValidation, Parse, Query, UserValidation};

#[derive(Debug, Error)]
pub enum AppError {
    #[error("bcrypt error: {0}")]
    Bcrypt(#[from] BcryptError),

    #[error("jwt error: {0}")]
    Jwt(#[from] JwtError),

    #[error("parse error: {0}")]
    Parse(#[from] ParseError),

    #[error("query error: {0}")]
    Query(#[from] QueryError),

    #[error("jwt claims validation error")]
    JwtClaimsValidation,

    #[error("layer params validation error")]
    LayerParamsValidation,

    #[error("user validation error")]
    UserValidation,
}
#[async_trait]
impl Writer for AppError {
    async fn write(mut self, _req: &mut Request, _depot: &mut Depot, res: &mut Response) {
        match self {
            Bcrypt(_) => {
                res.status_code(StatusCode::UNAUTHORIZED)
                   .render(json!(format!("{}", &self)).to_string());
            }
            Jwt(_) => {
                res.status_code(StatusCode::UNAUTHORIZED)
                   .render(json!(format!("{}", &self)).to_string());
            }
            Parse(_) => {
                res.status_code(StatusCode::BAD_REQUEST)
                   .render(json!(format!("{}", &self)).to_string());
            }
            Query(_) => {
                res.status_code(StatusCode::BAD_REQUEST)
                   .render(json!(format!("{}", &self)).to_string());
            }
            JwtClaimsValidation => {
                res.status_code(StatusCode::UNAUTHORIZED)
                   .render(json!(format!("{}", &self)).to_string());
            }
            LayerParamsValidation => {
                res.status_code(StatusCode::BAD_REQUEST)
                   .render(json!(format!("{}", &self)).to_string());
            }
            UserValidation => {
                res.status_code(StatusCode::BAD_REQUEST)
                   .render(json!(format!("{}", &self)).to_string());
            }
        }
    }
}
