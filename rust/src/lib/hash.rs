use argon2::{Config, Error};

use super::env::Env;
use super::password::{HashedPassword, TextPassword};
use super::response::ResponseError;

/// Generate HS256 hashed password from text password.
pub fn generate_hashed_password(password: &TextPassword) -> Result<HashedPassword, ResponseError> {
    let env = Env::get_env();
    let config = Config::default();
    let password = password.as_str().as_bytes();
    let salt = env.hash_salt.as_bytes();
    let hash = argon2::hash_encoded(password, salt, &config)?;
    let hashed_password = HashedPassword::new(&hash);
    Ok(hashed_password)
}

/// Verify password submitted by user at login with HS256 hashed password stored in db.
pub fn verify_hashed_password_and_password(
    hashed_password: &HashedPassword,
    password: &TextPassword,
) -> Result<(), ResponseError> {
    let verify = argon2::verify_encoded(hashed_password.as_str(), password.as_str().as_bytes());
    match verify {
        Ok(true) => Ok(()),
        Ok(false) => Err(ResponseError::Argon2(Error::DecodingFail)),
        Err(err) => Err(ResponseError::Argon2(err)),
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn generate_hashed_password_from_password_ok() {
        let password = "secretPassword";
        let text_password = TextPassword::new(password);
        let result = generate_hashed_password(&text_password);
        assert!(result.is_ok());
    }

    #[test]
    fn verify_password_and_hashed_password_ok() {
        let password = "secretPassword";
        let text_password = TextPassword::new(password);
        let hashed_password = generate_hashed_password(&text_password).unwrap();
        let result = verify_hashed_password_and_password(&hashed_password, &text_password);
        assert!(result.is_ok());
    }

    #[test]
    fn verify_password_and_hashed_password_err() {
        let password = "secretPassword";
        let text_password = TextPassword::new(password);
        let hashed_password = "$2b$12$OaGlXlV/drI7Zdf4kX32YOU6OZIO9I4hWWkx/TNybgI9tBsP/6EM6";
        let result = verify_hashed_password_and_password(&HashedPassword::new(hashed_password), &text_password);
        assert!(matches!(result, Err(ResponseError::Argon2(_))));
    }
}
