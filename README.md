# 💜 Nuestro cofre de recuerdos

Una página web de regalo: un cofre en el centro que se abre **12 veces**, una por
cada mes juntos. Cada vez muestra una foto de los dos con un texto de algo que
amo hacer con ella. Al abrir el recuerdo **número 12** se lanzan fuegos
artificiales con **"¡Feliz Año!"**.

Colores: púrpura, borgoña y oro.

---

## 🖼️ Dónde poner las FOTOS

Van en la carpeta **`imagenes/`** con estos nombres exactos:

```
imagenes/mes-01.jpg
imagenes/mes-02.jpg
imagenes/mes-03.jpg
...
imagenes/mes-12.jpg
```

- Formato: `.jpg` (también sirve `.png`, pero entonces hay que cambiar el nombre
  en `recuerdos.js`).
- Se recomiendan fotos **verticales** (el marco es 4:5) y de menos de ~1 MB cada
  una para que cargue rápido en el celular.
- Si una foto todavía no está, la página no se rompe: muestra un marco morado
  con la ruta del archivo que falta.

## ✍️ Dónde poner los TEXTOS

Todo se edita en el archivo **`recuerdos.js`**. Es el único archivo que
necesitas tocar:

```js
const CONFIG = {
  nombre: "Mi amor",
  titulo: "Nuestro cofre de recuerdos",
  subtitulo: "Doce meses, doce momentos...",
  finalTitulo: "¡Feliz Año!",
  finalTexto: "Doce meses contigo...",
};

const RECUERDOS = [
  {
    mes: "Mes 1",                    // el título chiquito de arriba
    imagen: "imagenes/mes-01.jpg",   // la ruta de la foto
    texto: "Amo despertarme y...",   // lo que amas hacer con ella
  },
  ...
];
```

Cambia `mes`, `imagen` y `texto` de los 12. También puedes poner fechas de
verdad (`"Enero"`, `"14 de febrero"`, etc.) en vez de "Mes 1".

---

## ▶️ Verla en tu computadora

Abre `index.html` con doble clic, o levanta un servidor local:

```bash
python3 -m http.server 8000
```

Y entra a `http://localhost:8000`.

## 🌐 Publicarla en internet (GitHub Pages, gratis)

1. En GitHub, entra al repo → **Settings** → **Pages**.
2. En *Source* elige **Deploy from a branch**.
3. Branch: **`main`**, carpeta: **`/ (root)`** → **Save**.
4. En un par de minutos queda en:
   `https://<tu-usuario>.github.io/<nombre-del-repo>/`

Ese enlace es el que le mandas a ella. 💜

---

## 🗂️ Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | La estructura de la página |
| `estilos.css` | Colores, animaciones, el diseño |
| `recuerdos.js` | **Tus textos y las rutas de las fotos** ← edita aquí |
| `app.js` | La lógica del cofre, el confeti y los fuegos artificiales |
| `imagenes/` | **Tus fotos** ← ponlas aquí |

## ℹ️ Detalles

- El progreso se guarda en el navegador: si cierra la página, al volver sigue
  donde iba.
- Los corazones de abajo se van encendiendo; puede tocar uno ya encendido para
  volver a ver ese recuerdo.
- El botón *"Empezar de nuevo"* reinicia los 12.
- Funciona en celular y en computadora, sin conexión a ningún servidor.
