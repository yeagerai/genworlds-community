<template>
  <div class="min-h-screen p-8 bg-gray-50" v-if="screens.length > 0">
    <div v-if="websocketPort === 7455" class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8" role="alert">
      <p class="font-bold">WARNING Mocked Data:</p>
      <p>You are currently connected to a simulated socket, which means that the data you are seeing has been pre-recorded and is not live. To initiate a real-time simulation, please configure the environment variables as outlined in the .env.example file.</p>
    </div>
    <h1 class="mb-6 text-4xl font-semibold text-blue-600">{{ useCaseName }}</h1>
    <div class="flex mb-4">
      <button
        v-for="screen in screens"
        :key="screen.name"
        @click="activeScreen = screen.name"
        :class="{ 'border-b-4 border-blue-600': activeScreen === screen.name }"
        class="px-4 py-2 mr-4 text-lg text-blue-500 hover:text-blue-700"
      >
        {{ screen.name }}
      </button>
    </div>
    <div v-if="activeScreenObject" class="p-6 bg-white rounded-lg shadow-md">
        <ul class="space-y-4">
            <li v-for="event in activeScreenObject.tracked_events" :key="event.event_type" class="mb-4">
                <div class="p-3 rounded-lg bg-blue-100 ml-10 mr-10">
                    <div v-for="field in event.fields_to_display" :key="field.name">
                        <div v-if="field.name === 'sender_id'" class="font-bold text-xs text-gray-600">
                            Sender: {{ field.data }}
                        </div>
                        <div v-if="field.name === 'message'" class="text-sm">
                            {{ field.data }}
                        </div>
                        <div v-if="field.name === 'created_at'" class="text-xs text-gray-500 text-right">
                            {{ field.data }}
                        </div>
                        <div v-if="field.name === 'description'" class="text-xs text-gray-500">
                            Description: {{ field.data }}
                        </div>
                        <div v-if="field.name === 'event_type'" class="text-xs text-gray-500">
                            Event Type: {{ field.data }}
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import ReconnectingWebSocket from 'reconnecting-websocket';

export default {
  data() {
    return {
      activeScreen: '',
      screens: [],
      useCaseName: '',
      websocketPort: null,
    };
  },
  async mounted() {
    // Fetch configuration from REST API
    const config = await this.fetchConfig();
    // Set the screens
    this.screens = config.event_stream_config.screens;
    if (this.screens.length > 0) {
      this.activeScreen = this.screens[0].name;
    }

    // Set the use case name
    this.useCaseName = config.name;

    // Connect to WebSocket
    this.websocketPort = config.port;
    this.connectToWebSocket();
  },
  computed: {
    activeScreenObject() {
        return this.screens.find(screen => screen.name === this.activeScreen);
    }
  },
  methods: {
    async fetchConfig() {
      try {
        const slug = this.$route.params.slug;
        const response = await axios.get(`http://localhost:7457/trigger-use-case/${slug}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching config:', error);
      }
      return { screens: [], settings: {} };
    },
    connectToWebSocket() {
    const rws = new ReconnectingWebSocket(`ws://localhost:${this.websocketPort}/ws`);

    rws.addEventListener('message', (msg) => {
        const { event_type, description, created_at, message, sender_id } = JSON.parse(msg.data);
        console.log('Received message:', event_type, description);

        const newScreens = this.screens.map(screen => {
            const trackedEvents = screen.tracked_events ? [...screen.tracked_events] : [];

            // Check if event with the same created_at already exists
            const eventExists = trackedEvents.some(event => event.created_at === created_at);

            if (!eventExists) {
                const newFields = [
                    { name: 'description', data: description},
                    { name: 'event_type', data: event_type},
                    { name: 'created_at', data: created_at},
                    { name: 'sender_id', data: sender_id},
                    { name: 'message', data: message}
                ];

                trackedEvents.push({ event_type, fields_to_display: newFields, created_at });
            }

            return { ...screen, tracked_events: trackedEvents };
        });

        this.screens = [...newScreens];
    });
}},
};
</script>

<style scoped>
[format*="bold"] {
  font-weight: bold;
}
</style>
