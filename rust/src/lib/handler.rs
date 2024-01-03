#![cfg_attr(rustfmt, rustfmt_skip)]

use garde::Validate;
use salvo::http::{StatusCode, StatusError};
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
use super::geojson;
use super::model::User;
use super::query;
use super::error::AppError;

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
    if auth::validate_jwt_claims_issuer(depot) {
        match depot.jwt_auth_state() {
            Authorized => {
                let params: LayerParams = req.extract().await?;
                if let Err(err) = params.validate(&()) {
                    error!("layer params validation error: {}", err);
                    return Err(AppError::LayerParamsValidation);
                }
                let features = query::get_features(&params).await?;
                let fc = geojson::create_feature_collection(&features);
                res.status_code(StatusCode::OK)
                   .render(json!(&fc).to_string());
            }
            Unauthorized => res.render(StatusError::unauthorized()),
            Forbidden => res.render(StatusError::forbidden()),
        }
        Ok(())
    } else {
        Err(AppError::JwtClaimsValidation)
    }
}

#[handler]
#[tracing::instrument]
pub async fn get_mapbox_access_token(depot: &mut Depot, res: &mut Response) -> Result<(), AppError> {
    if auth::validate_jwt_claims_issuer(depot) {
        match depot.jwt_auth_state() {
            Authorized => {
                let env: Env = Default::default();
                res.status_code(StatusCode::OK)
                   .render(json!(&env.mapbox_access_token).to_string());
            }
            Unauthorized => res.render(StatusError::unauthorized()),
            Forbidden => res.render(StatusError::forbidden()),
        }
        Ok(())
    } else {
        Err(AppError::JwtClaimsValidation)
    }
}
#[handler]
#[tracing::instrument]
pub async fn get_user(depot: &mut Depot, req: &mut Request, res: &mut Response) -> Result<(), AppError> {
    if auth::validate_jwt_claims_issuer(depot) {
        match depot.jwt_auth_state() {
            Authorized => {
                let user: User = req.extract().await?;
                if let Err(err) = user.validate(&()) {
                    error!("user validation error: {}", err);
                    return Err(AppError::UserValidation);
                }
                let user = query::get_user(&user.username).await?;
                res.status_code(StatusCode::OK)
                   .render(json!(&user.username).to_string());
            }
            Unauthorized => res.render(StatusError::unauthorized()),
            Forbidden => res.render(StatusError::forbidden()),
        }
        Ok(())
    } else {
        Err(AppError::JwtClaimsValidation)
    }
}

#[handler]
#[tracing::instrument]
pub async fn delete_user(depot: &mut Depot, req: &mut Request, res: &mut Response) -> Result<(), AppError> {
    if auth::validate_jwt_claims_issuer(depot) {
        match depot.jwt_auth_state() {
            Authorized => {
                let user: User = req.extract().await?;
                if let Err(err) = user.validate(&()) {
                    error!("user validation error: {}", &err);
                    return Err(AppError::UserValidation);
                }
                let user = query::delete_user(&user.username).await?;
                res.status_code(StatusCode::OK)
                   .render(json!(&user.username).to_string());
            }
            Unauthorized => res.render(StatusError::unauthorized()),
            Forbidden => res.render(StatusError::forbidden()),
        }
        Ok(())
    } else {
        Err(AppError::JwtClaimsValidation)
    }
}

#[handler]
#[tracing::instrument]
pub async fn login(req: &mut Request, res: &mut Response) -> Result<(), AppError> {
    let user: User = req.extract().await?;
    if let Err(err) = user.validate(&()) {
        error!("user validation error: {}", &err);
        return Err(AppError::UserValidation);
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
        error!("user validation error: {}", &err);
        return Err(AppError::UserValidation);
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
    if auth::validate_jwt_claims_issuer(depot) {
        match depot.jwt_auth_state() {
            Authorized => {
                let user: User = req.extract().await?;
                if let Err(err) = user.validate(&()) {
                    error!("user validation error: {}", &err);
                    return Err(AppError::UserValidation);
                }
                let hash = auth::generate_hash_from_password(&user.password.unwrap())?;
                let user = query::update_password(&User::new(&user.username, &Some(hash))).await?;
                res.status_code(StatusCode::OK)
                   .render(json!(&user.username).to_string());
            }
            Unauthorized => res.render(StatusError::unauthorized()),
            Forbidden => res.render(StatusError::forbidden()),
        }
        Ok(())
    } else {
        Err(AppError::JwtClaimsValidation)
    }
}

#[handler]
#[tracing::instrument]
pub async fn validate_user(req: &mut Request, res: &mut Response) -> Result<(), AppError> {
    let user: User = req.extract().await?;
    if let Err(err) = user.validate(&()) {
        error!("user validation error: {}", &err);
        return Err(AppError::UserValidation);
    }
    let user = query::get_user(&user.username).await?;
    res.status_code(StatusCode::OK)
       .render(json!(&user.username).to_string());
    Ok(())
}
