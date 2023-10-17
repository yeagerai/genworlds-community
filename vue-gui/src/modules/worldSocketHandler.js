// worldSocketHandler.js
import { ref } from 'vue';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { useScreensStore } from '@/stores/screensStore';
import { useWorldStateStore } from '@/stores/worldStateStore';

function createWebSocketHandler() {
  const isConnected = ref(false);
  const fullEventHistory = ref([]);
  let connection = null;

  const screensStore = useScreensStore();
  const worldStateStore = useWorldStateStore();

  function baseUrl() {
    const currentUrl = window.location.hostname;
    const protocol = currentUrl === 'localhost' ? 'ws' : 'wss';
    const port = 7456;
    const full_url = `${protocol}://${currentUrl}:${port}/ws`;
    console.log(full_url);
    return full_url;
  }

  function connect() {
    connection = new ReconnectingWebSocket(baseUrl());
    connection.onopen = () => { 
      isConnected.value = true; 
      sendEvent({ 
        event_type: "user_requests_screens_to_world", 
        description: "The user requests the screens to the world.",
        sender_id: "test_user",
        target_id: null,
        created_at: new Date().toISOString(),
      });
      sendEvent({ 
        event_type: "agent_wants_updated_state", 
        description: "Agent wants to update its state.",
        sender_id: "test_user",
        target_id: null,
        created_at: new Date().toISOString(),
      });
    };
    connection.onmessage = handleMessage;
    connection.onerror = handleError;
    connection.onclose = handleClose;
  }

  function sendEvent(eventArgs) {
    if(isConnected.value) {
      const message = JSON.stringify(eventArgs);
      connection.send(message);
    } else {
      console.error("WebSocket is not connected. Unable to send message.");
    }
  }

  function handleMessage(response) {
    const data = JSON.parse(response.data);
    fullEventHistory.value.push(data);
    screensStore.addEventToApplicableScreensHistory(data);
    if (data && data.event_type) {
      console.log(data);

      switch(data.event_type) {
        case "world_sends_screens_to_user":
          screensStore.initializeScreens(data.screens_config);
          break;
        case "world_sends_available_entities_event":
          worldStateStore.setWorldState(data);
          break;
        default:
          ""
      }
    } else {
      console.error('Invalid message format received:', data);
    }
  }

  function handleError(error) {
    console.error("WebSocket Error: ", error);
  }

  function handleClose() {
    isConnected.value = false;
  }

  return {
    isConnected,
    fullEventHistory,
    connect,
    sendEvent,
    handleMessage,
    handleError,
    handleClose,
  }
}

let worldSocketHandler = null;

export function getWorldSocketHandler() {
  if (!worldSocketHandler) {
    worldSocketHandler = createWebSocketHandler();
  }
  console.log(worldSocketHandler)
  return worldSocketHandler;
}