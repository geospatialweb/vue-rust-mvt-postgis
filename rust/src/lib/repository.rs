use garde::Validate;
use serde::Deserialize;
use sqlx::PgPool;

use super::model::User;
use super::postgres::Pool;

/// GeoJSON query URL params.
#[derive(Debug, Clone, Deserialize, Validate)]
pub struct GeoJsonParams {
    #[garde(ascii)]
    pub columns: String,
    #[garde(ascii)]
    pub table: String,
    #[garde(ascii)]
    pub role: String,
}

/// Repository pattern struct.
#[derive(Debug)]
pub struct Repository {
    pub geojson_params: Option<GeoJsonParams>,
    pub user: Option<User>,
    pub pool: PgPool,
}

impl Repository {
    pub fn new(geojson_params: &Option<&GeoJsonParams>, user: &Option<&User>) -> Self {
        Self {
            geojson_params: geojson_params.cloned(),
            user: user.cloned(),
            pool: Pool::get_pool().to_owned(),
        }
    }
}
