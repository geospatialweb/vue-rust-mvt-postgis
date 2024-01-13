# syntax=docker/dockerfile:1
FROM rust:bookworm AS builder
WORKDIR /usr/src/app
COPY . .
# Build statically-linked binary and cache dependent crates
RUN --mount=type=cache,target=/usr/local/cargo,from=rust:bookworm,source=/usr/local/cargo \
    --mount=type=cache,target=target \
    cargo build --bin main --release && mv ./target/release/main .

FROM debian:bookworm-slim AS app
WORKDIR /usr/src/app
RUN useradd -s /bin/bash app
USER app
COPY --from=builder /usr/src/app/.env .
COPY --from=builder /usr/src/app/main .
CMD ["./main"]
