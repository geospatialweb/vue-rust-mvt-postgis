use garde::Validate;
use serde::Deserialize;

/// URL query layer params.
#[derive(Debug, Deserialize, Validate)]
pub struct LayerParams {
    #[garde(ascii)]
    pub columns: String,
    #[garde(ascii)]
    pub table: String,
}
