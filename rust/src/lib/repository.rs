use sqlx::PgPool;

use super::database::Pool;
use super::password::HashedPassword;

#[derive(Debug)]
pub struct Repository {
    // pub layer_params: LayerParams,
    pub password: Option<HashedPassword>,
    pub role: Option<String>,
    pub username: Option<String>,
    pub pool: PgPool,
}

impl Repository {
    pub fn new(
        username: &Option<&String>,
        password: &Option<&HashedPassword>,
        role: &Option<&String>,
    ) -> Self {
        Self {
            username: username.cloned(),
            password: password.cloned(),
            role: role.cloned(),
            pool: Pool::get_pool().to_owned(),
        }
    }
}
