/// Mapbox access token originally stored in .env file.
#[derive(Debug, Clone)]
pub struct MapboxAccessToken {
    pub access_token: String,
}

impl MapboxAccessToken {
    /// Create new MapboxAccessToken.
    pub fn new(access_token: &str) -> Self {
        Self {
            access_token: access_token.to_owned(),
        }
    }
}
