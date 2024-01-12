start:
	@cd rust; docker-compose up -d
	@cd client; make start
