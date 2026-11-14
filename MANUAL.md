# Manual de ejecución

## La Guajira en cifras

Sitio web estático con tablas, gráficas, un mapa interactivo y análisis socioeconómico de La Guajira y Riohacha.

---

## 1. Requisitos

Solo necesitas:

- Un navegador moderno: Chrome, Edge, Firefox o Safari.
- Opcional pero recomendado: **Python 3** para ejecutar un servidor local.
- Opcional: **Visual Studio Code** con la extensión **Live Server**.
- Opcional: **Node.js** si prefieres usar `npx serve`.

No se necesita conexión a internet para ver la página. Las fuentes oficiales solo se abren si haces clic en sus enlaces.

---

## 2. Forma recomendada: servidor local con Python

Abrir la página con un servidor local evita bloqueos del navegador al cargar los archivos JSON.

### 2.1. Abrir una terminal en la carpeta del proyecto

La carpeta debe ser la que contiene `index.html`.

En Linux o macOS:

```bash
cd ~/Descargas/"FUNDAMENTOS DE ECONOMIA"
```

En Windows, desde PowerShell:

```powershell
cd "C:\Users\TU_USUARIO\Downloads\FUNDAMENTOS DE ECONOMIA"
```

> Consejo: también puedes abrir la carpeta en el explorador de archivos, hacer clic derecho y elegir
> “Abrir terminal aquí” o “Abrir en Terminal”.

### 2.2. Verificar que Python está instalado

```bash
python3 --version
```

En Windows puede ser:

```powershell
py --version
```

Debe aparecer algo como `Python 3.12.0`. Si no aparece, instala Python 3 desde <https://www.python.org/downloads/>.

### 2.3. Iniciar el servidor

Linux o macOS:

```bash
python3 -m http.server 8000
```

Windows:

```powershell
py -m http.server 8000
```

o:

```powershell
python -m http.server 8000
```

Debe mostrarse un mensaje similar a:

