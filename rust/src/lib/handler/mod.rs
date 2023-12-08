use super::env::Config;
use salvo::macros::Extractible;
use salvo::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Extractible, Serialize, Deserialize)]
#[salvo(extract(default_source(from = "query"), default_source(from = "body")))]
struct Credentials {
    password: String,
    username: String,
}

#[derive(Debug, Extractible, Serialize, Deserialize)]
#[salvo(extract(default_source(from = "query")))]
struct Layer {
    columns: String,
    table: String,
}

#[derive(Debug, Extractible, Serialize, Deserialize)]
#[salvo(extract(default_source(from = "query")))]
struct User {
    username: String,
}

#[handler]
pub async fn get_geojson_feature_collection(req: &mut Request, res: &mut Response) {
    let params: Layer = req.extract().await.unwrap();
    println!("{params:?}");
    res.render("geojsonFeatureCollection");
}

#[handler]
pub async fn get_mapbox_access_token(res: &mut Response) {
    let env: Config = Default::default();
    res.render(env.mapbox_access_token);
}

#[handler]
pub async fn delete_user(req: &mut Request, res: &mut Response) {
    let username: User = req.extract().await.unwrap();
    println!("{username:?}");
    res.render("deleteUser");
}

#[handler]
pub async fn get_user(req: &mut Request, res: &mut Response) {
    let username: User = req.extract().await.unwrap();
    println!("{username:?}");
    res.render("getUser");
}

#[handler]
pub async fn login_user(req: &mut Request, res: &mut Response) {
    let credentials: Credentials = req.extract().await.unwrap();
    println!("{credentials:?}");
    res.render("loginUser");
}

#[handler]
pub async fn register_user(req: &mut Request, res: &mut Response) {
    let credentials: Credentials = req.extract().await.unwrap();
    println!("{credentials:?}");
    res.render("registerUser");
}

#[handler]
pub async fn update_password(req: &mut Request, res: &mut Response) {
    let credentials: Credentials = req.extract().await.unwrap();
    println!("{credentials:?}");
    res.render("updatePassword");
}
