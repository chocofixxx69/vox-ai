# ═══════════════════════════════════════════════════════════
# WHISPER AI TRANSCRIPTION (100% FREE!)
# Converts speech to text using OpenAI's Whisper model
# Runs LOCALLY - no API key needed!
# ═══════════════════════════════════════════════════════════

from faster_whisper import WhisperModel
import os
import time
import tempfile

# Audio conversion (pydub + ffmpeg)
try:
    from pydub import AudioSegment
    PYDUB_AVAILABLE = True
    print("✅ pydub loaded — audio conversion available.")
except ImportError:
    PYDUB_AVAILABLE = False
    print("⚠️ pydub not installed — audio conversion disabled. Run: pip install pydub")

# Get model size from config
try:
    from config import WHISPER_MODEL
    MODEL_SIZE = WHISPER_MODEL
except:
    MODEL_SIZE = "small"

DEVICE = "cpu"
COMPUTE_TYPE = "int8"

print(f"🔄 Loading Whisper model: {MODEL_SIZE}...")
try:
    model = WhisperModel(MODEL_SIZE, device=DEVICE, compute_type=COMPUTE_TYPE)
    print(f"✅ Whisper model '{MODEL_SIZE}' loaded successfully!")
except Exception as e:
    print(f"⚠️ Warning loading Whisper model: {e}")
    print("Model will be downloaded on first use.")
    model = None

def convert_audio_to_wav(audio_path):
    """
    Convert any audio file to 16kHz mono WAV for optimal Whisper accuracy.
    Returns the path to the converted file (or original if conversion fails/unnecessary).
    """
    if not PYDUB_AVAILABLE:
        print("⚠️ pydub not available, using original audio file.")
        return audio_path
    
    try:
        ext = os.path.splitext(audio_path)[1].lower()
        # If already a WAV, still normalize to 16kHz mono
        print(f"🔄 Converting {ext} to 16kHz mono WAV...")
        
        audio = AudioSegment.from_file(audio_path)
        # Convert to mono, 16kHz, 16-bit — optimal for Whisper
        audio = audio.set_channels(1).set_frame_rate(16000).set_sample_width(2)
        
        wav_path = tempfile.mktemp(suffix=".wav")
        audio.export(wav_path, format="wav")
        
        print(f"✅ Audio converted: {os.path.getsize(wav_path) / 1024:.1f} KB")
        return wav_path
    except Exception as e:
        print(f"⚠️ Audio conversion failed: {e}. Using original file.")
        return audio_path

def transcribe_audio(audio_path, language=None):
    """
    Transcribe audio file to text using Whisper AI (FREE!)
    
    Args:
        audio_path (str): Path to audio file
        language (str, optional): Language code (e.g., 'en', 'es', 'hi')
    
    Returns:
        dict: Transcription results
    """
    
    global model
    
    start_time = time.time()
    
    print(f"🎤 Transcribing audio: {os.path.basename(audio_path)}")
    print(f"📏 File size: {os.path.getsize(audio_path) / 1024:.2f} KB")
    
    try:
        # Load model if not already loaded
        if model is None:
            print(f"🔄 Loading Whisper model: {MODEL_SIZE}...")
            model = WhisperModel(MODEL_SIZE, device=DEVICE, compute_type=COMPUTE_TYPE)
            print(f"✅ Model loaded!")
        
        # Convert audio to optimal format for Whisper
        converted_path = convert_audio_to_wav(audio_path)
        
        # Transcribe (Optimized for Accuracy)
        segments, info = model.transcribe(
            converted_path,
            language=language,
            beam_size=5,          # Beam search for higher accuracy
            best_of=5,            # Consider top 5 candidates
            vad_filter=True,
            vad_parameters=dict(
                min_silence_duration_ms=300,
                speech_pad_ms=200
            ),
            word_timestamps=True   # Enable word-level timestamps
        )
        
        detected_language = info.language
        language_probability = info.language_probability
        
        print(f"🌍 Detected language: {detected_language} ({language_probability:.2%} confidence)")
        
        # Collect segments
        full_text = []
        segment_list = []
        
        for segment in segments:
            full_text.append(segment.text)
            segment_list.append({
                'start': segment.start,
                'end': segment.end,
                'text': segment.text
            })
            print(f"⏱️ [{segment.start:.2f}s → {segment.end:.2f}s] {segment.text}")
        
        transcription = " ".join(full_text)
        processing_time = time.time() - start_time
        
        # Cleanup converted file if different from original
        if converted_path != audio_path and os.path.exists(converted_path):
            os.remove(converted_path)
        
        print(f"✅ Transcription complete! ({processing_time:.2f}s)")
        print(f"📝 Text length: {len(transcription)} characters")
        
        return {
            'text': transcription.strip(),
            'language': detected_language,
            'language_probability': language_probability,
            'segments': segment_list,
            'processing_time': processing_time,
            'word_count': len(transcription.split())
        }
        
    except Exception as e:
        print(f"❌ Transcription error: {str(e)}")
        import traceback
        traceback.print_exc()
        # Return error instead of fake demo data
        return {
            'text': f"[Transcription failed: {str(e)}]",
            'language': 'unknown',
            'language_probability': 0,
            'segments': [],
            'processing_time': 0,
            'word_count': 0,
            'is_error': True
        }

print("✅ Whisper transcription module loaded!")