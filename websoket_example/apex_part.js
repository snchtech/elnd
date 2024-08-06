// Create a WebSocket connection to the server
var ws = new WebSocket('ws://10.0.0.160:8080');

// Handle incoming messages
ws.onmessage = function(event) {
  var data = JSON.parse(event.data); // Parse the JSON data
  console.log('Data received from server:', data);

  // Update APEX items or regions with the new data
  apex.item('P1_WS1').setValue(data.count1);
  apex.item('P1_WS2').setValue(data.count2);
  apex.item('P1_WS3').setValue(data.count3);
  //apex.region('count_region').refresh(); // Refresh a region if necessary
};

// Handle WebSocket errors
ws.onerror = function(error) {
  console.error('WebSocket error:', error);
};

// Optionally handle WebSocket connection closure
ws.onclose = function() {
  console.log('WebSocket connection closed');
};