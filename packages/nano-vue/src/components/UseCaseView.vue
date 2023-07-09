<template>
  <div v-if="screens.length > 0" class="p-4 flex flex-col h-full">
    <div v-if="showAlert && websocketPort === 7455" class="alert alert-warning mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      <p>You are currently connected to a simulated websocket server, which means that the data you are seeing has been pre-recorded and is not live. To initiate a real-time simulation, please configure the environment variables as outlined in the .env.example file.</p>

      <button @click="showAlert = false" class="btn btn-sm">OK</button>
    </div>
    <!-- <h1 class="text-xl mb-4">{{ useCaseName }}</h1> -->
    <div class="tabs tabs-boxed mb-4">
      <button
        v-for="screen in screens"
        :key="screen.name"
        @click="handleTabClick(screen.name)"
        :class="{ 'tab-active': activeScreen === screen.name }"
        class="tab"
      >
        {{ screen.name }}
      </button>
      <button
        :key="'16bit'"
        @click="handleTabClick('16bit')"
        :class="{ 'tab-active': activeScreen === '16bit' }"
        class="tab"
      >
        16bit
      </button>
    </div>
    <div class="overflow-y-auto flex-1 mb-4" ref="chatContainer">
      <div v-if="shouldRenderIframe" class="w-full h-full">
          <iframe 
            :src="iframeSrc" 
            class="w-full h-full"
            frameborder="0"
            allow="autoplay; encrypted-media" 
            allowfullscreen
            >
          </iframe>
      </div>
      <div v-else>
        <div v-if="activeScreenObject" class="p-6 rounded-lg shadow-md">
            <ul class="space-y-4">
              <li v-for="(event, index) in activeScreenObject.event_history" :key="index">
                <div class="chat chat-start">
                  <div class="chat-header">
                    From: {{ getFieldValue(event, 'sender_id') }}                    
                    <time class="text-xs opacity-50">{{ getFieldValue(event, 'created_at') }}</time>
                  </div>
                  <div class="chat-bubble" :class="getEventCssClasses(event)">
                    <template v-if="getFieldValue(event, 'message')">
                      {{ getFieldValue(event, 'message') }}
                    </template>
                    <template v-else-if="getFieldValue(event, 'summary')">
                      {{ getFieldValue(event, 'summary') }}
                    </template>
                    <template v-else>
                      <pre class="overflow-x-auto"><code>{{ JSON.stringify(event, null, 2) }}</code></pre>
                    </template>
                  </div>
                  <div class="chat-footer">
                    <p class="text-xs opacity-50">Event Type: {{ getFieldValue(event, 'event_type') }}</p>
                  </div>
                </div>
              </li>
              <li class="pl-[12px]">
                <span class="loading loading-dots loading-lg"></span>
              </li>
            </ul>
        </div>
      </div>
    </div>
    <!-- <textarea class="textarea w-full" placeholder="SendEvent" disabled></textarea> -->
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
      showAlert: true,
      webSocket: null,
      fullEventHistory: [],
    };
  },
  props: ['use_case', 'world_definition'],
  watch: {
    'activeScreenObject.tracked_events': {
      handler() {
        this.$nextTick(() => {
          const container = this.$refs.chatContainer;
          if (container) {
            // Check if the user is near the bottom
            const isNearBottom =
              container.scrollHeight - container.scrollTop - container.clientHeight < 400;

            // Only scroll to the bottom if the user is near the bottom
            if (isNearBottom) {
              container.scrollTo({top: container.scrollHeight, behavior: 'instant'});
            }
          }
        });
      },
      deep: true,
    },
    $route(to,) {
      this.loadUseCase(to.params.use_case, to.params.world_definition);
    },
  },
  async mounted() {
    this.loadUseCase(this.use_case, this.world_definition);

    this._keyListener = function(e) {
        if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault(); // present "Save Page" from getting triggered.

            this.downloadEventHistory();
        }
    };

    document.addEventListener('keydown', this._keyListener.bind(this));  

  },
  beforeUnmount() {
      document.removeEventListener('keydown', this._keyListener);
  },
  computed: {
    activeScreenObject() {
        return this.screens.find(screen => screen.name === this.activeScreen);
    },
    shouldRenderIframe() {
    return this.activeScreen === '16bit';
  },
  iframeSrc() {
      const currentUrl = window.location.origin;
      return `${currentUrl}:9000/16bit-front/?tankId=1`;
    }
  },
  methods: {
    handleTabClick(screenName) {
        console.log('Tab clicked:', screenName);
        this.activeScreen = screenName;
    },
    async loadUseCase(use_case, world_definition) {     
      console.log('Loading use case:', use_case, world_definition)
      
      // Fetch configuration from REST API
      const config = await this.fetchConfig(use_case, world_definition);
      // Set the screens
      this.screens = config.event_stream_config.screens;
      for (const screen of this.screens) {
        screen.event_history = [];
      }
      if (this.screens.length > 0) {
        this.activeScreen = this.screens[0].name;
      }

      // Set the use case name
      this.useCaseName = config.event_stream_config.name;

      // Connect to WebSocket
      this.websocketPort = config.port;
      this.connectToWebSocket();
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.chatContainer;
        if (container) {
          const lastMessage = container.lastElementChild;
          if (lastMessage) {
            lastMessage.scrollIntoView(false);
          }
        }
      });
    },
    getFieldValue(event, fieldName) {
      return fieldName in event ? event[fieldName] : '';
    },
    getEventCssClasses(event) {
      const eventInfo = this.activeScreenObject.tracked_events.find((trackedEvent) => trackedEvent.event_type === event.event_type);
      return 'css_classes' in eventInfo ? eventInfo.css_classes : '';
    },
    async fetchConfig(use_case, world_definition) {
      try {
        const currentUrl = window.location.host;
        let protocol = window.location.protocol === 'https:' ? 'https' : 'http';
        const response = await axios.get(`${protocol}://${currentUrl}:9000/world-instance/trigger-use-case/${use_case}/${world_definition}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching config:', error);
      }
      return { screens: [], settings: {} };
    },
    connectToWebSocket() {
      if (this.webSocket) {
        this.webSocket.close();
      }
      let wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const currentHost = window.location.host;
      let wsUrl;
      
      if (this.websocketPort == 7456) {
          wsUrl = `${wsProtocol}://${currentHost}:9000/real-ws/ws`;
      } else {
          wsUrl = `${wsProtocol}://${currentHost}:9000/mocked-ws/ws`;
      }
      this.webSocket = new ReconnectingWebSocket(wsUrl, [], {maxRetries: 0});

      this.webSocket.addEventListener('message', (msg) => {
        const socketEvent = JSON.parse(msg.data);
        console.log('Received message:', socketEvent)

        this.fullEventHistory.push(socketEvent);
        
        // Check if the message contains all necessary data
        if (!socketEvent || socketEvent.event_type === null || socketEvent.event_type === undefined || socketEvent.created_at === null || socketEvent.created_at === undefined) {
            console.warn('Invalid message received:', msg.data);
            return; // Don't process this message
        } 

        for (const screen of this.screens) {
            for (const trackedEvent of screen.tracked_events) {
                if (trackedEvent.event_type === socketEvent.event_type) {
                    const filteredEvent = {
                        event_type: socketEvent.event_type,
                        created_at: socketEvent.created_at,
                        sender_id: socketEvent.sender_id,
                    }

                    for (const field of trackedEvent.fields_to_display) {
                        filteredEvent[field.name] = socketEvent[field.name];
                    }

                    screen.event_history.push(filteredEvent);

                    break;
                    }
                }
            }
        });
    },
    downloadEventHistory() {
      // Suppose this is your JSON object
      const data = {
        events: this.fullEventHistory,
      }

      // Convert it to JSON string
      const jsonStr = JSON.stringify(data, null, 2);

      // Create a Blob from the JSON string
      const blob = new Blob([jsonStr], { type: 'application/json' });

      // Create an object URL from the Blob
      const url = URL.createObjectURL(blob);

      // Create a link element
      const link = document.createElement('a');

      // Set the href and download attributes of the link
      link.href = url;
      link.download = 'websocket_event_history.json';

      // Append the link to the body
      document.body.appendChild(link);

      // Click the link to start the download
      link.click();

      // Remove the link after the download starts
      document.body.removeChild(link);
    },
  },
};
</script>

<style scoped>
[format*="bold"] {
  font-weight: bold;
}
</style>
