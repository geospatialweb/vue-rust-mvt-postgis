#![cfg_attr(rustfmt, rustfmt_skip)]

use garde::Validate;
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
use super::error::AppError;
use super::geojson;
use super::model::User;
use super::query;

use AppError::{JwtForbidden, JwtUnauthorized, LayerParamsValidation, UserValidation};

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
pub async fn get_geojson_feature_collection(
    depot: &mut Depot,
    req: &mut Request,
    res: &mut Response,
) -> Result<(), AppError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let params: LayerParams = req.extract().await?;
            if let Err(err) = params.validate(&()) {
                error!("layer query params validation error: {}", err);
                return Err(LayerParamsValidation);
            }
            let features = query::get_features(&params).await?;
            let fc = geojson::create_feature_collection(&features);
            res.status_code(StatusCode::OK)
               .render(json!(&fc).to_string());
        }
        Unauthorized => return Err(JwtUnauthorized),
        Forbidden => return Err(JwtForbidden),
    }
    Ok(())
}

#[handler]
#[tracing::instrument]
pub async fn get_mapbox_access_token(depot: &mut Depot, res: &mut Response) -> Result<(), AppError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let env: Env = Default::default();
            res.status_code(StatusCode::OK)
               .render(json!(&env.mapbox_access_token).to_string());
        }
        Unauthorized => return Err(JwtUnauthorized),
        Forbidden => return Err(JwtForbidden),
    }
    Ok(())
}
#[handler]
#[tracing::instrument]
pub async fn get_user(depot: &mut Depot, req: &mut Request, res: &mut Response) -> Result<(), AppError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let user: User = req.extract().await?;
            if let Err(err) = user.validate(&()) {
                error!("user query params validation error: {}", err);
                return Err(UserValidation);
            }
            let user = query::get_user(&user.username).await?;
            res.status_code(StatusCode::OK)
               .render(json!(&user.username).to_string());
        }
        Unauthorized => return Err(JwtUnauthorized),
        Forbidden => return Err(JwtForbidden),
    }
    Ok(())
}

#[handler]
#[tracing::instrument]
pub async fn delete_user(depot: &mut Depot, req: &mut Request, res: &mut Response) -> Result<(), AppError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let user: User = req.extract().await?;
            if let Err(err) = user.validate(&()) {
                error!("user query params validation error: {}", &err);
                return Err(UserValidation);
            }
            let user = query::delete_user(&user.username).await?;
            res.status_code(StatusCode::OK)
               .render(json!(&user.username).to_string());
        }
        Unauthorized => return Err(JwtUnauthorized),
        Forbidden => return Err(JwtForbidden),
    }
    Ok(())
}

#[handler]
#[tracing::instrument]
pub async fn login(req: &mut Request, res: &mut Response) -> Result<(), AppError> {
    let user: User = req.extract().await?;
    if let Err(err) = user.validate(&()) {
        error!("user query params validation error: {}", &err);
        return Err(UserValidation);
    }
    let password = query::get_password(&user.username).await?;
    auth::verify_password_and_hash(&user.password.unwrap(), &password.hash)?;
    let jwt = auth::get_jwt(&user.username)?;
    res.status_code(StatusCode::OK)
       .render(json!(&jwt).to_string());
    Ok(())
}

#[handler]
#[tracing::instrument]
pub async fn register(req: &mut Request, res: &mut Response) -> Result<(), AppError> {
    let user: User = req.extract().await?;
    if let Err(err) = user.validate(&()) {
        error!("user query params validation error: {}", &err);
        return Err(UserValidation);
    }
    let hash = auth::generate_hash_from_password(&user.password.unwrap())?;
    let user = query::insert_user(&User::new(&user.username, &Some(hash))).await?;
    res.status_code(StatusCode::CREATED)
       .render(json!(&user.username).to_string());
    Ok(())
}

#[handler]
#[tracing::instrument]
pub async fn update_password(depot: &mut Depot, req: &mut Request, res: &mut Response) -> Result<(), AppError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let user: User = req.extract().await?;
            if let Err(err) = user.validate(&()) {
                error!("user query params validation error: {}", &err);
                return Err(UserValidation);
            }
            let hash = auth::generate_hash_from_password(&user.password.unwrap())?;
            let user = query::update_password(&User::new(&user.username, &Some(hash))).await?;
            res.status_code(StatusCode::OK)
               .render(json!(&user.username).to_string());
        }
        Unauthorized => return Err(JwtUnauthorized),
        Forbidden => return Err(JwtForbidden),
    }
    Ok(())
}

#[handler]
#[tracing::instrument]
pub async fn validate_user(req: &mut Request, res: &mut Response) -> Result<(), AppError> {
    let user: User = req.extract().await?;
    if let Err(err) = user.validate(&()) {
        error!("user query params validation error: {}", &err);
        return Err(UserValidation);
    }
    let user = query::get_user(&user.username).await?;
    res.status_code(StatusCode::OK)
       .render(json!(&user.username).to_string());
    Ok(())
}
