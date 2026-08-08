from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import get_db
from database import crud
from services.url_analyzer import URLAnalyzer
from schemas.analysis import URLScanRequest, AnalysisResultSchema
from utils.security import get_current_user_optional

router = APIRouter(prefix="/api/analyze", tags=["URL Scanner"])

@router.post("/url", response_model=AnalysisResultSchema)
def analyze_url(
    payload: URLScanRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_optional)
):
    if not payload.url or not payload.url.strip():
        raise HTTPException(status_code=400, detail="URL field cannot be empty")

    try:
        result = URLAnalyzer.analyze_url(payload.url)
        
        user_id = current_user.id if current_user else None
        db_scan = crud.create_scan(db, result, user_id=user_id)
        
        result["id"] = db_scan.id
        result["created_at"] = db_scan.created_at.isoformat()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"URL analysis failed: {str(e)}")
