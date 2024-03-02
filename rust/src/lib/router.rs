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
            Router::with_path(env.api_path_prefix.as_str())
                .hoop(auth::handle_auth())
                .push(
                    Router::with_path(env.geojson_endpoint.as_str())
                        .get(handler::handle_get_geojson_feature_collection))
                .push(
                    Router::with_path(env.mapbox_access_token_endpoint.as_str())
                        .get(handler::handle_get_mapbox_access_token))
                .push(
                    Router::with_path(env.get_user_endpoint.as_str())
                        .get(handler::handle_get_user))
                .push(
                    Router::with_path(env.delete_user_endpoint.as_str())
                        .delete(handler::handle_delete_user))
                .push(
                    Router::with_path(env.update_password_endpoint.as_str())
                        .patch(handler::handle_update_password)),
        )
        .push(
            Router::with_path(env.credentials_path_prefix.as_str())
                .push(
                    Router::with_path(env.validate_user_endpoint.as_str())
                        .get(handler::handle_validate_user))
                .push(
                    Router::with_path(env.login_endpoint.as_str())
                        .get(handler::handle_login))
                .push(
                    Router::with_path(env.register_endpoint.as_str())
                        .post(handler::handle_register)),
        )
}

#[cfg(test)]
mod test {
    use salvo::http::{Method, StatusCode};
    use salvo::test::RequestBuilder;
    use salvo::Service;

    use super::*;
    use crate::router;

    fn get_base_url() -> String {
        let env = Env::get_env();
        format!("http://{}:{}", env.server_host.as_str(), env.server_port.as_str())
    }

    fn get_api_url() -> String {
        let env = Env::get_env();
        format!("{}{}", &get_base_url(), env.api_path_prefix.as_str())
    }

    fn get_credentials_url() -> String {
        let env = Env::get_env();
        format!("{}{}", &get_base_url(), env.credentials_path_prefix.as_str())
    }

    fn get_jwt_token() -> String {
        let username = "foo@bar.com";
        let jwt = auth::get_jwt(username).unwrap();
        jwt.token
    }

    fn get_service() -> Service {
        let router = router::new();
        Service::new(router)
    }

    #[tokio::test]
    async fn a_register_endpoint_ok() {
        let env = Env::get_env();
        let body = r#"{"username":"foo@bar.com","password":"secretPassword"}"#;
        let url = format!("{}{}", &get_credentials_url(), env.register_endpoint.as_str());
        let res = RequestBuilder::new(url, Method::POST)
            .raw_json(body)
            .send(&get_service())
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(&status_code, &StatusCode::CREATED, "expected status code 201, received status code {}", &status_code);
    }

    #[tokio::test]
    async fn b_register_endpoint_err() {
        let env = Env::get_env();
        let body = r#"{"username":"foo@bar.com","password":"secretPassword"}"#;
        let url = format!("{}{}", &get_credentials_url(), env.register_endpoint.as_str());
        let res = RequestBuilder::new(url, Method::POST)
            .raw_json(body)
            .send(&get_service())
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(&status_code, &StatusCode::INTERNAL_SERVER_ERROR, "expected status code 400, received status code {}", &status_code);
    }

    #[tokio::test]
    async fn c_validate_user_endpoint_ok() {
        let env = Env::get_env();
        let username = "foo@bar.com";
        let url = format!("{}{}", &get_credentials_url(), env.validate_user_endpoint.as_str());
        let res = RequestBuilder::new(url, Method::GET)
            .query("username", username)
            .send(&get_service())
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(&status_code, &StatusCode::OK, "expected status code 200, received status code {}", &status_code);
    }

    #[tokio::test]
    async fn d_validate_user_endpoint_err() {
        let env = Env::get_env();
        let username = "bar@foo.com";
        let url = format!("{}{}", &get_credentials_url(), env.validate_user_endpoint.as_str());
        let res = RequestBuilder::new(url, Method::GET)
            .query("username", username)
            .send(&get_service())
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(&status_code, &StatusCode::INTERNAL_SERVER_ERROR, "expected status code 400, received status code {}", &status_code);
    }

