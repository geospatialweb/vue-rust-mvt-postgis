use garde::Validate;
use geojson::FeatureCollection;
use salvo::http::StatusCode;
use salvo::macros::Extractible;
use salvo::prelude::{JwtAuthDepotExt, JwtAuthState::Authorized, JwtAuthState::Forbidden, JwtAuthState::Unauthorized};
use salvo::{handler, Depot, Request};
use serde::Deserialize;
use tracing::error;

use super::auth;
use super::auth::Jwt;
use super::env::Env;
use super::model::User;
use super::query;
use super::response::{HandlerError, HandlerResponse};

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
) -> Result<HandlerResponse<FeatureCollection>, HandlerError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let params: LayerParams = req.extract().await?;
            if let Err(err) = params.validate(&()) {
                error!("layer query params validation error: {}", &err);
                return Err(HandlerError::LayerParamsValidation);
            }
            let features = query::get_features(&params).await?;
            let fc = super::geojson::create_feature_collection(&features);
            let res = HandlerResponse::new(fc.into(), &StatusCode::OK);
            Ok(res)
        }
        Unauthorized => Err(HandlerError::JwtUnauthorized),
        Forbidden => Err(HandlerError::JwtForbidden),
    }
}

#[handler]
/// Return Mapbox Access Token.
pub async fn handle_get_mapbox_access_token(depot: &mut Depot) -> Result<HandlerResponse<String>, HandlerError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let env = Env::get_env();
            let res = HandlerResponse::new(env.mapbox_access_token.to_string().into(), &StatusCode::OK);
            Ok(res)
        }
        Unauthorized => Err(HandlerError::JwtUnauthorized),
        Forbidden => Err(HandlerError::JwtForbidden),
    }
}

#[handler]
/// Return User.
pub async fn handle_get_user(depot: &mut Depot, req: &mut Request) -> Result<HandlerResponse<String>, HandlerError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let user: User = req.extract().await?;
            if let Err(err) = user.validate(&()) {
                error!("user query params validation error: {}", &err);
                return Err(HandlerError::UserValidation);
            }
            let user = query::get_user(&user.username).await?;
            let res = HandlerResponse::new(user.username.into(), &StatusCode::OK);
            Ok(res)
        }
        Unauthorized => Err(HandlerError::JwtUnauthorized),
        Forbidden => Err(HandlerError::JwtForbidden),
    }
}

#[handler]
/// Delete user returning username.
pub async fn handle_delete_user(depot: &mut Depot, req: &mut Request) -> Result<HandlerResponse<String>, HandlerError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let user: User = req.extract().await?;
            if let Err(err) = user.validate(&()) {
                error!("user query params validation error: {}", &err);
                return Err(HandlerError::UserValidation);
            }
            let user = query::delete_user(&user.username).await?;
            let res = HandlerResponse::new(user.username.into(), &StatusCode::OK);
            Ok(res)
        }
        Unauthorized => Err(HandlerError::JwtUnauthorized),
        Forbidden => Err(HandlerError::JwtForbidden),
    }
}

#[handler]
/// Login user. User submitted password is verified against HS256 password hash stored in db.
pub async fn handle_login(req: &mut Request) -> Result<HandlerResponse<Jwt>, HandlerError> {
    let user: User = req.extract().await?;
    if let Err(err) = user.validate(&()) {
        error!("user query params validation error: {}", &err);
        return Err(HandlerError::UserValidation);
    }
    let credential = query::get_password(&user.username).await?;
    auth::verify_password_and_hash(&user.password.unwrap(), &credential.password)?;
    let jwt = auth::get_jwt(&user.username)?;
    let res = HandlerResponse::new(jwt.into(), &StatusCode::OK);
    Ok(res)
}

#[handler]
/// Register user. User submitted password is converted into HS256 password hash stored in db.
pub async fn handle_register(req: &mut Request) -> Result<HandlerResponse<String>, HandlerError> {
    let user: User = req.extract().await?;
    if let Err(err) = user.validate(&()) {
        error!("user query params validation error: {}", &err);
        return Err(HandlerError::UserValidation);
    }
    let hash = auth::generate_hash_from_password(&user.password.unwrap())?;
    let user = query::insert_user(&User::new(&user.username, &Some(hash))).await?;
    let res = HandlerResponse::new(user.username.into(), &StatusCode::CREATED);
    Ok(res)
}

#[handler]
/// Update user password returning username. User submitted password is converted into HS256 password hash stored in db.
pub async fn handle_update_password(
    depot: &mut Depot,
    req: &mut Request,
) -> Result<HandlerResponse<String>, HandlerError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let user: User = req.extract().await?;
            if let Err(err) = user.validate(&()) {
                error!("user query params validation error: {}", &err);
                return Err(HandlerError::UserValidation);
            }
            let hash = auth::generate_hash_from_password(&user.password.unwrap())?;
            let user = query::update_password(&User::new(&user.username, &Some(hash))).await?;
            let res = HandlerResponse::new(user.username.into(), &StatusCode::OK);
            Ok(res)
        }
        Unauthorized => Err(HandlerError::JwtUnauthorized),
        Forbidden => Err(HandlerError::JwtForbidden),
    }
}

#[handler]
/// Validate user exists in db returning username.
pub async fn handle_validate_user(req: &mut Request) -> Result<HandlerResponse<String>, HandlerError> {
    let user: User = req.extract().await?;
    if let Err(err) = user.validate(&()) {
        error!("user query params validation error: {}", &err);
        return Err(HandlerError::UserValidation);
    }
    let user = query::get_user(&user.username).await?;
    let res = HandlerResponse::new(user.username.into(), &StatusCode::OK);
    Ok(res)
}
