# syntax=docker/dockerfile:1
FROM rust:bookworm AS builder
WORKDIR /usr/src/app
ENV USER=app
ENV UID=1000
RUN adduser \
    --gecos "" \
    --disabled-password \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    "${USER}"
COPY . .
# Build statically-linked binary and cache dependent crates
RUN --mount=type=cache,target=/usr/local/cargo,from=rust:bookworm,source=/usr/local/cargo \
    --mount=type=cache,target=target \
    cargo build --bin main --release && mv ./target/release/main .

FROM gcr.io/distroless/cc-debian12 AS app
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/.env .
COPY --from=builder /usr/src/app/main .
COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /etc/group /etc/group
USER app:app
CMD ["./main"]
