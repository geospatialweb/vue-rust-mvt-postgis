#![cfg_attr(rustfmt, rustfmt_skip)]

use sqlx::Row;

// use super::geojson::JsonFeature;
use super::model::User;
use super::password::HashedPassword;
// use super::request::LayerParams;
use super::repository::Repository;
use super::response::ResponseError;

// /// Return vector of JsonFeature structs.
// pub async fn get_json_features(params: &LayerParams) -> Result<Vec<JsonFeature>, ResponseError> {
//     let query = format!("
//         SELECT ST_AsGeoJSON(feature.*)
//         AS feature
//         FROM (SELECT {} FROM {})
//         AS feature",
//         &params.columns,
//         &params.table);
//     let json_features = sqlx::query_as(&query)
//         .fetch_all(Pool::get_pool())
//         .await?;
//     Ok(json_features)
// }

/// Return user.
pub async fn get_user(repo: &Repository) -> Result<User, ResponseError> {
    let query = "
        SELECT username, role
        FROM users
        WHERE username = $1";
    let row = sqlx::query(query)
        .bind(&repo.username)
        .fetch_one(&repo.pool)
        .await?;
    let user = User::new(row.get("username"), &None, row.get("role"));
    Ok(user)
}

/// Delete user returning username.
pub async fn delete_user(repo: &Repository) -> Result<User, ResponseError> {
    let query = "
        DELETE FROM users
        WHERE username = $1
        RETURNING username";
    let row = sqlx::query(query)
        .bind(&repo.username)
        .fetch_one(&repo.pool)
        .await?;
    let user = User::new(row.get("username"), &None, "");
    Ok(user)
}

/// Insert user returning username.
pub async fn insert_user(repo: &Repository) -> Result<User, ResponseError> {
    let query = "
        INSERT INTO users (username, password, role)
        VALUES ($1, $2, $3)
        RETURNING username";
    let row = sqlx::query(query)
        .bind(&repo.username)
        .bind(repo.password.as_ref().unwrap().as_str())
        .bind(&repo.role)
        .fetch_one(&repo.pool)
        .await?;
    let user = User::new(row.get("username"), &None, "");
    Ok(user)
}

/// Return HS256 hashed password.
pub async fn get_password(repo: &Repository) -> Result<HashedPassword, ResponseError> {
    let query = "
        SELECT password
        FROM users
        WHERE username = $1";
    let row = sqlx::query(query)
        .bind(&repo.username)
        .fetch_one(&repo.pool)
        .await?;
    let hashed_password = HashedPassword::new(row.get("password"));
    Ok(hashed_password)
}

// /// Update HS256 hashed password returning username.
pub async fn update_password(repo: &Repository) -> Result<User, ResponseError> {
    let query = "
        UPDATE users
        SET password = $2
        WHERE username = $1
        RETURNING username";
    let row = sqlx::query(query)
        .bind(&repo.username)
        .bind(repo.password.as_ref().unwrap().as_str())
        .fetch_one(&repo.pool)
        .await?;
    let user = User::new(row.get("username"), &None, "");
    Ok(user)
}

// #[cfg(test)]
// mod test {
//     use super::*;

//     #[tokio::test]
//     async fn a_insert_user_ok() {
//         let role = "user";
//         let username = "foo@bar.com";
//         let password = "$2b$12$OaGlXlV/drI7Zdf4kX32YOU6OZIO9I4hWWkx/TNybgI9tBsP/6EM6";
//         let hashed_password = HashedPassword::new(password);
//         let user = User::new(username, &None, "");
//         let result = insert_user(username, &hashed_password, role).await;
//         assert!(result.is_ok());
//         assert_eq!(result.unwrap(), user);
//     }

//     #[tokio::test]
//     async fn b_insert_user_err() {
//         let role = "user";
//         let username = "foo@bar.com";
//         let password = "$2b$12$OaGlXlV/drI7Zdf4kX32YOU6OZIO9I4hWWkx/TNybgI9tBsP/6EM6";
//         let hashed_password = HashedPassword::new(password);
//         let result = insert_user(username, &hashed_password, role).await;
//         assert!(matches!(result, Err(ResponseError::Database(_))));
//     }

//     #[tokio::test]
//     async fn c_get_user_ok() {
//         let role = "user";
//         let username = "foo@bar.com";
//         let user = User::new(username, &None, role);
//         let result = get_user(username).await;
//         assert!(result.is_ok());
//         assert_eq!(result.unwrap(), user);
//     }

//     #[tokio::test]
//     async fn d_get_password_ok() {
//         let username = "foo@bar.com";
//         let password = "$2b$12$OaGlXlV/drI7Zdf4kX32YOU6OZIO9I4hWWkx/TNybgI9tBsP/6EM6";
//         let hashed_password = HashedPassword::new(password);
//         let result = get_password(username).await;
//         assert!(result.is_ok());
//         assert_eq!(result.unwrap(), hashed_password);
//     }

//     #[tokio::test]
//     async fn e_update_password_ok() {
//         let username = "foo@bar.com";
//         let password = "$2b$12$OaGlXlV/drI7Zdf4kX32YOU6OZIO9I4hWWkx/TNybgI9tBsP/6EM6";
//         let hashed_password = HashedPassword::new(password);
//         let user = User::new(username, &None, "");
//         let result = update_password(username, &hashed_password).await;
//         assert!(result.is_ok());
//         assert_eq!(result.unwrap(), user);
//     }

//     #[tokio::test]
//     async fn f_delete_user_ok() {
//         let username = "foo@bar.com";
//         let user = User::new(username, &None, "");
//         let result = delete_user(username).await;
//         assert!(result.is_ok());
//         assert_eq!(result.unwrap(), user);
//     }

//     #[tokio::test]
//     async fn get_json_features_ok() {
//         let feature = r#"{"type": "Feature", "geometry": {"type":"Point","coordinates":[-76.011422,44.384362]}, "properties": {"name": "Frontenac Arch Biosphere Office", "description": "19 Reynolds Road, Lansdowne, ON. Open Monday to Friday 8:30am - 4:30pm"}}"#;
//         let json_features = vec![JsonFeature::new(feature)];
//         let columns = "name,description,geom";
//         let table = "office";
//         let params = LayerParams {
//             columns:  columns.to_owned(),
//             table: table.to_owned(),
//         };
//         let result = get_json_features(&params).await;
//         assert!(result.is_ok());
//         assert_eq!(result.unwrap(), json_features);
//     }
// }
