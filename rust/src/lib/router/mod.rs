use super::env::Config;
use super::handler;
use salvo::cors::Cors;
use salvo::http::Method;
use salvo::prelude::Router;

pub fn new() -> Router {
    let env: Config = Default::default();
    let cors_handler = Cors::new()
        .allow_origin(vec!["https://www.geospatialweb.ca", "http://localhost:4173", "http://localhost:5173"])
        .allow_methods(vec![Method::DELETE, Method::GET, Method::OPTIONS, Method::PATCH, Method::POST, Method::PUT])
        .allow_headers(vec!["Accept", "Authorization", "Content-Type"])
        .into_handler();
    Router::with_hoop(cors_handler)
        .push(
            Router::with_path(env.api_path_prefix)
                // .hoop(auth_middleware)
                .push(
                    Router::with_path(env.geojson_endpoint)
                        .get(handler::get_geojson_feature_collection),
                )
                .push(
                    Router::with_path(env.mapbox_access_token_endpoint)
                        .get(handler::get_mapbox_access_token),
                )
                .push(
                    Router::with_path(env.get_user_endpoint)
                        .get(handler::get_user)
                )
                .push(
                    Router::with_path(env.delete_user_endpoint)
                        .delete(handler::delete_user)
                )
                .push(
                    Router::with_path(env.update_password_endpoint)
                        .patch(handler::update_password),
                ),
        )
        .push(
            Router::with_path(env.credentials_path_prefix)
                .push(
                    Router::with_path(env.validate_user_endpoint)
                        .get(handler::get_user)
                )
                .push(
                    Router::with_path(env.login_endpoint)
                        .get(handler::login)
                )
                .push(
                    Router::with_path(env.register_endpoint)
                        .post(handler::register)
                ),
        )
}
