#![cfg_attr(rustfmt, rustfmt_skip)]

use sqlx::Row;

use super::geojson::JsonFeature;
use super::hash;
use super::model::User;
use super::password::HashedPassword;
use super::repository::{LayerRepository, UserRepository};
use super::response::ResponseError;

/// Return vector of JsonFeature structs.
pub async fn get_json_features(repo: &LayerRepository) -> Result<Vec<JsonFeature>, ResponseError> {
    let query = format!("
        SELECT ST_AsGeoJSON(feature.*)
        AS feature
        FROM (SELECT {} FROM {})
        AS feature",
        &repo.layer.columns,
        &repo.layer.table);
    let json_features = sqlx::query_as(&query)
        .fetch_all(&repo.pool)
        .await?;
    Ok(json_features)
}

/// Get user returning username.
pub async fn get_user(repo: &UserRepository) -> Result<User, ResponseError> {
    let query = "
        SELECT username, role
        FROM users
        WHERE username = $1";
    let row = sqlx::query(query)
        .bind(&repo.user.username)
        .fetch_one(&repo.pool)
        .await?;
    let user = User::new(&Some(&row.get("username")), &None, row.get("role"));
    Ok(user)
}

/// Delete user returning username.
pub async fn delete_user(repo: &UserRepository) -> Result<User, ResponseError> {
    let query = "
        DELETE FROM users
        WHERE username = $1
        RETURNING username";
    let row = sqlx::query(query)
        .bind(&repo.user.username)
        .fetch_one(&repo.pool)
        .await?;
    let user = User::new(&Some(&row.get("username")), &None, "");
    Ok(user)
}

/// Insert user returning username.
pub async fn insert_user(repo: &UserRepository) -> Result<User, ResponseError> {
    let query = "
        INSERT INTO users (username, password, role)
        VALUES ($1, $2, $3)
        RETURNING username";
    let text_password = repo.user.password.as_ref().unwrap();
    let hashed_password = hash::generate_hashed_password(text_password)?;
    let row = sqlx::query(query)
        .bind(&repo.user.username)
        .bind(hashed_password.as_str())
        .bind(&repo.user.role)
        .fetch_one(&repo.pool)
        .await?;
    let user = User::new(&Some(&row.get("username")), &None, "");
    Ok(user)
}

/// Return HS256 hashed password.
pub async fn get_password(repo: &UserRepository) -> Result<HashedPassword, ResponseError> {
    let query = "
        SELECT password
        FROM users
        WHERE username = $1";
    let row = sqlx::query(query)
        .bind(&repo.user.username)
        .fetch_one(&repo.pool)
        .await?;
    let hashed_password = HashedPassword::new(row.get("password"));
    Ok(hashed_password)
}

/// Update HS256 hashed password returning username.
pub async fn update_password(repo: &UserRepository) -> Result<User, ResponseError> {
    let query = "
        UPDATE users
        SET password = $2
        WHERE username = $1
        RETURNING username";
    let text_password = repo.user.password.as_ref().unwrap();
    let hashed_password = hash::generate_hashed_password(text_password)?;
    let row = sqlx::query(query)
        .bind(&repo.user.username)
        .bind(hashed_password.as_str())
        .fetch_one(&repo.pool)
        .await?;
    let user = User::new(&Some(&row.get("username")), &None, "");
    Ok(user)
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::model::Layer;
    use crate::password::TextPassword;

    #[tokio::test]
    async fn a_insert_user_ok() {
        let role = "user";
        let username = String::from("foo@bar.com");
        let password = "secretPassword";
        let text_password = TextPassword::new(password);
        let mut user = User::new(&Some(&username), &Some(&text_password), role);
        let repo = UserRepository::new(&user);
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
        let repo = UserRepository::new(&user);
        let result = insert_user(&repo).await;
        assert!(matches!(result, Err(ResponseError::Database(_))));
    }

    #[tokio::test]
    async fn c_get_user_ok() {
        let role = "user";
        let username = String::from("foo@bar.com");
        let mut user = User::new(&Some(&username), &None, "");
        let repo = UserRepository::new(&user);
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
        let repo = UserRepository::new(&user);
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
        let repo = UserRepository::new(&user);
        let result = update_password(&repo).await;
        user = User::new(&Some(&username), &None, "");
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), user);
    }

    #[tokio::test]
    async fn f_delete_user_ok() {
        let username = String::from("foo@bar.com");
        let user = User::new(&Some(&username), &None, "");
        let repo = UserRepository::new(&user);
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
        let repo = LayerRepository::new(&layer);
        let result = get_json_features(&repo).await;
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), json_features);
    }
}
