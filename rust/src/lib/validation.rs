use garde::Validate;

use super::model::{Layer, User};
use super::response::ResponseError;

/// Validate layer query params with `garde` field constraints in Layer struct.
pub fn validate_layer(layer: &Layer) -> Result<(), ResponseError> {
    if layer.validate().is_err() {
        return Err(ResponseError::LayerValidation);
    }
    let tables = ["office", "places", "trails"];
    if !tables.contains(&layer.table.as_str()) {
        return Err(ResponseError::LayerValidation);
    }
    validate_role(&layer.role)?;
    Ok(())
}

/// Validate user query params with `garde` field constraints in User struct.
pub fn validate_user(user: &User) -> Result<(), ResponseError> {
    if user.validate().is_err() {
        return Err(ResponseError::UserValidation);
    }
    validate_role(&user.role)?;
    Ok(())
}

/// Validate role with a vector of valid roles.
pub fn validate_role(role: &str) -> Result<(), ResponseError> {
    let roles = ["admin", "user"];
    if !roles.contains(&role) {
        return Err(ResponseError::RoleValidation);
    }
    Ok(())
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::password::TextPassword;

    #[test]
    fn validate_layer_ok() {
        let columns = "name,description,geom";
        let table = "office";
        let role = "user";
        let layer = Layer::new(columns, table, role);
        let result = validate_layer(&layer);
        assert!(result.is_ok());
    }

    #[test]
    fn validate_layer_err() {
        let columns = "name,description,geom";
        let table = "offices";
        let role = "user";
        let layer = Layer::new(columns, table, role);
        let result = validate_layer(&layer);
        assert!(matches!(result, Err(ResponseError::LayerValidation)));
    }

    #[test]
    fn validate_user_ok() {
        let role = "user";
        let username = String::from("foo@bar.com");
        let password = "secretPassword";
        let text_password = TextPassword::new(password);
        let user = User::new(&Some(&username), &Some(&text_password), role);
        let result = validate_user(&user);
        assert!(result.is_ok());
    }

    #[test]
    fn validate_user_err() {
        let role = "user";
        let username = String::from("foobar.com"); // must be email format
        let password = "secretPassword";
        let text_password = TextPassword::new(password);
        let user = User::new(&Some(&username), &Some(&text_password), role);
        let result = validate_user(&user);
        assert!(matches!(result, Err(ResponseError::UserValidation)));
    }

    #[test]
    fn validate_role_ok() {
        let role = "user";
        let username = String::from("foo@bar.com");
        let password = "secretPassword";
        let text_password = TextPassword::new(password);
        let user = User::new(&Some(&username), &Some(&text_password), role);
        let result = validate_user(&user);
        assert!(result.is_ok());
    }

    #[test]
    fn validate_role_err() {
        let role = "test";
        let username = String::from("foo@bar.com");
        let password = "secretPassword";
        let text_password = TextPassword::new(password);
        let user = User::new(&Some(&username), &Some(&text_password), role);
        let result = validate_user(&user);
        assert!(matches!(result, Err(ResponseError::RoleValidation)));
    }
}