```text
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

### 2.4. Abrir la página

En el navegador entra a:

```text
http://localhost:8000/index.html
```

o:

```text
http://127.0.0.1:8000/index.html
```

### 2.5. Detener el servidor

Vuelve a la terminal y presiona:

```text
Ctrl + C
```

Si el puerto 8000 está ocupado, usa otro, por ejemplo 8080:

```bash
python3 -m http.server 8080
```

Y abre:

```text
http://localhost:8080/index.html
```

---

## 3. Alternativa: Visual Studio Code + Live Server

1. Instala **Visual Studio Code**.
2. Instala la extensión **Live Server** de Ritwick Dey.
3. Abre la carpeta del proyecto en VS Code: `Archivo → Abrir carpeta`.
4. En el explorador, haz clic derecho sobre `index.html`.
5. Selecciona **Open with Live Server**.
6. El navegador se abrirá automáticamente, normalmente en una dirección como:

```text
http://127.0.0.1:5500/index.html
```

Para detenerlo, haz clic en **Port: 5500** en la barra inferior de VS Code y luego en **Stop**.

---

## 4. Alternativa: Node.js

Si tienes Node.js instalado, desde la carpeta del proyecto ejecuta:

```bash
npx serve .
```

La terminal mostrará una dirección local. Ábrela en el navegador. Para detenerlo, presiona `Ctrl + C`.

---

## 5. Abrir el archivo directamente con doble clic

También puedes abrir `index.html` con doble clic. La página se verá y funcionará, pero:

- El **mapa interactivo sí funciona**, porque sus geometrías están incluidas en `map_guajira.js` y no dependen de internet.
- Algunos navegadores bloquean la carga automática de los JSON por seguridad.
- En ese caso se muestran los **datos de respaldo** incluidos en `app.js`, por lo que las tablas y gráficas principales no quedan vacías. La sección **Datos** muestra un aviso explicando la situación.
- Para cargar los JSON manualmente, ve a la sección **“Datos y rutas dinámicas”**, abre
  **“Configurar rutas y cargar archivos locales”** y selecciona los archivos.
- La preferencia de tema claro/oscuro puede no guardarse en algunos navegadores cuando se abre como archivo local.

Por eso se recomienda usar un servidor local, aunque el mapa y los datos de respaldo permiten una revisión rápida sin servidor.

---

## 6. Qué debe aparecer al abrir la página

Al cargar correctamente verás:

- Barra superior con navegación y el botón de tema.
- Héroe con el título **“La Guajira en cifras”**.
- Panel de indicadores clave: pobreza, desempleo, PIB e informalidad.
- Sección **Presentación** con un mapa interactivo de los 15 municipios, la capital y un inset de Colombia.
- Secciones: Presentación, Variables económicas, PIB, Inflación, Empleo, Diagnóstico, Conclusiones, Fuentes y Datos.
- Tablas y gráficas con sus años y fuentes, incluida la tabla de mercado laboral
  por sexo (Tabla 1A) y la de desocupación por edad y sexo (Tabla 6A).
- En la sección **Datos**, un mensaje de estado similar a:

```text
Datos cargados correctamente: IPC 10 años, empleo 10 años, PIB 10 años e informalidad 10 años. Fuente: DANE.
```

Si aparece un mensaje de error, la página seguirá funcionando con los datos de respaldo.

---

## 7. Uso del modo claro y oscuro

- El botón está en la barra superior, a la derecha.
- En modo claro dice **“Modo oscuro”** con un icono de luna.
- En modo oscuro dice **“Modo claro”** con un icono de sol.
- La elección se guarda en el navegador y se mantiene al recargar.
- Si nunca has elegido un tema, la página usa el tema configurado en tu sistema operativo.
- Si cambias el tema del sistema y no has elegido manualmente, la página se adapta.
- La impresión siempre usa una paleta clara.

Para restablecer la preferencia desde la consola del navegador:

```javascript
localStorage.removeItem("guajira-theme");
location.reload();
```

---

## 8. Uso del mapa interactivo

El mapa de la sección **Presentación** muestra los 15 municipios de La Guajira con límites de referencia del DANE.

- **Pasar el cursor** sobre un municipio muestra su nombre, código DANE y si es la capital en el panel lateral.
- **Hacer clic** en un municipio lo selecciona y lo resalta en el mapa y en la lista.
- La **lista de municipios** del panel también permite seleccionar; el botón **“Limpiar selección”** vuelve al estado inicial.
- **Teclado:** use `Tab` para recorrer los municipios, `Enter` o `Espacio` para seleccionar y `Escape` para limpiar.
- En **pantallas pequeñas** se ocultan las etiquetas sobre el mapa para evitar amontonamiento. Los nombres siguen disponibles en la lista y en el panel.
- La **estrella** marca Riohacha como capital departamental. Su ubicación es aproximada.
- El **inset de Colombia** (arriba a la izquierda) ubica La Guajira dentro del país.
- La **escala gráfica** es aproximada y sirve como referencia visual.
- Al **imprimir**, el mapa se conserva con una paleta clara; se ocultan el panel lateral y la barra de herramientas del mapa.

### Fuente y alcance del mapa

- Fuente: **DANE**, Marco Geoestadístico Nacional, División Político-Administrativa 2012.
- Servicio: <https://portalgis.dane.gov.co/mparcgis/rest/services/INDICADORES_CTERRITORIO/Cache_MpiosCTDeptosAM_DivisionPolitica_2012/MapServer>
- Las geometrías fueron simplificadas para visualización web. Los límites son de referencia y pueden diferir de demarcaciones posteriores; no constituyen una delimitación oficial.
- Las geometrías y metadatos están en `map_guajira.js`, que expone `window.GUAJIRA_MAP_DATA`.
- Las posiciones de las etiquetas están en la constante `MAP_LABELS` de `app.js`.

Para regenerar el mapa, descargue las capas 4 (municipios) y 2 (departamentos) del servicio DANE, simplifique las geometrías y reemplace `map_guajira.js` conservando la estructura de `window.GUAJIRA_MAP_DATA`. Si cambia el número de municipios, actualice también la lista de etiquetas y el contador “15” de `index.html`.

---

## 9. Cómo actualizar los datos

Los datos están en archivos JSON dentro de la carpeta del proyecto:

| Archivo | Contenido |
|---|---|
| `data_guajira.json` | Paquete unificado: PIB, informalidad, ramas de empleo, IPC, empleo y tablas por sexo/edad. |
| `ipc_riohacha.json` | Serie de inflación de Riohacha y Colombia. |
| `empleo_guajira.json` | Serie de empleo departamental y referencia nacional. |
| `map_guajira.js` | Geometrías DANE y metadatos del mapa interactivo. |
| `config.js` | Rutas de los archivos y nombres del territorio. |

Pasos:

1. Abre el JSON con un editor de texto.
2. Actualiza los valores conservando el año y la fuente.
3. Guarda el archivo.
4. Recarga la página con `Ctrl + F5` o `Cmd + Shift + R`.

También puedes cambiar las rutas desde la sección **“Datos y rutas dinámicas”** y pulsar **“Recargar datos”**.

Recomendaciones:

- No cambies la estructura de los objetos sin revisar `app.js`.
- Mantén los nombres de los campos: `year`, `pib_dep`, `crecimiento_dep`, `riohacha`, etc.
- Si actualizas una serie, revisa las notas metodológicas y las fuentes.
- Verifica que los totales y las participaciones sigan siendo coherentes.
- El mapa no se actualiza desde los JSON: sus geometrías están en `map_guajira.js`. Para cambiarlas, regenere ese archivo desde el servicio DANE indicado en la sección 8 y revise las etiquetas de `app.js`.

---

## 10. Problemas frecuentes

### “No se pudo cargar automáticamente…”

Causas habituales:

- Abriste `index.html` con doble clic.
- El servidor local no está activo.
- La ruta de un JSON es incorrecta.
- El archivo JSON tiene un error de sintaxis.

Solución:

1. Inicia el servidor con Python.
2. Abre `http://localhost:8000/index.html`.
3. Revisa la consola del navegador con `F12 → Consola`.
4. Valida el JSON con un editor o con:

