use garde::Validate;
use geojson::FeatureCollection;
use salvo::http::{Request, StatusCode};
use salvo::prelude::{JwtAuthDepotExt, JwtAuthState::Authorized, JwtAuthState::Forbidden, JwtAuthState::Unauthorized};
use salvo::{handler, Depot};
use serde::Deserialize;

use super::auth;
use super::auth::Jwt;
use super::env::Env;
use super::helpers;
use super::model::User;
use super::query;
use super::response::{ResponseError, ResponsePayload};

#[derive(Debug, Deserialize, Validate)]
pub struct LayerParams {
    #[garde(ascii)]
    pub columns: String,
    #[garde(ascii)]
    pub table: String,
}

#[handler]
/// Return GeoJSON feature collection.
pub async fn handle_get_geojson_feature_collection(
    depot: &mut Depot,
    req: &mut Request,
) -> Result<ResponsePayload<FeatureCollection>, ResponseError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let params = req.parse_queries::<LayerParams>()?;
            helpers::validate_layer_params(&params)?;
            let features = query::get_features(&params).await?;
            let fc = super::geojson::create_feature_collection(&features)?;
            let res = ResponsePayload::new(fc.into(), &StatusCode::OK);
            Ok(res)
        }
        Unauthorized => Err(ResponseError::JwtUnauthorized),
        Forbidden => Err(ResponseError::JwtForbidden),
    }
}

#[handler]
/// Return Mapbox Access Token.
pub async fn handle_get_mapbox_access_token(depot: &mut Depot) -> Result<ResponsePayload<String>, ResponseError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let env = Env::get_env();
            let res = ResponsePayload::new(env.mapbox_access_token.clone().into(), &StatusCode::OK);
            Ok(res)
        }
        Unauthorized => Err(ResponseError::JwtUnauthorized),
        Forbidden => Err(ResponseError::JwtForbidden),
    }
}

#[handler]
/// Login user. User submitted password is verified against HS256 password hash stored in db.
pub async fn handle_login(req: &mut Request) -> Result<ResponsePayload<Jwt>, ResponseError> {
    let user = req.parse_queries::<User>()?;
    helpers::validate_user(&user)?;
    let credential = query::get_password(&user.username).await?;
    auth::verify_password_and_hash(&user.password.unwrap(), &credential.password)?;
    let jwt = auth::get_jwt(&user.username)?;
    let res = ResponsePayload::new(jwt.into(), &StatusCode::OK);
    Ok(res)
}

#[handler]
/// Register user. User submitted password is converted into HS256 password hash stored in db.
pub async fn handle_register(req: &mut Request) -> Result<ResponsePayload<String>, ResponseError> {
    let user = req.parse_body::<User>().await?;
    helpers::validate_user(&user)?;
    let hash = auth::generate_hash_from_password(&user.password.unwrap())?;
    let username = query::insert_user(&User::new(&user.username, &Some(hash))).await?;
    let res = ResponsePayload::new(username.into(), &StatusCode::CREATED);
    Ok(res)
}

#[handler]
/// Return user.
pub async fn handle_get_user(depot: &mut Depot, req: &mut Request) -> Result<ResponsePayload<String>, ResponseError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let user = req.parse_queries::<User>()?;
            helpers::validate_user(&user)?;
            let username = query::get_user(&user.username).await?;
            let res = ResponsePayload::new(username.into(), &StatusCode::OK);
            Ok(res)
        }
        Unauthorized => Err(ResponseError::JwtUnauthorized),
        Forbidden => Err(ResponseError::JwtForbidden),
    }
}

#[handler]
/// Delete user returning username.
pub async fn handle_delete_user(
    depot: &mut Depot,
    req: &mut Request,
) -> Result<ResponsePayload<String>, ResponseError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let user = req.parse_queries::<User>()?;
            helpers::validate_user(&user)?;
            let username = query::delete_user(&user.username).await?;
            let res = ResponsePayload::new(username.into(), &StatusCode::OK);
            Ok(res)
        }
        Unauthorized => Err(ResponseError::JwtUnauthorized),
        Forbidden => Err(ResponseError::JwtForbidden),
    }
}

#[handler]
/// Validate user exists in db returning username.
pub async fn handle_validate_user(req: &mut Request) -> Result<ResponsePayload<String>, ResponseError> {
    let user = req.parse_queries::<User>()?;
    helpers::validate_user(&user)?;
    let username = query::get_user(&user.username).await?;
    let res = ResponsePayload::new(username.into(), &StatusCode::OK);
    Ok(res)
}

#[handler]
/// Update user password returning username. User submitted password is converted into HS256 password hash stored in db.
pub async fn handle_update_password(
    depot: &mut Depot,
    req: &mut Request,
) -> Result<ResponsePayload<String>, ResponseError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let user = req.parse_body::<User>().await?;
            helpers::validate_user(&user)?;
            let hash = auth::generate_hash_from_password(&user.password.unwrap())?;
            let user = query::update_password(&User::new(&user.username, &Some(hash))).await?;
            let res = ResponsePayload::new(user.username.into(), &StatusCode::OK);
            Ok(res)
        }
        Unauthorized => Err(ResponseError::JwtUnauthorized),
        Forbidden => Err(ResponseError::JwtForbidden),
    }
}
