use geojson::FeatureCollection;
use salvo::{
    handler,
    http::{Request, StatusCode},
    prelude::{
        JwtAuthDepotExt,
        JwtAuthState::{Authorized, Forbidden, Unauthorized},
    },
    Depot,
};

use super::auth::{self, Jwt};
use super::hash;
use super::mapbox::MapboxAccessToken;
use super::model::User;
use super::query;
use super::request::LayerParams;
use super::response::{ResponseError, ResponsePayload};
use super::validation;

/// Return GeoJSON feature collection.
#[handler]
pub async fn handle_get_geojson_feature_collection(
    depot: &mut Depot,
    req: &mut Request,
) -> Result<ResponsePayload<FeatureCollection>, ResponseError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let params = req.parse_queries::<LayerParams>()?;
            validation::validate_layer_params(&params)?;
            let json_features = query::get_json_features(&params).await?;
            let fc = super::geojson::create_feature_collection(&json_features)?;
            let res = ResponsePayload::new(fc.into(), StatusCode::OK);
            Ok(res)
        }
        Unauthorized => Err(ResponseError::JwtUnauthorized),
        Forbidden => Err(ResponseError::JwtForbidden),
    }
}

/// Return Mapbox Access Token.
#[handler]
pub async fn handle_get_mapbox_access_token(
    depot: &mut Depot,
) -> Result<ResponsePayload<MapboxAccessToken>, ResponseError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let token = depot.obtain::<MapboxAccessToken>().unwrap().clone();
            let res = ResponsePayload::new(token.into(), StatusCode::OK);
            Ok(res)
        }
        Unauthorized => Err(ResponseError::JwtUnauthorized),
        Forbidden => Err(ResponseError::JwtForbidden),
    }
}

/// Login user. User submitted plain text password is verified against HS256 hashed password stored in db.
#[handler]
pub async fn handle_login(req: &mut Request) -> Result<ResponsePayload<Jwt>, ResponseError> {
    let user = req.parse_queries::<User>()?;
    validation::validate_user(&user)?;
    validation::validate_role(&user)?;
    let hashed_password = query::get_password(&user.username).await?;
    hash::verify_hashed_password_and_password(&hashed_password, &user.password.unwrap())?;
    let jwt = auth::create_jwt(&user.username, &user.role)?;
    let res = ResponsePayload::new(jwt.into(), StatusCode::OK);
    Ok(res)
}

/// Register user. User submitted password is converted into HS256 hash and stored in db.
#[handler]
pub async fn handle_register(req: &mut Request) -> Result<ResponsePayload<User>, ResponseError> {
    let mut user = req.parse_body::<User>().await?;
    validation::validate_user(&user)?;
    validation::validate_role(&user)?;
    let hashed_password = hash::generate_hashed_password(&user.password.unwrap())?;
    user = query::insert_user(&user.username, &hashed_password, &user.role).await?;
    let res = ResponsePayload::new(user.into(), StatusCode::CREATED);
    Ok(res)
}

/// Return user.
#[handler]
pub async fn handle_get_user(depot: &mut Depot, req: &mut Request) -> Result<ResponsePayload<User>, ResponseError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let mut user = req.parse_queries::<User>()?;
            validation::validate_user(&user)?;
            validation::validate_role(&user)?;
            user = query::get_user(&user.username).await?;
            let res = ResponsePayload::new(user.into(), StatusCode::OK);
            Ok(res)
        }
        Unauthorized => Err(ResponseError::JwtUnauthorized),
        Forbidden => Err(ResponseError::JwtForbidden),
    }
}

/// Delete user returning username.
#[handler]
pub async fn handle_delete_user(depot: &mut Depot, req: &mut Request) -> Result<ResponsePayload<User>, ResponseError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let mut user = req.parse_queries::<User>()?;
            validation::validate_user(&user)?;
            validation::validate_role(&user)?;
            user = query::delete_user(&user.username).await?;
            let res = ResponsePayload::new(user.into(), StatusCode::OK);
            Ok(res)
        }
        Unauthorized => Err(ResponseError::JwtUnauthorized),
        Forbidden => Err(ResponseError::JwtForbidden),
    }
}

/// Validate user exists in db returning username.
#[handler]
pub async fn handle_validate_user(req: &mut Request) -> Result<ResponsePayload<User>, ResponseError> {
    let mut user = req.parse_queries::<User>()?;
    validation::validate_user(&user)?;
    validation::validate_role(&user)?;
    user = query::get_user(&user.username).await?;
    let res = ResponsePayload::new(user.into(), StatusCode::OK);
    Ok(res)
}

/// Update user password returning username. User submitted password is converted into HS256 hash and stored in db.
#[handler]
pub async fn handle_update_password(
    depot: &mut Depot,
    req: &mut Request,
) -> Result<ResponsePayload<User>, ResponseError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let mut user = req.parse_body::<User>().await?;
            validation::validate_user(&user)?;
            validation::validate_role(&user)?;
            let hashed_password = hash::generate_hashed_password(&user.password.unwrap())?;
            user = query::update_password(&user.username, &hashed_password).await?;
            let res = ResponsePayload::new(user.into(), StatusCode::OK);
            Ok(res)
        }
        Unauthorized => Err(ResponseError::JwtUnauthorized),
        Forbidden => Err(ResponseError::JwtForbidden),
    }
}
