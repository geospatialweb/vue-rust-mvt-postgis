use envy::Error;
use once_cell::sync::OnceCell;
use serde::Deserialize;
use tracing::info;

static ENV: OnceCell<Env> = OnceCell::new();

/// Environment variables parsed from .env file.
#[derive(Debug, Deserialize, PartialEq)]
pub struct Env {
    pub api_path_prefix: String,
    pub app_env: String,
    pub credentials_path_prefix: String,
    pub delete_user_endpoint: String,
    pub dev_env: String,
    pub get_geojson_endpoint: String,
    pub get_mapbox_access_token_endpoint: String,
    pub get_user_endpoint: String,
    pub hash_salt: String,
    pub jwt_expiry: String,
    pub jwt_issuer: String,
    pub jwt_secret: String,
    pub login_endpoint: String,
    pub mapbox_access_token: String,
    pub postgres_dsn: String,
    pub postgres_test_dsn: String,
    pub prod_env: String,
    pub register_endpoint: String,
    pub server_host: String,
    pub server_port: String,
    pub tls_cert: String,
    pub tls_key: String,
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

    #[test]
    fn get_env_ok() {
        let env = ENV.get().unwrap();
        let result = Env::get_env();
        assert_eq!(result, env);
    }
}
