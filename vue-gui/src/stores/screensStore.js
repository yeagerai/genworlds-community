import { defineStore } from 'pinia';

export const useScreensStore = defineStore({
    id: 'screens',
    state: () => ({
        name: "",
        screens: [],
        settings: {},
        activeScreenName: '',
        screensHaveBeenLoaded: false,
    }),
    actions: {
        initializeScreens(screensConfig) {
            this.name = screensConfig.name;
            this.screens = screensConfig.screens;
            this.settings = screensConfig.settings;

            if (this.screens.length > 0) {
                this.activeScreenName = this.screens[0].name;
            }
            this.screensHaveBeenLoaded = true;
            for (const screen of this.screens) {
                screen.eventHistory = [];
            }
        },
        setActiveScreen(screenName) {
            if (this.screens.some(screen => screen.name === screenName)) {
                this.activeScreenName = screenName;
            } else {
                console.error(`No screen found with the name: ${screenName}`);
            }
        },
        addEventToScreenHistory(screenName, event) {
            const screen = this.screens.find(s => s.name === screenName);
            if (screen) {
                if (!screen.eventHistory) {
                    screen.eventHistory = [];
                }
                screen.eventHistory.push(event);
            } else {
                console.error(`No screen found with the name: ${screenName}`);
            }
        },
        addEventToApplicableScreensHistory(event) {
            this.screens.forEach(screen => {
                const isEventTracked = screen.tracked_events.some(te => te.event_type === event.event_type);
                if (isEventTracked) {
                    if (!screen.eventHistory) {
                        screen.eventHistory = [];
                    }
                    screen.eventHistory.push(event);
                }
            });
        },
        // Additional utility functions based on your needs.
    }
});
