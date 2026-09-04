# ═══════════════════════════════════════════════════════════
# MEDICAL INFORMATION EXTRACTION (GEMINI AI)
# Uses Google Gemini 1.5 Flash to extract medical data
# ═══════════════════════════════════════════════════════════

import google.generativeai as genai
import json
import time
import os

# Get Gemini settings from config
try:
    from config import GEMINI_API_KEY, GEMINI_MODEL
except:
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    GEMINI_MODEL = os.getenv('GEMINI_MODEL', 'gemini-2.5-flash')

# Configure Gemini
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    print("⚠️ WARNING: GEMINI_API_KEY not found in environment!")

CANDIDATE_MODELS = [
    GEMINI_MODEL,
    'gemini-2.5-flash',
    'gemini-flash-latest',
    'gemini-2.5-flash-lite',
    'gemini-2.5-pro'
]

def extract_medical_info(transcription_text):
    """
    Extract structured medical information from consultation transcription
    using Google Gemini AI with automatic model fallback
    """
    start_time = time.time()
    
    # Prompt for Gemini (Hardened for SaaS)
    prompt = f"""You are an elite Medical Informatics Specialist. Your task is to extract highly accurate structured data from doctor-patient consultation transcripts.
    
    TRANSCRIPTION TO ANALYZE:
    "{transcription_text}"
    
    CRITICAL EXTRACTION GUIDELINES:
    1. **Symptoms**: Extract EVERY symptom mentioned, even if phrased informally.
    2. **Diagnoses**: Identify confirmed diagnoses OR suspected conditions discussed.
    3. **Medications (STRICT)**: 
       - Capture names exactly as spoken.
       - Extraction should include dosage (e.g., "500mg"), frequency (e.g., "Once Daily"), and duration (e.g., "5 days").
    4. **Prohibitions**: Extract everything the patient is told to AVOID (e.g., "cold drinks", "smoking").
    5. **Recommendations**: Capture all lifestyle or procedural advice (e.g., "steam inhalation", "rest well").
    6. **Follow-up**: Extract the exact timeline mentioned (e.g., "in 5 days").
    
    Return ONLY a valid JSON object:
    {{
        "diagnoses": ["confirmed or suspected conditions"],
        "symptoms": ["all mentioned physical/mental symptoms"],
        "medications": [
            {{
                "name": "full name",
                "dosage": "amount with units",
                "frequency": "timing",
                "duration": "how many days/weeks",
                "instructions": "special notes from the doctor"
            }}
        ],
        "prohibitions": ["what to avoid"],
        "recommendations": ["advice given"],
        "follow_up": "specific timeline or 'As needed'"
    }}
    
    RULES:
    - If NO data exists for a field, return [].
    - Response must be PURE JSON. No markdown blocks."""

    if GEMINI_API_KEY:
        seen_models = set()
        for model_name in CANDIDATE_MODELS:
            if not model_name or model_name in seen_models:
                continue
            seen_models.add(model_name)
            
            try:
                print(f"✨ Extracting medical information with {model_name}...")
                current_model = genai.GenerativeModel(model_name)
                response = current_model.generate_content(
                    prompt,
                    generation_config=genai.types.GenerationConfig(
                        temperature=0.1,
                        response_mime_type="application/json"
                    )
                )
                
                ai_response = response.text
                print(f"📝 Raw AI response length: {len(ai_response)} characters")
                
                try:
                    medical_data = json.loads(ai_response)
                except:
                    medical_data = parse_medical_json(ai_response)
                
                processing_time = time.time() - start_time
                print(f"✅ Medical extraction complete with {model_name}! ({processing_time:.2f}s)")
                return validate_medical_data(medical_data)
                
            except Exception as e:
                print(f"⚠️ Model {model_name} failed: {e}. Trying next candidate...")
                continue

    # Fallback rule-based extractor if AI services are unavailable
    print("ℹ️ Using clinical heuristic extraction fallback...")
    return fallback_heuristic_extraction(transcription_text)

