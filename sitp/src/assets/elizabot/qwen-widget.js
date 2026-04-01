(function () {
  var SYSTEM_PROMPT = "You are a Rogerian psychotherapist. Respond with empathy, reflect the client's feelings, and use open-ended questions to encourage self-exploration. Be warm, non-directive, and non-judgmental. Keep responses concise — two to four sentences.";
  var MODEL = "qwen/qwen3-235b-a22b";
  var API_URL = "https://openrouter.ai/api/v1/chat/messages";
  var history = [];

  var log = document.getElementById('qwen-log');
  var form = document.getElementById('qwen-form');
  var input = document.getElementById('qwen-input');
  var keyInput = document.getElementById('qwen-key');
  var keyPrompt = document.getElementById('qwen-key-prompt');

  var storedKey = localStorage.getItem('openrouter_api_key');
  if (storedKey) {
    keyPrompt.style.display = 'none';
    addLine('qwen', "Hello. I'm here to listen. What's been on your mind?");
  }

  function addLine(speaker, text) {
    var line = document.createElement('div');
    line.style.cssText = 'opacity:0.9;line-height:1.45;';
    var label = document.createElement('span');
    label.style.cssText = 'opacity:0.5;margin-right:0.5em;user-select:none;';
    label.textContent = speaker === 'qwen' ? 'qwen:' : ' you:';
    line.appendChild(label);
    var textNode = document.createTextNode(text);
    line.appendChild(textNode);
    line.dataset.speaker = speaker;
    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
    return line;
  }

  input.addEventListener('keydown', function (e) { e.stopPropagation(); });
  if (keyInput) keyInput.addEventListener('keydown', function (e) { e.stopPropagation(); });

  document.getElementById('qwen-key-save').addEventListener('click', function () {
    var key = keyInput.value.trim();
    if (!key) return;
    localStorage.setItem('openrouter_api_key', key);
    keyPrompt.style.display = 'none';
    addLine('qwen', "Hello. I'm here to listen. What's been on your mind?");
    input.focus();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    var apiKey = localStorage.getItem('openrouter_api_key');
    if (!apiKey) {
      keyPrompt.style.display = '';
      return;
    }
    addLine('you', text);
    input.value = '';
    input.disabled = true;

    history.push({ role: 'user', content: text });

    var thinkingLine = addLine('qwen', '…');

    fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.href,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }].concat(history),
      }),
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var reply = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
        if (!reply) reply = '(no response)';
        // strip <think>…</think> blocks that some Qwen models emit
        reply = reply.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
        thinkingLine.childNodes[1].textContent = reply;
        history.push({ role: 'assistant', content: reply });
        log.scrollTop = log.scrollHeight;
      })
      .catch(function (err) {
        thinkingLine.childNodes[1].textContent = '(error: ' + err.message + ')';
      })
      .finally(function () {
        input.disabled = false;
        input.focus();
      });
  });
})();
