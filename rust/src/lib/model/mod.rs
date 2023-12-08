use salvo::macros::Extractible;
use serde::{Deserialize, Serialize};

#[derive(Debug, Extractible, Deserialize, Serialize)]
#[salvo(extract(default_source(from = "query")))]
pub struct LayerParams {
    columns: String,
    table: String,
}

#[derive(Debug, Extractible, Deserialize, Serialize)]
#[salvo(extract(default_source(from = "query"), default_source(from = "body")))]
pub struct User {
    password: Option<String>,
    username: String,
}
