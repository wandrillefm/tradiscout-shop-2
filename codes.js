/* ══════════════════════════════════════════════
   TRADISCOUT — Codes (Morse, César, Vigenère, Sémaphore)
   ══════════════════════════════════════════════ */

/* ─── MORSE ───────────────────────────────────── */
const morseMap = {
  'A':'.-',   'B':'-...', 'C':'-.-.', 'D':'-..',  'E':'.',
  'F':'..-.', 'G':'--.',  'H':'....', 'I':'..',   'J':'.---',
  'K':'-.-',  'L':'.-..', 'M':'--',   'N':'-.',   'O':'---',
  'P':'.--.', 'Q':'--.-', 'R':'.-.',  'S':'...',  'T':'-',
  'U':'..-',  'V':'...-', 'W':'.--',  'X':'-..-', 'Y':'-.--',
  'Z':'--..',
  '0':'-----','1':'.----','2':'..---','3':'...--','4':'....-',
  '5':'.....','6':'-....','7':'--...','8':'---..','9':'----.'
};
const inverseMorse = Object.fromEntries(Object.entries(morseMap).map(([k,v]) => [v,k]));

function looksLikeMorse(str) { return /^[.\-\/\s]+$/.test(str.trim()); }

function textToMorse(str) {
  const upper = str.toUpperCase().replace(/[^A-Z0-9 ]/g, '');
  return upper.split(/\s+/).filter(Boolean)
    .map(word => word.split('').map(ch => morseMap[ch] ? morseMap[ch] + ' /' : '').filter(Boolean).join(' ').trim())
    .join('/ ');
}

function morseToText(str) {
  if (!str.trim()) return '';
  return str.split('//').map(w => w.trim()).filter(Boolean)
    .map(w => w.replace(/\/+/g, '/').split('/').map(s => s.trim()).filter(Boolean)
      .map(lb => inverseMorse[lb.split(/\s+/).filter(Boolean).join(' ')] || '')
      .join('')
    ).join(' ');
}

const morseInput  = document.getElementById('morse-input');
const morseOutput = document.getElementById('morse-output');
if (morseInput && morseOutput) {
  morseInput.addEventListener('input', () => {
    const v = morseInput.value;
    if (!v.trim()) { morseOutput.value = ''; return; }
    morseOutput.value = looksLikeMorse(v) ? morseToText(v) : textToMorse(v);
  });
}

/* ─── CÉSAR ───────────────────────────────────── */
function caesar(str, shift) {
  return str.split('').map(ch => {
    const code = ch.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 + shift + 26) % 26) + 65);
    if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 + shift + 26) % 26) + 97);
    return ch;
  }).join('');
}

const caesarInput  = document.getElementById('caesar-input');
const caesarOutput = document.getElementById('caesar-output');
const shiftInput   = document.getElementById('shift');

function updateCaesar() {
  if (!caesarInput || !caesarOutput) return;
  const k = parseInt(shiftInput?.value || '0', 10);
  caesarOutput.value = caesar(caesarInput.value, k);
}
caesarInput?.addEventListener('input', updateCaesar);
shiftInput?.addEventListener('input', updateCaesar);

/* ─── VIGENÈRE ────────────────────────────────── */
function vigenere(text, key, mode) {
  if (!key) return text;
  key = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (!key.length) return text;
  let result = '', keyIndex = 0;
  for (const char of text) {
    if (/[a-zA-Z]/.test(char)) {
      const isUpper = char === char.toUpperCase();
      const base  = isUpper ? 65 : 97;
      let shift   = key.charCodeAt(keyIndex % key.length) - 65;
      if (mode === 'decode') shift = -shift;
      result += String.fromCharCode(((char.charCodeAt(0) - base + shift % 26 + 26) % 26) + base);
      keyIndex++;
    } else { result += char; }
  }
  return result;
}

const vigInput  = document.getElementById('vig-input');
const vigKey    = document.getElementById('vig-key');
const vigMode   = document.getElementById('vig-mode');
const vigOutput = document.getElementById('vig-output');

