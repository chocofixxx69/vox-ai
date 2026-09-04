# ═══════════════════════════════════════════════════════════
# NOTIFICATION SERVICE
# Sends reports to n8n (Hostinger) for email & WhatsApp delivery
# ═══════════════════════════════════════════════════════════

import requests
import os
import base64

try:
    from config import N8N_WEBHOOK_URL
except:
    N8N_WEBHOOK_URL = 'https://your-n8n.hostinger.com/webhook/voxai'

def send_to_n8n(report_data, patient_info, pdf_path):
    """
    Send report to n8n webhook for email & WhatsApp delivery
    
    Args:
        report_data (dict): Complete report data
        patient_info (dict): Patient information
        pdf_path (str): Path to PDF file
    
    Returns:
        dict: Response from n8n
    """
    
    print("📤 Sending to n8n webhook...")
    print(f"🔗 Webhook URL: {N8N_WEBHOOK_URL}")
    
    # Read PDF and encode to base64
    with open(pdf_path, 'rb') as pdf_file:
        pdf_content = pdf_file.read()
        pdf_base64 = base64.b64encode(pdf_content).decode('utf-8')
    
    pdf_filename = os.path.basename(pdf_path)
    
    # Prepare payload
    payload = {
        'patient': {
            'name': patient_info.get('name', ''),
            'email': patient_info.get('email', ''),
            'phone': patient_info.get('phone', ''),
            'age': patient_info.get('age', '')
        },
        'report': {
            'report_id': report_data.get('report_id', ''),
            'date': report_data.get('consultation', {}).get('date', ''),
            'language': report_data.get('consultation', {}).get('language', '')
        },
        'medical_info': report_data.get('medical_information', {}),
        'pdf': {
            'filename': pdf_filename,
            'content': pdf_base64,
            'mime_type': 'application/pdf'
        }
    }
    
    try:
        # Send to n8n
        response = requests.post(
            N8N_WEBHOOK_URL,
            json=payload,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        response.raise_for_status()
        
        print(f"✅ Successfully sent to n8n!")
        print(f"📊 Response status: {response.status_code}")
        
        return {
            'success': True,
            'status_code': response.status_code,
            'response': response.json() if response.text else {}
        }
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to send to n8n: {str(e)}")
        
        if 'your-n8n.hostinger.com' in N8N_WEBHOOK_URL:
            print("⚠️ WARNING: You're using the default n8n URL!")
            print("💡 Update N8N_WEBHOOK_URL in .env with your actual Hostinger webhook URL")
        
        return {
            'success': False,
            'error': str(e),
            'message': 'Failed to send notification'
        }

print("✅ Notification service module loaded!")