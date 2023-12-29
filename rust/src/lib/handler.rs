#![cfg_attr(rustfmt, rustfmt_skip)]

use garde::Validate;
use salvo::http::{ParseError, StatusCode, StatusError};
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
use tracing::error;

use super::auth;
use super::geojson;
use super::model::User;
use super::query;
use super::response;

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
pub async fn get_geojson_feature_collection(depot: &mut Depot, req: &mut Request, res: &mut Response) {
    match depot.jwt_auth_state() {
        Authorized => {
            let params: Result<LayerParams, ParseError> = req.extract().await;
            match params {
                Ok(params) => {
                    if let Err(err) = params.validate(&()) {
                        return error!("layer params validation error: {}", &err);
                    }
                    let features = query::get_features(&params).await;
                    match features {
                        Ok(features) => {
                            let fc = geojson::create_feature_collection(&features);
                            response::render_geojson_feature_collection(StatusCode::OK, res, &fc);
                        }
                        Err(err) => {
                            error!("get_features query error: {}", &err);
                            response::render_query_error(StatusCode::BAD_REQUEST, res, &err);
                        }
                    }
                }
                Err(err) => {
                    error!("get_geojson_feature_collection parse error: {}", &err);
                    response::render_parse_error(StatusCode::BAD_REQUEST, res, &err);
                }
            }
        }
        Unauthorized => res.render(StatusError::unauthorized()),
        Forbidden => res.render(StatusError::forbidden()),
    }
}
#[handler]
#[tracing::instrument]
pub async fn get_mapbox_access_token(depot: &mut Depot, res: &mut Response) {
    match depot.jwt_auth_state() {
        Authorized => response::render_mapbox_access_token(StatusCode::OK, res),
        Unauthorized => res.render(StatusError::unauthorized()),
        Forbidden => res.render(StatusError::forbidden()),
    }
}
#[handler]
#[tracing::instrument]
pub async fn get_user(depot: &mut Depot, req: &mut Request, res: &mut Response) {
    match depot.jwt_auth_state() {
        Authorized => {
            let user: Result<User, ParseError> = req.extract().await;
            match user {
                Ok(user) => {
                    if let Err(err) = user.validate(&()) {
                        return error!("user validation error: {}", &err);
                    }
                    let user = query::get_user(&user).await;
                    match user {
                        Ok(user) => {
                            response::render_username(StatusCode::OK, res, &user)
                        },
                        Err(err) => {
                            error!("get_user query error: {}", &err);
                            response::render_query_error(StatusCode::BAD_REQUEST, res, &err);
                        }
                    }
                }
                Err(err) => {
                    error!("get_user parse error: {}", &err);
                    response::render_parse_error(StatusCode::BAD_REQUEST, res, &err);
                }
            }
        }
        Unauthorized => res.render(StatusError::unauthorized()),
        Forbidden => res.render(StatusError::forbidden()),
    }
}
#[handler]
#[tracing::instrument]
pub async fn delete_user(depot: &mut Depot, req: &mut Request, res: &mut Response) {
    match depot.jwt_auth_state() {
        Authorized => {
            let user: Result<User, ParseError> = req.extract().await;
            match user {
                Ok(user) => {
                    if let Err(err) = user.validate(&()) {
                        return error!("user validation error: {}", &err);
                    }
                    let user = query::delete_user(&user).await;
                    match user {
                        Ok(user) => {
                            response::render_username(StatusCode::OK, res, &user)
                        },
                        Err(err) => {
                            error!("delete_user query error: {}", &err);
                            response::render_query_error(StatusCode::BAD_REQUEST, res, &err);
                        }
                    }
                }
                Err(err) => {
                    error!("delete_user parse error: {}", &err);
                    response::render_parse_error(StatusCode::BAD_REQUEST, res, &err);
                }
            }
        }
        Unauthorized => res.render(StatusError::unauthorized()),
        Forbidden => res.render(StatusError::forbidden()),
    }
}
#[handler]
#[tracing::instrument]
pub async fn login(req: &mut Request, res: &mut Response) {
    let user: Result<User, ParseError> = req.extract().await;
    match user {
        Ok(user) => {
            if let Err(err) = user.validate(&()) {
                return error!("user validation error: {}", &err);
            }
            let user = query::get_user(&user).await;
            match user {
                Ok(user) => {
                    let jwt = auth::get_jwt(&user);
                    match jwt {
                        Ok(jwt) => {
                            response::render_jwt(StatusCode::OK, res, &jwt)
                        },
                        Err(err) => {
                            error!("get_jwt auth error: {}", &err);
                            response::render_auth_error(StatusCode::UNAUTHORIZED, res, &err);
                        }
                    }
                }
                Err(err) => {
                    error!("get_user query error: {}", &err);
                    response::render_query_error(StatusCode::BAD_REQUEST, res, &err);
                }
            }
        }
        Err(err) => {
            error!("login parse error: {}", &err);
            response::render_parse_error(StatusCode::BAD_REQUEST, res, &err);
        }
    }
}
#[handler]
#[tracing::instrument]
pub async fn register(req: &mut Request, res: &mut Response) {
    let user: Result<User, ParseError> = req.extract().await;
    match user {
        Ok(user) => {
            if let Err(err) = user.validate(&()) {
                return error!("user validation error: {}", &err);
            }
            let user = query::insert_user(&user).await;
            match user {
                Ok(user) => {
                    response::render_username(StatusCode::CREATED, res, &user)
                },
                Err(err) => {
                    error!("insert_user query error: {}", &err);
                    response::render_query_error(StatusCode::BAD_REQUEST, res, &err);
                }
            }
        }
        Err(err) => {
            error!("register parse error: {}", &err);
            response::render_parse_error(StatusCode::BAD_REQUEST, res, &err);
        }
    }
}
#[handler]
#[tracing::instrument]
pub async fn update_password(depot: &mut Depot, req: &mut Request, res: &mut Response) {
    match depot.jwt_auth_state() {
        Authorized => {
            let user: Result<User, ParseError> = req.extract().await;
            match user {
                Ok(user) => {
                    if let Err(err) = user.validate(&()) {
                        return error!("user validation error: {}", &err);
                    }
                    let user = query::update_password(&user).await;
                    match user {
                        Ok(user) => {
                            response::render_username(StatusCode::OK, res, &user)
                        },
                        Err(err) => {
                            error!("update_password query error: {}", &err);
                            response::render_query_error(StatusCode::BAD_REQUEST, res, &err);
                        }
                    }
                }
                Err(err) => {
                    error!("update_password parse error: {}", &err);
                    response::render_parse_error(StatusCode::BAD_REQUEST, res, &err);
                }
            }
        }
        Unauthorized => res.render(StatusError::unauthorized()),
        Forbidden => res.render(StatusError::forbidden()),
    }
}
#[handler]
#[tracing::instrument]
pub async fn validate_user(req: &mut Request, res: &mut Response) {
    let user: Result<User, ParseError> = req.extract().await;
    match user {
        Ok(user) => {
            if let Err(err) = user.validate(&()) {
                return error!("user validation error: {}", &err);
            }
            let user = query::get_user(&user).await;
            match user {
                Ok(user) => {
                    response::render_username(StatusCode::OK, res, &user)
                },
                Err(err) => {
                    error!("get_user query error: {}", &err);
                    response::render_query_error(StatusCode::BAD_REQUEST, res, &err);
                }
            }
        }
        Err(err) => {
            error!("validate_user parse error: {}", &err);
            response::render_parse_error(StatusCode::BAD_REQUEST, res, &err);
        }
    }
}
