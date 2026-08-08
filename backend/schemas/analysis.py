from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class URLScanRequest(BaseModel):
    url: str

class TextScanRequest(BaseModel):
    message: str

class SignalItem(BaseModel):
    name: str
    weight: float # 0.0 to 1.0
    detected: bool
    description: str

class AnalysisResultSchema(BaseModel):
    id: Optional[str] = None
    scan_type: str
    input_summary: str
    risk_score: int # 0-100
    trust_score: int # 0-100
    threat_level: str # SAFE, LOW, MEDIUM, HIGH, CRITICAL
    threat_type: str
    confidence: float # 0.0-1.0
    signals: List[Dict[str, Any]]
    explanation: Dict[str, Any]
    recommended_action: str
    metadata_info: Optional[Dict[str, Any]] = None
    created_at: Optional[str] = None

class ScanListResponse(BaseModel):
    items: List[AnalysisResultSchema]
    total: int
    page: int
    size: int
