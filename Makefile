.PHONY: help build up down logs clean restart ps status test

help:
	@echo "Smart Farmer AI - Docker Commands"
	@echo "=================================="
	@echo ""
	@echo "Available commands:"
	@echo "  make build       - Build Docker image"
	@echo "  make up          - Start containers"
	@echo "  make down        - Stop containers"
	@echo "  make logs        - View container logs"
	@echo "  make restart     - Restart containers"
	@echo "  make clean       - Remove containers and images"
	@echo "  make ps          - List running containers"
	@echo "  make status      - Show container health status"
	@echo "  make shell       - Open shell in container"
	@echo ""

build:
	@echo "Building Docker image..."
	docker-compose build

up:
	@echo "Starting containers..."
	docker-compose up -d
	@echo "✓ App running at http://localhost:3000"

down:
	@echo "Stopping containers..."
	docker-compose down

logs:
	docker-compose logs -f

restart:
	@echo "Restarting containers..."
	docker-compose down
	docker-compose up -d
	@echo "✓ Containers restarted"

clean:
	@echo "Cleaning up Docker resources..."
	docker-compose down -v
	docker system prune -f
	@echo "✓ Cleaned up"

ps:
	docker-compose ps

status:
	docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

shell:
	docker-compose exec smart-farmer sh

test:
	@echo "Running health check..."
	docker-compose exec smart-farmer wget --quiet --tries=1 --spider http://localhost:3000 && echo "✓ Health check passed" || echo "✗ Health check failed"

.DEFAULT_GOAL := help
