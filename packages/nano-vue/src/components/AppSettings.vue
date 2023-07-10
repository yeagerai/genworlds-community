<script setup>
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settingsStore';

const settingsStore = useSettingsStore();
const { settings } = storeToRefs(settingsStore);
</script>

<template>
    <dialog id="settings_modal" class="modal">
    <form method="dialog" class="modal-box">
        <div class="form-control w-full max-w-xs">
            <label class="label">
                <span class="label-text">OpenAI API key</span>
            </label>
            <input type="text" v-model.lazy="settings.openaiApiKey" placeholder="sk-..." class="input input-bordered w-full max-w-xs" />
        </div>
        <!-- <div class="form-control w-full max-w-xs">
            <label class="label">
                <span class="label-text">ElevenLabs API key (For Text-to-Speech)</span>
            </label>
            <input type="text" v-model.lazy="settings.elevenLabsApiKey" placeholder="..." class="input input-bordered w-full max-w-xs" />
        </div>   -->

        <div class="modal-action">
            <button class="btn">Save</button>
        </div>
    </form>

    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>
  

  