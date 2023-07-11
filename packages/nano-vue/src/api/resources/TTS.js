import { useSettingsStore } from '@/stores/settingsStore';



export default {
    baseUrl() {
        return `https://api.elevenlabs.io/v1/text-to-speech`
    },

    headers() {
        const headers = {
            "Content-Type": "application/json",
            accept: 'audio/mpeg',
            responseType: "arraybuffer",
        };

        const settingsStore = useSettingsStore();
        if (settingsStore.settings.elevenLabsApiKey) {
            headers['xi-api-key'] = settingsStore.settings.elevenLabsApiKey.trim();
        }

        return headers;
    },

    async convert(voiceId, text, optimizeStreamingLatency = 0) {
        const body = {
            "text": text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
              "stability": 0.33,
              "similarity_boost": 0,
              "style": 0.5,
              "use_speaker_boost": false
            }
        }

        const options = {
            headers: this.headers(),
            method: 'POST',
            body: JSON.stringify(body),
        }

        const response = await fetch(`${this.baseUrl()}/${voiceId}/stream?`+new URLSearchParams({
            optimize_streaming_latency: optimizeStreamingLatency,
        }), options);
        return response.blob();
    },
}