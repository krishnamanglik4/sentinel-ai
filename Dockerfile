# Dockerfile for Sentinel AI Production Deployment
FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive \
    PORT=8000

WORKDIR /app

# Install system dependencies for OpenCV and PyMuPDF
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1-mesa-glx \
    libglib2.0-0 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements & install dependencies
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt email-validator

# Copy backend & frontend built dist
COPY backend /app/backend
COPY frontend/dist /app/frontend/dist

WORKDIR /app/backend

EXPOSE 8000

CMD ["python", "main.py"]
