use serde::Deserialize;

#[derive(Debug, Deserialize)]
/// Deserialize .env file into Env struct.
pub struct Env {
    pub api_path_prefix: String,
    pub app_mode: String,
    pub app_mode_dev: String,
    pub app_mode_prod: String,
    pub credentials_path_prefix: String,
    pub delete_user_endpoint: String,
    pub geojson_endpoint: String,
    pub get_user_endpoint: String,
    pub jwt_claims_expiry: String,
    pub jwt_claims_issuer: String,
    pub jwt_claims_secret: String,
    pub login_endpoint: String,
    pub mapbox_access_token: String,
    pub mapbox_access_token_endpoint: String,
    pub postgres_uri: String,
    pub register_endpoint: String,
    pub server_host: String,
    pub server_port: String,
    pub server_sleep_duration: String,
    pub ssl_cert: String,
    pub ssl_key: String,
    pub update_password_endpoint: String,
    pub validate_user_endpoint: String,
}
impl Default for Env {
    fn default() -> Self {
        envy::from_env::<Self>().unwrap()
    }
}