    #[tokio::test]
    async fn e_login_endpoint_ok() {
        let env = Env::get_env();
        let username = "foo@bar.com";
        let password = "passwordSecret";
        let url = format!("{}{}", &get_credentials_url(), env.login_endpoint.as_str());
        let res = RequestBuilder::new(url, Method::GET)
            .queries(&[("username", username), ("password", password)])
            .send(&get_service())
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(&status_code, &StatusCode::OK, "expected status code 200, received status code {}", &status_code);
    }

    #[tokio::test]
    async fn f_login_endpoint_err() {
        let env = Env::get_env();
        let username = "bar@foo.com";
        let password = "passwordSecret";
        let url = format!("{}{}", &get_credentials_url(), env.login_endpoint.as_str());
        let res = RequestBuilder::new(url, Method::GET)
            .queries(&[("username", username), ("password", password)])
            .send(&get_service())
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(&status_code, &StatusCode::INTERNAL_SERVER_ERROR, "expected status code 400, received status code {}", &status_code);
    }

    #[tokio::test]
    async fn g_geojson_endpoint_ok() {
        let env = Env::get_env();
        let columns = "name,description,geom";
        let table = "office";
        let url = format!("{}{}", &get_api_url(), env.geojson_endpoint.as_str());
        let res = RequestBuilder::new(url, Method::GET)
            .bearer_auth(&get_jwt_token())
            .queries(&[("columns", columns), ("table", table)])
            .send(&get_service())
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(&status_code, &StatusCode::OK, "expected status code 200, received status code {}", &status_code);
    }

    #[tokio::test]
    async fn h_geojson_endpoint_err() {
        let env = Env::get_env();
        let columns = "name,description,geom";
        let table = "offices";
        let url = format!("{}{}", &get_api_url(), env.geojson_endpoint.as_str());
        let res = RequestBuilder::new(url, Method::GET)
            .bearer_auth(&get_jwt_token())
            .queries(&[("columns", columns), ("table", table)])
            .send(&get_service())
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(&status_code, &StatusCode::INTERNAL_SERVER_ERROR, "expected status code 400, received status code {}", &status_code);
    }

    #[tokio::test]
    async fn i_mapbox_access_token_endpoint_ok() {
        let env = Env::get_env();
        let url = format!("{}{}", &get_api_url(), env.mapbox_access_token_endpoint.as_str());
        let res = RequestBuilder::new(url, Method::GET)
            .bearer_auth(&get_jwt_token())
            .send(&get_service())
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(&status_code, &StatusCode::OK, "expected status code 200, received status code {}", &status_code);
    }

    #[tokio::test]
    async fn j_mapbox_access_token_endpoint_unauthorized() {
        let env = Env::get_env();
        let url = format!("{}{}", &get_api_url(), env.mapbox_access_token_endpoint.as_str());
        let res = RequestBuilder::new(url, Method::GET)
            .send(&get_service())
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(&status_code, &StatusCode::UNAUTHORIZED, "expected status code 401, received status code {}", &status_code);
    }

    #[tokio::test]
    async fn k_mapbox_access_token_endpoint_forbidden_expired_token() {
        let env = Env::get_env();
        let url = format!("{}{}", &get_api_url(), env.mapbox_access_token_endpoint.as_str());
        let expired_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiYXVkIjoiZ2Vvc3BhdGlhbHdlYi5jYSIsImV4cCI6MTY3OTk0MzkyNywiaXNzIjoiZ2Vvc3BhdGlhbHdlYi5jYSIsIm5hbWUiOiJqb2huY2FtcGJlbGxAZ2Vvc3BhdGlhbHdlYi5jYSIsInN1YiI6IjEifQ.w8oD07bCbCp7h4vfJU9X4f8Pam4QRrOd-se4Pggices";
        let res = RequestBuilder::new(url, Method::GET)
            .bearer_auth(expired_token)
            .send(&get_service())
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(&status_code, &StatusCode::FORBIDDEN, "expected status code 403, received status code {}", &status_code);
    }

