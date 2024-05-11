app:
	@docker-compose up -d
	@cd vue; make start
