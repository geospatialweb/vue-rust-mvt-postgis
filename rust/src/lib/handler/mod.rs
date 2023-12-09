use super::env::Config;
use super::model::{LayerParams, User};
use salvo::prelude::{handler, Request, Response};
use serde_json;

#[handler]
pub async fn get_geojson_feature_collection(req: &mut Request, res: &mut Response) {
    let params: LayerParams = req.extract().await.unwrap();
    res.render(serde_json::to_string(&params).unwrap());
}
#[handler]
pub async fn get_mapbox_access_token(res: &mut Response) {
    let env: Config = Default::default();
    res.render(serde_json::to_string(&env.mapbox_access_token).unwrap());
}
#[handler]
pub async fn get_user(req: &mut Request, res: &mut Response) {
    let user: User = req.extract().await.unwrap();
    res.render(serde_json::to_string(&user).unwrap());
}
#[handler]
pub async fn delete_user(req: &mut Request, res: &mut Response) {
    let user: User = req.extract().await.unwrap();
    res.render(serde_json::to_string(&user).unwrap());
}
#[handler]
pub async fn login(req: &mut Request, res: &mut Response) {
    let user: User = req.extract().await.unwrap();
    res.render(serde_json::to_string(&user).unwrap());
}
#[handler]
pub async fn register(req: &mut Request, res: &mut Response) {
    let user: User = req.extract().await.unwrap();
    res.render(serde_json::to_string(&user).unwrap());
}
#[handler]
pub async fn update_password(req: &mut Request, res: &mut Response) {
    let user: User = req.extract().await.unwrap();
    res.render(serde_json::to_string(&user).unwrap());
}
