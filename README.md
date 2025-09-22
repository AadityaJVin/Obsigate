# Obsigate – Advanced AI-Powered Web Application Firewall

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

   * Matches incoming requests against predefined attack patterns.
   * Detects SQLi, XSS, path traversal, and other common exploits.

2. **Stage 2 – AI/ML Detection**

   * Triggered when requests appear “obfuscated” or suspicious.
   * Uses a pre-trained **LightGBM model** to classify requests as *malicious (1)* or *valid (0)*.

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
* **Framework**: scikit-learn, joblib
* **Model File**: `ml_model.pkl`
* **Output**: Binary → `0 = valid`, `1 = malicious`

---

## 4. Model Training (Background)

The repo includes **inference code only**, not training scripts or datasets.

**Training workflow (inferred):**

1. Collect labeled malicious + benign web requests.
2. Extract the 8 features with `extract_features()`.
3. Train a LightGBM classifier.
4. Validate with cross-validation.
5. Save model → `ml_model.pkl`.

**Dataset sources**: public attack datasets, web logs, synthetic attacks.

**Notes on Training:**

* Dataset should cover thousands of examples to ensure model generalization.
* Includes various obfuscation encodings (URL, Base64, Hex).
* Model can be retrained with new data for adaptive learning.

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

Ensure the following dependencies are installed:

```txt
flask
joblib
numpy
scipy
scikit-learn
lightgbm
```

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
