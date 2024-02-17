app:
	@docker-compose up -d
	@cd client; make start
