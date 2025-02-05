use garde::Validate;

use super::model::User;
use super::repository::GeoJsonParams;
use super::response::ResponseError;

/// Validate geojson query params with `garde` field constraints in GeoJsonParams struct.
pub fn validate_geojson_params(params: &GeoJsonParams) -> Result<(), ResponseError> {
    if params.validate().is_err() {
        return Err(ResponseError::GeoJsonParamsValidation);
    }
    let tables = ["office", "places", "trails"];
    if !tables.contains(&params.table.as_str()) {
        return Err(ResponseError::GeoJsonParamsValidation);
    }
    validate_role(&params.role)?;
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
    fn validate_geojson_params_ok() {
        let columns = "name,description,geom";
        let table = "office";
        let role = "user";
        let params = GeoJsonParams {
            columns: columns.to_owned(),
            table: table.to_owned(),
            role: role.to_owned(),
        };
        let result = validate_geojson_params(&params);
        assert!(result.is_ok());
    }

    #[test]
    fn validate_geojson_params_err() {
        let columns = "name,description,geom";
        let table = "offices";
        let role = "user";
        let params = GeoJsonParams {
            columns: columns.to_owned(),
            table: table.to_owned(),
            role: role.to_owned(),
        };
        let result = validate_geojson_params(&params);
        assert!(matches!(result, Err(ResponseError::GeoJsonParamsValidation)));
    }

    #[test]
    fn validate_user_ok() {
        let role = "user";
        let username = "foo@bar.com";
        let password = "secretPassword";
        let text_password = TextPassword::new(password);
        let user = User::new(&Some(&username.to_owned()), &Some(&text_password), role);
        let result = validate_user(&user);
        assert!(result.is_ok());
    }

    #[test]
    fn validate_user_err() {
        let role = "user";
        let username = "foobar.com"; // must be email format
        let password = "secretPassword";
        let text_password = TextPassword::new(password);
        let user = User::new(&Some(&username.to_owned()), &Some(&text_password), role);
        let result = validate_user(&user);
        assert!(matches!(result, Err(ResponseError::UserValidation)));
    }

    #[test]
    fn validate_role_ok() {
        let role = "user";
        let username = "foo@bar.com";
        let password = "secretPassword";
        let text_password = TextPassword::new(password);
        let user = User::new(&Some(&username.to_owned()), &Some(&text_password), role);
        let result = validate_user(&user);
        assert!(result.is_ok());
    }

    #[test]
    fn validate_role_err() {
        let role = "test";
        let username = "foo@bar.com";
        let password = "secretPassword";
        let text_password = TextPassword::new(password);
        let user = User::new(&Some(&username.to_owned()), &Some(&text_password), role);
        let result = validate_user(&user);
        assert!(matches!(result, Err(ResponseError::RoleValidation)));
    }
}
