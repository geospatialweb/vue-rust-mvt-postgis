compose:
	@docker-compose up -d

start:
	@make compose
	@cd client; make start
