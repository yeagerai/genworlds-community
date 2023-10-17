<script setup>
import { ref, watch, nextTick, computed } from 'vue';
import { useScreensStore } from '@/stores/screensStore';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';
import Prism from 'prismjs';
import 'prismjs/components/prism-python'; // For Python highlighting
import 'prism-themes/themes/prism-vsc-dark-plus.css'; // For the default Prism theme

const chatContainer = ref(null);
const screensStore = useScreensStore();
const activeScreen = computed(() => {
  return screensStore.screens.find(screen => screen.name === screensStore.activeScreenName);
});
const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && Prism.languages[lang]) {
      try {
        return Prism.highlight(str, Prism.languages[lang], lang);
      } catch (e) {
        console.error(e);
      }
    }
    return ''; // use external default escaping
  }
});

console.log(activeScreen)
watch(() => activeScreen, async () => {
  await nextTick();

  if (chatContainer.value) {
    // Check if the user is near the bottom
    const isNearBottom =
      chatContainer.value.scrollHeight - chatContainer.value.scrollTop - chatContainer.value.clientHeight < 400;

    // Only scroll to the bottom if the user is near the bottom
    if (isNearBottom) {
      chatContainer.value.scrollTo({top: chatContainer.value.scrollHeight, behavior: 'instant'});
    }
  }      
}, { deep: true });
// get field to display as message from screensStore
const getFieldValue = (event, fieldName) => event[fieldName] ?? null;

const renderMarkdown = (markdownText) => {
  const rawHtml = md.render(markdownText);
  return DOMPurify.sanitize(rawHtml);
};

</script>

<template>
        <div class="p-6 rounded-lg shadow-md">
            <ul class="space-y-4">
              <li v-for="(event, index) in activeScreen.eventHistory" :key="index">
                <div class="chat chat-start">
                  <div class="chat-header" >
                    From: {{ getFieldValue(event, 'sender_id') }}         
                    <template v-if="getFieldValue(event, 'target_id')">
                              To: {{ getFieldValue(event, 'target_id') }}
                    </template>
                    <time class="text-xs opacity-50">{{ getFieldValue(event, 'created_at') }}</time>
                  </div>
                  <div class="chat-bubble">
                    <template v-if="getFieldValue(event, 'message')">
                      <div class="markdown-content" v-html="renderMarkdown(getFieldValue(event, 'message'))"></div>
                    </template>
                    <template v-else-if="getFieldValue(event, 'summary')">
                      {{ getFieldValue(event, 'summary') }}
                    </template>
                    <template v-else-if="getFieldValue(event, 'description')">
                      {{ getFieldValue(event, 'description') }}
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
</template>

<style>
.markdown-content ol {
    list-style-type: decimal;
    margin-left: 20px;
}

code, pre {
    text-shadow: none !important;
    background-color: #2c2c2c;
    padding: 5px; 
    border-radius: 4px; 
}

pre { /* The element typically used for code blocks */
    margin: 20px !important; /* Add some space below the code block */
}
</style>