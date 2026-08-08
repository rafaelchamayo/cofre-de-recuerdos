/* ═══════════════════════════════════════════════════════════
   Cofre de recuerdos — lógica
   (normalmente no necesitas tocar este archivo:
    los textos y las fotos se editan en recuerdos.js)
   ═══════════════════════════════════════════════════════════ */

const $ = (id) => document.getElementById(id);

const TOTAL = RECUERDOS.length;
const LLAVE = "cofre-recuerdos-v1";
const menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const COLORES = ["#f6c453","#ffe9a8","#ff6ec7","#c084fc","#7b2ff7","#ff4d6d","#fff4e6","#e879f9"];

const cofre     = $("cofre");
const capa      = $("capa");
const marco     = $("marco");
const foto      = $("foto");
const corazones = $("corazones");
const final     = $("final");

let abiertos = cargarProgreso();   // cuántos recuerdos se han descubierto
let ocupado  = false;              // evita dobles clics durante la animación

/* ── Textos de configuración ──────────────────────────────── */
document.title = `${CONFIG.titulo} 💜`;
$("titulo").textContent     = CONFIG.titulo;
$("subtitulo").textContent  = CONFIG.subtitulo;
$("finalTitulo").textContent = CONFIG.finalTitulo;
$("finalTexto").textContent  = CONFIG.finalTexto;

/* ── Progreso guardado ────────────────────────────────────── */
function cargarProgreso(){
  const n = parseInt(localStorage.getItem(LLAVE), 10);
  return Number.isFinite(n) ? Math.min(Math.max(n, 0), TOTAL) : 0;
}
function guardarProgreso(){
  try { localStorage.setItem(LLAVE, String(abiertos)); } catch (_) {}
}

/* ── Corazones de progreso ────────────────────────────────── */
RECUERDOS.forEach((r, i) => {
  const b = document.createElement("button");
  b.className = "corazon";
  b.textContent = "💜";
  b.type = "button";
  b.setAttribute("aria-label", `${r.mes}: aún sin abrir`);
  b.addEventListener("click", () => { if (i < abiertos) mostrarRecuerdo(i, false); });
  corazones.appendChild(b);
});

function pintarProgreso(){
  [...corazones.children].forEach((b, i) => {
    const listo = i < abiertos;
    b.classList.toggle("abierto", listo);
    b.setAttribute("aria-label", listo
      ? `Ver de nuevo el recuerdo del ${RECUERDOS[i].mes}`
      : `${RECUERDOS[i].mes}: aún sin abrir`);
  });
  $("contador").textContent = abiertos;
  $("reiniciar").hidden = abiertos === 0;

  if (abiertos >= TOTAL){
    cofre.classList.add("agotado");
    $("pista").textContent = "Los 12 están abiertos 💜";
    cofre.setAttribute("aria-label", "Volver a ver el festejo");
  } else {
    cofre.classList.remove("agotado");
    $("pista").textContent = abiertos === 0 ? "Tócalo 👆" : "Tócalo otra vez 👆";
  }
}

/* ── Abrir el cofre ───────────────────────────────────────── */
cofre.addEventListener("click", () => {
  if (ocupado) return;

  if (abiertos >= TOTAL){        // ya están todos: repetir el festejo
    festejar();
    return;
  }

  ocupado = true;
  cofre.classList.add("esta-abierto");

  const c = cofre.getBoundingClientRect();
  estallido(c.left + c.width / 2, c.top + c.height * 0.55, menosMovimiento ? 18 : 46);

  const i = abiertos;
  abiertos++;
  guardarProgreso();
  pintarProgreso();

  setTimeout(() => mostrarRecuerdo(i, true), menosMovimiento ? 120 : 560);
});

/* ── Tarjeta del recuerdo ─────────────────────────────────── */
let recuerdoActual = 0;
let esNuevo = false;

function mostrarRecuerdo(i, nuevo){
  const r = RECUERDOS[i];
  recuerdoActual = i;
  esNuevo = nuevo;

  $("tarjetaMes").textContent   = r.mes;
  $("tarjetaTexto").textContent = r.texto;
  $("rutaFoto").textContent     = r.imagen;

  // Si la foto todavía no existe, se muestra un marco bonito con la ruta.
  foto.removeAttribute("src");            // fuerza una carga nueva cada vez
  marco.classList.add("sin-foto");
  foto.onload  = () => marco.classList.remove("sin-foto");
  foto.onerror = () => marco.classList.add("sin-foto");
  foto.alt = `${r.mes} — ${r.texto}`;
  foto.src = r.imagen;

  capa.hidden = false;
  capa.classList.remove("cerrando");
  $("siguiente").focus({ preventScroll: true });
}

function cerrarTarjeta(){
  capa.classList.add("cerrando");
  setTimeout(() => {
    capa.hidden = true;
    capa.classList.remove("cerrando");
    cofre.classList.remove("esta-abierto");
    ocupado = false;

    if (esNuevo && recuerdoActual === TOTAL - 1) festejar();
    esNuevo = false;
  }, menosMovimiento ? 60 : 290);
}

$("siguiente").addEventListener("click", cerrarTarjeta);
$("cerrar").addEventListener("click", cerrarTarjeta);
capa.addEventListener("click", (e) => { if (e.target === capa) cerrarTarjeta(); });
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!final.hidden) cerrarFinal();
  else if (!capa.hidden) cerrarTarjeta();
});

