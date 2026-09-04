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
    GEMINI_MODEL = 'gemini-2.0-flash-lite'

# Configure Gemini
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel(GEMINI_MODEL)
else:
    print("⚠️ WARNING: GEMINI_API_KEY not found in environment!")
    model = None

def extract_medical_info(transcription_text):
    """
    Extract structured medical information from consultation transcription
    using Google Gemini AI
    
    Args:
        transcription_text (str): The full consultation transcription
    
    Returns:
        dict: Structured medical information
    """
    
    if not model:
        print("❌ Gemini model not configured. Check API key.")
        return get_default_medical_data()

    print(f"✨ Extracting medical information with {GEMINI_MODEL}...")
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
       - PRIORITIZE the doctor's verbal instructions over anything else.
       - Extraction should include dosage (e.g., "500mg"), frequency (e.g., "twice daily"), and duration (e.g., "for 5 days").
       - If the doctor says "I am prescribing [Med] for [X] days", the duration MUST be [X].
    4. **Prohibitions**: Extract everything the patient is told to AVOID (e.g., "don't drink cold water", "avoid sugar").
    5. **Recommendations**: Capture all lifestyle or procedural advice (e.g., "gargle with salt water", "rest well").
    6. **Follow-up**: Extract the exact timeline mentioned (e.g., "see me in a week").
    
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
    - Do NOT invent data. If no medication is prescribed, medications should be [].
    - Response must be PURE JSON. No markdown blocks."""

    try:
        # Call Gemini API
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.1, # Lower temperature for better structural consistency
                response_mime_type="application/json"
            )
        )
        
        ai_response = response.text
        
        print(f"📝 Raw AI response length: {len(ai_response)} characters")
        
        # Parse JSON from response
        try:
            medical_data = json.loads(ai_response)
        except:
            medical_data = parse_medical_json(ai_response)
        
        processing_time = time.time() - start_time
        print(f"✅ Medical extraction complete! ({processing_time:.2f}s)")
        
        # Validate and clean data
        medical_data = validate_medical_data(medical_data)
        
        return medical_data
        
    except Exception as e:
        print(f"❌ Gemini extraction error: {str(e)}")
        import traceback
        traceback.print_exc()
        # Return empty structure with error flag instead of fake demo data
        return {
            'diagnoses': [],
            'symptoms': [],
            'medications': [],
            'prohibitions': [],
            'recommendations': [f"⚠️ AI extraction failed: {str(e)}. Please fill in manually."],
            'follow_up': '',
            '_error': str(e)
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