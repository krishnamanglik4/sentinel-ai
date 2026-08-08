from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import get_db
from database import crud
from services.text_analyzer import TextAnalyzer
from schemas.analysis import TextScanRequest, AnalysisResultSchema
from utils.security import get_current_user_optional

router = APIRouter(prefix="/api/analyze", tags=["Message Scanner"])

@router.post("/text", response_model=AnalysisResultSchema)
def analyze_text(
    payload: TextScanRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_optional)
):
    if not payload.message or not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message body cannot be empty")

    try:
        result = TextAnalyzer.analyze_text(payload.message)
        
        user_id = current_user.id if current_user else None
        db_scan = crud.create_scan(db, result, user_id=user_id)
        
        result["id"] = db_scan.id
        result["created_at"] = db_scan.created_at.isoformat()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text message analysis failed: {str(e)}")
