<template>
    <div class="min-h-screen p-8 bg-gray-50">
      <h1 class="mb-6 text-4xl font-semibold text-blue-600">{{ useCaseTitle }}</h1>
      <div class="flex mb-4">
        <button
          @click="activeTab = 'eventStream'"
          :class="{ 'border-b-4 border-blue-600': activeTab === 'eventStream' }"
          class="px-4 py-2 mr-4 text-lg text-blue-500 hover:text-blue-700"
        >
          Event Stream
        </button>
        <button
          @click="activeTab = '16bit'"
          :class="{ 'border-b-4 border-blue-600': activeTab === '16bit' }"
          class="px-4 py-2 text-lg text-blue-500 hover:text-blue-700"
        >
          16bit
        </button>
      </div>
      <div v-if="activeTab === 'eventStream'" class="p-6 bg-white rounded-lg shadow-md">
        <h2 class="mb-4 text-2xl font-semibold text-gray-700">Event Stream</h2>
        <ul class="space-y-4">
          <li
            v-for="message in messages"
            :key="message.id"
            class="p-4 bg-gray-100 rounded-md"
          >
            {{ message.data }}
          </li>
        </ul>
      </div>
      <div v-if="activeTab === '16bit'" class="p-6 bg-white rounded-lg shadow-md">
        <h2 class="mb-4 text-2xl font-semibold text-gray-700">16bit Content</h2>
        <!-- Put your content for the 16bit tab here -->
      </div>
    </div>
  </template>
  
  <script>
  import ReconnectingWebSocket from 'reconnecting-websocket';
  
  export default {
    data() {
      return {
        activeTab: 'eventStream',
        messages: [],
        useCaseTitle: ''
      };
    },
    mounted() {
      this.connectToWebSocket();
      this.useCaseTitle = this.$route.params.slug.split('-').join(' ');
    },
    methods: {
      connectToWebSocket() {
        const rws = new ReconnectingWebSocket('ws://localhost:7456');
  
        rws.addEventListener('message', (message) => {
          this.messages.push({
            id: this.messages.length + 1,
            data: message.data,
          });
        });
      },
    },
  };
  </script>
  