```bash
python3 -m json.tool data_guajira.json > /dev/null && echo "JSON válido"
```

### El puerto ya está en uso

Usa otro puerto:

```bash
python3 -m http.server 8080
```

### La página se ve desactualizada

Fuerza la recarga:

- Windows/Linux: `Ctrl + F5`
- macOS: `Cmd + Shift + R`

### El tema no se guarda

Puede ocurrir en navegación privada o si el navegador bloquea `localStorage`.
En ese caso el tema funciona durante la sesión, pero no se conserva al cerrar.

### La página se ve sin estilos

Verifica que `styles.css` esté en la misma carpeta que `index.html` y que el navegador la esté cargando.

### Las gráficas no aparecen

Verifica que `app.js` esté en la carpeta y que la consola no muestre errores.
Las gráficas se generan con SVG y no necesitan librerías externas.

### El mapa no aparece o muestra un mensaje de error

Verifica que `map_guajira.js` esté en la misma carpeta que `index.html` y que se cargue antes de `app.js`.
El mapa no necesita internet. Si ves el mensaje “No se pudo cargar la geometría del mapa”, el archivo
`map_guajira.js` falta, está corrupto o la página se movió sin él. También puedes abrir la consola con
`F12` para revisar errores.

### En el móvil no se ven los nombres sobre el mapa

Es el comportamiento esperado: en pantallas pequeñas se ocultan las etiquetas para evitar amontonamiento.
Usa la lista de municipios o toca un municipio para ver su nombre en el panel.

### Quiero imprimir o guardar en PDF

Usa `Ctrl + P` o `Cmd + P`. La impresión oculta la barra superior, los botones, el panel lateral del mapa
y la barra de herramientas del mapa, y usa fondo blanco para ahorrar tinta. El mapa y las tablas se conservan.
Las gráficas dentro de sus contenedores se ocultan; para conservarlas, toma capturas o usa “Guardar como PDF”
desde el navegador antes de imprimir.

---

## 11. Estructura del proyecto

```text
FUNDAMENTOS DE ECONOMIA/
├── index.html                 Página principal
├── styles.css                 Diseño, temas claro/oscuro y responsive
├── app.js                     Carga de datos, tablas, gráficas y tema
├── map_guajira.js             Geometrías DANE y metadatos del mapa
├── config.js                  Rutas y configuración del territorio
├── favicon.svg                Icono del sitio
├── data_guajira.json          Paquete unificado de datos
├── ipc_riohacha.json          Serie de inflación
├── empleo_guajira.json        Serie de empleo
├── LEEME.txt                  Notas de datos y metodología
├── MANUAL.md                  Este manual
└── archivos fuente (.xls/.xlsx/.csv)
```

---

## 12. Resumen rápido

```bash
cd ~/Descargas/"FUNDAMENTOS DE ECONOMIA"
python3 -m http.server 8000
```

Abrir:

```text
http://localhost:8000/index.html
```

Detener:

```text
Ctrl + C
```
