# ⚡ Dos Rayos — Dashboard Frontend
### Brand Intelligence · Anymal Media · ENE 2026

Dashboard React que se conecta al backend para mostrar métricas en tiempo real de todas las plataformas de Dos Rayos.

---

## 🗂️ Estructura

```
dos-rayos-frontend/
├── index.html
├── vite.config.js
├── package.json
├── .env.example
└── src/
    ├── main.jsx                 ← Entrada React
    ├── lib/
    │   ├── api.js               ← Cliente HTTP → backend
    │   └── brand.js             ← Colores, tokens y helpers de marca
    ├── hooks/
    │   └── useData.js           ← Hooks para cada endpoint del API
    └── components/
        ├── Dashboard.jsx        ← Layout principal
        ├── ui.jsx               ← Componentes reutilizables
        ├── MetricsSection.jsx   ← KPIs por plataforma
        ├── EngagementChart.jsx  ← Gráfica de engagement (Chart.js)
        ├── ContentIdeas.jsx     ← Ideas de contenido con IA
        ├── AudienceComments.jsx ← Últimos comentarios
        ├── BrandAnalysis.jsx    ← Análisis de marca con pilares
        ├── ContentCalendar.jsx  ← Parrilla mensual interactiva
        └── Widgets.jsx          ← Tendencias + acciones rápidas
```

---

## 🚀 Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Si tu backend no corre en localhost:3000, edita VITE_API_URL

# 3. Arrancar en desarrollo
npm run dev
# → http://localhost:5173
```

> **Importante:** el backend debe estar corriendo antes de abrir el dashboard.
> Ver `social-dashboard-backend` para cómo arrancarlo.

---

## 🔌 Conexión con el Backend

Todos los datos vienen de los endpoints en `src/lib/api.js`:

| Hook               | Endpoint              | Qué muestra                     |
|--------------------|-----------------------|----------------------------------|
| `useMetrics()`     | `GET /api/metrics`    | Seguidores por plataforma        |
| `useComments()`    | `GET /api/comments`   | Últimos comentarios + sentimiento|
| `useBrandAnalysis()` | `GET /api/analysis/brand` | Análisis IA de marca         |
| `useContentIdeas()` | `GET /api/analysis/content-ideas` | Ideas de contenido   |
| `useTopics()`      | `GET /api/analysis/topics` | Temas predominantes          |
| `useCalendar()`    | `GET /api/calendar`   | Parrilla mensual                 |
| `useAuthStatus()`  | `GET /auth/status`    | Plataformas conectadas           |

Si el backend no está disponible, el dashboard muestra datos de demostración automáticamente para que puedas ver el diseño completo.

---

## 🎨 Paleta Dos Rayos (Brandbook ENE 2026)

| Color          | Hex       | Uso                        |
|----------------|-----------|----------------------------|
| Amarillo Rayo  | `#FFCE47` | Acento principal, Instagram |
| Azul Cielo     | `#89C6E9` | Acento secundario, TikTok  |
| Naranja Atardecer | `#F16F11` | YouTube, alertas          |
| Verde Menta    | `#83DAB0` | Spotify, positivo           |
| Blanco Nube    | `#F7F3E8` | Twitter/X, textos claros    |

---

## 🏗️ Build para producción

```bash
npm run build
# → genera /dist listo para subir a Vercel, Netlify o cualquier CDN
```

Para cambiar la URL del backend en producción:
```bash
VITE_API_URL=https://tu-backend.railway.app npm run build
```

---

*Dos Rayos · "Dos Piezas de Un Mismo Cielo" · Anymal Media*
