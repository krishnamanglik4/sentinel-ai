import re
from typing import Dict, Any, List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import numpy as np
from .risk_engine import CommonRiskEngine

# Baseline dataset for TF-IDF training
SCAM_TRAINING_DATA = [
    ("URGENT: Your bank account has been suspended! Click http://bit.ly/bank-verify to restore access within 2 hours.", 1),
    ("Congratulations! You won $50,000 in the national lottery. Send your full name and OTP to claim prize.", 1),
    ("Dear customer, your parcel is on hold due to missing house number. Pay $2.99 fee here: http://customs-post.org", 1),
    ("Please send the 6-digit OTP code sent to your phone immediately to verify your identity.", 1),
    ("Security Alert: Someone attempted to login to your Google account from Russia. Change password now.", 1),
    ("Hey mom, I lost my phone and this is my new temporary number. Can you transfer $500 to my friend's account?", 1),
    ("IRS Final Warning: Lawsuit filed against you for unpaid taxes. Call this number immediately to avoid arrest.", 1),
    ("Hi John, are we still meeting today at 3 PM for coffee?", 0),
    ("Project status update: The backend API documentation has been completed and published to team repository.", 0),
    ("Thanks for subscribing to Netflix. Your monthly invoice is attached for your reference.", 0),
    ("Your appointment with Dr. Smith is confirmed for tomorrow at 10:00 AM. Reply CANCEL to reschedule.", 0),
    ("Hey mate, could you review the latest pull request when you get a chance? Thanks!", 0)
]

class TextAnalyzer:
    _vectorizer = None
    _classifier = None

    @classmethod
    def _initialize_model(cls):
        if cls._vectorizer is None or cls._classifier is None:
            texts, labels = zip(*SCAM_TRAINING_DATA)
            cls._vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words='english')
            X = cls._vectorizer.fit_transform(texts)
            cls._classifier = LogisticRegression()
            cls._classifier.fit(X, labels)

    @classmethod
    def analyze_text(cls, message: str) -> Dict[str, Any]:
        cls._initialize_model()

        msg_lower = message.lower()
        signals = []
        highlighted_terms = []

        # 1. Artificial Urgency & Pressure
        urgency_terms = ["urgent", "immediately", "24 hours", "2 hours", "action required", "account suspended", "final warning", "arrest", "lawsuit"]
        found_urgency = [t for t in urgency_terms if t in msg_lower]
        if found_urgency:
            highlighted_terms.extend(found_urgency)
            signals.append({
                "name": "Artificial Urgency & Coercion",
                "weight": 30.0,
                "detected": True,
                "description": f"High-pressure psychological tactics detected: [{', '.join(found_urgency)}]."
            })
        else:
            signals.append({
                "name": "Artificial Urgency & Coercion",
                "weight": 20.0,
                "detected": False,
                "description": "No urgent deadlines or threatening language found."
            })

        # 2. Financial Lures & Unsolicited Prizes
        financial_terms = ["won", "$", "lottery", "prize", "refund", "claim", "transfer", "unpaid taxes", "fee", "free gift"]
        found_financial = [t for t in financial_terms if t in msg_lower]
        if found_financial:
            highlighted_terms.extend(found_financial)
            signals.append({
                "name": "Financial Lure / Prize Claim",
                "weight": 30.0,
                "detected": True,
                "description": f"Monetary rewards or unsolicited money requests detected: [{', '.join(found_financial)}]."
            })
        else:
            signals.append({
                "name": "Financial Lure / Prize Claim",
                "weight": 20.0,
                "detected": False,
                "description": "No financial reward promises or payment demands detected."
            })

        # 3. OTP & Credential Harvesting
        credential_terms = ["otp", "password", "verification code", "6-digit code", "pin", "login details", "passcode"]
        found_cred = [t for t in credential_terms if t in msg_lower]
        if found_cred:
            highlighted_terms.extend(found_cred)
            signals.append({
                "name": "OTP / Credential Harvesting Request",
                "weight": 35.0,
                "detected": True,
                "description": f"Direct request for sensitive authentication credentials: [{', '.join(found_cred)}]."
            })
        else:
            signals.append({
                "name": "OTP / Credential Harvesting Request",
                "weight": 25.0,
                "detected": False,
                "description": "No requests for passwords, OTPs, or authentication codes."
            })

        # 4. Embedded Links Check
        links = re.findall(r"https?://\S+|bit\.ly/\S+", message)
        if links:
            signals.append({
                "name": "Embedded Web Link",
                "weight": 25.0,
                "detected": True,
                "description": f"Message contains embedded link: '{links[0]}'."
            })
        else:
            signals.append({
                "name": "Embedded Web Link",
                "weight": 15.0,
                "detected": False,
                "description": "No external URLs present in message body."
            })

        # 5. ML Model Phishing Probability
        try:
            X_vec = cls._vectorizer.transform([message])
            scam_prob = float(cls._classifier.predict_proba(X_vec)[0][1])
        except Exception:
            scam_prob = 0.50

        if scam_prob > 0.65:
            signals.append({
                "name": "NLP Social Engineering Pattern",
                "weight": 35.0,
                "detected": True,
                "description": f"TF-IDF Machine Learning Classifier evaluated high scam language intent ({int(scam_prob * 100)}%)."
            })
        else:
            signals.append({
                "name": "NLP Social Engineering Pattern",
                "weight": 25.0,
                "detected": False,
                "description": f"Natural language patterns align with standard message intent."
            })

        metadata_info = {
            "scam_probability": round(scam_prob, 2),
            "character_count": len(message),
            "word_count": len(message.split()),
            "highlighted_terms": list(set(highlighted_terms)),
            "detected_links": links
        }

        # Short input summary
        summary = message[:60] + "..." if len(message) > 60 else message

        return CommonRiskEngine.evaluate(
            scan_type="text",
            input_summary=summary,
            detected_signals=signals,
            base_confidence=0.90,
            metadata_info=metadata_info
        )
