use garde::Validate;

use super::handler::LayerParams;
use super::model::User;
use super::response::ResponseError;

pub fn validate_layer_params(params: &LayerParams) -> Result<(), ResponseError> {
    if params.validate(&()).is_err() {
        return Err(ResponseError::LayerParamsValidation);
    }
    Ok(())
}

pub fn validate_user(user: &User) -> Result<(), ResponseError> {
    if user.validate(&()).is_err() {
        return Err(ResponseError::UserValidation);
    }
    Ok(())
}
