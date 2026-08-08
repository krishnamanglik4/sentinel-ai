from sqlalchemy.orm import Session
from sqlalchemy import desc
from . import models

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email.lower()).first()

def get_user_by_id(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, email: str, password_hash: str, full_name: str):
    db_user = models.User(
        email=email.lower(),
        hashed_password=password_hash,
        full_name=full_name
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_scan(db: Session, scan_data: dict, user_id: str = None):
    db_scan = models.Scan(
        user_id=user_id,
        scan_type=scan_data.get("scan_type"),
        input_summary=scan_data.get("input_summary"),
        risk_score=scan_data.get("risk_score"),
        trust_score=scan_data.get("trust_score"),
        threat_level=scan_data.get("threat_level"),
        threat_type=scan_data.get("threat_type"),
        confidence=scan_data.get("confidence"),
        signals=scan_data.get("signals"),
        explanation=scan_data.get("explanation"),
        recommended_action=scan_data.get("recommended_action"),
        metadata_info=scan_data.get("metadata_info", {})
    )
    db.add(db_scan)
    db.commit()
    db.refresh(db_scan)
    return db_scan

def get_scans(
    db: Session,
    user_id: str = None,
    scan_type: str = None,
    threat_level: str = None,
    search: str = None,
    skip: int = 0,
    limit: int = 50
):
    query = db.query(models.Scan)
    if user_id:
        query = query.filter(models.Scan.user_id == user_id)
    if scan_type:
        query = query.filter(models.Scan.scan_type == scan_type)
    if threat_level:
        query = query.filter(models.Scan.threat_level == threat_level)
    if search:
        query = query.filter(
            (models.Scan.input_summary.ilike(f"%{search}%")) |
            (models.Scan.threat_type.ilike(f"%{search}%"))
        )
    total = query.count()
    items = query.order_by(desc(models.Scan.created_at)).offset(skip).limit(limit).all()
    return items, total

def get_scan_by_id(db: Session, scan_id: str):
    return db.query(models.Scan).filter(models.Scan.id == scan_id).first()

def delete_scan(db: Session, scan_id: str, user_id: str = None):
    query = db.query(models.Scan).filter(models.Scan.id == scan_id)
    if user_id:
        query = query.filter(models.Scan.user_id == user_id)
    scan = query.first()
    if scan:
        db.delete(scan)
        db.commit()
        return True
    return False

def get_dashboard_stats(db: Session, user_id: str = None):
    query = db.query(models.Scan)
    if user_id:
        query = query.filter(models.Scan.user_id == user_id)
    
    scans = query.all()
    total_scans = len(scans)
    
    if total_scans == 0:
        return {
            "overall_security_score": 100,
            "total_scans": 0,
            "threats_detected": 0,
            "safe_scans": 0,
            "critical_threats": 0,
            "threat_distribution": [],
            "risk_distribution": []
        }
    
    safe_scans = sum(1 for s in scans if s.threat_level == "SAFE")
    threats_detected = total_scans - safe_scans
    critical_threats = sum(1 for s in scans if s.threat_level == "CRITICAL")
    
    avg_risk = sum(s.risk_score for s in scans) / total_scans
    overall_security_score = max(0, min(100, int(100 - avg_risk)))

    # Threat distribution
    t_counts = {}
    for s in scans:
        t_counts[s.threat_level] = t_counts.get(s.threat_level, 0) + 1
    
    threat_dist = [{"name": level, "count": count} for level, count in t_counts.items()]

    # Scan type distribution
    st_counts = {}
    for s in scans:
        st_counts[s.scan_type] = st_counts.get(s.scan_type, 0) + 1
    
    scan_type_dist = [{"type": stype, "count": count} for stype, count in st_counts.items()]

    return {
        "overall_security_score": overall_security_score,
        "total_scans": total_scans,
        "threats_detected": threats_detected,
        "safe_scans": safe_scans,
        "critical_threats": critical_threats,
        "threat_distribution": threat_dist,
        "scan_type_distribution": scan_type_dist
    }