function updateVigenere() {
  if (!vigInput) return;
  vigOutput.value = vigenere(vigInput.value, vigKey.value, vigMode.value);
}
vigInput?.addEventListener('input', updateVigenere);
vigKey?.addEventListener('input', updateVigenere);
vigMode?.addEventListener('change', updateVigenere);

/* ─── SÉMAPHORE ───────────────────────────────── */
const semaphoreAlphabet = {
  'A':[135,90],  'B':[180,90],  'C':[225,90],  'D':[270,90],
  'E':[90,45],   'F':[90,0],    'G':[90,315],   'H':[180,135],
  'I':[225,135], 'J':[270,0],   'K':[135,270],  'L':[135,315],
  'M':[135,0],   'N':[135,45],  'O':[180,225],  'P':[180,270],
  'Q':[180,315], 'R':[180,0],   'S':[180,45],   'T':[225,270],
  'U':[225,315], 'V':[270,45],  'W':[315,0],    'X':[315,45],
  'Y':[225,0],   'Z':[0,45]
};

const semaphoreMap = {};
Object.entries(semaphoreAlphabet).forEach(([letter, [l, r]]) => {
  semaphoreMap[`${l}-${r}`] = letter;
  semaphoreMap[`${r}-${l}`] = letter;
});

const canvas = document.getElementById('semaphore-canvas');
const semaphoreLetterSpan = document.getElementById('semaphore-letter');
let armAngles    = { left: semaphoreAlphabet['A'][0], right: semaphoreAlphabet['A'][1] };
let targetAngles = { ...armAngles };
let lastTimestamp = 0;

function drawSemaphoreFigure(ctx, w, h, leftAngle, rightAngle) {
  const cx = w / 2, cy = h / 2 + 10;
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = '#0a1d37';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';

  // Corps
  ctx.beginPath(); ctx.moveTo(cx, cy-25); ctx.lineTo(cx, cy+35); ctx.stroke();
  // Tête
  ctx.beginPath(); ctx.arc(cx, cy-35, 10, 0, Math.PI*2); ctx.stroke();
  // Jambes
  ctx.beginPath();
  ctx.moveTo(cx, cy+35); ctx.lineTo(cx-15, cy+60);
  ctx.moveTo(cx, cy+35); ctx.lineTo(cx+15, cy+60);
  ctx.stroke();
  // Épaules
  ctx.beginPath(); ctx.moveTo(cx-18, cy-10); ctx.lineTo(cx+18, cy-10); ctx.stroke();

  function drawArm(angleDeg, isLeft) {
    const rad      = angleDeg * Math.PI / 180;
    const armLen   = 70;
    const sx       = isLeft ? cx-18 : cx+18;
    const sy       = cy - 10;
    const hx       = sx + Math.cos(rad) * armLen;
    const hy       = sy + Math.sin(rad) * armLen;
    const size     = 22;
    ctx.strokeStyle = '#0a1d37';
    ctx.lineWidth   = 5;
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.save();
    ctx.translate(hx, hy);
    ctx.rotate(rad);
    const xOff = -20, yOff = isLeft ? -size : 0;
    ctx.fillStyle = '#ffdf40';
    ctx.beginPath(); ctx.moveTo(xOff,yOff); ctx.lineTo(xOff+size,yOff); ctx.lineTo(xOff,yOff+size); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#c00000';
    ctx.beginPath(); ctx.moveTo(xOff+size,yOff); ctx.lineTo(xOff+size,yOff+size); ctx.lineTo(xOff,yOff+size); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#7a0000'; ctx.lineWidth = 1.5;
    ctx.strokeRect(xOff, yOff, size, size);
    ctx.restore();
  }
  drawArm(leftAngle, true);
  drawArm(rightAngle, false);
}

