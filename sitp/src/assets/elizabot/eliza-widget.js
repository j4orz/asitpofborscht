(function () {
  var eliza = new ElizaBot();
  var log = document.getElementById('eliza-log');
  var form = document.getElementById('eliza-form');
  var input = document.getElementById('eliza-input');
  function addLine(speaker, text) {
    var line = document.createElement('div');
    line.style.cssText = 'opacity:0.9;line-height:1.45;';
    var label = document.createElement('span');
    label.style.cssText = 'opacity:0.5;margin-right:0.5em;user-select:none;';
    label.textContent = speaker === 'eliza' ? 'eliza:' : '  you:';
    line.appendChild(label);
    line.appendChild(document.createTextNode(text));
    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
  }
  input.addEventListener('keydown', function (e) { e.stopPropagation(); });
  addLine('eliza', eliza.getInitial());
  input.focus();
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    addLine('you', text);
    var reply = eliza.transform(text);
    addLine('eliza', reply);
    input.value = '';
    if (eliza.quit) input.disabled = true;
  });
})();
