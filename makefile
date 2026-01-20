.PHONY: help up down build rebuild fresh logs clean prod-deploy

# PROD
prod-deploy:
	sudo docker compose -f down && sudo docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
# DEV
up:
	docker-compose --env-file .env.development -f docker-compose.dev.yml up -d

down:
	docker-compose --env-file .env.development -f docker-compose.dev.yml down

clean:
	docker-compose --env-file .env.development -f docker-compose.dev.yml down -v

build:
	docker-compose --env-file .env.development -f docker-compose.dev.yml up -d --build

fresh: clean build


# EXAMPLE
example-deploy:
	sudo docker compose --env-file .env.example -f docker-compose.example.yml down && sudo docker compose --env-file .env.example -f docker-compose.example.yml up -d --build