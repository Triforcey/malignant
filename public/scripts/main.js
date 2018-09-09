var ws = io();

function displayMessage(msg) {
  var scrollDown = messages.scrollTop == messages.scrollHeight - messages.offsetHeight;
  var e = document.createElement('p');
  e.innerHTML = msg;
  messages.appendChild(e);
  if (scrollDown) messages.scrollTop = messages.scrollHeight;
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

msgInput.onkeydown = e => {
  if (e.key != 'Enter') return;
  e.preventDefault();
  send();
};
