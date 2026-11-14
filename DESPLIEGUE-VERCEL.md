# Despliegue en Vercel

Este proyecto es un sitio estático (HTML, CSS y JavaScript sin compilación). Vercel puede
publicarlo tal cual, sin `package.json` y sin paso de build. La configuración ya está en
`vercel.json`.

## 1. Requisitos

- Una cuenta en [vercel.com](https://vercel.com/) (plan Hobby gratuito).
- Opcional: Node.js 18 o superior para usar la CLI (`npx vercel`).
- Opcional: un repositorio en GitHub, GitLab o Bitbucket para despliegue automático.

## 2. Opción A: desplegar con la CLI (rápido)

Desde la carpeta del proyecto:

```bash
cd ~/Descargas/"FUNDAMENTOS DE ECONOMIA"

# Iniciar sesión (abre el navegador)
npx vercel login

# Despliegue de prueba (preview)
npx vercel

# Despliegue de producción
npx vercel --prod
```

La CLI hace algunas preguntas la primera vez:

| Pregunta | Respuesta |
| --- | --- |
| Set up and deploy? | `Y` |
| Which scope? | Tu cuenta personal |
| Link to existing project? | `N` |
| Project name | `fundamentos-economia` (o el que prefieras) |
| In which directory is your code located? | `./` |
| Want to modify these settings? | `N` |

No hace falta configurar build command ni install command: el proyecto no tiene compilación.
`vercel.json` selecciona el preset "Other" y las cabeceras HTTP.

## 3. Opción B: desplegar desde Git (recomendado para actualizar)

1. Crea un repositorio vacío en GitHub/GitLab/Bitbucket.
2. Desde la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Sitio La Guajira en cifras"
git branch -M main
git remote add origin <URL-DEL-REPOSITORIO>
git push -u origin main
```

3. Entra a [vercel.com/new](https://vercel.com/new), importa el repositorio y usa esta configuración:

| Campo | Valor |
| --- | --- |
| Framework Preset | **Other** |
| Root Directory | `./` |
| Build Command | *(vacío / Override desactivado)* |
| Output Directory | `.` *(o dejar el valor por defecto)* |
| Install Command | *(vacío / Override desactivado)* |

4. Pulsa **Deploy**. Cada `git push` a `main` genera un nuevo despliegue de producción.

## 4. Verificación después del despliegue

Abre la URL que entrega Vercel (por ejemplo `https://fundamentos-economia.vercel.app/`) y comprueba:

- La página principal carga con estilos y sin errores en la consola (`F12`).
- Las tarjetas y tablas muestran datos (no los valores de respaldo).
- El mapa de los 15 municipios se dibuja y responde al clic.
- Los JSON están disponibles:
  - `https://TU-DOMINIO/data_guajira.json`
  - `https://TU-DOMINIO/ipc_riohacha.json`
  - `https://TU-DOMINIO/empleo_guajira.json`
- El botón de modo oscuro funciona y recuerda la preferencia.

## 5. Dominio propio (opcional)

En el panel de Vercel: **Project → Settings → Domains → Add**. Agrega el dominio y configura
en tu proveedor los registros DNS que Vercel indique (`A` o `CNAME`). Vercel emite el
certificado HTTPS automáticamente.

## 6. Actualizar datos o contenido

- Si usas Git: edita los archivos, haz `git commit` y `git push`. Vercel vuelve a desplegar.
- Si usas la CLI: ejecuta `npx vercel --prod` de nuevo desde la carpeta.
- Los cambios en `config.js`, `data_guajira.json`, `ipc_riohacha.json`, `empleo_guajira.json`,
  `app.js`, `styles.css` o `index.html` requieren un nuevo despliegue.
- La página pide los JSON con `cache: "no-store"`, así que al recargar no debería quedarse con
  datos viejos. Si ves contenido antiguo, fuerza la recarga (`Ctrl + F5`).

## 7. Notas específicas de Vercel

- **Sitio estático:** no hay servidor Node, API ni funciones serverless. Todo se ejecuta en el
  navegador. No se necesita `package.json`.
- **Rutas relativas:** `config.js` usa nombres de archivo relativos (`data_guajira.json`, etc.).
  Funcionan tanto en la raíz del dominio como en previews.
- **Mayúsculas:** el sistema de archivos de Vercel distingue mayúsculas de minúsculas. Mantén
  exactamente los nombres actuales (por ejemplo `IPC  ciudades.xlsx`).
- **Espacios en nombres de archivo:** Vercel los admite y el navegador los codifica como `%20`.
  No es necesario renombrarlos para desplegar.
- **Archivos fuente:** los `.xls`, `.xlsx` y `.csv` se suben al despliegue aunque la página no
  los descargue; sirven como respaldo documental. Si quieres reducir el tamaño, puedes excluirlos
  con un `.vercelignore`, pero entonces no estarán disponibles públicamente.
- **Sin caché agresiva:** `vercel.json` marca HTML, JS, CSS, SVG y JSON con
  `max-age=0, must-revalidate` para que los cambios se vean al recargar.
- **Cabeceras de seguridad:** se incluyen `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy` y `Cross-Origin-Opener-Policy`. No se aplica una
  Content-Security-Policy estricta porque la página usa un script inline para el tema y estilos
  generados por JavaScript.
- **Límites del plan Hobby:** el proyecto pesa unos pocos MB, muy por debajo de los límites de
  Vercel. El tráfico es el de un sitio académico.

## 8. Solución de problemas

### La página carga sin estilos o sin datos

Revisa que `styles.css`, `app.js`, `config.js`, `map_guajira.js` y los JSON estén en la raíz del
despliegue. En Vercel: **Deployments → tu despliegue → Source** para confirmar los archivos.

### Error 404 al entrar a `/index.html`

Es normal si `cleanUrls` está activo: Vercel redirige a `/`. Usa la URL raíz
(`https://TU-DOMINIO/`).

### El mapa no aparece

Comprueba que `map_guajira.js` se haya subido y que no haya errores en la consola. El mapa no
depende de internet ni de servicios externos.

### Los datos siguen apareciendo viejos

Fuerza la recarga con `Ctrl + F5` (o `Cmd + Shift + R`). También verifica que el despliegue de
producción sea el más reciente en el panel de Vercel.

### Quiero probar el despliegue en local antes de publicar

```bash
npx vercel dev
```

O, sin Vercel:

```bash
python3 -m http.server 8000
```
