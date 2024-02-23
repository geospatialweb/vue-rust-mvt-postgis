use geojson::{Error, Feature, FeatureCollection};
use sqlx::FromRow;
use std::str::FromStr;

#[derive(Debug, FromRow)]
pub struct JsonFeature {
    feature: String,
}

/// Create GeoJSON feature collection from a vector of GeoJSON features.
pub fn create_feature_collection(json_features: &[JsonFeature]) -> Result<FeatureCollection, Error> {
    let features = create_geojson_features(json_features)?;
    let fc = FeatureCollection {
        bbox: None,
        features,
        foreign_members: None,
    };
    Ok(fc)
}

/// Create vector of GeoJSON features from a slice of json strings formatted as GeoJSON features from PostGIS query.
fn create_geojson_features(json_features: &[JsonFeature]) -> Result<Vec<Feature>, Error> {
    json_features
        .iter()
        .map(|json_feature| Feature::from_str(json_feature.feature.as_str()))
        .collect()
}
