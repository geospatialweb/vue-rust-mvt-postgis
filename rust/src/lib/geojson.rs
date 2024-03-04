use geojson::{Error, Feature, FeatureCollection};
use sqlx::FromRow;
use std::str::FromStr;

use super::response::ResponseError;

#[derive(Debug, FromRow, PartialEq)]
/// Struct containing json string formatted as a GeoJSON feature from PostGIS query.
pub struct JsonFeature {
    pub feature: String,
}

/// Create GeoJSON feature collection from a vector of GeoJSON features.
pub fn create_feature_collection(json_features: &[JsonFeature]) -> Result<FeatureCollection, ResponseError> {
    let features = create_geojson_features(json_features)?;
    let fc = FeatureCollection {
        bbox: None,
        features,
        foreign_members: None,
    };
    Ok(fc)
}

/// Create vector of GeoJSON features from a slice of json feature strings formatted as a GeoJSON feature.
fn create_geojson_features(json_features: &[JsonFeature]) -> Result<Vec<Feature>, Error> {
    json_features
        .iter()
        .map(|json_feature| Feature::from_str(&json_feature.feature))
        .collect()
}

#[cfg(test)]
mod test {
    use super::*;

    fn create_feature() -> String {
        let feature = r#"{"geometry":{"coordinates":[-76.011422,44.384362],"type":"Point"},"properties":{"description":"19 Reynolds Road, Lansdowne, ON. Open Monday to Friday 8:30am - 4:30pm","name":"Frontenac Arch Biosphere Office"},"type":"Feature"}"#;
        feature.to_string()
    }

    fn create_json_features(feature: &str) -> Vec<JsonFeature> {
        let json_feature = JsonFeature {
            feature: feature.to_owned(),
        };
        vec![json_feature]
    }

    #[test]
    fn create_geojson_feature_collection_ok() {
        let feature = create_feature();
        let json_features = create_json_features(&feature);
        let result = create_feature_collection(&json_features);
        let fc = r#"{"features":[{"geometry":{"coordinates":[-76.011422,44.384362],"type":"Point"},"properties":{"description":"19 Reynolds Road, Lansdowne, ON. Open Monday to Friday 8:30am - 4:30pm","name":"Frontenac Arch Biosphere Office"},"type":"Feature"}],"type":"FeatureCollection"}"#;
        let expected_fc = FeatureCollection::from_str(fc).unwrap();
        assert_eq!(result.unwrap(), expected_fc);
    }

    #[test]
    fn create_geojson_feature_collection_err() {
        let feature = create_feature().replace("Feature", "FeatureCollection");
        let json_features = create_json_features(&feature);
        let result = create_feature_collection(&json_features);
        assert!(matches!(result, Err(ResponseError::GeoJson(..))));
    }

    #[test]
    fn create_geojson_features_ok() {
        let feature = create_feature();
        let json_features = create_json_features(&feature);
        let result = create_geojson_features(&json_features);
        let expected_geojson_feature = Feature::from_str(&feature).unwrap();
        let expected_geojson_features = vec![expected_geojson_feature];
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), expected_geojson_features);
    }

    #[test]
    fn create_geojson_features_err() {
        let feature = create_feature().replace("Feature", "FeatureCollection");
        let json_features = create_json_features(&feature);
        let result = create_geojson_features(&json_features);
        assert!(matches!(result, Err(..)));
    }
}
