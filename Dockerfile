# Dockerfile for Sentinel AI Cloud Deployment
FROM python:3.10-slim

ENV PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive \
    PORT=8000

WORKDIR /app

# Install system libraries for OpenCV and PyMuPDF
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements & install dependencies
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir --prefer-binary -r /app/backend/requirements.txt

# Copy backend & frontend built dist
COPY backend /app/backend
COPY frontend/dist /app/frontend/dist

WORKDIR /app/backend

EXPOSE 8000

CMD ["python", "main.py"]
