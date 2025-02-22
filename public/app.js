document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const socket = io(); // Connect to the server via WebSocket

  let drawing = false;
  let lastX = 0;
  let lastY = 0;
  let currentColor = '#000000'; // Default color
  let currentSize = 5; // Default brush size

  // Adjust the canvas size
  canvas.width = window.innerWidth * 0.8;
  canvas.height = window.innerHeight * 0.7;

  // Start drawing
  canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
  });

  // Capture and send drawing data instead of drawing immediately
  canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
  
    const data = {
      lastX,
      lastY,
      x: e.offsetX,
      y: e.offsetY,
      color: currentColor,
      size: currentSize
    };
  
    console.log('Sending draw event:', data);
    socket.emit('draw', data); // Send to server
  
    lastX = data.x;
    lastY = data.y;
  });
  

  // Stop drawing when mouse is up or leaves canvas
  canvas.addEventListener('mouseup', () => (drawing = false));
  canvas.addEventListener('mouseout', () => (drawing = false));

  // Listen for drawing data from the server
  socket.on('draw', (data) => {
    console.log('Received drawing data from server:', data);
  
    ctx.beginPath();
    ctx.moveTo(data.lastX, data.lastY);
    ctx.lineTo(data.x, data.y);
    ctx.strokeStyle = data.color;
    ctx.lineWidth = data.size;
    ctx.stroke();
  });
  

  // Clear the canvas when the button is clicked
  document.getElementById('clearBoard').addEventListener('click', () => {
    socket.emit('clear'); // Send clear event to the server
  });

  // Listen for clear command from the server
  socket.on('clear', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  // Set brush color
  document.getElementById('colorPicker').addEventListener('input', (e) => {
    currentColor = e.target.value;
  });

  // Set brush size
  document.getElementById('brushSize').addEventListener('input', (e) => {
    currentSize = e.target.value;
  });
});

