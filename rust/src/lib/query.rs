#![cfg_attr(rustfmt, rustfmt_skip)]

use sqlx::{Row, query, query_as};

use super::geojson::JsonFeature;
use super::hash;
use super::model::User;
use super::password::HashedPassword;
use super::repository::{LayerRepository, UserRepository};
use super::response::ResponseError;

/// Return vector of JsonFeature structs.
pub async fn get_json_features(repo: &LayerRepository) -> Result<Vec<JsonFeature>, ResponseError> {
    let json_features = query_as(&repo.sql)
        .fetch_all(&repo.pool)
        .await?;
    Ok(json_features)
}

/// Get user returning username.
pub async fn get_user(repo: &UserRepository) -> Result<User, ResponseError> {
    let row = query(&repo.sql)
        .bind(&repo.user.username)
        .fetch_one(&repo.pool)
        .await?;
    let role = row.get("role");
    let username = row.get("username");
    let user = User::new(&Some(&username), &None, role);
    Ok(user)
}

/// Delete user returning username.
pub async fn delete_user(repo: &UserRepository) -> Result<User, ResponseError> {
    let row = query(&repo.sql)
        .bind(&repo.user.username)
        .fetch_one(&repo.pool)
        .await?;
    let username = row.get("username");
    let user = User::new(&Some(&username), &None, "");
    Ok(user)
}

/// Insert user returning username.
pub async fn insert_user(repo: &UserRepository) -> Result<User, ResponseError> {
    let text_password = repo.user.password.to_owned().unwrap();
    let hashed_password = hash::generate_hashed_password(&text_password)?;
    let row = query(&repo.sql)
        .bind(&repo.user.username)
        .bind(hashed_password.as_str())
        .bind(&repo.user.role)
        .fetch_one(&repo.pool)
        .await?;
    let username = row.get("username");
    let user = User::new(&Some(&username), &None, "");
    Ok(user)
}

/// Return HS256 hashed password.
pub async fn get_password(repo: &UserRepository) -> Result<HashedPassword, ResponseError> {
    let row = query(&repo.sql)
        .bind(&repo.user.username)
        .fetch_one(&repo.pool)
        .await?;
    let password = row.get("password");
    let hashed_password = HashedPassword::new(password);
    Ok(hashed_password)
}


/// Update HS256 hashed password returning username.
pub async fn update_password(repo: &UserRepository) -> Result<User, ResponseError> {
    let text_password = repo.user.password.to_owned().unwrap();
    let hashed_password = hash::generate_hashed_password(&text_password)?;
    let row = query(&repo.sql)
        .bind(&repo.user.username)
        .bind(hashed_password.as_str())
        .fetch_one(&repo.pool)
        .await?;
    let username = row.get("username");
    let user = User::new(&Some(&username), &None, "");
    Ok(user)
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::model::Layer;
    use crate::password::TextPassword;
    use crate::repository::{LayerRepositorySQL, UserRepositorySQL};

    #[tokio::test]
    async fn a_insert_user_ok() {
        let role = "user";
        let username = String::from("foo@bar.com");
        let password = "secretPassword";
        let text_password = TextPassword::new(password);
        let mut user = User::new(&Some(&username), &Some(&text_password), role);
        let sql = UserRepository::insert_user_sql();
        let repo = UserRepository::new(&user, &sql);
        let result = insert_user(&repo).await;
        user = User::new(&Some(&username), &None, "");
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), user);
    }

    #[tokio::test]
    async fn b_insert_user_err() {
        let role = "user";
        let username = String::from("foo@bar.com");
        let password = "secretPassword";
        let text_password = TextPassword::new(password);
        let user = User::new(&Some(&username), &Some(&text_password), role);
        let sql = UserRepository::insert_user_sql();
        let repo = UserRepository::new(&user, &sql);
        let result = insert_user(&repo).await;
        assert!(matches!(result, Err(ResponseError::Database(_))));
    }

    #[tokio::test]
    async fn c_get_user_ok() {
        let role = "user";
        let username = String::from("foo@bar.com");
        let mut user = User::new(&Some(&username), &None, "");
        let sql = UserRepository::get_user_sql();
        let repo = UserRepository::new(&user, &sql);
        let result = get_user(&repo).await;
        user = User::new(&Some(&username), &None, role);
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), user);
    }

    #[tokio::test]
    async fn d_get_password_ok() {
        let username = String::from("foo@bar.com");
        let password = "$argon2id$v=19$m=19456,t=2,p=1$bnVMV1RsQVpxTks5c3hNQQ$r4g+fMtNBV5srD2zgiVsTU/8EkWREGgy6epi7Ux6d+c";
        let hashed_password = HashedPassword::new(password);
        let user = User::new(&Some(&username), &None, "");
        let sql = UserRepository::get_password_sql();
        let repo = UserRepository::new(&user, &sql);
        let result = get_password(&repo).await;
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), hashed_password);
    }

    #[tokio::test]
    async fn e_update_password_ok() {
        let username = String::from("foo@bar.com");
        let password = "newSecretPassword";
        let text_password = TextPassword::new(password);
        let mut user = User::new(&Some(&username), &Some(&text_password), "");
        let sql = UserRepository::update_password_sql();
        let repo = UserRepository::new(&user, &sql);
        let result = update_password(&repo).await;
        user = User::new(&Some(&username), &None, "");
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), user);
    }

    #[tokio::test]
    async fn f_delete_user_ok() {
        let username = String::from("foo@bar.com");
        let user = User::new(&Some(&username), &None, "");
        let sql = UserRepository::delete_user_sql();
        let repo = UserRepository::new(&user, &sql);
        let result = delete_user(&repo).await;
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), user);
    }

    #[tokio::test]
    async fn g_get_json_features_ok() {
        let feature = r#"{"type": "Feature", "geometry": {"type":"Point","coordinates":[-76.011422,44.384362]}, "properties": {"name": "Frontenac Arch Biosphere Office", "description": "19 Reynolds Road, Lansdowne, ON. Open Monday to Friday 8:30am - 4:30pm"}}"#;
        let json_features = vec![JsonFeature::new(feature)];
        let columns = "name,description,geom";
        let table = "office";
        let role = "user";
        let layer = Layer::new(columns, table, role);
        let sql = LayerRepository::get_json_features_sql(&layer);
        let repo = LayerRepository::new(&layer, &sql);
        let result = get_json_features(&repo).await;
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), json_features);
    }
}
