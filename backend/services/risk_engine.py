from typing import List, Dict, Any

class CommonRiskEngine:
    @staticmethod
    def evaluate(
        scan_type: str,
        input_summary: str,
        detected_signals: List[Dict[str, Any]],
        base_confidence: float = 0.88,
        metadata_info: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        evaluates standardized forensic signals and produces normalized risk score (0-100),
        trust score (0-100), threat level, confidence, and recommended safety actions.
        """
        if metadata_info is None:
            metadata_info = {}

        total_weight = 0.0
        triggered_weight = 0.0
        active_indicators = []

        for sig in detected_signals:
            weight = sig.get("weight", 10.0)
            total_weight += weight
            if sig.get("detected", False):
                triggered_weight += weight
                active_indicators.append(sig.get("description", sig.get("name")))

        if total_weight > 0:
            raw_risk = (triggered_weight / total_weight) * 100.0
        else:
            raw_risk = 0.0

        risk_score = min(100, max(0, int(round(raw_risk))))
        trust_score = 100 - risk_score

        # Determine Threat Level
        if risk_score <= 20:
            threat_level = "SAFE"
        elif risk_score <= 40:
            threat_level = "LOW"
        elif risk_score <= 60:
            threat_level = "MEDIUM"
        elif risk_score <= 80:
            threat_level = "HIGH"
        else:
            threat_level = "CRITICAL"

        # Determine Threat Type based on scan_type and indicators
        if scan_type in ["image", "document"]:
            if risk_score > 60:
                threat_type = "High Likelihood of Image Manipulation / Tampering"
            elif risk_score > 30:
                threat_type = "Potential Minor Image Artifacts / Inconsistencies"
            else:
                threat_type = "Authentic Image Structure"
        elif scan_type == "url":
            if risk_score > 60:
                threat_type = "Malicious Phishing / Fraudulent Domain"
            elif risk_score > 30:
                threat_type = "Suspicious URL Structure"
            else:
                threat_type = "Legitimate Domain Structure"
        elif scan_type == "text":
            if risk_score > 60:
                threat_type = "Phishing / Social Engineering Scam Message"
            elif risk_score > 30:
                threat_type = "Potential Unsolicited / High-Pressure Text"
            else:
                threat_type = "Standard Safe Communication"
        elif scan_type == "audio":
            if risk_score > 60:
                threat_type = "AI Voice Clone / Synthetic Speech Artifacts"
            elif risk_score > 30:
                threat_type = "Potential Audio Processing Anomaly"
            else:
                threat_type = "Natural Voice Recording"
        elif scan_type == "video":
            if risk_score > 60:
                threat_type = "Deepfake Facial Manipulation Detected"
            elif risk_score > 30:
                threat_type = "Potential Frame Inconsistency / Artifacts"
            else:
                threat_type = "Authentic Video Stream"
        else:
            threat_type = "Unspecified Content Analysis"

        # Recommended Action
        if threat_level in ["HIGH", "CRITICAL"]:
            recommended_action = "CRITICAL WARNING: High likelihood of fraudulent or synthetic manipulation. Do NOT interact, enter credentials, download attachments, or make financial transfers without independent off-band verification."
        elif threat_level == "MEDIUM":
            recommended_action = "EXERCISING CAUTION: Moderate forensic anomalies detected. Verify sender identity or document origins through trusted primary sources before acting."
        elif threat_level == "LOW":
            recommended_action = "LOW RISK: Minor non-standard indicators detected. Content is likely benign, but remain attentive to unsolicited requests."
        else:
            recommended_action = "VERIFIED SAFE: No significant forensic anomalies, phishing markers, or manipulation patterns were detected."

        # XAI Explanation Breakdown
        explanation = {
            "summary": f"{threat_level} risk evaluated with {int(base_confidence * 100)}% engine confidence.",
            "active_indicators": active_indicators,
            "total_signals_scanned": len(detected_signals),
            "triggered_signals_count": len(active_indicators),
            "notes": "Forensic scores reflect empirical signal analysis. Always cross-verify critical requests."
        }

        return {
            "scan_type": scan_type,
            "input_summary": input_summary,
            "risk_score": risk_score,
            "trust_score": trust_score,
            "threat_level": threat_level,
            "threat_type": threat_type,
            "confidence": round(base_confidence, 2),
            "signals": detected_signals,
            "explanation": explanation,
            "recommended_action": recommended_action,
            "metadata_info": metadata_info
        }
