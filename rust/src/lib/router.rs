#![cfg_attr(rustfmt, rustfmt_skip)]

use salvo::{
    affix_state,
    cors::{Cors, CorsHandler},
    http::Method,
    jwt_auth::{ConstDecoder, HeaderFinder},
    logging::Logger,
    prelude::JwtAuth,
    routing::Router,
};

use super::auth::JwtClaims;
use super::env::Env;
use super::handler;
use super::mapbox::MapboxAccessToken;

/// JWT authentication middleware handler.
fn handle_jwt_auth() -> JwtAuth<JwtClaims, ConstDecoder> {
    let env = Env::get_env();
    let jwt_secret = env.jwt_secret.as_bytes();
    JwtAuth::new(ConstDecoder::from_secret(jwt_secret))
        .finders(vec![Box::new(HeaderFinder::new())])
        .force_passed(true)
}

/// Create new CORS middleware handler.
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
                .hoop(handle_jwt_auth())
        //         .push(
        //             Router::with_path(&env.get_geojson_endpoint)
        //                 .get(handler::handle_get_geojson_feature_collection))
                .push(
                    Router::with_path(&env.get_mapbox_access_token_endpoint)
                        .hoop(affix_state::inject(MapboxAccessToken::new(env.mapbox_access_token.as_str())))
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
                    Router::with_path(&env.login_endpoint)
                        .get(handler::handle_login))
                .push(
                    Router::with_path(&env.register_endpoint)
                        .post(handler::handle_register))
                .push(
                    Router::with_path(&env.validate_user_endpoint)
                        .get(handler::handle_validate_user)),
        )
}

#[cfg(test)]
mod test {
    use salvo::http::StatusCode;
    use salvo::test::RequestBuilder;
    use salvo::Service;

    use super::*;
    use crate::auth;

    fn get_base_url() -> String {
        let env = Env::get_env();
        format!("http://{}:{}", &env.server_host, &env.server_port)
    }

    fn get_api_url() -> String {
        let env = Env::get_env();
        format!("{}{}", &get_base_url(), &env.api_path_prefix)
    }

    fn get_credentials_url() -> String {
        let env = Env::get_env();
        format!("{}{}", &get_base_url(), &env.credentials_path_prefix)
    }

    fn create_jwt_token() -> String {
        let role = "user";
        let username = "foo@bar.com";
        let jwt = auth::create_jwt(username, role).unwrap();
        jwt.jwt_token
    }

    fn get_service() -> Service {
        let router = new();
        Service::new(router)
    }

    #[tokio::test]
    async fn a_register_endpoint_ok() {
        let env = Env::get_env();
        let service = get_service();
        let body = r#"{"username":"foo@bar.com","password":"secretPassword","role":"user"}"#;
        let url = format!("{}{}", &get_credentials_url(), &env.register_endpoint);
        let res = RequestBuilder::new(&url, Method::POST)
            .raw_json(body)
            .send(&service)
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(status_code, StatusCode::CREATED);
    }

    #[tokio::test]
    async fn b_register_endpoint_err() {
        let env = Env::get_env();
        let service = get_service();
        let body = r#"{"username":"foo@bar.com","password":"secretPassword","role":"user"}"#;
        let url = format!("{}{}", &get_credentials_url(), &env.register_endpoint);
        let res = RequestBuilder::new(&url, Method::POST)
            .raw_json(body)
            .send(&service)
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(status_code, StatusCode::INTERNAL_SERVER_ERROR);
    }

    #[tokio::test]
    async fn c_validate_user_endpoint_ok() {
        let env = Env::get_env();
        let service = get_service();
        let username = "foo@bar.com";
        let role = "user";
        let url = format!("{}{}", &get_credentials_url(), &env.validate_user_endpoint);
        let res = RequestBuilder::new(&url, Method::GET)
            .queries([("username", username), ("role", role)])
            .send(&service)
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(status_code, StatusCode::OK);
    }

    #[tokio::test]
    async fn d_validate_user_endpoint_err() {
        let env = Env::get_env();
        let service = get_service();
        let username = "bar@foo.com";
        let role = "user";
        let url = format!("{}{}", &get_credentials_url(), &env.validate_user_endpoint);
        let res = RequestBuilder::new(&url, Method::GET)
            .queries([("username", username), ("role", role)])
            .send(&service)
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(status_code, StatusCode::INTERNAL_SERVER_ERROR);
    }

