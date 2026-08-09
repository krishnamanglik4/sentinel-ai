import os
import sys
import pytest
import cv2
import numpy as np
from PIL import Image

# Add backend directory to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from services.image_analyzer import ImageAnalyzer

@pytest.fixture
def temp_dir(tmp_path):
    return str(tmp_path)

def test_ela_score_normal_jpeg(temp_dir):
    # Create a uniform synthetic JPEG image
    img = np.ones((300, 400, 3), dtype=np.uint8) * 200
    cv2.putText(img, "TEST NORMAL", (50, 150), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (20, 20, 20), 2)
    path = os.path.join(temp_dir, "normal.jpg")
    cv2.imwrite(path, img, [cv2.IMWRITE_JPEG_QUALITY, 95])

    pil_img = Image.open(path)
    ela_res = ImageAnalyzer.calculate_ela_score(path, pil_img)
    pil_img.close()

    assert 0 <= ela_res["ela_score"] <= 100
    assert ela_res["ela_anomaly_level"] in ["VERY LOW", "LOW", "MODERATE", "HIGH", "VERY HIGH"]
    assert "ela_mean" in ela_res
    assert "ela_max" in ela_res

    full_res = ImageAnalyzer.analyze_image(path, "normal.jpg")
    assert 0 <= full_res["risk_score"] <= 100
    assert full_res["trust_score"] == 100 - full_res["risk_score"]
    assert full_res["threat_level"] in ["SAFE", "LOW", "MEDIUM", "HIGH", "CRITICAL"]

def test_ela_score_tampered_jpeg(temp_dir):
    # Create a base JPEG
    img = np.ones((400, 500, 3), dtype=np.uint8) * 240
    cv2.putText(img, "ORIGINAL", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (30, 30, 30), 2)
    path = os.path.join(temp_dir, "tampered.jpg")
    cv2.imwrite(path, img, [cv2.IMWRITE_JPEG_QUALITY, 60])

    # Splice a noisy patch into the JPEG
    img_loaded = cv2.imread(path)
    patch = np.random.randint(0, 255, (100, 200, 3), dtype=np.uint8)
    img_loaded[150:250, 150:350] = patch
    cv2.imwrite(path, img_loaded, [cv2.IMWRITE_JPEG_QUALITY, 90])

    pil_img = Image.open(path)
    ela_res = ImageAnalyzer.calculate_ela_score(path, pil_img)
    pil_img.close()

    assert 0 <= ela_res["ela_score"] <= 100
    full_res = ImageAnalyzer.analyze_image(path, "tampered.jpg")
    assert 0 <= full_res["risk_score"] <= 100
    assert full_res["trust_score"] == 100 - full_res["risk_score"]

def test_ela_png_format_handling(temp_dir):
    # Create a PNG image
    img = np.ones((250, 350, 3), dtype=np.uint8) * 180
    cv2.circle(img, (175, 125), 50, (0, 0, 255), -1)
    path = os.path.join(temp_dir, "sample.png")
    cv2.imwrite(path, img)

    pil_img = Image.open(path)
    ela_res = ImageAnalyzer.calculate_ela_score(path, pil_img)
    pil_img.close()

    assert 0 <= ela_res["ela_score"] <= 100
    assert "JPEG-recompression-based ELA" in ela_res["format_note"]

    full_res = ImageAnalyzer.analyze_image(path, "sample.png")
    assert 0 <= full_res["risk_score"] <= 100
    assert full_res["trust_score"] == 100 - full_res["risk_score"]

def test_very_small_image(temp_dir):
    img = np.ones((20, 20, 3), dtype=np.uint8) * 100
    path = os.path.join(temp_dir, "small.jpg")
    cv2.imwrite(path, img)

    full_res = ImageAnalyzer.analyze_image(path, "small.jpg")
    assert 0 <= full_res["risk_score"] <= 100
    assert full_res["trust_score"] == 100 - full_res["risk_score"]

def test_invalid_file_handling():
    full_res = ImageAnalyzer.analyze_image("/invalid/non_existent_file.jpg", "non_existent.jpg")
    assert full_res["risk_score"] >= 0
    assert full_res["trust_score"] == 100 - full_res["risk_score"]
    assert full_res["threat_level"] is not None

def test_score_variation(temp_dir):
    # Generate image A (clean uniform)
    img_a = np.ones((300, 300, 3), dtype=np.uint8) * 200
    path_a = os.path.join(temp_dir, "img_a.jpg")
    cv2.imwrite(path_a, img_a, [cv2.IMWRITE_JPEG_QUALITY, 95])

    # Generate image B (noisy with text splice)
    img_b = np.ones((300, 300, 3), dtype=np.uint8) * 200
    noise = np.random.randint(0, 255, (100, 100, 3), dtype=np.uint8)
    img_b[100:200, 100:200] = noise
    path_b = os.path.join(temp_dir, "img_b.jpg")
    cv2.imwrite(path_b, img_b, [cv2.IMWRITE_JPEG_QUALITY, 70])

    res_a = ImageAnalyzer.analyze_image(path_a, "img_a.jpg")
    res_b = ImageAnalyzer.analyze_image(path_b, "img_b.jpg")

    assert res_a["risk_score"] != res_b["risk_score"] or res_a["ela"]["ela_score"] != res_b["ela"]["ela_score"]
