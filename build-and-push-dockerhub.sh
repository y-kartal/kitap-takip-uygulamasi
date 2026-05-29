#!/bin/bash

# Docker Hub'a image'ları build ve push etme scripti

# Değişkenler
DOCKERHUB_USERNAME="ykartal"  # Docker Hub kullanıcı adınızı buraya yazın
VERSION="v2.0"

# Image isimleri
BACKEND_IMAGE="${DOCKERHUB_USERNAME}/kitap-backend:${VERSION}"
FRONTEND_IMAGE="${DOCKERHUB_USERNAME}/kitap-frontend:${VERSION}"
BACKEND_LATEST="${DOCKERHUB_USERNAME}/kitap-backend:latest"
FRONTEND_LATEST="${DOCKERHUB_USERNAME}/kitap-frontend:latest"

echo "🔨 Building Docker images..."

# Backend build
echo "📦 Building backend..."
docker build -t ${BACKEND_IMAGE} -t ${BACKEND_LATEST} ./backend

# Frontend build
echo "📦 Building frontend..."
docker build -t ${FRONTEND_IMAGE} -t ${FRONTEND_LATEST} \
  --build-arg REACT_APP_API_URL=/api \
  ./frontend

echo "✅ Build completed!"
echo ""
echo "🚀 Pushing images to Docker Hub..."
echo "⚠️  Make sure you're logged in: docker login"
echo ""

# Push images
docker push ${BACKEND_IMAGE}
docker push ${BACKEND_LATEST}
docker push ${FRONTEND_IMAGE}
docker push ${FRONTEND_LATEST}

echo "✅ All images pushed successfully!"
echo ""
echo "📋 Images:"
echo "  Backend:  ${BACKEND_IMAGE}"
echo "  Frontend: ${FRONTEND_IMAGE}"
echo ""
echo "🌐 Docker Hub:"
echo "  https://hub.docker.com/r/${DOCKERHUB_USERNAME}/kitap-backend"
echo "  https://hub.docker.com/r/${DOCKERHUB_USERNAME}/kitap-frontend"
