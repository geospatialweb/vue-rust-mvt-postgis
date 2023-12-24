// use salvo::http::{StatusCode, StatusError};
use salvo::http::StatusCode;
use salvo::macros::Extractible;
// use salvo::prelude::{handler, Depot, JwtAuthDepotExt, JwtAuthState, Request, Response};
use salvo::prelude::{handler, Request, Response};
use serde::Deserialize;
use serde_json::json;
use tracing::error;

use super::auth;
use super::env::Config;
use super::geojson;
use super::query;

#[derive(Debug, Deserialize, Extractible)]
#[salvo(extract(default_source(from = "query")))]
pub struct LayerParams {
    pub columns: String,
    pub table: String,
}

#[handler]
pub async fn get_geojson_feature_collection(req: &mut Request, res: &mut Response) {
    let params = req.extract().await.unwrap();
    let features = query::get_features(&params).await;
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
// pub async fn get_mapbox_access_token(_depot: &mut Depot, res: &mut Response) {
pub async fn get_mapbox_access_token(res: &mut Response) {
    // match depot.jwt_auth_state() {
    //     JwtAuthState::Authorized => {
            let env: Config = Default::default();
            res.status_code(StatusCode::OK)
               .render(json!(&env.mapbox_access_token).to_string());
    //     }
    //     JwtAuthState::Unauthorized => {
    //         res.render(StatusError::unauthorized());
    //     }
    //     JwtAuthState::Forbidden => {
    //         res.render(StatusError::forbidden());
    //     }
    // }
}

#[handler]
pub async fn get_user(req: &mut Request, res: &mut Response) {
    let user = req.extract().await.unwrap();
    let user = query::get_user(&user).await;
    match user {
        Ok(user) => res
            .status_code(StatusCode::OK)
            .render(json!(&user.username).to_string()),
        Err(err) => {
            error!("get_user error: {}", err);
            res.status_code(StatusCode::BAD_REQUEST)
               .render(json!(format!("{}", err)).to_string())
        },
    }
}
#[handler]
pub async fn delete_user(req: &mut Request, res: &mut Response) {
    let user = req.extract().await.unwrap();
    let user = query::delete_user(&user).await;
    match user {
        Ok(user) => res
            .status_code(StatusCode::OK)
            .render(json!(&user.username).to_string()),
        Err(err) => {
            error!("delete_user error: {}", err);
            res.status_code(StatusCode::BAD_REQUEST)
               .render(json!(format!("{}", err)).to_string())
        },
    }
}
#[handler]
pub async fn login(req: &mut Request, res: &mut Response) {
    let user = req.extract().await.unwrap();
    let user = query::get_user(&user).await;
    match user {
        Ok(user) => {
            let jwt = auth::get_jwt(&user);
            match jwt {
                Ok(jwt) => res
                    .status_code(StatusCode::OK)
                    .render(json!(&jwt).to_string()),
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
pub async fn register(req: &mut Request, res: &mut Response) {
    let user = req.extract().await.unwrap();
    let user = query::insert_user(&user).await;
    match user {
        Ok(user) => res
            .status_code(StatusCode::OK)
            .render(json!(&user.username).to_string()),
        Err(err) => {
            error!("register error: {}", err);
            res.status_code(StatusCode::BAD_REQUEST)
               .render(json!(format!("{}", err)).to_string())
        },
    }
}
#[handler]
pub async fn update_password(req: &mut Request, res: &mut Response) {
    let user = req.extract().await.unwrap();
    let user = query::update_password(&user).await;
    match user {
        Ok(user) => res
            .status_code(StatusCode::OK)
            .render(json!(&user.username).to_string()),
        Err(err) => {
            error!("update_password error: {}", err);
            res.status_code(StatusCode::BAD_REQUEST)
               .render(json!(format!("{}", err)).to_string())
        },
    }
}
