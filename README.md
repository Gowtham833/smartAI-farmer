# Smart Farmer AI - Docker Setup

A React-based agricultural assistant application for Indian farmers, containerized with Docker.

## 📋 Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/) (v1.29+)
- Node.js 18+ (optional, for local development)

## 🚀 Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
docker-compose up --build
```

The app will be available at `http://localhost:3000`

### Option 2: Using Docker CLI

**Build the image:**
```bash
docker build -t smart-farmer-ai .
```

**Run the container:**
```bash
docker run -p 3000:3000 smart-farmer-ai
```

## 📦 Project Structure

```
.
├── Dockerfile                 # Multi-stage Docker build configuration
├── docker-compose.yml        # Docker Compose orchestration
├── .dockerignore             # Files to exclude from Docker context
├── .gitignore                # Git ignore patterns
├── package.json              # Node.js dependencies
├── public/
│   └── index.html           # Main HTML entry point
├── src/
│   ├── App.jsx              # Main React component
│   └── index.js             # React DOM initialization
└── README.md                # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file (optional):
```env
NODE_ENV=production
REACT_APP_API_URL=https://api.anthropic.com
```

### Ports

- Default: `3000`
- Custom: Modify `ports` in `docker-compose.yml` or use `-p` flag:
  ```bash
  docker run -p 8080:3000 smart-farmer-ai
  ```

## 📜 Available Commands

### Docker Compose
```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild images
docker-compose up --build
```

### Docker CLI
```bash
# Build image
docker build -t smart-farmer-ai .

# Run container
docker run -p 3000:3000 smart-farmer-ai

# View running containers
docker ps

# View logs
docker logs <container_id>

# Stop container
docker stop <container_id>

# Remove image
docker rmi smart-farmer-ai
```

## 🏥 Health Check

The container includes a built-in health check:
- Runs every 30 seconds
- Timeout: 3 seconds
- Fails after 3 consecutive failures
- Starts checking after 5 seconds

Check status:
```bash
docker ps --format "{{.Names}}\t{{.Status}}"
```

## 📱 Features

- **Multi-language Support**: English, Hindi, Telugu
- **Crop Advisory**: AI-powered crop recommendations based on soil type
- **Disease Detection**: Leaf photo analysis for disease identification
- **Market Platform**: Direct buyer-farmer marketplace
- **Equipment Rental**: Farm equipment sharing system
- **Community Forum**: Farmer discussion and knowledge sharing
- **AI Assistant**: Voice-enabled chatbot for farming tips
- **Weather Integration**: Real-time weather updates

## 🔐 Security Notes

- Container runs as non-root user
- Sensitive data should use environment variables
- Add API keys to `.env` file (not committed to git)
- Use secrets management for production deployments

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Use different port
docker run -p 8080:3000 smart-farmer-ai

# Or kill existing process
# On Windows: netstat -ano | findstr :3000
# On Unix: lsof -i :3000
```

### Build Issues
```bash
# Clear Docker cache
docker system prune -a

# Rebuild
docker-compose up --build
```

### Memory/Resource Issues
Limit resources in `docker-compose.yml`:
```yaml
services:
  smart-farmer:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
```

## 📦 Build Information

- **Base Image**: `node:18-alpine` (lightweight)
- **Build Stage**: Compile React app with dependencies
- **Production Stage**: Serve optimized build with `serve`
- **Image Size**: ~250MB (optimized with multi-stage build)

## 🚀 Production Deployment

For production, consider:
1. Using a reverse proxy (nginx)
2. Adding SSL/TLS certificates
3. Setting up logging and monitoring
4. Using environment-specific configurations
5. Implementing rate limiting and CORS policies

Example nginx configuration available on request.

## 📄 License

[Your License Here]

## 👨‍💻 Support

For issues or questions:
1. Check Docker logs: `docker-compose logs`
2. Verify network connectivity
3. Ensure Node.js dependencies are installed
4. Check port availability

---

**Happy Farming! 🌾**
