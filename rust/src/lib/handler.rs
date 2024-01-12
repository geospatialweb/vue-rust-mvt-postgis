#![cfg_attr(rustfmt, rustfmt_skip)]

use garde::Validate;
use geojson::FeatureCollection;
use salvo::http::StatusCode;
use salvo::macros::Extractible;
use salvo::prelude::{
    handler,
    Depot,
    JwtAuthDepotExt,
    JwtAuthState::Authorized,
    JwtAuthState::Forbidden,
    JwtAuthState::Unauthorized,
    Request,
    Response,
};
use serde::Deserialize;
use serde_json::json;
use tracing::error;

use super::auth;
use super::env::Env;
use super::model::User;
use super::query;
use super::response::{ResponseError, ResponseType};

#[derive(Debug, Deserialize, Extractible, Validate)]
#[salvo(extract(default_source(from = "query")))]
pub struct LayerParams {
    #[garde(ascii)]
    pub columns: String,
    #[garde(ascii)]
    pub table: String,
}

#[handler]
#[tracing::instrument]
pub async fn handle_get_geojson_feature_collection(
    depot: &mut Depot,
    req: &mut Request,
) -> Result<ResponseType<FeatureCollection>, ResponseError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let params: LayerParams = req.extract().await?;
            if let Err(err) = params.validate(&()) {
                error!("layer query params validation error: {}", &err);
                return Err(ResponseError::LayerParamsValidation);
            }
            let features = query::get_features(&params).await?;
            let fc = super::geojson::create_feature_collection(&features);
            return Ok(fc.into());
        }
        Unauthorized => return Err(ResponseError::JwtUnauthorized),
        Forbidden => return Err(ResponseError::JwtForbidden),
    }
}

#[handler]
#[tracing::instrument]
pub async fn handle_get_mapbox_access_token(depot: &mut Depot) -> Result<ResponseType<String>, ResponseError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let env: Env = Default::default();
            return Ok(env.mapbox_access_token.into());
        }
        Unauthorized => return Err(ResponseError::JwtUnauthorized),
        Forbidden => return Err(ResponseError::JwtForbidden),
    }
}

#[handler]
#[tracing::instrument]
pub async fn handle_get_user(depot: &mut Depot, req: &mut Request) -> Result<ResponseType<String>, ResponseError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let user: User = req.extract().await?;
            if let Err(err) = user.validate(&()) {
                error!("user query params validation error: {}", &err);
                return Err(ResponseError::UserValidation);
            }
            let user = query::get_user(&user.username).await?;
            return Ok(user.username.into());
        }
        Unauthorized => return Err(ResponseError::JwtUnauthorized),
        Forbidden => return Err(ResponseError::JwtForbidden),
    }
}

#[handler]
#[tracing::instrument]
pub async fn handle_delete_user(depot: &mut Depot, req: &mut Request) -> Result<ResponseType<String>, ResponseError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let user: User = req.extract().await?;
            if let Err(err) = user.validate(&()) {
                error!("user query params validation error: {}", &err);
                return Err(ResponseError::UserValidation);
            }
            let user = query::delete_user(&user.username).await?;
            return Ok(user.username.into());
        }
        Unauthorized => return Err(ResponseError::JwtUnauthorized),
        Forbidden => return Err(ResponseError::JwtForbidden),
    }
}

#[handler]
#[tracing::instrument]
pub async fn handle_login(req: &mut Request) -> Result<ResponseType<auth::Jwt>, ResponseError> {
    let user: User = req.extract().await?;
    if let Err(err) = user.validate(&()) {
        error!("user query params validation error: {}", &err);
        return Err(ResponseError::UserValidation);
    }
    let password = query::get_password(&user.username).await?;
    auth::verify_password_and_hash(&user.password.unwrap(), &password.hash)?;
    let jwt = auth::get_jwt(&user.username)?;
    return Ok(jwt.into());
}

#[handler]
#[tracing::instrument]
pub async fn handle_register(req: &mut Request, res: &mut Response) -> Result<(), ResponseError> {
    let user: User = req.extract().await?;
    if let Err(err) = user.validate(&()) {
        error!("user query params validation error: {}", &err);
        return Err(ResponseError::UserValidation);
    }
    let hash = auth::generate_hash_from_password(&user.password.unwrap())?;
    let user = query::insert_user(&User::new(&user.username, &Some(hash))).await?;
    res.status_code(StatusCode::CREATED)
       .render(json!(user.username).to_string());
    Ok(())
}

#[handler]
#[tracing::instrument]
pub async fn handle_update_password(
    depot: &mut Depot,
    req: &mut Request,
) -> Result<ResponseType<String>, ResponseError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let user: User = req.extract().await?;
            if let Err(err) = user.validate(&()) {
                error!("user query params validation error: {}", &err);
                return Err(ResponseError::UserValidation);
            }
            let hash = auth::generate_hash_from_password(&user.password.unwrap())?;
            let user = query::update_password(&User::new(&user.username, &Some(hash))).await?;
            return Ok(user.username.into());
        }
        Unauthorized => return Err(ResponseError::JwtUnauthorized),
        Forbidden => return Err(ResponseError::JwtForbidden),
    }
}

#[handler]
#[tracing::instrument]
pub async fn handle_validate_user(req: &mut Request) -> Result<ResponseType<String>, ResponseError> {
    let user: User = req.extract().await?;
    if let Err(err) = user.validate(&()) {
        error!("user query params validation error: {}", &err);
        return Err(ResponseError::UserValidation);
    }
    let user = query::get_user(&user.username).await?;
    return Ok(user.username.into());
}
