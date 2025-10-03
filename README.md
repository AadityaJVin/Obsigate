# Obsigate – Advanced AI-Powered Web Application Firewall  

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  
[![Python](https://img.shields.io/badge/Python-3.9+-green.svg)](https://www.python.org/)  

## 💡 Motivation
Obsigate is designed to explore **hybrid web security**, combining signature-based detection and AI/ML anomaly detection.  
The project demonstrates how to **protect modern web applications** against both known attacks and obfuscated or zero-day threats while learning about WAFs, feature extraction, and ML-based security.

---

## 1. Introduction
Obsigate is a hybrid **Web Application Firewall (WAF)** that combines:  

* **Signature-based detection** for known attacks.  
* **Machine Learning-based anomaly detection** for obfuscated or zero-day threats.  

This layered approach enhances security against both traditional exploits and sophisticated encoded payloads.

---

## 2. Hybrid Detection Architecture
Obsigate operates in **two stages**:

1. **Stage 1 – Signature Detection**  
   - Matches incoming requests against predefined attack patterns.  
   - Detects SQLi, XSS, path traversal, and other common exploits.  

2. **Stage 2 – AI/ML Detection**  
   - Triggered when requests appear “obfuscated” or suspicious.  
   - Uses a pre-trained **LightGBM model** to classify requests as *malicious (1)* or *valid (0)*.  

---

## 3. Machine Learning Pipeline

### 3.1 Feature Extraction
Obsigate extracts **8 statistical features** from URI, GET, and POST data:

* `URI_Length` – Length of URI  
* `GET_Length` – Length of GET parameters  
* `POST_Length` – Length of POST data  
* `URI_Entropy` – Shannon entropy of URI  
* `GET_Entropy` – Shannon entropy of GET data  
* `POST_Entropy` – Shannon entropy of POST data  
* `Numeric_Text_Ratio` – Digits-to-letters ratio  
* `Special_Char_Count` – Count of special characters (`'`, `"`, `{`, `}`, etc.)  

### 3.2 Model Inference
* **Algorithm**: LightGBM  
* **Frameworks**: scikit-learn, joblib  
* **Model File**: `ml_model.pkl`  
* **Output**: Binary → `0 = valid`, `1 = malicious`  

---

## 4. Model Training (Background)
The repository contains **inference code only**, not training scripts or datasets.  

**Training workflow (for reference):**
1. Collect labeled malicious + benign web requests.  
2. Extract features with `extract_features()`.  
3. Train LightGBM classifier.  
4. Validate with cross-validation.  
5. Save model → `ml_model.pkl`.  

**Notes:**  
* Dataset should include thousands of examples for generalization.  
* Include various obfuscation encodings (URL, Base64, Hex).  
* Retrainable with new data for adaptive learning.  

---

## 5. Technical Implementation
* **Language**: Python  
* **Frameworks**: Flask, scikit-learn, LightGBM  
* **Inference**: `model.predict()` per suspicious request  
* **Model Storage**: Pre-trained model (`ml_model.pkl`)  
* **Feature Vector**: 8-dimensional per request  
* **Decision Output**: Binary classification (0=valid, 1=malicious)  

---

## 6. Key Benefits
* Detects **zero-day & obfuscated attacks**  
* **Low false positives** (ML runs only on suspicious requests)  
* **Retrainable** for evolving threats  
* **Fast inference** with lightweight features  
* Provides **adaptive learning** for modern attack patterns  

---

## 7. Deployment Notes
* Default Flask server is for **development only**.  
* For production, use **gunicorn** / **uWSGI**.  
* Logging and monitoring recommended to improve datasets.  
* Periodic retraining ensures protection against emerging threats.  

---

## 8. Requirements

flask
joblib
numpy
scipy
scikit-learn
lightgbm


Install automatically with:

```bash
pip install -r requirements.txt
```

---

## 9. How to Execute

### 1. Clone the Repository

```bash
git clone https://github.com/Aaditya-2975/Obsigate.git
cd Obsigate
```

### 2. Create Virtual Environment & Install Dependencies

```bash
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows

pip install -r requirements.txt
```

### 3. Run the Application

```bash
python app.py
```

* The WAF starts on `http://127.0.0.1:5000/`.
* Logs display detection results for requests.

### 4. Test with Requests

```bash
curl "http://127.0.0.1:5000/?id=1"
curl "http://127.0.0.1:5000/?id=1' OR '1'='1"
```

### 5. Stop the Server

```bash
CTRL + C
```

---
## Example Requests
<img width="1771" height="1130" alt="image" src="https://github.com/user-attachments/assets/d02f4180-0b0d-47f4-b9f9-120eacec1912" />
<img width="1839" height="1098" alt="image" src="https://github.com/user-attachments/assets/1f66227c-e6f9-483f-a341-0f3d0dc4ca46" />

### ✅ Valid Requests

1. **Homepage**

```bash
    GET / HTTP/1.1
    Host: www.example.com
```
2. **Product listing**

```bash
    GET /products?category=electronics&page=2 HTTP/1.1
    Host: www.ecommerce.com
    Referer: https://www.ecommerce.com/products
```
3. **Single product**

```bash
    GET /product/12345 HTTP/1.1
    Host: www.ecommerce.com
    Referer: https://www.ecommerce.com/products?category=electronics&page=2
```
4. **Add to cart (POST with JSON body)**

```bash
POST /cart/add HTTP/1.1
Host: www.ecommerce.com
Content-Type: application/json
Content-Length: 45

    {"productId": "12345", "quantity": 1}
```
---

### ❌ Malicious Requests (Signature-Based Detection)

1. **SQL Injection via search**

```bash
    GET /search?q=' OR '1'='1'; DROP TABLE users;-- HTTP/1.1
    Host: www.example.com
```
2. **XSS in comment**

```bash
    GET /comment?text=<script>alert('XSS')</script> HTTP/1.1
    Host: www.example.com
```
3. **XSS using eval**

```bash
    GET /comment?text=<script>eval(String.fromCharCode(97,108,101,114,116,40,39,88,83,83,39,41))</script> HTTP/1.1
    Host: www.example.com
```
4. **SQL Injection with UNION**

```bash
    GET /search?q=1' UNION SELECT username,password FROM users-- HTTP/1.1
    Host: www.example.com
```
## 10. Conclusion

Obsigate delivers **robust web security** with a **hybrid detection approach**:

* Rules for known exploits
* AI/ML for advanced, hidden threats

This ensures a **future-ready WAF** for modern web applications.
