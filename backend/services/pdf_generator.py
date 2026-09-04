# ═══════════════════════════════════════════════════════════
# PDF GENERATOR
# Creates professional medical reports in PDF format
# ═══════════════════════════════════════════════════════════

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from datetime import datetime
import os

try:
    from config import PDF_FOLDER
except:
    PDF_FOLDER = 'pdfs'
    os.makedirs(PDF_FOLDER, exist_ok=True)

def generate_pdf(report_data, patient_info, clinic_info=None):
    """
    Generate professional PDF medical report
    
    Args:
        report_data (dict): Complete report data
        patient_info (dict): Patient information
        clinic_info (dict, optional): Clinic branding information
    
    Returns:
        str: Path to generated PDF file
    """
    
    print("📄 Generating PDF report...")
    
    # Clinic Defaults
    clinic_name = clinic_info.get('name', 'VoxAI') if clinic_info else 'VoxAI'
    clinic_address = clinic_info.get('address', '') if clinic_info else ''
    clinic_phone = clinic_info.get('phone', '') if clinic_info else ''
    clinic_website = clinic_info.get('website', '') if clinic_info else ''
    
    # Generate filename
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    patient_name = patient_info.get('name', 'patient').replace(' ', '_')
    filename = f"medical_report_{patient_name}_{timestamp}.pdf"
    filepath = os.path.join(PDF_FOLDER, filename)
    
    # Create PDF
    doc = SimpleDocTemplate(
        filepath,
        pagesize=A4,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=36
    )
    
    elements = []
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=6,
        alignment=TA_LEFT,
        fontName='Helvetica-Bold'
    )
    
    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#64748B'),
        spaceAfter=20,
        alignment=TA_LEFT
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=12,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=10,
        spaceBefore=15,
        fontName='Helvetica-Bold',
        borderPadding=(0, 0, 2, 0),
        borderWidth=0,
        borderColor=colors.HexColor('#E2E8F0')
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#334155'),
        spaceAfter=6,
        alignment=TA_LEFT,
        leading=14
    )
    
    bold_style = ParagraphStyle(
        'CustomBold',
        parent=normal_style,
        fontName='Helvetica-Bold'
    )

    # Header Section
    elements.append(Paragraph(clinic_name.upper(), title_style))
    header_text = f"{clinic_address} | Tel: {clinic_phone}" if clinic_address and clinic_phone else clinic_address or clinic_phone
    if clinic_website:
        header_text += f" | {clinic_website}"
    
    if header_text:
        elements.append(Paragraph(header_text, subtitle_style))
    
    elements.append(Paragraph("<b>MEDICAL CONSULTATION REPORT</b>", ParagraphStyle('Centered', parent=normal_style, alignment=TA_CENTER, fontSize=12, spaceBefore=10, spaceAfter=20)))
    
    # Report Meta Section (Table)
    meta_data = [
        [Paragraph("<b>Patient Details</b>", bold_style), Paragraph("<b>Consultation Info</b>", bold_style)],
        [
            Paragraph(f"Name: {patient_info.get('name', 'N/A')}<br/>Age: {patient_info.get('age', 'N/A')}<br/>Phone: {patient_info.get('phone', 'N/A')}", normal_style),
            Paragraph(f"Date: {datetime.now().strftime('%d %b %Y')}<br/>ID: #VX-{report_data.get('report_id', 'N/A')[:8]}", normal_style)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[2.75*inch, 2.75*inch])
    meta_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LINEBELOW', (0,0), (-1,0), 1, colors.HexColor('#E2E8F0')),
        ('BOTTOMPADDING', (0,0), (-1,0), 6),
        ('TOPPADDING', (0,1), (-1,1), 6),
    ]))
    elements.append(meta_table)
    elements.append(Spacer(1, 0.2*inch))
    
    # Medical Information Section
    medical_info = report_data.get('medical_information', {})
    
    # 1. Clinical Observations
    elements.append(Paragraph("CLINICAL OBSERVATIONS", heading_style))
    
    obs_data = []
    diagnoses = medical_info.get('diagnoses', [])
    if diagnoses:
        obs_data.append([Paragraph("<b>Diagnosis:</b>", normal_style), Paragraph(", ".join(diagnoses), normal_style)])
    
    symptoms = medical_info.get('symptoms', [])
    if symptoms:
        obs_data.append([Paragraph("<b>Symptoms:</b>", normal_style), Paragraph(", ".join(symptoms), normal_style)])
    
    if obs_data:
        obs_table = Table(obs_data, colWidths=[1.2*inch, 4.3*inch])
        obs_table.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
        elements.append(obs_table)
    
    # 2. Medications
    medications = medical_info.get('medications', [])
    if medications:
        elements.append(Paragraph("PRESCRIBED MEDICATIONS", heading_style))
        med_list = []
        for med in medications:
            med_info = f"<b>{med.get('name', 'N/A')}</b> - {med.get('dosage', 'N/A')} ({med.get('frequency', 'N/A')})"
            if med.get('duration'):
                med_info += f" for {med.get('duration')}"
            if med.get('instructions'):
                med_info += f"<br/><font size=9 color='#64748B'><i>Note: {med.get('instructions')}</i></font>"
            med_list.append([Paragraph(f"•", normal_style), Paragraph(med_info, normal_style)])
        
        med_table = Table(med_list, colWidths=[0.2*inch, 5.3*inch])
        med_table.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('BOTTOMPADDING', (0,0), (-1,-1), 8)]))
        elements.append(med_table)

    # 3. Recommendations & Follow-up
    recs = medical_info.get('recommendations', [])
    prohibitions = medical_info.get('prohibitions', [])
    
    if recs or prohibitions:
        elements.append(Paragraph("ADVICE & RECOMMENDATIONS", heading_style))
        advice_list = []
        for r in recs:
            advice_list.append([Paragraph("•", normal_style), Paragraph(r, normal_style)])
        for p in prohibitions:
            advice_list.append([Paragraph("•", normal_style), Paragraph(f"<b>AVOID:</b> {p}", normal_style)])
        
        advice_table = Table(advice_list, colWidths=[0.2*inch, 5.3*inch])
        advice_table.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
        elements.append(advice_table)

    follow_up = medical_info.get('follow_up', '')
    if follow_up:
        elements.append(Spacer(1, 0.15*inch))
        elements.append(Paragraph(f"<b>FOLLOW-UP:</b> {follow_up}", normal_style))

    # 4. Transcription (Optional, smaller font)
    transcription = report_data.get('transcription', {}).get('full_text', '')
    if transcription:
        elements.append(Paragraph("CONSULTATION NOTES", heading_style))
        elements.append(Paragraph(transcription, ParagraphStyle('Notes', parent=normal_style, fontSize=8, textColor=colors.HexColor('#64748B'), leading=10, italic=True)))

    # Footer Template
    elements.append(Spacer(1, 0.3*inch))
    footer_text = clinic_info.get('footer_template', "This report was generated by VoxAI.") if clinic_info else "This report was generated by VoxAI."
    
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.grey,
        alignment=TA_CENTER,
        spaceBefore=20
    )
    
    elements.append(Paragraph(footer_text, footer_style))
    elements.append(Paragraph(f"Verification Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}", footer_style))
    
    # Build PDF
    doc.build(elements)
    
    print(f"✅ PDF generated: {filename}")
    return filepath

print("✅ PDF generator module loaded!")