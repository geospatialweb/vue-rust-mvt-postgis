use geojson::{Error, Feature, FeatureCollection};
use sqlx::FromRow;
use std::str::FromStr;
use tracing::warn;

use super::response::ResponseError;

/// Json string formatted as a GeoJSON feature from PostGIS query.
#[derive(Debug, FromRow, PartialEq)]
pub struct JsonFeature {
    pub feature: String,
}

/// Create GeoJSON feature collection from a vector of GeoJSON features.
pub fn create_feature_collection(json_features: &[JsonFeature]) -> Result<FeatureCollection, ResponseError> {
    if !json_features.is_empty() {
        let features = create_geojson_features(json_features)?;
        let fc = FeatureCollection {
            bbox: None,
            features,
            foreign_members: None,
        };
        Ok(fc)
    } else {
        let fc = FeatureCollection {
            bbox: None,
            features: vec![],
            foreign_members: None,
        };
        warn!("no json features returned from sql query");
        Ok(fc)
    }
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

    impl JsonFeature {
        pub fn new(feature: &str) -> Self {
            Self {
                feature: feature.to_owned(),
            }
        }
    }

    fn create_feature() -> String {
        String::from(
            r#"{"geometry":{"coordinates":[-76.011422,44.384362],"type":"Point"},"properties":{"description":"19 Reynolds Road, Lansdowne, ON. Open Monday to Friday 8:30am - 4:30pm","name":"Frontenac Arch Biosphere Office"},"type":"Feature"}"#
        )
    }

    #[test]
    fn create_geojson_feature_collection_ok() {
        let feature = create_feature();
        let json_features = vec![JsonFeature::new(&feature)];
        let fc = r#"{"features":[{"geometry":{"coordinates":[-76.011422,44.384362],"type":"Point"},"properties":{"description":"19 Reynolds Road, Lansdowne, ON. Open Monday to Friday 8:30am - 4:30pm","name":"Frontenac Arch Biosphere Office"},"type":"Feature"}],"type":"FeatureCollection"}"#;
        let expected_fc = FeatureCollection::from_str(fc).unwrap();
        let result = create_feature_collection(&json_features);
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), expected_fc);
    }

    #[test]
    fn create_geojson_feature_collection_no_features() {
        let json_features = vec![];
        let expected_fc = FeatureCollection {
            bbox: None,
            features: vec![],
            foreign_members: None,
        };
        let result = create_feature_collection(&json_features);
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), expected_fc);
    }

    #[test]
    fn create_geojson_features_ok() {
        let feature = create_feature();
        let json_features = vec![JsonFeature::new(&feature)];
        let geojson_feature = Feature::from_str(&feature).unwrap();
        let expected_geojson_features = vec![geojson_feature];
        let result = create_geojson_features(&json_features);
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), expected_geojson_features);
    }

    #[test]
    fn create_geojson_features_err() {
        let feature = create_feature().replace("Feature", "FeatureCollection");
        let json_features = vec![JsonFeature::new(&feature)];
        let result = create_geojson_features(&json_features);
        assert!(matches!(result, Err(_)));
    }
}
