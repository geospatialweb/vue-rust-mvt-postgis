# FROM rust:bookworm AS builder
# WORKDIR /usr/src/app
# COPY Cargo.* .
# RUN cargo fetch
# COPY . .
# RUN cargo build --bin main --release

# FROM debian:bookworm-slim
# WORKDIR /app
# COPY --from=builder /usr/src/app/.env .
# COPY --from=builder /usr/src/app/target/release/main .
# EXPOSE 8000
# CMD ./main

FROM rust:latest as builder
WORKDIR /usr/src/app
COPY . .
# Will build & cache the binary and dependent crates in release mode
RUN --mount=type=cache,target=/usr/local/cargo,from=rust:latest,source=/usr/local/cargo \
    --mount=type=cache,target=target \
    cargo build --bin main --release && mv ./target/release/main .

FROM debian:bookworm-slim
RUN useradd -ms /bin/bash app
USER app
WORKDIR /app
COPY --from=builder /usr/src/app/.env .
COPY --from=builder /usr/src/app/main .
EXPOSE 8000
CMD ./main
