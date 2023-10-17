<script setup>
import { ref, computed } from 'vue'; 
import { useScreensStore } from '@/stores/screensStore';

const screensStore = useScreensStore();

const screens = computed(() => screensStore.screens);
const activeScreen = ref(screensStore.activeScreenName);

const handleTabClick = (screenName) => {
  activeScreen.value = screenName;
  screensStore.setActiveScreen(screenName);
};

</script>

<template>
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
        :key="'world_details'"
        @click="handleTabClick('world_details')"
        :class="{ 'tab-active': activeScreen === 'world_details' }"
        class="tab"
      >
        World Details
      </button>
    </div>
</template>