import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from database.connection import engine, Base
from routes import auth, image, url, text, audio, video, scans

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sentinel AI - Digital Scam & Deepfake Detection Engine API",
    description="AI-powered digital safety platform for media forensics, deepfake detection, phishing analysis, and scam message classification.",
    version="1.0.0"
)

# CORS Middleware
origins_env = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,*")
origins = [o.strip() for o in origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory exists & serve static uploaded media
upload_dir = os.getenv("UPLOAD_DIR", "uploads")
os.makedirs(upload_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")

# Include API Routers
app.include_router(auth.router)
app.include_router(image.router)
app.include_router(url.router)
app.include_router(text.router)
app.include_router(audio.router)
app.include_router(video.router)
app.include_router(scans.router)

@app.get("/api/health", tags=["Health Check"])
def health_check():
    return {
        "status": "healthy",
        "service": "Sentinel AI Engine Backend",
        "version": "1.0.0",
        "database": "connected"
    }

# Production SPA Frontend Catch-All Serving
frontend_dist = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    if full_path.startswith("api/"):
        raise HTTPException(status_code=404, detail="API endpoint not found")
    
    file_path = os.path.join(frontend_dist, full_path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    
    index_file = os.path.join(frontend_dist, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    
    return {"detail": "Frontend index.html not found"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
