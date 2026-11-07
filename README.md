# Carta digital

Demo de carta digital para hamburgueserías, resto-bares y cafeterías. La primera pantalla pública usa datos ficticios de **La Esquina**.

## Estado actual

- Carta pública adaptable a celular, con búsqueda, categorías, variantes de precio, etiquetas, disponibilidad, horarios, ubicación y enlaces de contacto.
- Datos de muestra en `data/demo.json`.
- Esta versión todavía no tiene acceso privado ni persiste cambios del dueño. El esquema relacional para ambas modalidades ya está preparado en `db/001_schema.sql`; falta aplicar la migración al proyecto Neon `carta-digital` y conectar autenticación y API.

## Ejecutar localmente

Serví la carpeta con cualquier servidor estático. Por ejemplo, con Python:

```sh
python3 -m http.server 3000
```

Después abrí `http://localhost:3000`.

## Editar la demo

Modificá `data/demo.json`. Cada plato lleva `variantes` (una o más), `etiquetas` y `disponible`. No agregues secretos ni datos privados a este archivo: lo que se publica en la carpeta de la carta es visible para cualquiera.

## Próximo paso: edición privada

La edición de la carta completa requiere inicio de sesión y una API con permisos en el servidor. El navegador no debe conectarse directamente a Postgres con credenciales ni decidir por sí solo qué negocio puede modificar. El proyecto Neon ya existe; para conectarlo desde esta sesión hace falta iniciar sesión en la consola y obtener la configuración de su rama.
