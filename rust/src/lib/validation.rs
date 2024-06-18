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

#[cfg(test)]
mod test {
    use super::*;
    use crate::password::TextPassword;

    #[test]
    fn validate_layer_params_ok() {
        let columns = "name,description,geom";
        let table = "office";
        let params = LayerParams {
            columns: String::from(columns),
            table: String::from(table),
        };
        let result = validate_layer_params(&params);
        assert!(result.is_ok());
    }

    #[test]
    fn validate_user_ok() {
        let username = "foo@bar.com";
        let password = "secretPassword";
        let text_password = TextPassword::new(&String::from(password));
        let user = User::new(username, &Some(&text_password));
        let result = validate_user(&user);
        assert!(result.is_ok());
    }

    #[test]
    fn validate_user_err() {
        let username = "foobar.com"; // must be email format
        let password = "secretPassword";
        let text_password = TextPassword::new(&String::from(password));
        let user = User::new(username, &Some(&text_password));
        let result = validate_user(&user);
        assert!(matches!(result, Err(ResponseError::UserValidation)));
    }
}
