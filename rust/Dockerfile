# syntax=docker/dockerfile:1
FROM rust:bookworm AS builder
WORKDIR /usr/src/app
COPY . .
# Build statically-linked binary in release mode & cache dependent crates for subsequent builds
RUN --mount=type=cache,target=/usr/local/cargo,from=rust:bookworm,source=/usr/local/cargo \
    --mount=type=cache,target=target \
    cargo build --bin main --release && mv ./target/release/main .

FROM debian:bookworm-slim AS app
WORKDIR /usr/local/bin
COPY --from=builder /usr/src/app/.env .
COPY --from=builder /usr/src/app/main .
RUN useradd -ms /bin/bash app
USER app
CMD ["./main"]
