import { getNVIDIAKeys, NVIDIA_MODELS, NVIDIA_ENDPOINTS, getNVIDIAHeaders } from '../utils/nvidiaCrypto.js';

class NVIDIAService {
  constructor() {
    this.keys = getNVIDIAKeys();
    this.models = NVIDIA_MODELS;
    this.endpoints = NVIDIA_ENDPOINTS;
  }

  // ============================================
  // VISION-LANGUAGE MODEL (Nemotron Super VL)
  // ============================================
  async analyzeImage(imageUrl, prompt) {
    try {
      const response = await fetch(this.endpoints.CHAT, {
        method: 'POST',
        headers: getNVIDIAHeaders(this.keys.vl, false),
        body: JSON.stringify({
          model: this.models.VISION_LANGUAGE,
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: imageUrl } }
            ]
          }],
          temperature: 1,
          top_p: 0.95,
          max_tokens: 16384,
          parallel_tool_calls: true,
          seed: 42,
          extra_body: {
            chat_template_kwargs: { enable_thinking: true }
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.choices[0].message.content,
        model: this.models.VISION_LANGUAGE,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Erreur Vision-Language API:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // ============================================
  // REASONING MODEL (Nemotron Bolt)
  // ============================================
  async reason(prompt) {
    try {
      const response = await fetch(this.endpoints.CHAT, {
        method: 'POST',
        headers: getNVIDIAHeaders(this.keys.guard, false),
        body: JSON.stringify({
          model: this.models.BOLT,
          messages: [{
            role: 'user',
            content: prompt
          }],
          temperature: 1,
          top_p: 0.95,
          max_tokens: 1024,
          seed: 42,
          parallel_tool_calls: true,
          chat_template_kwargs: {
            enable_thinking: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.choices[0].message.content,
        model: this.models.BOLT,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Erreur Reasoning API:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // ============================================
  // SAFETY CLASSIFIER (Llama Guard 4)
  // ============================================
  async classifySafety(content, type = 'text') {
    try {
      const messages = [{
        role: 'user',
        content: type === 'image' 
          ? [{ type: 'text', text: 'Classify the safety of this content' }, { type: 'image_url', image_url: { url: content } }]
          : content
      }];

      const response = await fetch(this.endpoints.CHAT, {
        method: 'POST',
        headers: getNVIDIAHeaders(this.keys.guard, false),
        body: JSON.stringify({
          model: this.models.GUARD,
          messages: messages,
          temperature: 0.1,
          top_p: 0.9,
          max_tokens: 256
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const classification = data.choices[0].message.content;
      
      // Parser la réponse
      const isSafe = !classification.toLowerCase().includes('unsafe');
      const categories = classification.match(/S\d+/g) || [];

      return {
        success: true,
        isSafe: isSafe,
        classification: classification,
        categories: categories,
        model: this.models.GUARD,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Erreur Safety API:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // ============================================
  // TOPIC CONTROL (Nemoguard)
  // ============================================
  async controlTopic(systemPrompt, userMessage, allowedTopics) {
    try {
      const response = await fetch(this.endpoints.CHAT, {
        method: 'POST',
        headers: getNVIDIAHeaders(this.keys.guard, false),
        body: JSON.stringify({
          model: this.models.TOPIC_CONTROL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.5,
          top_p: 1,
          max_tokens: 1024
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.choices[0].message.content,
        model: this.models.TOPIC_CONTROL,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Erreur Topic Control API:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // ============================================
  // BIOLOGY - RFDIFFUSION
  // ============================================
  async generateProtein(inputPDB, contigs, hotspotRes, diffusionSteps = 15) {
    try {
      const response = await fetch(this.endpoints.HEALTH, {
        method: 'POST',
        headers: getNVIDIAHeaders(this.keys.bio, false),
        body: JSON.stringify({
          input_pdb: inputPDB,
          contigs: contigs,
          hotspot_res: hotspotRes,
          diffusion_steps: diffusionSteps
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        outputPDB: data.output_pdb,
        model: this.models.DIFFUSION,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Erreur RFDiffusion API:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // ============================================
  // HEALTH CHECK
  // ============================================
  async healthCheck() {
    const checks = {
      visionLanguage: false,
      reasoning: false,
      safety: false,
      biology: false,
      timestamp: new Date().toISOString()
    };

    // Test Vision-Language
    try {
      const result = await this.analyzeImage(
        'https://assets.ngc.nvidia.com/products/api-catalog/phi-3-5-vision/example1a.jpg',
        'What is in this image?'
      );
      checks.visionLanguage = result.success;
    } catch (e) {
      checks.visionLanguage = false;
    }

    // Test Reasoning
    try {
      const result = await this.reason('What is 2+2?');
      checks.reasoning = result.success;
    } catch (e) {
      checks.reasoning = false;
    }

    // Test Safety
    try {
      const result = await this.classifySafety('Hello, how are you?');
      checks.safety = result.success;
    } catch (e) {
      checks.safety = false;
    }

    return checks;
  }

  // ============================================
  // GET AVAILABLE MODELS
  // ============================================
  getAvailableModels() {
    return {
      visionLanguage: {
        name: this.models.VISION_LANGUAGE,
        description: 'Vision-Language Model (120B parameters)',
        capabilities: ['Image analysis', 'Visual reasoning', 'Multimodal understanding'],
        status: this.keys.vl ? 'available' : 'unavailable'
      },
      reasoning: {
        name: this.models.BOLT,
        description: 'Reasoning Model with thinking',
        capabilities: ['Complex reasoning', 'Problem solving', 'Step-by-step analysis'],
        status: this.keys.guard ? 'available' : 'unavailable'
      },
      safety: {
        name: this.models.GUARD,
        description: 'Safety Classifier (12B parameters)',
        capabilities: ['Content safety', 'Harm detection', 'Policy compliance'],
        status: this.keys.guard ? 'available' : 'unavailable'
      },
      topicControl: {
        name: this.models.TOPIC_CONTROL,
        description: 'Topic Control Guard',
        capabilities: ['Topic filtering', 'Content moderation', 'Conversation control'],
        status: this.keys.guard ? 'available' : 'unavailable'
      },
      biology: {
        name: this.models.DIFFUSION,
        description: 'Protein Structure Generation',
        capabilities: ['Protein design', 'Structure prediction', 'Molecular engineering'],
        status: this.keys.bio ? 'available' : 'unavailable'
      }
    };
  }
}

export default new NVIDIAService();