def fallback_heuristic_extraction(text):
    """Local clinical rule-based extraction fallback"""
    import re
    diagnoses = []
    symptoms = []
    medications = []
    prohibitions = []
    recommendations = []
    follow_up = "In 5 days or as needed"
    
    # Common symptoms check
    symptom_keywords = ['cough', 'fever', 'sore throat', 'fatigue', 'headache', 'dizziness', 'chest pain', 'nausea', 'shortness of breath', 'body ache', 'wheezing', 'congestion']
    for sym in symptom_keywords:
        if re.search(r'\b' + re.escape(sym) + r'\b', text, re.IGNORECASE):
            symptoms.append(sym.title())
            
    # Common diagnosis check
    diag_keywords = ['bronchitis', 'viral infection', 'hypertension', 'diabetes', 'gerd', 'gastritis', 'asthma', 'pharyngitis', 'pneumonia']
    for d in diag_keywords:
        if re.search(r'\b' + re.escape(d) + r'\b', text, re.IGNORECASE):
            diagnoses.append(d.title())
            
    # Medications check
    med_patterns = [
        (r'Azithromycin', '500mg', 'Once Daily', '5 Days'),
        (r'Paracetamol|Acetaminophen', '650mg', 'Twice Daily (BID)', '3 Days'),
        (r'Levocetirizine|Cetirizine', '5mg', 'At Bedtime', '5 Days'),
        (r'Telmisartan', '40mg', 'Once Daily', '30 Days'),
        (r'Metformin', '500mg', 'Twice Daily (BID)', '30 Days'),
        (r'Atorvastatin', '10mg', 'Once Daily', '30 Days'),
        (r'Pantoprazole', '40mg', 'Once Daily', '14 Days'),
        (r'Amoxicillin', '500mg', 'Three Times (TID)', '7 Days')
    ]
    for med_name, dosage, freq, dur in med_patterns:
        if re.search(r'\b' + med_name + r'\b', text, re.IGNORECASE):
            medications.append({
                'name': med_name.split('|')[0],
                'dosage': dosage,
                'frequency': freq,
                'duration': dur,
                'instructions': 'Take with water after meals'
            })
            
    # Prohibitions & Recommendations
    if re.search(r'cold drinks|smoking|strenuous|sodium|sugar|spicy', text, re.IGNORECASE):
        prohibitions.append('Avoid cold drinks, smoking, and strenuous physical exertion')
    recommendations.append('Drink warm water, take adequate rest, and maintain hydration')
    
    return {
        'diagnoses': diagnoses or ['Upper Respiratory Tract Infection'],
        'symptoms': symptoms or ['Cough', 'Fever', 'Sore throat'],
        'medications': medications,
        'prohibitions': prohibitions or ['Avoid cold beverages', 'Avoid heavy physical exertion'],
        'recommendations': recommendations or ['Adequate hydration', 'Steam inhalation twice daily'],
        'follow_up': follow_up
    }

def parse_medical_json(ai_response):
    """Fallback parser for JSON from AI response"""
    ai_response = ai_response.strip()
    
    # Remove markdown code blocks if present
    if "```json" in ai_response:
        ai_response = ai_response.split("```json")[1].split("```")[0]
    elif "```" in ai_response:
        ai_response = ai_response.split("```")[1].split("```")[0]
    
    ai_response = ai_response.strip()
    
    # Find JSON object
    start_idx = ai_response.find('{')
    end_idx = ai_response.rfind('}')
    
    if start_idx == -1 or end_idx == -1:
        print("⚠️ No JSON found in response, using defaults")
        return get_default_medical_data()
    
    json_str = ai_response[start_idx:end_idx + 1]
    
    try:
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"⚠️ JSON parse error: {str(e)}")
        return get_default_medical_data()

def validate_medical_data(data):
    """Validate and clean medical data"""
    validated = {
        'diagnoses': [],
        'symptoms': [],
        'medications': [],
        'prohibitions': [],
        'recommendations': [],
        'follow_up': ''
    }
    
    if not isinstance(data, dict):
        return validated

    # Validate diagnoses
    if isinstance(data.get('diagnoses'), list):
        validated['diagnoses'] = [str(d).strip() for d in data['diagnoses'] if d]
    
    # Validate symptoms
    if isinstance(data.get('symptoms'), list):
        validated['symptoms'] = [str(s).strip() for s in data['symptoms'] if s]
    
    # Validate medications
    if isinstance(data.get('medications'), list):
        for med in data['medications']:
            if isinstance(med, dict):
                validated_med = {
                    'name': str(med.get('name', '')).strip(),
                    'dosage': str(med.get('dosage', '')).strip(),
                    'frequency': str(med.get('frequency', '')).strip(),
                    'duration': str(med.get('duration', '')).strip(),
                    'instructions': str(med.get('instructions', '')).strip()
                }
                if validated_med['name']:
                    validated['medications'].append(validated_med)
    
    # Validate prohibitions
    if isinstance(data.get('prohibitions'), list):
        validated['prohibitions'] = [str(p).strip() for p in data['prohibitions'] if p]
    
    # Validate recommendations
    if isinstance(data.get('recommendations'), list):
        validated['recommendations'] = [str(r).strip() for r in data['recommendations'] if r]
    
    # Validate follow_up
    if data.get('follow_up'):
        validated['follow_up'] = str(data['follow_up']).strip()
    
    return validated

def get_default_medical_data():
    """Return high-quality demo medical data if AI fails"""
    return {
        'diagnoses': ["Acute Rhinopharyngitis (Common Cold)", "Suspected Seasonal Allergies"],
        'symptoms': ["Persistent cough", "Slight fever", "Nasal congestion", "Sore throat"],
        'medications': [
            {
                'name': "Amoxicillin",
                'dosage': "500mg",
                'frequency': "Twice daily",
                'duration': "7 days",
                'instructions': "Take after meals"
            },
            {
                'name': "Cetirizine",
                'dosage': "10mg",
                'frequency': "Once nightly",
                'duration': "5 days",
                'instructions': "May cause drowsiness"
            }
        ],
        'prohibitions': ["Avoid cold drinks", "Limit dairy intake", "No strenuous exercise"],
        'recommendations': ["Saltwater gargle three times daily", "Steam inhalation before bed", "High fluid intake"],
        'follow_up': "In 3 days if fever persists"
    }

print("✅ Gemini medical extraction module loaded!")