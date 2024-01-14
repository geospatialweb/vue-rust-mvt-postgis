use geojson::{Error, Feature, FeatureCollection};
use sqlx::FromRow;
use std::str::FromStr;
use tracing::error;

#[derive(Debug, FromRow)]
pub struct JsonFeature {
    feature: String,
}

#[rustfmt::skip]
/// Create GeoJSON feature collection from a vector of GeoJSON features.
pub fn create_feature_collection(json_features: &[JsonFeature]) -> FeatureCollection {
    let features = create_geojson_features(json_features);
    match features {
        Ok(features) => {
            FeatureCollection {
                bbox: None,
                features,
                foreign_members: None,
            }
        },
        Err(err) => {
            error!("create_geojson_features error: {}", &err);
            FeatureCollection {
                bbox: None,
                features: vec![],
                foreign_members: None,
            }
        }
    }
}

/// Create vector of GeoJSON features from a vector of json strings formatted as GeoJSON features from PostGIS query.
fn create_geojson_features(json_features: &[JsonFeature]) -> Result<Vec<Feature>, Error> {
    json_features
        .iter()
        .map(|json_feature| Feature::from_str(json_feature.feature.as_str()))
        .collect()
}
