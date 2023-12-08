use super::env::Config;
use super::model::{LayerParams, User};
use salvo::prelude::{handler, Request, Response};

#[handler]
pub async fn get_geojson_feature_collection(req: &mut Request, res: &mut Response) {
    let params: LayerParams = req.extract().await.unwrap();
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
    let user: User = req.extract().await.unwrap();
    println!("{user:?}");
    res.render("deleteUser");
}

#[handler]
pub async fn get_user(req: &mut Request, res: &mut Response) {
    let user: User = req.extract().await.unwrap();
    println!("{user:?}");
    res.render("getUser");
}

#[handler]
pub async fn login_user(req: &mut Request, res: &mut Response) {
    let user: User = req.extract().await.unwrap();
    println!("{user:?}");
    res.render("loginUser");
}

#[handler]
pub async fn register_user(req: &mut Request, res: &mut Response) {
    let user: User = req.extract().await.unwrap();
    println!("{user:?}");
    res.render("registerUser");
}

#[handler]
pub async fn update_password(req: &mut Request, res: &mut Response) {
    let user: User = req.extract().await.unwrap();
    println!("{user:?}");
    res.render("updatePassword");
}
