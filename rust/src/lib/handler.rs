use geojson::FeatureCollection;
use salvo::{
    handler,
    http::{Request, StatusCode},
    prelude::{
        Depot, JwtAuthDepotExt,
        JwtAuthState::{Authorized, Forbidden, Unauthorized},
    },
};

use super::auth::{self, Jwt};
use super::geojson::JsonFeature;
use super::hash;
use super::mapbox::MapboxAccessToken;
use super::model::{Layer, User};
use super::password::HashedPassword;
use super::query;
use super::repository::{LayerRepository, LayerRepositorySQL, UserRepository, UserRepositorySQL};
use super::response::{ResponseError, ResponsePayload};
use super::validation;

/// LayerRepository postgres db queries.
trait LayerRepositoryQuery {
    async fn get_json_features(&self) -> Result<Vec<JsonFeature>, ResponseError>;
}

impl LayerRepositoryQuery for LayerRepository {
    /// LayerRepository `get json features` query.
    async fn get_json_features(&self) -> Result<Vec<JsonFeature>, ResponseError> {
        query::get_json_features(self).await
    }
}

/// UserRepository postgres db queries.
trait UserRepositoryQuery {
    async fn get_user(&self) -> Result<User, ResponseError>;
    async fn delete_user(&self) -> Result<User, ResponseError>;
    async fn insert_user(&self) -> Result<User, ResponseError>;
    async fn get_password(&self) -> Result<HashedPassword, ResponseError>;
    async fn update_password(&self) -> Result<User, ResponseError>;
}

impl UserRepositoryQuery for UserRepository {
    /// UserRepository `get user` query.
    async fn get_user(&self) -> Result<User, ResponseError> {
        query::get_user(self).await
    }

    /// UserRepository `delete user` query.
    async fn delete_user(&self) -> Result<User, ResponseError> {
        query::delete_user(self).await
    }

    /// UserRepository `insert user` query.
    async fn insert_user(&self) -> Result<User, ResponseError> {
        query::insert_user(self).await
    }

    /// UserRepository `get password` query.
    async fn get_password(&self) -> Result<HashedPassword, ResponseError> {
        query::get_password(self).await
    }

    /// UserRepository `update password` query.
    async fn update_password(&self) -> Result<User, ResponseError> {
        query::update_password(self).await
    }
}

/// Return GeoJSON feature collection.
#[handler]
pub async fn handle_get_geojson_feature_collection(
    depot: &mut Depot,
    req: &mut Request,
) -> Result<ResponsePayload<FeatureCollection>, ResponseError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let layer = req.parse_queries::<Layer>()?;
            validation::validate_layer(&layer)?;
            let sql = LayerRepository::get_json_features_sql(&layer);
            let repo = LayerRepository::new(&layer, &sql);
            let json_features = LayerRepository::get_json_features(&repo).await?;
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
pub fn handle_get_mapbox_access_token(
    depot: &mut Depot,
    req: &mut Request,
) -> Result<ResponsePayload<MapboxAccessToken>, ResponseError> {
    match depot.jwt_auth_state() {
        Authorized => {
            let user = req.parse_queries::<User>()?;
            validation::validate_user(&user)?;
            let token = depot.obtain::<MapboxAccessToken>().unwrap().to_owned();
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
    let sql = UserRepository::get_password_sql();
    let repo = UserRepository::new(&user, &sql);
    let hashed_password = UserRepository::get_password(&repo).await?;
    hash::verify_hashed_password_and_password(&hashed_password, &user.password.unwrap())?;
    let jwt = auth::create_jwt(&user.username.unwrap(), &user.role)?;
    let res = ResponsePayload::new(jwt.into(), StatusCode::OK);
    Ok(res)
}

/// Register user. User submitted password is converted into HS256 hash and stored in db.
#[handler]
pub async fn handle_register(req: &mut Request) -> Result<ResponsePayload<User>, ResponseError> {
    let mut user = req.parse_body::<User>().await?;
    validation::validate_user(&user)?;
    let sql = UserRepository::insert_user_sql();
    let repo = UserRepository::new(&user, &sql);
    user = UserRepository::insert_user(&repo).await?;
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
            let sql = UserRepository::get_user_sql();
            let repo = UserRepository::new(&user, &sql);
            user = UserRepository::get_user(&repo).await?;
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
            let sql = UserRepository::delete_user_sql();
            let repo = UserRepository::new(&user, &sql);
            user = UserRepository::delete_user(&repo).await?;
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
    let sql = UserRepository::get_user_sql();
    let repo = UserRepository::new(&user, &sql);
    user = UserRepository::get_user(&repo).await?;
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
            let sql = UserRepository::update_password_sql();
            let repo = UserRepository::new(&user, &sql);
            user = UserRepository::update_password(&repo).await?;
            let res = ResponsePayload::new(user.into(), StatusCode::OK);
            Ok(res)
        }
        Unauthorized => Err(ResponseError::JwtUnauthorized),
        Forbidden => Err(ResponseError::JwtForbidden),
    }
}
