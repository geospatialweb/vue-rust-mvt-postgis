compose:
	@docker-compose up -d --build

start:
	@make compose
	@cd client; make start
