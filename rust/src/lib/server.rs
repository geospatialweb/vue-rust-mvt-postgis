#![cfg_attr(rustfmt, rustfmt_skip)]

use salvo::catcher::Catcher;
use salvo::conn::rustls::{Keycert, RustlsConfig};
use salvo::prelude::{Listener, Server, Service, TcpListener};
use tokio::time::{sleep, Duration};

use super::env::Env;
use super::router;

#[tracing::instrument]
pub async fn start() {
    let env: Env = Default::default();
    let host = format!("{}:{}", &env.server_host, &env.server_port);
    let service = Service::new(router::new())
        .catcher(Catcher::default()
            .hoop(router::handle_cors())
    );
    if env.app_mode == env.app_mode_dev {
        Server::new(TcpListener::new(&host)
            .bind()
            .await
        )
            .serve(service)
            .await;
    } else if env.app_mode == env.app_mode_prod {
        let config = RustlsConfig::new(
            Keycert::new()
                .cert(env.ssl_cert)
                .key(env.ssl_key)
        );
        let server = Server::new(TcpListener::new(&host)
            .rustls(config)
            .bind()
            .await
        );
        let handle = server.handle();
        /* graceful shutdown */
        tokio::spawn(async move {
            let secs = env.server_sleep_duration.parse::<u64>().unwrap();
            sleep(Duration::from_secs(secs)).await;
            handle.stop_graceful(None);
        });
        server
            .serve(service)
            .await;
    }
}
