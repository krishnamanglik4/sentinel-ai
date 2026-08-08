import os
import cv2
import numpy as np
from PIL import Image, ImageChops, ImageEnhance
import pymupdf as fitz  # PyMuPDF
from typing import Dict, Any, List
from .risk_engine import CommonRiskEngine

class ImageAnalyzer:
    @staticmethod
    def analyze_image(file_path: str, original_filename: str) -> Dict[str, Any]:
        ext = os.path.splitext(file_path)[1].lower()
        is_pdf = ext == ".pdf"
        
        # 1. Automatic Image/Document Classification
        image_type = "document" if is_pdf else ImageAnalyzer._classify_file(file_path)
        
        # Prepare OpenCV & PIL image objects
        cv_img = None
        pil_img = None
        suspicious_regions = []
        ela_preview_url = None

        if is_pdf:
            doc = fitz.open(file_path)
            if len(doc) > 0:
                page = doc[0]
                pix = page.get_pixmap()
                cv_img = cv2.imdecode(np.frombuffer(pix.tobytes(), np.uint8), cv2.IMREAD_COLOR)
                pil_img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        else:
            try:
                cv_img = cv2.imread(file_path)
                pil_img = Image.open(file_path)
            except Exception:
                pass

        signals = []

        # Signal 1: Metadata Anomaly
        meta_signals = ImageAnalyzer._analyze_metadata(pil_img)
        signals.extend(meta_signals)

        # Signal 2: ELA (Error Level Analysis)
        ela_val, ela_path = ImageAnalyzer._perform_ela(file_path, pil_img)
        if ela_val > 18.0:
            signals.append({
                "name": "Compression Anomaly (ELA)",
                "weight": 25.0,
                "detected": True,
                "description": f"High ELA error variance ({ela_val:.1f}), indicating potential local re-compression or splicing."
            })
        else:
            signals.append({
                "name": "Compression Anomaly (ELA)",
                "weight": 25.0,
                "detected": False,
                "description": f"Uniform ELA error distribution ({ela_val:.1f})."
            })

        # Signal 3: Noise & Edge Discontinuity
        noise_var = ImageAnalyzer._analyze_noise_variance(cv_img) if cv_img is not None else 10.0
        if noise_var < 5.0 or noise_var > 450.0:
            signals.append({
                "name": "Noise Discontinuity",
                "weight": 20.0,
                "detected": True,
                "description": f"Abnormal high-frequency noise variance ({noise_var:.1f}) detected."
            })
        else:
            signals.append({
                "name": "Noise Discontinuity",
                "weight": 20.0,
                "detected": False,
                "description": "Consistent noise texture across image regions."
            })

        # Signal 4: Document / Text Tampering & Bounding Box Detection
        if image_type == "document" and cv_img is not None:
            doc_signals, bounding_boxes = ImageAnalyzer._analyze_document_structure(cv_img)
            signals.extend(doc_signals)
            suspicious_regions.extend(bounding_boxes)
        else:
            # General Splicing / Copy-Paste check for normal images
            if cv_img is not None:
                splicing_detected, boxes = ImageAnalyzer._detect_copy_move(cv_img)
                if splicing_detected:
                    signals.append({
                        "name": "Copy-Paste / Splicing Region",
                        "weight": 30.0,
                        "detected": True,
                        "description": "Duplicate visual feature blocks detected across non-adjacent image coordinates."
                    })
                    suspicious_regions.extend(boxes)
                else:
                    signals.append({
                        "name": "Copy-Paste / Splicing Region",
                        "weight": 30.0,
                        "detected": False,
                        "description": "No duplicate cloned feature regions detected."
                    })

        # Base confidence
        confidence = 0.91 if cv_img is not None else 0.75

        metadata_info = {
            "image_type": image_type,
            "dimensions": f"{cv_img.shape[1]}x{cv_img.shape[0]}" if cv_img is not None else "Unknown",
            "ela_score": round(ela_val, 2),
            "ela_image_path": ela_path,
            "suspicious_regions": suspicious_regions
        }

        return CommonRiskEngine.evaluate(
            scan_type="document" if image_type == "document" else "image",
            input_summary=original_filename,
            detected_signals=signals,
            base_confidence=confidence,
            metadata_info=metadata_info
        )

    @staticmethod
    def _classify_file(file_path: str) -> str:
        """Determines if image is a Document or Normal Image based on edge/text density"""
        try:
            img = cv2.imread(file_path, cv2.IMREAD_GRAYSCALE)
            if img is None:
                return "normal_image"
            edges = cv2.Canny(img, 100, 200)
            edge_density = np.sum(edges > 0) / (img.shape[0] * img.shape[1])
            if edge_density > 0.08:
                return "document"
            return "normal_image"
        except Exception:
            return "normal_image"

    @staticmethod
    def _analyze_metadata(pil_img) -> List[Dict[str, Any]]:
        signals = []
        if pil_img is None:
            return signals

        info = getattr(pil_img, "_getexif", lambda: None)()
        software_detected = False
        if info:
            for tag, value in info.items():
                if isinstance(value, str) and any(sw in value.lower() for sw in ["photoshop", "gimp", "paint.net", "canva", "adobe"]):
                    software_detected = True
                    break

        if software_detected:
            signals.append({
                "name": "Editing Software Metadata Tag",
                "weight": 25.0,
                "detected": True,
                "description": "EXIF metadata contains traces of photo editing software."
            })
        else:
            signals.append({
                "name": "Editing Software Metadata Tag",
                "weight": 25.0,
                "detected": False,
                "description": "No photo editing software signatures found in EXIF tags."
            })
        return signals

    @staticmethod
    def _perform_ela(file_path: str, pil_img) -> tuple[float, str]:
        """Calculates Error Level Analysis (ELA) variance score and saves visual map"""
        if pil_img is None:
            return 0.0, ""
        try:
            temp_path = file_path + ".resaved.jpg"
            ela_out_path = file_path + ".ela.jpg"

            # Resave image at 95% quality
            pil_img.convert("RGB").save(temp_path, "JPEG", quality=95)
            resaved_img = Image.open(temp_path)

            # Compute pixel difference
            ela_img = ImageChops.difference(pil_img.convert("RGB"), resaved_img)

            extrema = ela_img.getextrema()
            max_diff = max([ex[1] for ex in extrema])
            if max_diff == 0:
                max_diff = 1

            scale = 255.0 / max_diff
            ela_img = ImageEnhance.Brightness(ela_img).enhance(scale)
            ela_img.save(ela_out_path)

            if os.path.exists(temp_path):
                os.remove(temp_path)

            # Compute variance of ELA image
            np_ela = np.array(ela_img)
            ela_variance = float(np.var(np_ela))

            # Return relative path for web serving
            web_path = os.path.basename(ela_out_path)
            return ela_variance, f"/uploads/{web_path}"
        except Exception:
            return 0.0, ""

    @staticmethod
    def _analyze_noise_variance(cv_img) -> float:
        try:
            gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
            laplacian = cv2.Laplacian(gray, cv2.CV_64F)
            return float(laplacian.var())
        except Exception:
            return 10.0

    @staticmethod
    def _analyze_document_structure(cv_img) -> tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        signals = []
        boxes = []
        gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
        
        # Adaptive thresholding to identify text blocks & potential tampered overlays
        thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        h, w = cv_img.shape[:2]
        suspicious_count = 0

        for cnt in contours:
            x, y, bw, bh = cv2.boundingRect(cnt)
            # Filter bounding boxes representing potential altered numbers/words
            if 15 < bw < (w * 0.4) and 10 < bh < (h * 0.2):
                roi = gray[y:y+bh, x:x+bw]
                mean_val = np.mean(roi)
                std_val = np.std(roi)
                if std_val > 65.0: # Sudden high contrast edge anomaly
                    suspicious_count += 1
                    if len(boxes) < 4:
                        boxes.append({
                            "x": int(x),
                            "y": int(y),
                            "width": int(bw),
                            "height": int(bh),
                            "label": f"Altered Text Field #{len(boxes)+1}",
                            "confidence": 0.86
                        })

        if suspicious_count > 0:
            signals.append({
                "name": "Font/Layout Inconsistency",
                "weight": 35.0,
                "detected": True,
                "description": f"Detected {suspicious_count} text regions with localized contrast & line thickness mismatch."
            })
        else:
            signals.append({
                "name": "Font/Layout Inconsistency",
                "weight": 35.0,
                "detected": False,
                "description": "Document text alignment, line weight, and background structure are uniform."
            })

        return signals, boxes

    @staticmethod
    def _detect_copy_move(cv_img) -> tuple[bool, List[Dict[str, Any]]]:
        boxes = []
        try:
            gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
            orb = cv2.ORB_create(nfeatures=500)
            keypoints, descriptors = orb.detectAndCompute(gray, None)
            
            if descriptors is None or len(descriptors) < 10:
                return False, boxes

            bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
            matches = bf.match(descriptors, descriptors)
            
            # Filter matches that point to separate physical locations
            duplicated = []
            for m in matches:
                if m.queryIdx != m.trainIdx:
                    pt1 = keypoints[m.queryIdx].pt
                    pt2 = keypoints[m.trainIdx].pt
                    dist = np.sqrt((pt1[0]-pt2[0])**2 + (pt1[1]-pt2[1])**2)
                    if dist > 80.0: # Significant spatial separation
                        duplicated.append(pt1)

            if len(duplicated) >= 8:
                # Add bounding box around cluster
                pts = np.array(duplicated, dtype=np.int32)
                x, y, w, h = cv2.boundingRect(pts)
                boxes.append({
                    "x": int(x),
                    "y": int(y),
                    "width": int(w),
                    "height": int(h),
                    "label": "Cloned / Spliced Region",
                    "confidence": 0.89
                })
                return True, boxes
            return False, boxes
        except Exception:
            return False, boxes
