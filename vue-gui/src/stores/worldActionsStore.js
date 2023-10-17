import { defineStore } from 'pinia';

export const useUseCaseActionStore = defineStore({
  id: 'useCaseActionStore',
  state: () => ({
    performStopUseCaseAction: false,
    performRestartUseCaseAction: false,
    performDownloadUseCaseEventHistoryAction: false,
  }),
  actions: {
    setPerformStopUseCaseAction(value) {
      this.performStopUseCaseAction = value;
    },
    setPerformRestartUseCaseAction(value) {
      this.performRestartUseCaseAction = value;
    },
    setPerformDownloadUseCaseEventHistoryAction(value) {
      this.performDownloadUseCaseEventHistoryAction = value;
    },
  }
});