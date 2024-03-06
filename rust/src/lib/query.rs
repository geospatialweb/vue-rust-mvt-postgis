#![cfg_attr(rustfmt, rustfmt_skip)]

use sqlx::Row;

use super::auth::Credential;
use super::database::get_pool;
use super::geojson::JsonFeature;
use super::handler::LayerParams;
use super::password::HashedPassword;
use super::response::ResponseError;

/// Return vector of JsonFeature structs.
pub async fn get_json_features(params: &LayerParams) -> Result<Vec<JsonFeature>, ResponseError> {
    let query = format!("
        SELECT ST_AsGeoJSON(feature.*)
        AS feature
        FROM (SELECT {} FROM {})
        AS feature",
        params.columns,
        params.table);
    let json_features = sqlx::query_as(&query)
        .fetch_all(&get_pool().await?)
        .await?;
    Ok(json_features)
}

/// Return user.
pub async fn get_user(username: &str) -> Result<String, ResponseError> {
    let query = "
        SELECT username
        FROM users
        WHERE username = $1";
    let row = sqlx::query(query)
        .bind(username)
        .fetch_one(&get_pool().await?)
        .await?;
    let username = row.get("username");
    Ok(username)
}

/// Delete user returning username.
pub async fn delete_user(username: &str) -> Result<String, ResponseError> {
    let query = "
        DELETE FROM users
        WHERE username = $1
        RETURNING username";
    let row = sqlx::query(query)
        .bind(username)
        .fetch_one(&get_pool().await?)
        .await?;
    let username = row.get("username");
    Ok(username)
}

/// Insert user returning username.
pub async fn insert_user(username: &str, password: &HashedPassword) -> Result<String, ResponseError> {
    let query = "
        INSERT INTO users (username, password)
        VALUES ($1, $2)
        RETURNING username";
    let row = sqlx::query(query)
        .bind(username)
        .bind(password.as_str())
        .fetch_one(&get_pool().await?)
        .await?;
    let username = row.get("username");
    Ok(username)
}

/// Return HS256 hashed password.
pub async fn get_password(username: &str) -> Result<Credential, ResponseError> {
    let query = "
        SELECT password
        FROM users
        WHERE username = $1";
    let row = sqlx::query(query)
        .bind(username)
        .fetch_one(&get_pool().await?)
        .await?;
    let hashed_password = HashedPassword::new(row.get("password"));
    let credential = Credential::new(&hashed_password);
    Ok(credential)
}

/// Update HS256 hashed password returning username.
pub async fn update_password(username: &str, password: &HashedPassword) -> Result<String, ResponseError> {
    let query = "
        UPDATE users
        SET password = $2
        WHERE username = $1
        RETURNING username";
    let row = sqlx::query(query)
        .bind(username)
        .bind(password.as_str())
        .fetch_one(&get_pool().await?)
        .await?;
    let username = row.get("username");
    Ok(username)
}

#[cfg(test)]
mod test {
    use super::*;

    #[tokio::test]
    async fn a_insert_user_ok() {
        let username = "foo@bar.com";
        let password = "$2b$12$OaGlXlV/drI7Zdf4kX32YOU6OZIO9I4hWWkx/TNybgI9tBsP/6EM6";
        let hashed_password = HashedPassword::new(&String::from(password));
        let result = insert_user(username, &hashed_password).await;
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), username);
    }

    #[tokio::test]
    async fn b_insert_user_err() {
        let username = "foo@bar.com";
        let password = "$2b$12$OaGlXlV/drI7Zdf4kX32YOU6OZIO9I4hWWkx/TNybgI9tBsP/6EM6";
        let hashed_password = HashedPassword::new(&String::from(password));
        let result = insert_user(username, &hashed_password).await;
        assert!(matches!(result, Err(ResponseError::Database(_))));
    }

    #[tokio::test]
    async fn c_get_user_ok() {
        let username = "foo@bar.com";
        let result = get_user(username).await;
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), username);
    }

    #[tokio::test]
    async fn d_get_password_ok() {
        let username = "foo@bar.com";
        let password = "$2b$12$OaGlXlV/drI7Zdf4kX32YOU6OZIO9I4hWWkx/TNybgI9tBsP/6EM6";
        let hashed_password = HashedPassword::new(&String::from(password));
        let credential = Credential::new(&hashed_password);
        let result = get_password(username).await;
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), credential);
    }

    #[tokio::test]
    async fn e_update_password_ok() {
        let username = "foo@bar.com";
        let password = "$2b$12$OaGlXlV/drI7Zdf4kX32YOU6OZIO9I4hWWkx/TNybgI9tBsP/6EM6";
        let hashed_password = HashedPassword::new(&String::from(password));
        let result = update_password(username, &hashed_password).await;
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), username);
    }

    #[tokio::test]
    async fn f_delete_user_ok() {
        let username = "foo@bar.com";
        let result = delete_user(username).await;
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), username);
    }

    #[tokio::test]
    async fn get_json_features_ok() {
        let feature = r#"{"type": "Feature", "geometry": {"type":"Point","coordinates":[-76.011422,44.384362]}, "properties": {"name": "Frontenac Arch Biosphere Office", "description": "19 Reynolds Road, Lansdowne, ON. Open Monday to Friday 8:30am - 4:30pm"}}"#;
        let json_features = vec![JsonFeature { feature: String::from(feature) }];
        let columns = "name,description,geom";
        let table = "office";
        let params = LayerParams {
            columns:  String::from(columns),
            table: String::from(table),
        };
        let result = get_json_features(&params).await;
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), json_features);
    }
}
