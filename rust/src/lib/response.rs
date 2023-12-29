#![cfg_attr(rustfmt, rustfmt_skip)]

use geojson::FeatureCollection;
use jsonwebtoken::errors::Error as JwtError;
use salvo::http::{ParseError, StatusCode};
use salvo::prelude::Response;
use serde_json::json;
use sqlx::Error as QueryError;

use super::auth::Jwt;
use super::env::Config;
use super::model::User;

#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("jwt error: {0}")]
    Jwt(JwtError),

    #[error("query error: {0}")]
    Query(QueryError),

    // ParseError has to be handled separately since Salvo extracts `req` into structs
    // let params: Result<LayerParams, ParseError> = req.extract().await;
    // let user: Result<User, ParseError> = req.extract().await;
}

pub fn render_geojson_feature_collection(status: StatusCode, res: &mut Response, fc: &FeatureCollection) {
    res.status_code(status)
       .render(json!(&fc).to_string());
}

pub fn render_jwt(status: StatusCode, res: &mut Response, jwt: &Jwt) {
    res.status_code(status)
       .render(json!(&jwt).to_string());
}

pub fn render_mapbox_access_token(status: StatusCode, res: &mut Response) {
    let env: Config = Default::default();
    res.status_code(status)
       .render(json!(&env.mapbox_access_token).to_string());
}

pub fn render_username(status: StatusCode, res: &mut Response, user: &User) {
    res.status_code(status)
       .render(json!(&user.username).to_string());
}

pub fn _render_error(status: StatusCode, res: &mut Response, err: &AppError) {
    res.status_code(status)
       .render(json!(format!("{}", &err)).to_string());
}

pub fn render_auth_error(status: StatusCode, res: &mut Response, err: &JwtError) {
    res.status_code(status)
       .render(json!(format!("{}", &err)).to_string());
}

pub fn render_query_error(status: StatusCode, res: &mut Response, err: &QueryError) {
    res.status_code(status)
       .render(json!(format!("{}", &err)).to_string());
}

pub fn render_parse_error(status: StatusCode, res: &mut Response, err: &ParseError) {
    res.status_code(status)
       .render(json!(format!("{}", &err)).to_string());
}
