use super::handler::hello_world;
use salvo::prelude::Router;

pub fn new() -> Router {
    Router::new().get(hello_world)
}
