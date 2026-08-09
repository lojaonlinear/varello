# Varello — Cupón sorpresa 50% OFF

Página gamificada de una sola vista: la persona escribe su nombre, "abre" una caja animada y recibe un cupón de 50% de descuento con temporizador de urgencia hasta las 00:00, con un botón que redirige a tu página de ventas.

## Cómo usarla

1. Sube `index.html` a un repositorio de GitHub.
2. Activa **GitHub Pages** (Settings → Pages → Deploy from branch → `main` / carpeta raíz).
3. Antes de publicar, abre `index.html` y edita esta línea (cerca del final, dentro de `<script>`):

   ```js
   var URL_PAGINA_VENTAS = "https://tutienda-varello.com/coleccion?cupon=VARELLO50";
   ```

   Reemplázala por el link real de tu página de ventas o de tu tienda (Shopify, Nuvemshop, etc.).

## Qué incluye

- Logo de Varello incrustado (no depende de archivos externos, es un solo `index.html`).
- Formulario con el nombre del usuario (validación simple).
- Animación de "caja que se abre" + confeti al ganar.
- Cupón visual con código `VARELLO50`.
- Temporizador en vivo que cuenta hasta la medianoche (00:00) del día actual.
- Botón final que redirige a tu página de ventas, pasando el nombre como parámetro (`?nombre=...`) por si quieres personalizar la página de destino.
- Responsive (funciona bien en celular) y respeta "reduced motion" para accesibilidad.

## Personalizar textos o colores

Todo el texto está en español (tono colombiano/latam neutro) directamente en el HTML — puedes buscar y editar frases como `"¡Felicidades"` o `"Abre tu caja sorpresa"` sin tocar el código. Los colores principales están definidos como variables CSS al inicio del archivo (`--orange`, `--ink`, etc.) si quieres ajustarlos a otra campaña.
