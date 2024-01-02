# syntax=docker/dockerfile:1.4
FROM rust:buster AS builder
WORKDIR /app
COPY Cargo.toml .
RUN cargo fetch
COPY . .
RUN cargo build --bin main --release --offline

FROM alpine:latest AS app
WORKDIR /app
COPY --from=builder /app/.env .
COPY --from=builder /app/target/release/main .
EXPOSE 8000
