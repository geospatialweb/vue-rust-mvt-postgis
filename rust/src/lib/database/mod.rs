use super::env::Config;
use once_cell::sync::OnceCell;
use sqlx::PgPool;

pub static POOL: OnceCell<PgPool> = OnceCell::new();

#[inline]
pub fn get_pool() -> &'static PgPool {
    POOL.get().unwrap()
}

pub async fn set_pool() {
    let env: Config = Default::default();
    let pool = PgPool::connect(&env.postgres_dsn).await.unwrap();
    POOL.set(pool).unwrap();
    println!("\x1b[32mPool creation success\x1b[0m");
}
