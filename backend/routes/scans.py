from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database.connection import get_db
from database import crud
from schemas.analysis import AnalysisResultSchema, ScanListResponse
from utils.security import get_current_user_optional, get_current_user

router = APIRouter(prefix="/api/scans", tags=["Scan History & Analytics"])

@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_optional)
):
    user_id = current_user.id if current_user else None
    return crud.get_dashboard_stats(db, user_id=user_id)

@router.get("", response_model=ScanListResponse)
def get_scan_history(
    scan_type: Optional[str] = Query(None),
    threat_level: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_optional)
):
    user_id = current_user.id if current_user else None
    skip = (page - 1) * size
    items, total = crud.get_scans(
        db,
        user_id=user_id,
        scan_type=scan_type,
        threat_level=threat_level,
        search=search,
        skip=skip,
        limit=size
    )

    formatted_items = []
    for item in items:
        formatted_items.append({
            "id": item.id,
            "scan_type": item.scan_type,
            "input_summary": item.input_summary,
            "risk_score": item.risk_score,
            "trust_score": item.trust_score,
            "threat_level": item.threat_level,
            "threat_type": item.threat_type,
            "confidence": item.confidence,
            "signals": item.signals,
            "explanation": item.explanation,
            "recommended_action": item.recommended_action,
            "metadata_info": item.metadata_info,
            "created_at": item.created_at.isoformat() if item.created_at else None
        })

    return {
        "items": formatted_items,
        "total": total,
        "page": page,
        "size": size
    }

@router.get("/{scan_id}", response_model=AnalysisResultSchema)
def get_scan_detail(
    scan_id: str,
    db: Session = Depends(get_db)
):
    item = crud.get_scan_by_id(db, scan_id)
    if not item:
        raise HTTPException(status_code=404, detail="Scan record not found")
    
    return {
        "id": item.id,
        "scan_type": item.scan_type,
        "input_summary": item.input_summary,
        "risk_score": item.risk_score,
        "trust_score": item.trust_score,
        "threat_level": item.threat_level,
        "threat_type": item.threat_type,
        "confidence": item.confidence,
        "signals": item.signals,
        "explanation": item.explanation,
        "recommended_action": item.recommended_action,
        "metadata_info": item.metadata_info,
        "created_at": item.created_at.isoformat() if item.created_at else None
    }

@router.delete("/{scan_id}")
def delete_scan_record(
    scan_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_optional)
):
    user_id = current_user.id if current_user else None
    deleted = crud.delete_scan(db, scan_id=scan_id, user_id=user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Scan record not found or unauthorized")
    return {"message": "Scan record deleted successfully"}
