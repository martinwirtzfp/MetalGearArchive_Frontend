# Imagenes reales para la app

La app busca primero imagenes locales para cada entidad con esta estructura:

- /images/characters/{slug}.webp
- /images/games/{slug}.webp
- /images/events/{slug}.webp
- /images/locations/{slug}.webp
- /images/organizations/{slug}.webp

## Como se calcula el slug

- minusculas
- sin tildes
- espacios y simbolos convertidos a '-'

Ejemplos:

- Solid Snake -> solid-snake.webp
- Metal Gear Solid 2: Sons of Liberty -> metal-gear-solid-2-sons-of-liberty.webp
- Operation Intrude N313 -> operation-intrude-n313.webp

## Formato recomendado

- extension: .webp
- tamaño sugerido para listas/fichas: 800x450 o superior
- peso sugerido: 80KB a 250KB por imagen

Si no existe imagen local, la app usa la URL del backend. Si esa URL falla, muestra un placeholder automatico.
