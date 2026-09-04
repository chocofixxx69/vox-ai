# ═══════════════════════════════════════════════════════════
# REPORT GENERATOR
# Creates structured JSON report from transcription and medical data
# ═══════════════════════════════════════════════════════════

from datetime import datetime

def generate_report(transcription_data, medical_data, patient_info):
    """
    Generate structured medical report
    
    Args:
        transcription_data (dict): Output from Whisper
        medical_data (dict): Output from Llama extraction
        patient_info (dict): Patient information
    
    Returns:
        dict: Complete structured report
    """
    
    print("📋 Generating medical report...")
    
    report = {
        'report_id': generate_report_id(),
        'timestamp': datetime.now().isoformat(),
        'patient_information': {
            'name': patient_info.get('name', ''),
            'age': patient_info.get('age', ''),
            'phone': patient_info.get('phone', ''),
            'email': patient_info.get('email', '')
        },
        'consultation': {
            'date': datetime.now().strftime('%Y-%m-%d'),
            'time': datetime.now().strftime('%H:%M:%S'),
            'language': transcription_data.get('language', 'unknown'),
            'language_confidence': transcription_data.get('language_probability', 0),
            'duration': transcription_data.get('processing_time', 0)
        },
        'transcription': {
            'full_text': transcription_data.get('text', ''),
            'word_count': transcription_data.get('word_count', 0),
            'segments': transcription_data.get('segments', [])
        },
        'medical_information': {
            'diagnoses': medical_data.get('diagnoses', []),
            'symptoms': medical_data.get('symptoms', []),
            'medications': medical_data.get('medications', []),
            'prohibitions': medical_data.get('prohibitions', []),
            'recommendations': medical_data.get('recommendations', []),
            'follow_up': medical_data.get('follow_up', '')
        },
        'status': 'pending_approval',
        'approved': False,
        'approved_by': None,
        'approved_at': None
    }
    
    print(f"✅ Report generated: {report['report_id']}")
    
    return report

def generate_report_id():
    """Generate unique report ID"""
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    return f"RPT-{timestamp}"

print("✅ Report generator module loaded!")