use garde::Validate;

use super::handler::LayerParams;
use super::model::User;
use super::response::ResponseError;

/// Validate layer query params with `garde` field constraints in LayerParams struct.
pub fn validate_layer_params(params: &LayerParams) -> Result<(), ResponseError> {
    if params.validate(&()).is_err() {
        return Err(ResponseError::LayerParamsValidation);
    }
    Ok(())
}

/// Validate user query params with `garde` field constraints in User struct.
pub fn validate_user(user: &User) -> Result<(), ResponseError> {
    if user.validate(&()).is_err() {
        return Err(ResponseError::UserValidation);
    }
    Ok(())
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn validate_layer_params_ok() {
        let columns = "name,description,geom";
        let table = "office";
        let params = LayerParams {
            columns: columns.to_owned(),
            table: table.to_owned(),
        };
        let result = validate_layer_params(&params);
        assert_eq!(result.is_ok(), true, "should be true");
        assert!(matches!(result.unwrap(), ()));
    }

    #[test]
    fn validate_user_ok() {
        let username = "foo@bar.com";
        let password = String::from("secretPassword");
        let user = User::new(username, &Some(password));
        let result = validate_user(&user);
        assert_eq!(result.is_ok(), true, "should be true");
        assert!(matches!(result.unwrap(), ()));
    }

    #[test]
    fn validate_user_err() {
        let username = "foobar.com"; // must be email format
        let password = String::from("secretPassword");
        let user = User::new(username, &Some(password));
        let result = validate_user(&user);
        assert_eq!(result.is_err(), true, "should be true");
        assert!(matches!(result, Err(ResponseError::UserValidation)));
    }
}
