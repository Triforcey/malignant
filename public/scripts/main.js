var ws = io();

function displayMessage(msg) {
  var e = document.createElement('p');
  e.innerHTML = msg;
  messages.appendChild(e);
}

ws.on('init', msgs => {
  messages.innerHTML = '';
  msgs.forEach(msg => {
    displayMessage(msg);
  });
});

ws.on('message', msg => {
  displayMessage(msg);
});

function send() {
  ws.emit('message', msgInput.value);
  msgInput.value = '';
}
