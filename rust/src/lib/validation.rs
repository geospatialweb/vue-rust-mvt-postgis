use garde::Validate;

use super::model::User;
use super::request::LayerParams;
use super::response::ResponseError;

/// Validate layer query params with `garde` field constraints in LayerParams struct.
pub fn validate_layer_params(params: &LayerParams) -> Result<(), ResponseError> {
    if params.validate().is_err() {
        return Err(ResponseError::LayerParamsValidation);
    }
    Ok(())
}

/// Validate user query params with `garde` field constraints in User struct.
pub fn validate_user(user: &User) -> Result<(), ResponseError> {
    if user.validate().is_err() {
        return Err(ResponseError::UserValidation);
    }
    Ok(())
}

/// Validate user role with a vector of valid roles.
pub fn validate_role(user: &User) -> Result<(), ResponseError> {
    let _ = validate_user(user);
    let roles = ["admin", "user"];
    if !roles.contains(&user.role.as_str()) {
        return Err(ResponseError::UserRoleValidation);
    }
    Ok(())
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::password::TextPassword;

    #[test]
    fn validate_layer_params_ok() {
        let columns = "name,description,geom";
        let table = "office";
        let params = LayerParams {
            columns: columns.to_owned(),
            table: table.to_owned(),
        };
        let result = validate_layer_params(&params);
        assert!(result.is_ok());
    }

    #[test]
    fn validate_user_ok() {
        let role = "user";
        let username = "foo@bar.com";
        let password = "secretPassword";
        let text_password = TextPassword::new(password);
        let user = User::new(username, &Some(&text_password), role);
        let result = validate_user(&user);
        assert!(result.is_ok());
    }

    #[test]
    fn validate_user_err() {
        let role = "user";
        let username = "foobar.com"; // must be email format
        let password = "secretPassword";
        let text_password = TextPassword::new(password);
        let user = User::new(username, &Some(&text_password), role);
        let result = validate_user(&user);
        assert!(matches!(result, Err(ResponseError::UserValidation)));
    }

    #[test]
    fn validate_role_ok() {
        let role = "user";
        let username = "foo@bar.com";
        let password = "secretPassword";
        let text_password = TextPassword::new(password);
        let user = User::new(username, &Some(&text_password), role);
        let result = validate_role(&user);
        assert!(result.is_ok());
    }

    #[test]
    fn validate_role_err() {
        let role = "test";
        let username = "foobar.com";
        let password = "secretPassword";
        let text_password = TextPassword::new(password);
        let user = User::new(username, &Some(&text_password), role);
        let result = validate_role(&user);
        assert!(matches!(result, Err(ResponseError::UserRoleValidation)));
    }
}
