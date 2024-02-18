use garde::Validate;
use salvo::http::StatusCode;
use salvo::macros::Extractible;
use salvo::prelude::{JwtAuthDepotExt, JwtAuthState::Authorized, JwtAuthState::Forbidden, JwtAuthState::Unauthorized};
use salvo::{handler, Depot, Request};
use serde::Deserialize;
use tracing::error;

use super::auth;
use super::env::Env;
use super::model::User;
use super::query;
use super::response::{ResponseError, ResponsePayload};

#[derive(Debug, Deserialize, Extractible, Validate)]
#[salvo(extract(default_source(from = "query")))]
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
) -> Result<ResponsePayload<geojson::FeatureCollection>, ResponseError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let params: LayerParams = req.extract().await?;
            if let Err(err) = params.validate(&()) {
                error!("layer query params validation error: {}", &err);
                return Err(ResponseError::LayerParamsValidation);
            }
            let features = query::get_features(&params).await?;
            let fc = super::geojson::create_feature_collection(&features);
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
            let res = ResponsePayload::new(env.mapbox_access_token.to_string().into(), &StatusCode::OK);
            Ok(res)
        }
        Unauthorized => Err(ResponseError::JwtUnauthorized),
        Forbidden => Err(ResponseError::JwtForbidden),
    }
}

#[handler]
/// Return User.
pub async fn handle_get_user(depot: &mut Depot, req: &mut Request) -> Result<ResponsePayload<String>, ResponseError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let user: User = req.extract().await?;
            if let Err(err) = user.validate(&()) {
                error!("user query params validation error: {}", &err);
                return Err(ResponseError::UserValidation);
            }
            let user = query::get_user(&user.username).await?;
            let res = ResponsePayload::new(user.username.into(), &StatusCode::OK);
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
            let user: User = req.extract().await?;
            if let Err(err) = user.validate(&()) {
                error!("user query params validation error: {}", &err);
                return Err(ResponseError::UserValidation);
            }
            let user = query::delete_user(&user.username).await?;
            let res = ResponsePayload::new(user.username.into(), &StatusCode::OK);
            Ok(res)
        }
        Unauthorized => Err(ResponseError::JwtUnauthorized),
        Forbidden => Err(ResponseError::JwtForbidden),
    }
}

#[handler]
/// Login user. User submitted password is verified against HS256 password hash stored in db.
pub async fn handle_login(req: &mut Request) -> Result<ResponsePayload<auth::Jwt>, ResponseError> {
    let user: User = req.extract().await?;
    if let Err(err) = user.validate(&()) {
        error!("user query params validation error: {}", &err);
        return Err(ResponseError::UserValidation);
    }
    let credential = query::get_password(&user.username).await?;
    auth::verify_password_and_hash(&user.password.unwrap(), &credential.password)?;
    let jwt = auth::get_jwt(&user.username)?;
    let res = ResponsePayload::new(jwt.into(), &StatusCode::OK);
    Ok(res)
}

#[handler]
/// Register user. User submitted password is converted into HS256 password hash stored in db.
pub async fn handle_register(req: &mut Request) -> Result<ResponsePayload<String>, ResponseError> {
    let user: User = req.extract().await?;
    if let Err(err) = user.validate(&()) {
        error!("user query params validation error: {}", &err);
        return Err(ResponseError::UserValidation);
    }
    let hash = auth::generate_hash_from_password(&user.password.unwrap())?;
    let user = query::insert_user(&User::new(&user.username, &Some(hash))).await?;
    let res = ResponsePayload::new(user.username.into(), &StatusCode::CREATED);
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
            let user: User = req.extract().await?;
            if let Err(err) = user.validate(&()) {
                error!("user query params validation error: {}", &err);
                return Err(ResponseError::UserValidation);
            }
            let hash = auth::generate_hash_from_password(&user.password.unwrap())?;
            let user = query::update_password(&User::new(&user.username, &Some(hash))).await?;
            let res = ResponsePayload::new(user.username.into(), &StatusCode::OK);
            Ok(res)
        }
        Unauthorized => Err(ResponseError::JwtUnauthorized),
        Forbidden => Err(ResponseError::JwtForbidden),
    }
}

#[handler]
/// Validate user exists in db returning username.
pub async fn handle_validate_user(req: &mut Request) -> Result<ResponsePayload<String>, ResponseError> {
    let user: User = req.extract().await?;
    if let Err(err) = user.validate(&()) {
        error!("user query params validation error: {}", &err);
        return Err(ResponseError::UserValidation);
    }
    let user = query::get_user(&user.username).await?;
    let res = ResponsePayload::new(user.username.into(), &StatusCode::OK);
    Ok(res)
}
