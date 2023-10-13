<script setup>
import { ref, computed } from 'vue';

import { useWorldStateStore } from '@/stores/worldStateStore';

import { getWorldSocketHandler } from '@/modules/worldSocketHandler';

const worldSocketHandler = getWorldSocketHandler();

const mod = (n, m) => {
  return ((n % m) + m) % m;
}

const message = ref("");
const showSuggestions = ref(false);
const suggestions = ref([]);

const worldStateStore = useWorldStateStore();

let availableAgents = computed(() => worldStateStore.agents.map(agent => agent.name));

let selectedAgent = ref("");

let selectedEvent = ref("");

const focusedSuggestionIndex = ref(0);

const handleInput = () => {
  if (message.value.startsWith("/")) {
    // If agent and event are already selected, no need to show dropdown again
    if (selectedAgent.value && selectedEvent.value) {
      showSuggestions.value = false;
      return;
    }
    
    if (!selectedAgent.value) {
      // If agent is not selected, show agents suggestions
      suggestions.value = availableAgents.value;
    } else {
      // If agent is selected, show events suggestions
      // look for the speaking events of this agent
      suggestions.value = ["user_speaks_with_agent_event"]; // temporal
    }
    showSuggestions.value = true;
  } else {
    showSuggestions.value = false;
  }
};

const handleKeydown = (event) => {
  switch (event.key) {
    case 'ArrowUp':
      // prevent cursor from going to the start of textarea
      event.preventDefault();
      focusedSuggestionIndex.value = mod(focusedSuggestionIndex.value - 1, suggestions.value.length);
      break;
    case 'ArrowDown':
      // prevent cursor from going to the end of textarea
      event.preventDefault();
      focusedSuggestionIndex.value = mod(focusedSuggestionIndex.value + 1, suggestions.value.length);
      break;
    case 'Enter':
    case 'Tab':
      event.preventDefault();
      // 'Enter' selects the focused suggestion
      selectSuggestion(suggestions.value[focusedSuggestionIndex.value]);
      focusedSuggestionIndex.value = 0;
      break;
    case 'Backspace':selectedAgent
      // If there is no input and there is a selected event, remove the event.
      if (message.value === '' && selectedEvent.value) {
        removeEvent();
      }
      // If there is no input and no selected event, but there is a selected agent, remove the agent.
      else if (message.value === '' && !selectedEvent.value && selectedAgent.value) {
        removeAgent();
      }
      focusedSuggestionIndex.value = 0;
      break;
  }
};

const removeEvent = () => {
  selectedEvent.value = "";
};

const removeAgent = () => {
  selectedAgent.value = "";
};

const selectSuggestion = (item) => {
  if (!selectedAgent.value) {
    selectedAgent.value = item;
    // Clear the input message once the agent has been selected
    message.value = "";
  } else if (!selectedEvent.value) {
    selectedEvent.value = item;
    // Clear the input message once the event has been selected
    message.value = "";
  }
  showSuggestions.value = false;
};

const sendMessage = () => {
  // Checking if necessary data is filled
  if (!selectedAgent.value || !selectedEvent.value || !message.value) {
    console.warn('Cannot send message: not all required fields are filled.');
    return;
  }

  const payload = {
    event_type: "user_speaks_with_agent_event",
    description: "The user speaks with an agent",
    created_at: new Date().toISOString(),
    sender_id: "chat_user",
    target_id: selectedAgent.value,
    message: message.value
  };

  // Sending the message through the WebSocket
  try {
    worldSocketHandler.sendEvent(payload);
  } catch (error) {
    console.error('Failed to send message:', error);
  }

  // Reset the message input and selected values
  message.value = "";
  selectedAgent.value = "";
  selectedEvent.value = "";
};
</script>

<template>
    <div class="flex flex-col">
        <div class="flex relative items-end w-full">
            <div class="flex-grow bg-white shadow rounded p-2 flex items-center">

                <!-- Render the selected agent as a badge -->
                <span class="bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2" 
                        v-if="selectedAgent">
                    {{ selectedAgent }}
                    <button @click="removeAgent()">x</button>
                </span>

                <!-- Render the selected event as a badge -->
                <span class="bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2" 
                        v-if="selectedEvent">
                    {{ selectedEvent }}
                    <button @click="removeEvent()">x</button>
                </span>

                <!-- Only show input field when the textarea is not disabled -->
                <input
                    type="text" 
                    class="flex-grow bg-transparent outline-none" 
                    v-model="message" 
                    @input="handleInput" 
                    @keydown="handleKeydown"
                    :placeholder="getPlaceholder">
            </div>
            
            <div class="absolute bg-white shadow rounded p-2 w-full" v-show="showSuggestions" style="bottom: 100%;">
                <div v-for="(item, index) in suggestions" 
                    :key="index" 
                    @click="selectSuggestion(item)" 
                    :class="{ 'bg-gray-200': index === focusedSuggestionIndex }" 
                    class="cursor-pointer hover:bg-gray-200">
                {{ item }}
                </div>
            </div>
            
            <button class="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                    @click="sendMessage">
                Send
            </button>
        </div>
    </div>
</template>