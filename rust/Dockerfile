# syntax=docker/dockerfile:1.6
FROM rust:buster AS builder
WORKDIR /build
COPY . .
RUN cargo install --path .
RUN cargo build --bin main --release --offline

FROM alpine:latest AS app
COPY --from=builder /build/.env .
COPY --from=builder /build/target/release/main .
EXPOSE 8000
