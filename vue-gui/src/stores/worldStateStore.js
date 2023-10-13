import { defineStore } from 'pinia';

export const useWorldStateStore = defineStore({
  // unique id of the store across your application
  id: 'worldState',

  // define state
  state: () => ({
    worldName: '',
    worldDescription: '',
    agents: [],
    objects: [],
    userEvents: [],
  }),

  getters: {
    findAgentById: (state) => (id) => {
      return state.agents.find(agent => agent.id === id);
    },

    findObjectById: (state) => (id) => {
      return state.objects.find(object => object.id === id);
    },
  },

  // define actions and mutations
  actions: {
    // Set world state action
    setWorldState(payload) {
      const entitiesArray = Object.values(payload.available_entities || {});
      this.worldName = entitiesArray.filter(e => e.entity_type === "WORLD")[0].name;
      this.worldDescription = entitiesArray.filter(e => e.entity_type === "WORLD")[0].description;
      this.agents = entitiesArray.filter(e => e.entity_type === "AGENT");
      this.objects = entitiesArray.filter(e => e.entity_type === "OBJECT");
    },

    setUserEvents(payload) {
        this.userEvents = payload.user_events;
    },

    // Update/add agent action
    updateAgent(agent) {
      const index = this.agents.findIndex(a => a.name === agent.name);
      if (index !== -1) {
        this.agents[index] = agent;
      } else {
        this.agents.push(agent);
      }
    },

    // Remove agent action
    removeAgent(agentName) {
      this.agents = this.agents.filter(a => a.name !== agentName);
    },

    updateObject(object) {
        const index = this.objects.findIndex(o => o.name === object.name);
        if (index !== -1) {
          this.objects[index] = object;
        } else {
          this.objects.push(object);
        }
      },
  
    removeObject(objectName) {
        this.objects = this.objects.filter(o => o.name !== objectName);
    },

    // Additional actions or mutations as you need them...
  }
});