    #[tokio::test]
    async fn e_login_endpoint_ok() {
        let env = Env::get_env();
        let service = get_service();
        let username = "foo@bar.com";
        let password = "secretPassword";
        let role = "user";
        let url = format!("{}{}", &get_credentials_url(), &env.login_endpoint);
        let res = RequestBuilder::new(&url, Method::GET)
            .queries([("username", username), ("password", password), ("role", role)])
            .send(&service)
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(status_code, StatusCode::OK);
    }

    #[tokio::test]
    async fn f_login_endpoint_err() {
        let env = Env::get_env();
        let service = get_service();
        let username = "bar@foo.com";
        let password = "secretPassword";
        let role = "user";
        let url = format!("{}{}", &get_credentials_url(), &env.login_endpoint);
        let res = RequestBuilder::new(&url, Method::GET)
            .queries([("username", username), ("password", password), ("role", role)])
            .send(&service)
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(status_code, StatusCode::INTERNAL_SERVER_ERROR);
    }

    #[tokio::test]
    async fn g_get_geojson_endpoint_ok() {
        let env = Env::get_env();
        let service = get_service();
        let jwt_token = create_jwt_token();
        let columns = "name,description,geom";
        let table = "office";
        let url = format!("{}{}", &get_api_url(), &env.get_geojson_endpoint);
        let res = RequestBuilder::new(&url, Method::GET)
            .bearer_auth(&jwt_token)
            .queries([("columns", columns), ("table", table)])
            .send(&service)
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(status_code, StatusCode::OK);
    }

    #[tokio::test]
    async fn h_get_geojson_endpoint_err() {
        let env = Env::get_env();
        let service = get_service();
        let jwt_token = create_jwt_token();
        let columns = "name,description,geom";
        let table = "offices";
        let url = format!("{}{}", &get_api_url(), &env.get_geojson_endpoint);
        let res = RequestBuilder::new(&url, Method::GET)
            .bearer_auth(&jwt_token)
            .queries([("columns", columns), ("table", table)])
            .send(&service)
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(status_code, StatusCode::INTERNAL_SERVER_ERROR);
    }

    #[tokio::test]
    async fn i_get_mapbox_access_token_endpoint_ok() {
        let env = Env::get_env();
        let service = get_service();
        let jwt_token = create_jwt_token();
        let url = format!("{}{}", &get_api_url(), &env.get_mapbox_access_token_endpoint);
        let res = RequestBuilder::new(&url, Method::GET)
            .bearer_auth(&jwt_token)
            .send(&service)
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(status_code, StatusCode::OK);
    }

    #[tokio::test]
    async fn j_get_mapbox_access_token_endpoint_unauthorized_no_bearer_auth() {
        let env = Env::get_env();
        let service = get_service();
        let url = format!("{}{}", &get_api_url(), &env.get_mapbox_access_token_endpoint);
        let res = RequestBuilder::new(&url, Method::GET)
            .send(&service)
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(status_code, StatusCode::UNAUTHORIZED);
    }

    #[tokio::test]
    async fn k_get_mapbox_access_token_endpoint_forbidden_expired_token() {
        let env = Env::get_env();
        let service = get_service();
        let url = format!("{}{}", &get_api_url(), &env.get_mapbox_access_token_endpoint);
        let expired_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiYXVkIjoiZ2Vvc3BhdGlhbHdlYi5jYSIsImV4cCI6MTY3OTk0MzkyNywiaXNzIjoiZ2Vvc3BhdGlhbHdlYi5jYSIsIm5hbWUiOiJqb2huY2FtcGJlbGxAZ2Vvc3BhdGlhbHdlYi5jYSIsInN1YiI6IjEifQ.w8oD07bCbCp7h4vfJU9X4f8Pam4QRrOd-se4Pggices";
        let res = RequestBuilder::new(&url, Method::GET)
            .bearer_auth(expired_token)
            .send(&service)
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(status_code, StatusCode::FORBIDDEN);
    }

