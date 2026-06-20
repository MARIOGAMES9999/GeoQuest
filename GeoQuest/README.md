# 🌍 GeoQuest — The Endless Geography Game (v3)

GeoQuest es un juego de geografía **enfocado a móvil** (y también disponible en ordenador) diseñado para ser **infinito**: cada partida se genera aleatoriamente. Incluye **19 modos de juego oficiales**, modos personalizados avanzados, una **Tienda de Monedas rotativa mensual**, un **Pase de Temporada mensual** de 60 niveles y soporte completo en **inglés y español**.

---

## ✅ Funcionalidades implementadas (v3)

### 🛒 Tienda de Monedas — Rotación Mensual (nuevo en v3)
- El catálogo de la tienda **cambia automáticamente cada mes**, igual que el Pase de Temporada.
- **6 rotaciones** que se suceden cíclicamente (determinista por mes del calendario).
- Cada rotación ofrece una selección de **2 fondos + 2 avatares + 1 título + 1 tema** distintos.
- Los **consumibles** (Boosts de XP ×2, ×3 y Escudo) están siempre disponibles en cualquier rotación.
- La tienda muestra un **banner con la fecha exacta** en que se renovará el catálogo.
- Al inicio de un nuevo mes, se muestra una **notificación toast** avisando de la nueva rotación.
- Los artículos ya comprados en rotaciones anteriores **se conservan** en el perfil del jugador.

### 🪙 Sistema de Monedas
- **+25 monedas** automáticas al terminar una **partida perfecta** (sin ningún error, ≥5 preguntas).
- Monedas también obtenibles a través del Pase de Temporada (cada pocos niveles).

### 🎮 Modos de juego (19 oficiales)

**Clásicos (7):**
1. Guess the Flag / Adivina la Bandera
2. Capital Cities / Capitales
3. Flag to Capital / Bandera a Capital
4. Higher Population / Mayor Población
5. Bigger Country / País Más Grande
6. Which Continent? / ¿Qué Continente?
7. Capital Hunt / Caza de Capitales

**Creativos (8):**
8. Country Anagram / Anagrama de País
9. Odd One Out / El Intruso
10. Biggest of Three / El Mayor de Tres
11. Population Race / Carrera Demográfica
12. Missing Color / Color que Falta
13. Landlocked or Not? / ¿Sin Litoral?
14. Island Nation? / ¿Nación Insular?
15. What Language? / ¿Qué Idioma?

**Especiales (4):**
16. Survival / Supervivencia ♾️
17. Time Attack / Contrarreloj ⏱️
18. Blitz / Ráfaga ⚡
19. Hardcore / Extremo ☠️

> ⚠️ El modo **Récords Geográficos** fue eliminado en v3.

### 🛠️ Modos Personalizados (avanzado)
- Presets de dificultad: Fácil, Normal, Difícil, Personalizado
- Tipo base, modo mezcla, filtro de continente, N° de preguntas, temporizador, vidas, multiplicador XP

### 🎁 Pase de Temporada (60 niveles)
- 60 recompensas en 6 bloques. Hitos dorados en múltiplos de 10.
- **Reinicio mensual automático** con toast de aviso.
- Muestra fecha de reinicio en cabecera.

### 👕 Taquilla + Tienda de Monedas
- 4 pestañas: Fondos, Temas, Avatares, Títulos.
- Acceso rápido a la tienda desde la taquilla.

### 🏅 Logros (20), XP Boosts, racha diaria

---

## 🗂️ Archivos del proyecto

| Archivo | Descripción |
|---------|-------------|
| `index.html` | SPA con 9 pantallas |
| `css/style.css` | Estilos completos + `.shop-reset-banner` |
| `js/countries.js` | ~190 países bilingüe + helpers |
| `js/i18n.js` | i18n EN/ES — incluye `shop_resets`, `shop_new_rotation` |
| `js/rewards.js` | `COIN_SHOP_ALL`, `COIN_SHOP_ROTATIONS`, `getMonthlyShop()`, pase 60 tiers |
| `js/state.js` | Estado del jugador: `shopMonth`, `checkShopReset()`, `checkSeasonReset()` |
| `js/game.js` | 16 tipos de pregunta + 19 modos oficiales |
| `js/app.js` | UI completa + `renderCoinShop()` rotativa + `getShopResetDate()` |

**Pantallas:** `home` · `play` · `game` · `result` · `pass` · `shop` · `coinshop` · `profile` · `builder`

---

## 💾 Almacenamiento
- Todo en **localStorage** (`geoquest_save_v2`). Sin backend, sin login.
- Banderas vía `https://flagcdn.com/` (CDN gratuito).

## 🔄 Lógica de rotación mensual

```
Mes (1-12)  →  índice de rotación  →  catálogo
  Enero (1)  →  0  →  Candy Dream, Cosmic Dust, Phoenix, Unicorn, Perfectionist, Lime
  Feb   (2)  →  1  →  Matrix, Northern Lights, Alien, Pirate, Coin Lord, Lime
  Mar   (3)  →  2  →  Candy Dream, Northern Lights, Phoenix, Alien, Perfectionist, Lime
  Abr   (4)  →  3  →  Cosmic Dust, Matrix, Unicorn, Pirate, Coin Lord, Lime
  May   (5)  →  4  →  Northern Lights, Candy Dream, Alien, Unicorn, Perfectionist, Lime
  Jun   (6)  →  5  →  Cosmic Dust, Matrix, Phoenix, Pirate, Coin Lord, Lime
  … (ciclo se repite en julio–diciembre)
```

## 🚀 Despliegue
Ve a la pestaña **Publish** para publicar con un clic y obtener la URL en vivo.
