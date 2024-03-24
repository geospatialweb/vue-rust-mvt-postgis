use garde::Validate;
use geojson::FeatureCollection;
use salvo::{
    handler,
    http::{Request, StatusCode},
    prelude::{
        JwtAuthDepotExt,
        JwtAuthState::{Authorized, Forbidden, Unauthorized},
    },
    Depot,
};
use serde::Deserialize;

use super::auth::{self, Jwt};
use super::env::Env;
use super::model::User;
use super::query;
use super::response::{ResponseError, ResponsePayload};
use super::validation;

/// URL query params.
#[derive(Debug, Deserialize, Validate)]
pub struct LayerParams {
    #[garde(ascii)]
    pub columns: String,
    #[garde(ascii)]
    pub table: String,
}

/// Return GeoJSON feature collection.
#[handler]
pub async fn handle_get_geojson_feature_collection(
    depot: &mut Depot,
    req: &mut Request,
) -> Result<ResponsePayload<FeatureCollection>, ResponseError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let params = req.parse_queries::<LayerParams>()?;
            validation::validate_layer_params(&params)?;
            let json_features = query::get_json_features(&params).await?;
            let fc = super::geojson::create_feature_collection(&json_features)?;
            let res = ResponsePayload::new(fc.into(), StatusCode::OK);
            Ok(res)
        }
        Unauthorized => Err(ResponseError::JwtUnauthorized),
        Forbidden => Err(ResponseError::JwtForbidden),
    }
}

/// Return Mapbox Access Token.
#[handler]
pub async fn handle_get_mapbox_access_token(depot: &mut Depot) -> Result<ResponsePayload<String>, ResponseError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let env = Env::get_env();
            let res = ResponsePayload::new(env.mapbox_access_token.clone().into(), StatusCode::OK);
            Ok(res)
        }
        Unauthorized => Err(ResponseError::JwtUnauthorized),
        Forbidden => Err(ResponseError::JwtForbidden),
    }
}

/// Login user. User submitted plain text password is verified against HS256 hashed password stored in db.
#[handler]
pub async fn handle_login(req: &mut Request) -> Result<ResponsePayload<Jwt>, ResponseError> {
    let user = req.parse_queries::<User>()?;
    validation::validate_user(&user)?;
    let credential = query::get_password(&user.username).await?;
    auth::verify_password_and_hashed_password(&user.password.unwrap(), &credential.hashed_password)?;
    let jwt = auth::get_jwt(&user.username)?;
    let res = ResponsePayload::new(jwt.into(), StatusCode::OK);
    Ok(res)
}

/// Register user. User submitted password is converted into HS256 hash and stored in db.
#[handler]
pub async fn handle_register(req: &mut Request) -> Result<ResponsePayload<String>, ResponseError> {
    let user = req.parse_body::<User>().await?;
    validation::validate_user(&user)?;
    let hashed_password = auth::generate_hashed_password_from_password(&user.password.unwrap())?;
    let username = query::insert_user(&user.username, &hashed_password).await?;
    let res = ResponsePayload::new(username.into(), StatusCode::CREATED);
    Ok(res)
}

/// Return user.
#[handler]
pub async fn handle_get_user(depot: &mut Depot, req: &mut Request) -> Result<ResponsePayload<String>, ResponseError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let user = req.parse_queries::<User>()?;
            validation::validate_user(&user)?;
            let username = query::get_user(&user.username).await?;
            let res = ResponsePayload::new(username.into(), StatusCode::OK);
            Ok(res)
        }
        Unauthorized => Err(ResponseError::JwtUnauthorized),
        Forbidden => Err(ResponseError::JwtForbidden),
    }
}

/// Delete user returning username.
#[handler]
pub async fn handle_delete_user(
    depot: &mut Depot,
    req: &mut Request,
) -> Result<ResponsePayload<String>, ResponseError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let user = req.parse_queries::<User>()?;
            validation::validate_user(&user)?;
            let username = query::delete_user(&user.username).await?;
            let res = ResponsePayload::new(username.into(), StatusCode::OK);
            Ok(res)
        }
        Unauthorized => Err(ResponseError::JwtUnauthorized),
        Forbidden => Err(ResponseError::JwtForbidden),
    }
}

/// Validate user exists in db returning username.
#[handler]
pub async fn handle_validate_user(req: &mut Request) -> Result<ResponsePayload<String>, ResponseError> {
    let user = req.parse_queries::<User>()?;
    validation::validate_user(&user)?;
    let username = query::get_user(&user.username).await?;
    let res = ResponsePayload::new(username.into(), StatusCode::OK);
    Ok(res)
}

/// Update user password returning username. User submitted password is converted into HS256 hash and stored in db.
#[handler]
pub async fn handle_update_password(
    depot: &mut Depot,
    req: &mut Request,
) -> Result<ResponsePayload<String>, ResponseError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let user = req.parse_body::<User>().await?;
            validation::validate_user(&user)?;
            let hashed_password = auth::generate_hashed_password_from_password(&user.password.unwrap())?;
            let username = query::update_password(&user.username, &hashed_password).await?;
            let res = ResponsePayload::new(username.into(), StatusCode::OK);
            Ok(res)
        }
        Unauthorized => Err(ResponseError::JwtUnauthorized),
        Forbidden => Err(ResponseError::JwtForbidden),
    }
}
