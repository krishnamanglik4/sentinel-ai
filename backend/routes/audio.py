from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from database.connection import get_db
from database import crud
from services.audio_analyzer import AudioAnalyzer
from schemas.analysis import AnalysisResultSchema
from utils.file_validation import validate_and_save_file
from utils.security import get_current_user_optional

router = APIRouter(prefix="/api/analyze", tags=["Audio Voice Scanner"])

@router.post("/audio", response_model=AnalysisResultSchema)
async def analyze_audio(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_optional)
):
    try:
        saved_path, original_name = validate_and_save_file(file, category="audio")
        result = AudioAnalyzer.analyze_audio(saved_path, original_name)
        
        user_id = current_user.id if current_user else None
        db_scan = crud.create_scan(db, result, user_id=user_id)
        
        result["id"] = db_scan.id
        result["created_at"] = db_scan.created_at.isoformat()
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio analysis failed: {str(e)}")
