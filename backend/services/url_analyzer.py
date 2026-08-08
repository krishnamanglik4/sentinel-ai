import re
import urllib.parse
from typing import Dict, Any, List
from .risk_engine import CommonRiskEngine

SUSPICIOUS_KEYWORDS = [
    "login", "verify", "secure", "update", "account", "signin", "support",
    "banking", "paypal", "appleid", "google-security", "microsoft-online",
    "wallet", "crypto", "binance", "metamask", "confirm", "claim", "free-gift",
    "refund", "unusual-activity", "passcode", "otp"
]

HIGH_RISK_TLDS = [".xyz", ".top", ".work", ".click", ".link", ".monster", ".gq", ".tk", ".ml", ".cf", ".cc"]

class URLAnalyzer:
    @staticmethod
    def analyze_url(raw_url: str) -> Dict[str, Any]:
        # Normalize URL
        url = raw_url.strip()
        if not (url.startswith("http://") or url.startswith("https://")):
            url = "http://" + url

        parsed = urllib.parse.urlparse(url)
        domain = parsed.netloc.lower()
        path = parsed.path.lower()
        query = parsed.query.lower()
        full_path = domain + path + query

        signals = []

        # 1. Scheme Check (HTTPS vs HTTP)
        if parsed.scheme != "https":
            signals.append({
                "name": "Insecure HTTP Protocol",
                "weight": 20.0,
                "detected": True,
                "description": "Connection uses plain HTTP protocol without SSL/TLS encryption."
            })
        else:
            signals.append({
                "name": "HTTPS Encryption",
                "weight": 15.0,
                "detected": False,
                "description": "Connection uses secure HTTPS encryption."
            })

        # 2. Raw IP Address as Host
        ip_pattern = r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?"
        has_ip = bool(re.match(ip_pattern, domain))
        if has_ip:
            signals.append({
                "name": "Raw IP Address Host",
                "weight": 35.0,
                "detected": True,
                "description": "URL references a numerical IP address directly instead of a registered domain name."
            })
        else:
            signals.append({
                "name": "Raw IP Address Host",
                "weight": 25.0,
                "detected": False,
                "description": "URL uses a standard domain hostname."
            })

        # 3. Excessive URL Length
        if len(url) > 75:
            signals.append({
                "name": "Excessive URL Length",
                "weight": 20.0,
                "detected": True,
                "description": f"Abnormally long URL string ({len(url)} characters) often used to conceal real destination."
            })
        else:
            signals.append({
                "name": "Excessive URL Length",
                "weight": 15.0,
                "detected": False,
                "description": f"Normal URL length ({len(url)} characters)."
            })

        # 4. Multiple Subdomains
        subdomains = domain.split(".")
        if len(subdomains) > 3:
            signals.append({
                "name": "Excessive Subdomains",
                "weight": 25.0,
                "detected": True,
                "description": f"Domain contains {len(subdomains)-2} subdomains, a technique frequently used in brand spoofing."
            })
        else:
            signals.append({
                "name": "Excessive Subdomains",
                "weight": 15.0,
                "detected": False,
                "description": f"Standard domain hierarchy ({len(subdomains)} levels)."
            })

        # 5. Suspicious TLD
        has_suspicious_tld = any(domain.endswith(tld) for tld in HIGH_RISK_TLDS)
        if has_suspicious_tld:
            signals.append({
                "name": "High-Risk Top-Level Domain (TLD)",
                "weight": 30.0,
                "detected": True,
                "description": "Registered TLD has high statistical association with spam & phishing campaigns."
            })
        else:
            signals.append({
                "name": "High-Risk Top-Level Domain (TLD)",
                "weight": 20.0,
                "detected": False,
                "description": "Standard top-level domain extension."
            })

        # 6. Credential & Brand Phishing Keywords
        found_keywords = [kw for kw in SUSPICIOUS_KEYWORDS if kw in full_path]
        if len(found_keywords) >= 2:
            signals.append({
                "name": "Phishing & Credential Keywords",
                "weight": 35.0,
                "detected": True,
                "description": f"Multiple phishing trigger terms detected in URL path: [{', '.join(found_keywords)}]."
            })
        elif len(found_keywords) == 1:
            signals.append({
                "name": "Phishing & Credential Keywords",
                "weight": 20.0,
                "detected": True,
                "description": f"Phishing keyword detected in URL path: '{found_keywords[0]}'."
            })
        else:
            signals.append({
                "name": "Phishing & Credential Keywords",
                "weight": 25.0,
                "detected": False,
                "description": "No credential or high-pressure phishing terms found in URL path."
            })

        # 7. Suspicious Special Characters (@, -, double slashes)
        if "@" in url or domain.count("-") >= 3 or "//" in path:
            signals.append({
                "name": "Obfuscated URL Formatting",
                "weight": 25.0,
                "detected": True,
                "description": "URL contains suspicious '@' redirection symbol, excess hyphens, or inline path re-routing."
            })
        else:
            signals.append({
                "name": "Obfuscated URL Formatting",
                "weight": 15.0,
                "detected": False,
                "description": "Clean URL character formatting."
            })

        metadata_info = {
            "domain": domain,
            "scheme": parsed.scheme,
            "path": parsed.path,
            "url_length": len(url),
            "subdomain_count": len(subdomains),
            "has_ip": has_ip,
            "detected_keywords": found_keywords
        }

        return CommonRiskEngine.evaluate(
            scan_type="url",
            input_summary=raw_url,
            detected_signals=signals,
            base_confidence=0.92,
            metadata_info=metadata_info
        )
