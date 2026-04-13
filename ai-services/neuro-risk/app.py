import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# =====================================================
# NeuroLink – Longitudinal Neurological Risk Engine
# Version: v1.0 (IEEE Final-Year Release)
# =====================================================

ENGINE_VERSION = "NeuroLink-Risk-v1.0"

def calculate_neurological_risk(data):
    """
    Longitudinal, explainable neurological risk inference.
    This is NOT disease diagnosis.
    """

    risk_score = 0.05
    factors = []

    # -------------------------------
    # 0. INPUT SANITIZATION (ROBUST)
    # -------------------------------
    try:
        age_val = data.get("age", 0)
        age = int(age_val)
    except (ValueError, TypeError):
        age = 0
        
    gender = str(data.get("gender", "")).lower()
    
    history_raw = data.get("history", [])
    if isinstance(history_raw, str):
        history = [history_raw]
    elif isinstance(history_raw, list):
        history = history_raw
    else:
        history = []

    # -------------------------------
    # 1. AGE-BASED NEURO RISK
    # -------------------------------
    # age is already set

    if age >= 65:
        risk_score += 0.25
        factors.append("Advanced age (>65) – increased neurodegenerative risk")
    elif age >= 50:
        risk_score += 0.15
        factors.append("Age between 50–65 – moderate neurological vulnerability")
    elif age >= 40:
        risk_score += 0.05

    # -------------------------------
    # 2. GENDER CONTEXT (NON-BIASED)
    # -------------------------------
    if gender in ["female", "male"]:
        # Gender used only as contextual modifier, not determinant
        risk_score += 0.02

    # -------------------------------
    # 3. LONGITUDINAL MEDICAL HISTORY
    # -------------------------------
    # history is already sanitized
    history_text = " ".join([str(h) for h in history]).lower()

    if "diabetes" in history_text:
        risk_score += 0.15
        factors.append("History of diabetes – metabolic neurological impact")

    if "hypertension" in history_text or "high bp" in history_text:
        risk_score += 0.20
        factors.append("Chronic hypertension – vascular neurological risk")

    if "stroke" in history_text:
        risk_score += 0.30
        factors.append("Previous stroke history – critical neurological risk")

    if "migraine" in history_text:
        risk_score += 0.10
        factors.append("Chronic migraines – neurological sensitivity indicator")

    # -------------------------------
    # 4. MANUAL VITALS (ROBUST PARSING)
    # -------------------------------
    bp_input = data.get("manual_bp") or data.get("bp") or ""
    if isinstance(bp_input, str):
        try:
            systolic = int(bp_input.split("/")[0])
            if systolic >= 140:
                risk_score += 0.20
                factors.append(f"Elevated systolic BP ({bp_input})")
        except:
            pass

    sugar_input = data.get("manual_sugar") or data.get("sugar") or ""
    try:
        sugar_val = int(sugar_input)
        if sugar_val >= 140:
            risk_score += 0.15
            factors.append(f"Elevated blood sugar ({sugar_val})")
    except:
        pass


    # -------------------------------
    # 5. AI–AI CONTEXTUAL COUPLING
    # -------------------------------
    if data.get("brainTumorHistory", False):
        risk_score += 0.25
        factors.append("Prior brain tumor AI findings – increased neurological risk")

    # -------------------------------
    # 6. SCORE NORMALIZATION
    # -------------------------------
    risk_score = min(max(risk_score, 0.01), 0.98)

    # -------------------------------
    # 7. RISK STRATIFICATION (FINAL)
    # -------------------------------
    if risk_score >= 0.60:
        level = "High"
        message = "High neurological risk detected. Clinical evaluation is advised."
    elif risk_score >= 0.35:
        level = "Moderate"
        message = "Moderate neurological risk detected. Monitoring is recommended."
    else:
        level = "Low"
        message = "Low neurological risk based on current indicators."

    return {
        "engineVersion": ENGINE_VERSION,
        "riskScore": round(risk_score, 2),
        "riskLevel": level,
        "explanation": factors,
        "clinicalNote": message
    }

# =====================================================
# API ENDPOINT
# =====================================================

@app.route("/predict-neurological-risk", methods=["POST"])
def predict_risk():
    try:
        payload = request.json
        print("Incoming payload:", payload)
        if not payload:
            return jsonify({"error": "No input data provided"}), 400

        result = calculate_neurological_risk(payload)

        return jsonify({
            "status": "success",
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "result": result,
            "disclaimer": (
                "This AI output is intended for clinical decision support only "
                "and does not constitute medical diagnosis."
            )
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# =====================================================
# SERVICE RUNNER
# =====================================================

if __name__ == "__main__":
    print("🧠 NeuroLink Neurological Risk Engine running on port 5002")
    app.run(host="0.0.0.0", port=5002, debug=True)