function updateSemaphoreLetterFromAngles() {
  const snap = d => Math.round(d / 45) * 45;
  const aL = (snap(armAngles.left) + 360) % 360;
  const aR = (snap(armAngles.right) + 360) % 360;
  if (semaphoreLetterSpan) semaphoreLetterSpan.textContent = semaphoreMap[`${aL}-${aR}`] || '?';
}

function animateSemaphore(timestamp) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dt  = (timestamp - lastTimestamp) / 1000 || 0;
  lastTimestamp = timestamp;
  const speed = 12;
  ['left','right'].forEach(side => {
    let diff = targetAngles[side] - armAngles[side];
    if (Math.abs(diff) > 180) diff -= Math.sign(diff) * 360;
    armAngles[side] = (armAngles[side] + diff * Math.min(1, dt * speed) + 360) % 360;
  });
  drawSemaphoreFigure(ctx, canvas.width, canvas.height, armAngles.left, armAngles.right);
  updateSemaphoreLetterFromAngles();
  requestAnimationFrame(animateSemaphore);
}
if (canvas) requestAnimationFrame(animateSemaphore);

/* ─── Drag & drop sémaphore ───────────────────── */
let draggingArm = null;

function getPointerPos(e) {
  const rect    = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return { x: clientX - rect.left, y: clientY - rect.top };
}

function getHandPos(isLeft, angleDeg) {
  const rad = angleDeg * Math.PI / 180;
  const cx  = canvas.width / 2, cy = canvas.height / 2 + 10;
  const sx  = isLeft ? cx-18 : cx+18;
  return { x: sx + Math.cos(rad)*70, y: (cy-10) + Math.sin(rad)*70 };
}

function handlePointerDown(e) {
  const pos = getPointerPos(e);
  const lh  = getHandPos(true,  targetAngles.left);
  const rh  = getHandPos(false, targetAngles.right);
  const dL  = Math.hypot(pos.x-lh.x, pos.y-lh.y);
  const dR  = Math.hypot(pos.x-rh.x, pos.y-rh.y);
  if (dL < 40 && dL <= dR) { draggingArm = 'left';  e.preventDefault(); }
  else if (dR < 40)         { draggingArm = 'right'; e.preventDefault(); }
}

function handlePointerMove(e) {
  const pos = getPointerPos(e);
  if (!draggingArm && e.type === 'mousemove') {
    const lh = getHandPos(true,  targetAngles.left);
    const rh = getHandPos(false, targetAngles.right);
    canvas.style.cursor = (Math.hypot(pos.x-lh.x,pos.y-lh.y) < 40 || Math.hypot(pos.x-rh.x,pos.y-rh.y) < 40) ? 'grab' : 'default';
    return;
  }
  if (!draggingArm) return;
  e.preventDefault();
  canvas.style.cursor = 'grabbing';
  const cx     = canvas.width / 2, cy = canvas.height / 2 + 10;
  const isLeft = draggingArm === 'left';
  const sx     = isLeft ? cx-18 : cx+18;
  let angleDeg = Math.atan2(pos.y-(cy-10), pos.x-sx) * 180 / Math.PI;
  if (angleDeg < 0) angleDeg += 360;
  const normalized = (Math.round(angleDeg/45)*45 + 360) % 360;
  armAngles[draggingArm] = targetAngles[draggingArm] = normalized;
  updateSemaphoreLetterFromAngles();
}

function handlePointerUp() { draggingArm = null; canvas.style.cursor = 'default'; }

if (canvas) {
  canvas.addEventListener('mousedown',  handlePointerDown);
  canvas.addEventListener('mousemove',  handlePointerMove);
  canvas.addEventListener('mouseup',    handlePointerUp);
  canvas.addEventListener('mouseleave', handlePointerUp);
  canvas.addEventListener('touchstart', handlePointerDown, { passive: false });
  canvas.addEventListener('touchmove',  handlePointerMove, { passive: false });
  canvas.addEventListener('touchend',   handlePointerUp);
  canvas.addEventListener('touchcancel',handlePointerUp);
}
