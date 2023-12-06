use salvo::prelude::{handler, Response};

#[handler]
pub async fn hello_world(res: &mut Response) {
    res.render("Hello World");
}
