export const downloadEventHistory = (fullEventHistory) => {
    // Suppose this is your JSON object
    const data = {
      events: fullEventHistory.value,
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
  };