<script setup>
import { computed, defineProps } from 'vue';


const props = defineProps({
  yamlData: {
    type: Object,
    required: true,
  },
})


const topicOfConversation = computed(() => {
  return props.yamlData ? props.yamlData.world_definition.world.base_agent.topic_of_conversation : '';
})
const agents = computed(() => {
  return props.yamlData ? props.yamlData.world_definition.world.agents.map(agent => {
    return {
      name: agent.name,
      background: agent.background,
    }
  }) : [];
})
const objects = computed(() => {
  return props.yamlData ? props.yamlData.world_definition.world.objects.map(object => {
    return {
      name: object.name,
      description: object.description,
    }
  }) : [];
})

</script>

<template>
    <article class="prose">
        <h2>Topic of Conversation</h2>
        <p>
            {{ topicOfConversation }}
        </p>
        <h3>Agents</h3>
        <ul>
            <li v-for="agent in agents" :key="agent.name">
                <h4>{{ agent.name }}</h4>
                <p>{{ agent.background }}</p>
            </li>
        </ul>
        <h3>Objects</h3>
        <ul>
            <li v-for="object in objects" :key="object.name">
                <h4>{{ object.name }}</h4>
                <p>{{ object.description }}</p>
            </li>
        </ul>
    </article>
</template>
  

  