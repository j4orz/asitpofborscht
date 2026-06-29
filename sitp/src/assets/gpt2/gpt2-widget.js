// In-browser GPT-2 (2019) running fully client-side via transformers.js — no
// server, no API key. Given a prefix, it renders the real next-token
// distribution p(w | context): the "logit lens" view the surrounding section
// motivates. Model weights (~125 MB quantized) download from the HF hub on
// first prediction and are cached by the browser thereafter.
import {
  AutoTokenizer,
  AutoModelForCausalLM,
} from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.2.0";

const status = document.getElementById("gpt2-status");
const form = document.getElementById("gpt2-form");
const input = document.getElementById("gpt2-input");
const out = document.getElementById("gpt2-out");
const button = form.querySelector("button");

// mdBook binds arrow/space keys for page nav; keep them out of the input.
input.addEventListener("keydown", (e) => e.stopPropagation());

function setStatus(t) {
  status.textContent = t;
}

let tokenizer = null;
let model = null;
let loading = null;

function load() {
  if (loading) return loading;
  loading = (async () => {
    setStatus("downloading GPT-2 (~250 MB, first time only)…");
    tokenizer = await AutoTokenizer.from_pretrained("Xenova/gpt2");
    model = await AutoModelForCausalLM.from_pretrained("Xenova/gpt2", {
      // fp32 (onnx/model.onnx). The quantized exports (int8/q4) use a
      // MatMulNBits path whose scale metadata onnxruntime-web rejects.
      dtype: "fp32",
      progress_callback: (p) => {
        if (p.status === "progress" && /\.onnx$/.test(p.file || "")) {
          setStatus("downloading model… " + Math.round(p.progress || 0) + "%");
        }
      },
    });
  })();
  return loading;
}

function softmax(arr) {
  let max = -Infinity;
  for (const v of arr) if (v > max) max = v;
  const exps = new Float64Array(arr.length);
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    const e = Math.exp(arr[i] - max);
    exps[i] = e;
    sum += e;
  }
  for (let i = 0; i < arr.length; i++) exps[i] /= sum;
  return exps;
}

async function predict(text) {
  await load();
  setStatus("thinking…");
  const inputs = await tokenizer(text);
  const { logits } = await model(inputs);
  const [, seqLen, vocab] = logits.dims;
  // logits for the *last* position are the model's prediction for the next token.
  const last = Array.from(logits.data.slice((seqLen - 1) * vocab, seqLen * vocab));
  const probs = softmax(last);
  const topk = Array.from(probs.keys())
    .sort((a, b) => probs[b] - probs[a])
    .slice(0, 10)
    .map((id) => ({ token: tokenizer.decode([id]), p: probs[id] }));
  render(text, topk);
  setStatus("p(next token | “" + text + "”) — computed locally, on your machine");
}

function render(text, rows) {
  out.innerHTML = "";
  const max = rows[0].p;
  for (const r of rows) {
    const row = document.createElement("div");
    row.style.cssText = "display:flex;align-items:center;gap:0.5rem;margin-bottom:0.25rem;";

    const tok = document.createElement("span");
    tok.style.cssText = "width:11ch;text-align:right;white-space:pre;opacity:0.9;overflow:hidden;text-overflow:ellipsis;";
    // JSON-escape so leading spaces / newlines in the token are visible.
    tok.textContent = JSON.stringify(r.token).slice(1, -1);

    const track = document.createElement("div");
    track.style.cssText = "flex:1;min-width:0;";
    const bar = document.createElement("div");
    bar.style.cssText =
      "height:0.85em;background:var(--fg);opacity:0.5;border-radius:2px;width:" +
      Math.max(2, (r.p / max) * 100) + "%;";
    track.appendChild(bar);

    const pct = document.createElement("span");
    pct.style.cssText = "width:7ch;text-align:right;opacity:0.6;";
    pct.textContent = (r.p * 100).toFixed(2) + "%";

    row.appendChild(tok);
    row.appendChild(track);
    row.appendChild(pct);
    out.appendChild(row);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  button.disabled = true;
  input.disabled = true;
  predict(text)
    .catch((err) => setStatus("error: " + err.message))
    .finally(() => {
      button.disabled = false;
      input.disabled = false;
      input.focus();
    });
});
