import datetime
import uuid
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.orm import relationship
from .connection import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="user")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    scans = relationship("Scan", back_populates="owner", cascade="all, delete-orphan")

class Scan(Base):
    __tablename__ = "scans"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    scan_type = Column(String(50), index=True, nullable=False) # image, document, url, text, audio, video
    input_summary = Column(Text, nullable=False) # File path, domain, or message excerpt
    risk_score = Column(Integer, nullable=False) # 0-100
    trust_score = Column(Integer, nullable=False) # 0-100
    threat_level = Column(String(50), index=True, nullable=False) # SAFE, LOW, MEDIUM, HIGH, CRITICAL
    threat_type = Column(String(255), nullable=False)
    confidence = Column(Float, nullable=False) # 0.0 - 1.0
    signals = Column(JSON, nullable=False) # Array of signal objects/strings
    explanation = Column(JSON, nullable=False) # XAI reasons breakdown
    recommended_action = Column(Text, nullable=False)
    metadata_info = Column(JSON, nullable=True) # ELA images, visual bounding boxes, spectrogram paths, frame thumbnails
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    owner = relationship("User", back_populates="scans")