/* ── Reiniciar ────────────────────────────────────────────── */
$("reiniciar").addEventListener("click", () => {
  abiertos = 0;
  guardarProgreso();
  pintarProgreso();
});

/* ── Festejo final ────────────────────────────────────────── */
function festejar(){
  final.hidden = false;
  fuegos(true);
  $("finalCerrar").focus({ preventScroll: true });
}
function cerrarFinal(){
  final.hidden = true;
  fuegos(false);
}
$("finalCerrar").addEventListener("click", cerrarFinal);

/* ═══════════════════════════════════════════════════════════
   Partículas: confeti + fuegos artificiales
   ═══════════════════════════════════════════════════════════ */
const lienzo = $("lienzo");
const ctx = lienzo.getContext("2d");
let particulas = [], cohetes = [], animando = false, hayFuegos = false, proximoCohete = 0;

function ajustarLienzo(){
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  lienzo.width  = Math.floor(innerWidth  * dpr);
  lienzo.height = Math.floor(innerHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
ajustarLienzo();
addEventListener("resize", ajustarLienzo);

const azar = (a, b) => a + Math.random() * (b - a);
const color = () => COLORES[(Math.random() * COLORES.length) | 0];

/** Confeti que sale del cofre al abrirlo */
function estallido(x, y, cantidad){
  for (let i = 0; i < cantidad; i++){
    const ang = azar(-Math.PI * 0.95, -Math.PI * 0.05);
    const vel = azar(3, 11);
    particulas.push({
      x, y, px: x, py: y,
      vx: Math.cos(ang) * vel,
      vy: Math.sin(ang) * vel - 3,
      g: 0.22, roce: 0.985,
      vida: 1, merma: azar(0.008, 0.018),
      tam: azar(3, 7), color: color(), confeti: true,
      giro: azar(0, 6.28), vgiro: azar(-0.25, 0.25),
    });
  }
  arrancar();
}

/** Fuegos artificiales continuos */
function fuegos(activar){
  hayFuegos = activar;
  if (!activar) return;
  proximoCohete = 0;
  arrancar();
}

function lanzarCohete(){
  const x = azar(innerWidth * 0.15, innerWidth * 0.85);
  cohetes.push({
    x, y: innerHeight + 10, px: x, py: innerHeight + 10,
    vx: azar(-0.7, 0.7),
    vy: azar(-15, -11),
    meta: azar(innerHeight * 0.12, innerHeight * 0.48),
    color: color(),
  });
}

function explotar(x, y, c){
  const n = menosMovimiento ? 24 : (Math.random() < 0.35 ? 70 : 46);
  const doble = Math.random() < 0.4;
  const c2 = color();
  for (let i = 0; i < n; i++){
    const ang = (Math.PI * 2 * i) / n + azar(-0.06, 0.06);
    const vel = azar(2.4, 7.4);
    particulas.push({
      x, y, px: x, py: y,
      vx: Math.cos(ang) * vel,
      vy: Math.sin(ang) * vel,
      g: 0.075, roce: 0.965,
      vida: 1, merma: azar(0.009, 0.02),
      tam: azar(1.6, 3.2),
      color: doble && i % 2 ? c2 : c,
      confeti: false, giro: 0, vgiro: 0,
    });
  }
}

function arrancar(){
  if (animando) return;
  animando = true;
  requestAnimationFrame(bucle);
}

function bucle(t){
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  // lanzar cohetes mientras dure el festejo
  if (hayFuegos && t > proximoCohete){
    lanzarCohete();
    if (Math.random() < 0.35) lanzarCohete();
    proximoCohete = t + azar(320, 780);
  }

  // cohetes
  ctx.lineCap = "round";
  for (let i = cohetes.length - 1; i >= 0; i--){
    const c = cohetes[i];
    c.px = c.x; c.py = c.y;
    c.x += c.vx; c.y += c.vy; c.vy += 0.16;

    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = c.color;
    ctx.globalAlpha = 0.95;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(c.px, c.py); ctx.lineTo(c.x, c.y); ctx.stroke();

    if (c.y <= c.meta || c.vy >= 0){
      explotar(c.x, c.y, c.color);
      cohetes.splice(i, 1);
    }
  }

  // partículas
  for (let i = particulas.length - 1; i >= 0; i--){
    const p = particulas[i];
    p.px = p.x; p.py = p.y;
    p.vx *= p.roce; p.vy = p.vy * p.roce + p.g;
    p.x += p.vx; p.y += p.vy;
    p.vida -= p.merma;
    p.giro += p.vgiro;

    if (p.vida <= 0 || p.y > innerHeight + 60){ particulas.splice(i, 1); continue; }

    ctx.globalAlpha = Math.max(p.vida, 0);

    if (p.confeti){
      ctx.globalCompositeOperation = "source-over";
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.giro);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.tam / 2, -p.tam / 2, p.tam, p.tam * 1.6);
      ctx.restore();
    } else {
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.tam;
      ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke();
    }
  }

  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";

  if (particulas.length || cohetes.length || hayFuegos) requestAnimationFrame(bucle);
  else { animando = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
}

/* ── Arranque ─────────────────────────────────────────────── */
pintarProgreso();
