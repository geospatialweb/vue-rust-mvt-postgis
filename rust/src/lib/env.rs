use envy::Error;
use once_cell::sync::OnceCell;
use serde::Deserialize;
use tracing::info;

static ENV: OnceCell<Env> = OnceCell::new();

/// Environment variables parsed from .env file.
#[derive(Debug, Deserialize)]
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
    pub jwt_secret: String,
    pub login_endpoint: String,
    pub mapbox_access_token: String,
    pub mapbox_access_token_endpoint: String,
    pub postgres_uri: String,
    pub postgres_test_uri: String,
    pub register_endpoint: String,
    pub server_host_dev: String,
    pub server_host_prod: String,
    pub server_port: String,
    pub server_tls_cert: String,
    pub server_tls_key: String,
    pub update_password_endpoint: String,
    pub validate_user_endpoint: String,
}
impl Env {
    /// Get env variables from static ENV and return Env struct static lifetime reference.
    pub fn get_env() -> &'static Self {
        ENV.get().unwrap()
    }

    /// Deserialize .env file in root dir into Env struct and set static ENV.
    pub fn set_env() -> Result<(), Error> {
        let env = envy::from_env::<Self>()?;
        ENV.set(env).ok();
        info!("env ok");
        Ok(())
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn set_env_ok() {
        let result = Env::set_env();
        assert!(result.is_ok());
    }
}