    #[tokio::test]
    async fn l_mapbox_access_token_endpoint_forbidden_invalid_token() {
        let env = Env::get_env();
        let url = format!("{}{}", &get_api_url(), env.mapbox_access_token_endpoint.as_str());
        let invalid_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiYXVkIjoiZ2Vvc3BhdGlhbHdlYi5jYSIsImV4cCI6MTY3OTk0MzkyNywiaXNzIjoiZ2Vvc3BhdGlhbHdlYi5jYSIsIm5hbWUiOiJqb2huY2FtcGJlbGxAZ2Vvc3BhdGlhbHdlYi5jYSIsInN1YiI6IjEifQ.w8oD07bCbCp7h4vfJU9X4f8Pam4QRrOd-se4PggicesJ";
        let res = RequestBuilder::new(url, Method::GET)
            .bearer_auth(invalid_token)
            .send(&get_service())
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(&status_code, &StatusCode::FORBIDDEN, "expected status code 403, received status code {}", &status_code);
    }

    #[tokio::test]
    async fn m_get_user_endpoint_ok() {
        let env = Env::get_env();
        let username = "foo@bar.com";
        let url = format!("{}{}", &get_api_url(), env.get_user_endpoint.as_str());
        let res = RequestBuilder::new(url, Method::GET)
            .bearer_auth(&get_jwt_token())
            .query("username", username)
            .send(&get_service())
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(&status_code, &StatusCode::OK, "expected status code 200, received status code {}", &status_code);
    }

    #[tokio::test]
    async fn n_get_user_endpoint_err() {
        let env = Env::get_env();
        let username = "bar@foo.com";
        let url = format!("{}{}", &get_api_url(), env.get_user_endpoint.as_str());
        let res = RequestBuilder::new(url, Method::GET)
            .bearer_auth(&get_jwt_token())
            .query("username", username)
            .send(&get_service())
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(&status_code, &StatusCode::INTERNAL_SERVER_ERROR, "expected status code 400, received status code {}", &status_code);
    }

    #[tokio::test]
    async fn o_update_password_endpoint_ok() {
        let env = Env::get_env();
        let body = r#"{"username":"foo@bar.com","password":"newSecretPassword"}"#;
        let url = format!("{}{}", &get_api_url(), env.update_password_endpoint.as_str());
        let res = RequestBuilder::new(url, Method::PATCH)
            .bearer_auth(&get_jwt_token())
            .raw_json(body)
            .send(&get_service())
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(&status_code, &StatusCode::OK, "expected status code 200, received status code {}", &status_code);
    }

    #[tokio::test]
    async fn p_update_password_endpoint_err() {
        let env = Env::get_env();
        let body = r#"{"username":"bar@foo.com","password":"newSecretPassword"}"#;
        let url = format!("{}{}", &get_api_url(), env.update_password_endpoint.as_str());
        let res = RequestBuilder::new(url, Method::PATCH)
            .bearer_auth(&get_jwt_token())
            .raw_json(body)
            .send(&get_service())
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(&status_code, &StatusCode::INTERNAL_SERVER_ERROR, "expected status code 400, received status code {}", &status_code);
    }

    #[tokio::test]
    async fn q_delete_user_endpoint_ok() {
        let env = Env::get_env();
        let username = "foo@bar.com";
        let url = format!("{}{}", &get_api_url(), env.delete_user_endpoint.as_str());
        let res = RequestBuilder::new(url, Method::DELETE)
            .bearer_auth(&get_jwt_token())
            .query("username", username)
            .send(&get_service())
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(&status_code, &StatusCode::OK, "expected status code 200, received status code {}", &status_code);
    }

    #[tokio::test]
    async fn r_delete_user_endpoint_err() {
        let env = Env::get_env();
        let username = "bar@foo.com";
        let url = format!("{}{}", &get_api_url(), env.delete_user_endpoint.as_str());
        let res = RequestBuilder::new(url, Method::DELETE)
            .bearer_auth(&get_jwt_token())
            .query("username", username)
            .send(&get_service())
            .await;
        let status_code = res.status_code.unwrap();
        assert_eq!(&status_code, &StatusCode::INTERNAL_SERVER_ERROR, "expected status code 400, received status code {}", &status_code);
    }
}
