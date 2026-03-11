import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const ACCENT_OPTIONS = [
  { id: 'auto', label: 'Auto Detect', lang: '' },
  { id: 'en-us', label: 'American English', lang: 'en-US' },
  { id: 'en-gb', label: 'British English', lang: 'en-GB' },
  { id: 'en-au', label: 'Australian English', lang: 'en-AU' },
  { id: 'en-in', label: 'Indian English', lang: 'en-IN' },
  { id: 'en-za', label: 'South African English', lang: 'en-ZA' },
];

function getRecognitionCtor() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function isSecureMicContext() {
  if (window.isSecureContext) return true;
  const host = window.location?.hostname || '';
  return host === 'localhost' || host === '127.0.0.1';
}

function getMicBlockedGuidance() {
  const host = window.location?.hostname || 'this site';
  return `Microphone access is blocked. In your browser, open Site settings for ${host} and set Microphone to Allow, then reload this page.`;
}

function detectDeviceProfile() {
  const ua = navigator.userAgent || '';
  const mobile = /Android|iPhone|iPad|iPod/i.test(ua);
  const ios = /iPhone|iPad|iPod/i.test(ua);
  const android = /Android/i.test(ua);
  const windows = /Windows/i.test(ua);
  const mac = /Macintosh|Mac OS X/i.test(ua);
  return {
    mobile,
    ios,
    android,
    windows,
    mac,
    browser: /Edg\//i.test(ua)
      ? 'edge'
      : /Chrome\//i.test(ua)
        ? 'chrome'
        : /Safari\//i.test(ua)
          ? 'safari'
          : /Firefox\//i.test(ua)
            ? 'firefox'
            : 'unknown',
  };
}

