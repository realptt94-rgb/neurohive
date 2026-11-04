import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'neurohive_autonomous_2026_secure_key';

// Décoder Base64 et décrypter les clés API
export function decryptAPIKey(encodedKey) {
  try {
    // Décoder Base64
    const decoded = Buffer.from(encodedKey, 'base64').toString('utf-8');
    return decoded;
  } catch (error) {
    console.error('❌ Erreur décryptage clé API:', error);
    return null;
  }
}

// Récupérer toutes les clés API NVIDIA
export function getNVIDIAKeys() {
  return {
    vl: decryptAPIKey(process.env.NVIDIA_API_KEY_VL),
    guard: decryptAPIKey(process.env.NVIDIA_API_KEY_GUARD),
    bio: decryptAPIKey(process.env.NVIDIA_API_KEY_BIO),
  };
}

// Configuration des modèles NVIDIA
export const NVIDIA_MODELS = {
  VISION_LANGUAGE: process.env.NVIDIA_MODEL_VL || 'nvidia/nemotron-3.5-super-vl-120b-a12b',
  BOLT: process.env.NVIDIA_MODEL_BOLT || 'nvidia/nemotron-3.5-bolt-e4b',
  GUARD: process.env.NVIDIA_MODEL_GUARD || 'meta/llama-guard-4-12b',
  TOPIC_CONTROL: process.env.NVIDIA_MODEL_TOPIC || 'nvidia/llama-3.1-nemoguard-8b-topic-control',
  DIFFUSION: process.env.NVIDIA_MODEL_DIFFUSION || 'ipd/rfdiffusion',
};

// Endpoints API NVIDIA
export const NVIDIA_ENDPOINTS = {
  CHAT: `${process.env.NVIDIA_API_BASE || 'https://integrate.api.nvidia.com/v1'}/chat/completions`,
  HEALTH: `${process.env.NVIDIA_HEALTH_API || 'https://health.api.nvidia.com/v1'}/biology/ipd/rfdiffusion/generate`,
};

// Headers pour API NVIDIA
export function getNVIDIAHeaders(apiKey, stream = false) {
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Accept': stream ? 'text/event-stream' : 'application/json',
    'Content-Type': 'application/json',
  };
}
