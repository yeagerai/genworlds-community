import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settingsStore', {
  state: () => ({
    settings: {
      openaiApiKey: '',
      elevenLabsApiKey: '',
    },
  }),
  actions: {
    updateSettings(partialSettings) {
      this.settings = {
        ...this.settings,
        ...partialSettings,
      }
    },
  },
  persist: true,
})