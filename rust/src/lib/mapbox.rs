use serde::Serialize;

/// Mapbox access token originally stored in .env file.
#[derive(Debug, Clone, Serialize)]
pub struct MapboxAccessToken {
    pub token: String,
}

impl MapboxAccessToken {
    /// Create new MapboxAccessToken.
    pub fn new(token: &str) -> Self {
        Self {
            token: token.to_owned(),
        }
    }
}
