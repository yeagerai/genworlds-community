import axios from 'axios';
import { APISettings } from '../config';
import { useSettingsStore } from '@/stores/settingsStore';



export default {
    baseUrl() {
        const currentUrl = window.location.hostname;
        const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
        const port = 9000;
        return `${protocol}://${currentUrl}:${port}/world-instance`
    },

    headers() {
        const headers = {...APISettings.headers};

        const settingsStore = useSettingsStore();
        if (settingsStore.settings.openaiApiKey) {
            headers['openai-api-key'] = settingsStore.settings.openaiApiKey.trim();
        }

        return headers;
    },

    async listUseCases() {
        console.log(`${this.baseUrl()}/use-case-list`)
        try {
            const response = await axios.get(
                `${this.baseUrl()}/use-case-list`,
                { 
                    headers: this.headers(),
                }
            );
            return response.data;
        } catch (error) {
            return error;
        }        
    },

    async triggerUseCase(useCase, worldDefinition) {
        try {
            const response = await axios.get(
                `${this.baseUrl()}/trigger-use-case/${useCase}/${worldDefinition}`,
                { 
                    headers: this.headers(),
                }
            );
            return response.data;
        } catch (error) {
            return error;
        }    
    },

    async stopAllUseCases() {
        try {
            const response = await axios.get(
                `${this.baseUrl()}/kill-all-use-cases`,
                { 
                    headers: this.headers(),
                }
            );
            return response.data;
        } catch (error) {
            return error;
        }    
    },
}