    #[tokio::test]
    async fn l_get_mapbox_access_token_endpoint_forbidden_invalid_token() {
        let env = Env::get_env();
        let service = get_service();
        let url = format!("{}{}", &get_api_url(), &env.get_mapbox_access_token_endpoint);
        let invalid_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiYXVkIjoiZ2Vvc3BhdGlhbHdlYi5jYSIsImV4cCI6MTY3OTk0MzkyNywiaXNzIjoiZ2Vvc3BhdGlhbHdlYi5jYSIsIm5hbWUiOiJqb2huY2FtcGJlbGxAZ2Vvc3BhdGlhbHdlYi5jYSIsInN1YiI6IjEifQ.w8oD07bCbCp7h4vfJU9X4f8Pam4QRrOd-se4PggicesJ";
        let res = RequestBuilder::new(&url, Method::GET)
            .bearer_auth(invalid_token)
            .send(&service)
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(status_code, StatusCode::FORBIDDEN);
    }

    #[tokio::test]
    async fn m_get_user_endpoint_ok() {
        let env = Env::get_env();
        let service = get_service();
        let jwt_token = create_jwt_token();
        let username = "foo@bar.com";
        let role = "user";
        let url = format!("{}{}", &get_api_url(), &env.get_user_endpoint);
        let res = RequestBuilder::new(&url, Method::GET)
            .bearer_auth(&jwt_token)
            .queries([("username", username), ("role", role)])
            .send(&service)
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(status_code, StatusCode::OK);
    }

    #[tokio::test]
    async fn n_get_user_endpoint_err() {
        let env = Env::get_env();
        let service = get_service();
        let jwt_token = create_jwt_token();
        let username = "bar@foo.com";
        let role = "user";
        let url = format!("{}{}", &get_api_url(), &env.get_user_endpoint);
        let res = RequestBuilder::new(&url, Method::GET)
            .bearer_auth(&jwt_token)
            .queries([("username", username), ("role", role)])
            .send(&service)
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(status_code, StatusCode::INTERNAL_SERVER_ERROR);
    }

    #[tokio::test]
    async fn o_update_password_endpoint_ok() {
        let env = Env::get_env();
        let service = get_service();
        let jwt_token = create_jwt_token();
        let body = r#"{"username":"foo@bar.com","password":"newSecretPassword","role":"user"}"#;
        let url = format!("{}{}", &get_api_url(), &env.update_password_endpoint);
        let res = RequestBuilder::new(&url, Method::PATCH)
            .bearer_auth(&jwt_token)
            .raw_json(body)
            .send(&service)
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(status_code, StatusCode::OK);
    }

    #[tokio::test]
    async fn p_update_password_endpoint_err() {
        let env = Env::get_env();
        let service = get_service();
        let jwt_token = create_jwt_token();
        let body = r#"{"username":"bar@foo.com","password":"newSecretPassword","role":"user"}"#;
        let url = format!("{}{}", &get_api_url(), &env.update_password_endpoint);
        let res = RequestBuilder::new(&url, Method::PATCH)
            .bearer_auth(&jwt_token)
            .raw_json(body)
            .send(&service)
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(status_code, StatusCode::INTERNAL_SERVER_ERROR);
    }

    #[tokio::test]
    async fn q_delete_user_endpoint_ok() {
        let env = Env::get_env();
        let service = get_service();
        let jwt_token = create_jwt_token();
        let username = "foo@bar.com";
        let role = "user";
        let url = format!("{}{}", &get_api_url(), &env.delete_user_endpoint);
        let res = RequestBuilder::new(&url, Method::DELETE)
            .bearer_auth(&jwt_token)
            .queries([("username", username), ("role", role)])
            .send(&service)
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(status_code, StatusCode::OK);
    }

    #[tokio::test]
    async fn r_delete_user_endpoint_err() {
        let env = Env::get_env();
        let service = get_service();
        let jwt_token = create_jwt_token();
        let username = "bar@foo.com";
        let role = "user";
        let url = format!("{}{}", &get_api_url(), &env.delete_user_endpoint);
        let res = RequestBuilder::new(&url, Method::DELETE)
            .bearer_auth(&jwt_token)
            .queries([("username", username), ("role", role)])
            .send(&service)
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(status_code, StatusCode::INTERNAL_SERVER_ERROR);
    }
}