export function useVoiceAssistant({ onTranscriptFinal, onRecognitionError }) {
  const recognitionRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const volumeRafRef = useRef(0);
  const utteranceRef = useRef(null);

  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isVoiceAwake, setIsVoiceAwake] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognitionError, setRecognitionError] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [micPermission, setMicPermission] = useState('prompt');
  const [selectedAccent, setSelectedAccent] = useState('auto');
  const [voices, setVoices] = useState([]);
  const [voiceUri, setVoiceUri] = useState('');
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);
  const [autoPlay, setAutoPlay] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeechPaused, setIsSpeechPaused] = useState(false);
  const [spokenMessageId, setSpokenMessageId] = useState(null);
  const [spokenCharIndex, setSpokenCharIndex] = useState(0);

  const support = useMemo(() => {
    const recognitionCtor = getRecognitionCtor();
    const hasRecognition = Boolean(recognitionCtor);
    const hasSynthesis = 'speechSynthesis' in window;
    const hasMedia = Boolean(navigator.mediaDevices?.getUserMedia);
    return {
      hasRecognition,
      hasSynthesis,
      hasMedia,
      recognitionCtor,
      device: detectDeviceProfile(),
    };
  }, []);

  const selectedVoice = useMemo(
    () => voices.find((voice) => voice.voiceURI === voiceUri) || null,
    [voices, voiceUri],
  );

  const selectedLang = useMemo(() => {
    const option = ACCENT_OPTIONS.find((item) => item.id === selectedAccent);
    if (!option || !option.lang) return navigator.language || 'en-US';
    return option.lang;
  }, [selectedAccent]);

  const stopVolumeMeter = useCallback(() => {
    if (volumeRafRef.current) {
      window.cancelAnimationFrame(volumeRafRef.current);
      volumeRafRef.current = 0;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setVolumeLevel(0);
  }, []);

  const startVolumeMeter = useCallback(async () => {
    if (!support.hasMedia) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          noiseSuppression: true,
          echoCancellation: true,
          autoGainControl: true,
        },
      });
      setMicPermission('granted');
      mediaStreamRef.current = stream;
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyserRef.current = analyser;
      source.connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);
      const loop = () => {
        if (!analyserRef.current) return;
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i += 1) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        setVolumeLevel(Math.min(1, rms * 2.6));
        volumeRafRef.current = window.requestAnimationFrame(loop);
      };
      loop();
    } catch {
      setMicPermission('denied');
      throw new Error('mic-permission-denied');
    }
  }, [support.hasMedia]);

  const requestMicPermission = useCallback(async () => {
    if (!support.hasMedia) return false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setMicPermission('granted');
      setRecognitionError('');
      return true;
    } catch {
      setMicPermission('denied');
      return false;
    }
  }, [support.hasMedia]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    stopVolumeMeter();
    setIsListening(false);
    setIsProcessing(false);
  }, [stopVolumeMeter]);

  const startListening = useCallback(async () => {
    if (!isVoiceEnabled || !isVoiceAwake) return;
    if (!support.hasRecognition) {
      setRecognitionError('Speech recognition is not supported in this browser.');
      return;
    }

    if (!isSecureMicContext()) {
      const msg = 'Voice input requires a secure context. Open this site on HTTPS or use localhost.';
      setRecognitionError(msg);
      onRecognitionError?.(msg);
      return;
    }

    if (micPermission === 'denied') {
      const msg = getMicBlockedGuidance();
      setRecognitionError(msg);
      onRecognitionError?.(msg);
      return;
    }

    const permissionGranted = await requestMicPermission();
    if (!permissionGranted) {
      const msg = getMicBlockedGuidance();
      setRecognitionError(msg);
      onRecognitionError?.(msg);
      return;
    }

    try {
      if (!recognitionRef.current) {
        const RecognitionCtor = support.recognitionCtor;
        const recognition = new RecognitionCtor();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 3;
        recognitionRef.current = recognition;
      }

      const recognition = recognitionRef.current;
      recognition.lang = selectedLang;

      recognition.onstart = () => {
        setRecognitionError('');
        setIsListening(true);
        setIsProcessing(false);
        setInterimTranscript('');
      };

      recognition.onresult = (event) => {
        let interim = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const result = event.results[i];
          const transcript = result[0]?.transcript || '';
          const score = result[0]?.confidence || 0;
          setConfidence(score);
          if (result.isFinal) {
            finalText += transcript;
          } else {
            interim += transcript;
          }
        }

        setInterimTranscript(interim.trim());

        if (finalText.trim()) {
          setIsProcessing(true);
          onTranscriptFinal?.(finalText.trim(), {
            confidence,
            language: recognition.lang,
          });
          setIsProcessing(false);
        }
      };

      recognition.onerror = (event) => {
        const msg = event?.error === 'not-allowed' || event?.error === 'service-not-allowed'
          ? getMicBlockedGuidance()
          : event?.error === 'audio-capture'
            ? 'No working microphone was found. Connect a microphone and try again.'
            : event?.error === 'network'
              ? 'Voice recognition network error. Please retry.'
              : 'Voice recognition failed. Please speak clearly and try again.';
        setRecognitionError(msg);
        onRecognitionError?.(msg);
      };

      recognition.onend = () => {
        setIsListening(false);
        stopVolumeMeter();
      };

      await startVolumeMeter();
      recognition.start();
    } catch (error) {
      const msg = error?.message === 'mic-permission-denied'
        ? getMicBlockedGuidance()
        : 'Unable to start voice recognition.';
      setRecognitionError(msg);
      onRecognitionError?.(msg);
      stopVolumeMeter();
    }
  }, [confidence, isVoiceAwake, isVoiceEnabled, micPermission, onRecognitionError, onTranscriptFinal, requestMicPermission, selectedLang, startVolumeMeter, stopVolumeMeter, support.hasRecognition, support.recognitionCtor]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
      return;
    }
    startListening();
  }, [isListening, startListening, stopListening]);

  const stopSpeaking = useCallback(() => {
    if (!support.hasSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeechPaused(false);
    setIsSpeaking(false);
    setSpokenMessageId(null);
    setSpokenCharIndex(0);
  }, [support.hasSynthesis]);

  const pauseSpeaking = useCallback(() => {
    if (!support.hasSynthesis) return;
    window.speechSynthesis.pause();
    setIsSpeechPaused(true);
  }, [support.hasSynthesis]);

  const resumeSpeaking = useCallback(() => {
    if (!support.hasSynthesis) return;
    window.speechSynthesis.resume();
    setIsSpeechPaused(false);
  }, [support.hasSynthesis]);

  const speak = useCallback((text, messageId = null) => {
    if (!support.hasSynthesis || !text?.trim()) return;

    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;
    utterance.lang = selectedVoice?.lang || selectedLang;
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpokenMessageId(messageId);
      setSpokenCharIndex(0);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsSpeechPaused(false);
      setSpokenMessageId(null);
      setSpokenCharIndex(0);
    };
    utterance.onboundary = (event) => {
      if (typeof event.charIndex === 'number') {
        setSpokenCharIndex(event.charIndex);
      }
    };

    window.speechSynthesis.speak(utterance);
  }, [selectedLang, selectedVoice, speechPitch, speechRate, stopSpeaking, support.hasSynthesis]);

  useEffect(() => {
    if (!support.hasSynthesis) return undefined;

    const updateVoices = () => {
      const list = window.speechSynthesis.getVoices() || [];
      setVoices(list);
      if (!voiceUri && list.length) {
        const preferred = list.find((voice) => /en-/i.test(voice.lang)) || list[0];
        setVoiceUri(preferred.voiceURI);
      }
    };

    updateVoices();
    window.speechSynthesis.addEventListener('voiceschanged', updateVoices);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', updateVoices);
    };
  }, [support.hasSynthesis, voiceUri]);

  useEffect(() => {
    if (!navigator.permissions?.query) return undefined;
    let active = true;
    navigator.permissions
      .query({ name: 'microphone' })
      .then((status) => {
        if (!active) return;
        setMicPermission(status.state);
        status.onchange = () => setMicPermission(status.state);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => () => {
    stopListening();
    stopSpeaking();
  }, [stopListening, stopSpeaking]);

  const compatibility = useMemo(() => {
    const fullSupport = support.hasRecognition && support.hasSynthesis && support.hasMedia;
    return {
      fullSupport,
      recognition: support.hasRecognition,
      synthesis: support.hasSynthesis,
      media: support.hasMedia,
      voicesCount: voices.length,
      micPermission,
      device: support.device,
      summary: fullSupport
        ? 'Your browser supports voice features fully.'
        : support.hasRecognition || support.hasSynthesis
          ? 'Limited voice support. Chrome or Edge is recommended for best results.'
          : 'Voice features are not available in this browser.',
    };
  }, [micPermission, support.device, support.hasMedia, support.hasRecognition, support.hasSynthesis, voices.length]);

  return {
    support,
    compatibility,
    accents: ACCENT_OPTIONS,
    selectedAccent,
    setSelectedAccent,
    isVoiceEnabled,
    setIsVoiceEnabled,
    isVoiceAwake,
    setIsVoiceAwake,
    isListening,
    isProcessing,
    recognitionError,
    interimTranscript,
    confidence,
    volumeLevel,
    micPermission,
    requestMicPermission,
    startListening,
    stopListening,
    toggleListening,
    voices,
    voiceUri,
    setVoiceUri,
    speechRate,
    setSpeechRate,
    speechPitch,
    setSpeechPitch,
    autoPlay,
    setAutoPlay,
    isSpeaking,
    isSpeechPaused,
    spokenMessageId,
    spokenCharIndex,
    speak,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
  };
}
