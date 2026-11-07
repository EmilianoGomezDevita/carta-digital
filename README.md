# Carta digital

Demo estática de carta digital para hamburgueserías, resto-bares y cafeterías. La carta se mantiene desde archivos JSON; no tiene backend.

## Ejecutar localmente

Serví la carpeta con cualquier servidor estático, por ejemplo:

```sh
python3 -m http.server 3000
```

Después abrí `http://localhost:3000`.

## Cargar o actualizar un local

- La demo inicial está en `data/demo.json`.
- Para otro local, copiá ese archivo como `data/<slug>.json`; usá minúsculas, números y guiones en el slug. La URL será `?n=<slug>`.
- Editá los datos del negocio, horarios, categorías, platos y precios en ese JSON.
- Cada plato puede incluir `foto` con una ruta bajo `img/` o una URL HTTPS. Si no hay foto, se muestra el emoji opcional `icono`.
- `negocio.imagenPortada` es opcional; si falta, no se muestra una imagen fija en el hero. Los textos promocionales opcionales (`rubro`, `mensajePortada`, `textosCinta`, `sello`, `fraseVisita`, `frasePie`) también se controlan desde el JSON.

Los archivos de `data/` son públicos. No guardes contraseñas ni datos privados ahí. En esta versión, los cambios se hacen manualmente en el JSON y se publican con el sitio.
