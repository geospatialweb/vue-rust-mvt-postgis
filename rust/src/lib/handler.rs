use garde::Validate;
use salvo::http::{ParseError, StatusCode, StatusError};
use salvo::macros::Extractible;
use salvo::prelude::{handler, Depot, JwtAuthDepotExt, JwtAuthState, Request, Response};
use serde::Deserialize;
use serde_json::json;
use tracing::error;

use super::auth;
use super::env::Config;
use super::geojson;
use super::model::User;
use super::query;

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
pub async fn get_geojson_feature_collection(req: &mut Request, res: &mut Response) {
    let params: Result<LayerParams, ParseError>  = req.extract().await;
    if let Err(err) = params.as_ref().unwrap().validate(&()) {
        return error!("layer params validation failure: {}", err);
    }
    let features = query::get_features(params.as_ref().unwrap()).await;
    match features {
        Ok(features) => {
            let fc = geojson::create_feature_collection(&features);
            res.status_code(StatusCode::OK)
               .render(json!(&fc).to_string());
        },
        Err(err) => {
            error!("get_geojson_feature_collection error: {}", err);
            res.status_code(StatusCode::BAD_REQUEST)
               .render(json!(format!("{}", err)).to_string())
        },
    }
}
#[handler]
#[tracing::instrument]
pub async fn get_mapbox_access_token(depot: &mut Depot, res: &mut Response) {
    match depot.jwt_auth_state() {
        JwtAuthState::Authorized => {
            let env: Config = Default::default();
            res.status_code(StatusCode::OK)
               .render(json!(&env.mapbox_access_token).to_string());
        },
        JwtAuthState::Unauthorized => {
            res.render(StatusError::unauthorized());
        },
        JwtAuthState::Forbidden => {
            res.render(StatusError::forbidden());
        },
    }
}

#[handler]
#[tracing::instrument]
pub async fn get_user(req: &mut Request, res: &mut Response) {
    let user: Result<User, ParseError>  = req.extract().await;
    if let Err(err) = user.as_ref().unwrap().validate(&()) {
        return error!("username validation failure: {}", err);
    }
    let user = query::get_user(user.as_ref().unwrap()).await;
    match user {
        Ok(user) => {
            res.status_code(StatusCode::OK)
               .render(json!(&user.username).to_string())
        },
        Err(err) => {
            error!("get_user error: {}", err);
            res.status_code(StatusCode::BAD_REQUEST)
               .render(json!(format!("{}", err)).to_string())
        },
    }
}
#[handler]
#[tracing::instrument]
pub async fn delete_user(req: &mut Request, res: &mut Response) {
    let user: Result<User, ParseError>  = req.extract().await;
    if let Err(err) = user.as_ref().unwrap().validate(&()) {
        return error!("username validation failure: {}", err);
    };
    let user = query::delete_user(user.as_ref().unwrap()).await;
    match user {
        Ok(user) => {
            res.status_code(StatusCode::OK)
               .render(json!(&user.username).to_string())
        },
        Err(err) => {
            error!("delete_user error: {}", err);
            res.status_code(StatusCode::BAD_REQUEST)
               .render(json!(format!("{}", err)).to_string())
        },
    }
}
#[handler]
#[tracing::instrument]
pub async fn login(req: &mut Request, res: &mut Response) {
    let user: Result<User, ParseError>  = req.extract().await;
    if let Err(err) = user.as_ref().unwrap().validate(&()) {
        return error!("username validation failure: {}", err);
    };
    let user = query::get_user(user.as_ref().unwrap()).await;
    match user {
        Ok(user) => {
            let jwt = auth::get_jwt_token(&user);
            match jwt {
                Ok(jwt) => {
                    res.status_code(StatusCode::OK)
                       .render(json!(&jwt).to_string())
                },
                Err(err) => {
                    error!("jwt creation error: {}", err);
                    res.status_code(StatusCode::UNAUTHORIZED)
                       .render(json!(format!("{}", err)).to_string())
                },
            }
        },
        Err(err) => {
            error!("login error: {}", err);
            res.status_code(StatusCode::BAD_REQUEST)
               .render(json!(format!("{}", err)).to_string())
        },
    }
}
#[handler]
#[tracing::instrument]
pub async fn register(req: &mut Request, res: &mut Response) {
    let user: Result<User, ParseError>  = req.extract().await;
    if let Err(err) = user.as_ref().unwrap().validate(&()) {
        return error!("username validation failure: {}", err);
    };
    let user = query::insert_user(user.as_ref().unwrap()).await;
    match user {
        Ok(user) => {
            res.status_code(StatusCode::OK)
               .render(json!(&user.username).to_string())
        },
        Err(err) => {
            error!("register error: {}", err);
            res.status_code(StatusCode::BAD_REQUEST)
               .render(json!(format!("{}", err)).to_string())
        },
    }
}
#[handler]
#[tracing::instrument]
pub async fn update_password(req: &mut Request, res: &mut Response) {
    let user: Result<User, ParseError>  = req.extract().await;
    if let Err(err) = user.as_ref().unwrap().validate(&()) {
        return error!("username validation failure: {}", err);
    };
    let user = query::update_password(user.as_ref().unwrap()).await;
    match user {
        Ok(user) => {
            res.status_code(StatusCode::OK)
               .render(json!(&user.username).to_string())
        },
        Err(err) => {
            error!("update_password error: {}", err);
            res.status_code(StatusCode::BAD_REQUEST)
               .render(json!(format!("{}", err)).to_string())
        },
    }
}
#[handler]
#[tracing::instrument]
pub async fn validate_user(req: &mut Request, res: &mut Response) {
    let user: Result<User, ParseError>  = req.extract().await;
    if let Err(err) = user.as_ref().unwrap().validate(&()) {
        return error!("username validation failure: {}", err);
    }
    let user = query::get_user(user.as_ref().unwrap()).await;
    match user {
        Ok(user) => {
            res.status_code(StatusCode::OK)
               .render(json!(&user.username).to_string())
        },
        Err(err) => {
            error!("get_user error: {}", err);
            res.status_code(StatusCode::BAD_REQUEST)
               .render(json!(format!("{}", err)).to_string())
        },
    }
}
