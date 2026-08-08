from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from database.connection import get_db
from database import crud
from services.video_analyzer import VideoAnalyzer
from schemas.analysis import AnalysisResultSchema
from utils.file_validation import validate_and_save_file
from utils.security import get_current_user_optional

router = APIRouter(prefix="/api/analyze", tags=["Video Deepfake Scanner"])

@router.post("/video", response_model=AnalysisResultSchema)
async def analyze_video(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_optional)
):
    try:
        saved_path, original_name = validate_and_save_file(file, category="video")
        result = VideoAnalyzer.analyze_video(saved_path, original_name)
        
        user_id = current_user.id if current_user else None
        db_scan = crud.create_scan(db, result, user_id=user_id)
        
        result["id"] = db_scan.id
        result["created_at"] = db_scan.created_at.isoformat()
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Video analysis failed: {str(e)}")
