use salvo::http::StatusCode;
use salvo::macros::Extractible;
use salvo::prelude::{handler, Request, Response};
use serde::Deserialize;
use serde_json::json;
use tracing::error;

use super::env::Config;
use super::geojson;
use super::query;

#[derive(Deserialize, Extractible)]
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
        }
    }
}
#[handler]
pub async fn get_mapbox_access_token(res: &mut Response) {
    let env: Config = Default::default();
    res.status_code(StatusCode::OK)
       .render(json!(&env.mapbox_access_token).to_string());
}
#[handler]
pub async fn get_user(req: &mut Request, res: &mut Response) {
    let user = req.extract().await.unwrap();
    let user = query::get_user(&user).await;
    match user {
        Ok(user) =>
            res.status_code(StatusCode::OK)
               .render(json!(&user.username).to_string()),
        Err(err) => {
            error!("get_user error: {}", err);
            res.status_code(StatusCode::BAD_REQUEST)
               .render(json!(format!("{}", err)).to_string())
        }
    }
}
#[handler]
pub async fn delete_user(req: &mut Request, res: &mut Response) {
    let user = req.extract().await.unwrap();
    let result = query::delete_user(&user).await;
    match result {
        Ok(result) =>
            res.status_code(StatusCode::OK)
               .render(json!(&result).to_string()),
        Err(err) => {
            error!("delete_user error: {}", err);
            res.status_code(StatusCode::BAD_REQUEST)
               .render(json!(format!("{}", err)).to_string())
        }
    }
}
#[handler]
pub async fn login(req: &mut Request, res: &mut Response) {
    let user = req.extract().await.unwrap();
    let user = query::get_user(&user).await;
    match user {
        Ok(user) =>
            res.status_code(StatusCode::OK)
               .render(json!(&user.username).to_string()),
        Err(err) => {
            error!("login error: {}", err);
            res.status_code(StatusCode::BAD_REQUEST)
               .render(json!(format!("{}", err)).to_string())
        }
    }
}
#[handler]
pub async fn register(req: &mut Request, res: &mut Response) {
    let user = req.extract().await.unwrap();
    let result = query::insert_user(&user).await;
    match result {
        Ok(result) =>
            res.status_code(StatusCode::OK)
               .render(json!(&result).to_string()),
        Err(err) => {
            error!("register error: {}", err);
            res.status_code(StatusCode::BAD_REQUEST)
               .render(json!(format!("{}", err)).to_string())
        }
    }
}
#[handler]
pub async fn update_password(req: &mut Request, res: &mut Response) {
    let user = req.extract().await.unwrap();
    let result = query::update_password(&user).await;
    match result {
        Ok(result) =>
            res.status_code(StatusCode::OK)
               .render(json!(&result).to_string()),
        Err(err) => {
            error!("update_password error: {}", err);
            res.status_code(StatusCode::BAD_REQUEST)
               .render(json!(format!("{}", err)).to_string())
        }
    }
}
