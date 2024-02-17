#![cfg_attr(rustfmt, rustfmt_skip)]

use salvo::cors::{Cors, CorsHandler};
use salvo::http::Method;
use salvo::logging::Logger;
use salvo::Router;

use super::auth;
use super::env::Env;
use super::handler;

/// Create new CORS handler.
pub fn handle_cors() -> CorsHandler {
    Cors::new()
        .allow_origin(vec![
            "https://www.geospatialweb.ca",
            "http://localhost:4173",
            "http://localhost:5173",
        ])
        .allow_methods(vec![
            Method::DELETE,
            Method::GET,
            Method::OPTIONS,
            Method::PATCH,
            Method::POST,
        ])
        .allow_headers(vec![
            "Accept",
            "Authorization",
            "Content-Type",
        ])
        .into_handler()
}

/// Create new Router.
pub fn new() -> Router {
    let env = Env::get_env();
    Router::new()
        .hoop(handle_cors())
        .hoop(Logger::new())
        .push(
            Router::with_path(&env.api_path_prefix)
                .hoop(auth::handle_auth())
                .push(
                    Router::with_path(&env.geojson_endpoint)
                        .get(handler::handle_get_geojson_feature_collection))
                .push(
                    Router::with_path(&env.mapbox_access_token_endpoint)
                        .get(handler::handle_get_mapbox_access_token))
                .push(
                    Router::with_path(&env.get_user_endpoint)
                        .get(handler::handle_get_user))
                .push(
                    Router::with_path(&env.delete_user_endpoint)
                        .delete(handler::handle_delete_user))
                .push(
                    Router::with_path(&env.update_password_endpoint)
                        .patch(handler::handle_update_password)),
        )
        .push(
            Router::with_path(&env.credentials_path_prefix)
                .push(
                    Router::with_path(&env.validate_user_endpoint)
                        .get(handler::handle_validate_user))
                .push(
                    Router::with_path(&env.login_endpoint)
                        .get(handler::handle_login))
                .push(
                    Router::with_path(&env.register_endpoint)
                        .post(handler::handle_register)),
        )
}
