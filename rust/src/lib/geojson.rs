use geojson::{Error, Feature, FeatureCollection};
use sqlx::FromRow;
use std::str::FromStr;
use tracing::error;

#[derive(Debug, FromRow)]
pub struct JsonFeature {
    pub feature: String,
}

#[rustfmt::skip]
pub fn create_feature_collection(json_features: &[JsonFeature]) -> FeatureCollection {
    let features = create_features(json_features);
    match features {
        Ok(features) => {
            FeatureCollection {
                bbox: None,
                features,
                foreign_members: None,
            }
        },
        Err(err) => {
            error!("geojson feature creation failure: {}", &err);
            FeatureCollection {
                bbox: None,
                features: vec![],
                foreign_members: None,
            }
        }
    }
}

fn create_features(json_features: &[JsonFeature]) -> Result<Vec<Feature>, Error> {
    json_features
        .iter()
        .map(|json_feature| Feature::from_str(json_feature.feature.as_str()))
        .collect()
}
