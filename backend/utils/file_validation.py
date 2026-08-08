import os
import uuid
from fastapi import UploadFile, HTTPException

MAX_FILE_SIZE_MB = 50
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".pdf"}
ALLOWED_AUDIO_EXTENSIONS = {".mp3", ".wav", ".ogg", ".m4a", ".flac"}
ALLOWED_VIDEO_EXTENSIONS = {".mp4", ".avi", ".mov", ".mkv", ".webm"}

def validate_and_save_file(file: UploadFile, category: str, upload_dir: str = "uploads") -> tuple[str, str]:
    if not file.filename:
        raise HTTPException(status_code=400, detail="Empty filename provided")
    
    ext = os.path.splitext(file.filename)[1].lower()
    
    if category == "image":
        if ext not in ALLOWED_IMAGE_EXTENSIONS:
            raise HTTPException(status_code=400, detail=f"Unsupported image extension '{ext}'. Allowed: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}")
    elif category == "audio":
        if ext not in ALLOWED_AUDIO_EXTENSIONS:
            raise HTTPException(status_code=400, detail=f"Unsupported audio extension '{ext}'. Allowed: {', '.join(ALLOWED_AUDIO_EXTENSIONS)}")
    elif category == "video":
        if ext not in ALLOWED_VIDEO_EXTENSIONS:
            raise HTTPException(status_code=400, detail=f"Unsupported video extension '{ext}'. Allowed: {', '.join(ALLOWED_VIDEO_EXTENSIONS)}")
    else:
        raise HTTPException(status_code=400, detail="Invalid upload category")

    os.makedirs(upload_dir, exist_ok=True)
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    target_path = os.path.join(upload_dir, unique_filename)

    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)

    if file_size > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File exceeds maximum allowed size of {MAX_FILE_SIZE_MB}MB")

    with open(target_path, "wb") as f:
        f.write(file.file.read())

    return target_path, file.filename
