# Conversor de Unidades Físicas — Taller #1 Física ADSO

Aplicación web de una sola página (SPA) para convertir magnitudes físicas de
**longitud, área, volumen, masa y velocidad** con factores internacionales
exactos y aritmética decimal de alta precisión. No requiere backend: todo el
cálculo ocurre en el navegador y el sitio se puede desplegar como contenido
estático en Vercel.

## Características

- Interfaz tipo herramienta científica moderna, **modo oscuro por defecto** y
  selector de modo claro.
- Cinco categorías con pestañas e iconos: Longitud, Área, Volumen, Masa y
  Velocidad.
- Cálculo **en tiempo real** mientras se escribe, con botón explícito
  **Convertir** y soporte para la tecla `Enter`.
- Entrada numérica que acepta **punto (`.`)** o **coma (`,`)** como separador
  decimal.
- Botón animado para **intercambiar** las unidades de origen y destino.
- Resultado destacado con botón **Copiar resultado**.
- **Fórmula aplicada** con el factor de conversión exacto utilizado.
- **Equivalencias rápidas** del valor ingresado en todas las unidades de la
  categoría.
- **Historial reciente** en `localStorage` con las últimas 5 conversiones y
  opción para borrarlo.
- Validación visual: Longitud, Área, Volumen y Masa rechazan valores negativos;
  Velocidad sí los admite.
- Diseño 100 % responsivo, tipografía tabular para los números y componentes
  accesibles.

## Stack tecnológico

| Herramienta      | Uso                                              |
| ---------------- | ------------------------------------------------ |
| Vite 8           | Servidor de desarrollo y empaquetado de producción |
| React 19         | Interfaz de usuario                              |
| TypeScript 7     | Tipado estricto                                  |
| Tailwind CSS 4   | Sistema visual y diseño responsivo               |
| Lucide React     | Iconografía                                      |
| Decimal.js 10    | Aritmética decimal exacta                        |
| Vitest 5         | Pruebas unitarias                                |

## Categorías y unidades

La aplicación implementa **exclusivamente** estas unidades, cada una con su
factor exacto hacia la unidad base de su categoría.

### Longitud (base: metro, `m`)

| Unidad    | Símbolo | Factor en metros |
| --------- | ------- | ---------------- |
| Metro     | `m`     | `1`              |
| Centímetro | `cm`   | `0.01`           |
| Milímetro | `mm`    | `0.001`          |
| Kilómetro | `km`    | `1000`           |
| Pulgada   | `in`    | `0.0254`         |
| Pie       | `ft`    | `0.3048`         |
| Yarda     | `yd`    | `0.9144`         |
| Milla     | `mi`    | `1609.344`       |

### Área (base: metro cuadrado, `m²`)

| Unidad              | Símbolo | Factor en m² |
| ------------------- | ------- | ------------ |
| Metro cuadrado      | `m²`    | `1`          |
| Centímetro cuadrado | `cm²`   | `0.0001`     |
| Milímetro cuadrado  | `mm²`   | `0.000001`   |
| Kilómetro cuadrado  | `km²`   | `1000000`    |
| Pulgada cuadrada    | `in²`   | `0.00064516` |
| Pie cuadrado        | `ft²`   | `0.09290304` |

### Volumen (base: metro cúbico, `m³`)

| Unidad              | Símbolo | Factor en m³ |
| ------------------- | ------- | ------------ |
| Metro cúbico        | `m³`    | `1`          |
| Centímetro cúbico   | `cm³`   | `0.000001`   |
| Milímetro cúbico    | `mm³`   | `0.000000001` |
| Pie cúbico          | `ft³`   | `0.028316846592` |
| Pulgada cúbica      | `in³`   | `0.000016387064` |

### Masa (base: kilogramo, `kg`)

| Unidad    | Símbolo | Factor en kg |
| --------- | ------- | ------------ |
| Tonelada  | `t`     | `1000`       |
| Kilogramo | `kg`    | `1`          |
| Gramo     | `g`     | `0.001`      |
| Libra     | `lb`    | `0.45359237` |

### Velocidad (base: metro por segundo, `m/s`)

| Unidad                | Símbolo | Factor en m/s |
| --------------------- | ------- | ------------- |
| Kilómetro por hora    | `Km/h`  | `1000 / 3600` |
| Kilómetro por segundo | `Km/s`  | `1000`        |
| Metro por hora        | `m/h`   | `1 / 3600`    |
| Metro por segundo     | `m/s`   | `1`           |
| Milla por hora        | `ml/h`  | `1609.344 / 3600` |

> Los símbolos de velocidad se muestran respetando la notación solicitada en el
> taller (`Km/h`, `Km/s`, `m/h`, `m/s`, `ml/h`).

## Precisión numérica

- `decimal.js` se configura con **50 dígitos de precisión interna**.
- Cada conversión usa la unidad base de la categoría:
  `resultado = valor × factorOrigen ÷ factorDestino`.
- No hay redondeos intermedios; el redondeo ocurre únicamente al mostrar.
- Los resultados se presentan con **10 cifras significativas** y sin ceros
  sobrantes.
- Solo se usa notación científica para magnitudes muy grandes
  (`≥ 1 × 10¹²`) o muy pequeñas (`< 1 × 10⁻⁹`).
- Esto evita artefactos de punto flotante como `0.30000000000000004`.

## Requisitos

- Node.js `^20.19.0` o `>= 22.12.0` (recomendado: Node 22 LTS o superior).
- npm 10 o superior.

## Uso local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo
npm run dev
```

Vite mostrará la URL local, normalmente `http://localhost:5173`.

### Scripts disponibles

| Comando           | Descripción                                              |
| ----------------- | -------------------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo con recarga en caliente           |
| `npm test`        | Ejecuta la suite de pruebas con Vitest una vez           |
| `npm run test:watch` | Ejecuta Vitest en modo interactivo                    |
| `npm run lint`    | Analiza el código con oxlint                             |
| `npm run build`   | Compila TypeScript y genera el sitio de producción en `dist/` |
| `npm run preview` | Sirve localmente el contenido compilado de `dist/`       |

## Pruebas

La suite verifica el inventario exacto de categorías y unidades, los factores
internacionales, conversiones representativas de las cinco categorías, el
manejo de coma y punto decimal, el rechazo de negativos (excepto en velocidad)
y el formato de los resultados.

```bash
npm test
```

Resultado esperado: todas las pruebas aprobadas.

## Compilación de producción

```bash
npm run build
```

El comando ejecuta `tsc -b` y luego `vite build`. Si la compilación termina
correctamente, el sitio estático queda en `dist/`.

Para verificar localmente el resultado compilado:

```bash
npm run preview
```

## Despliegue en Vercel

El repositorio incluye `vercel.json` con la configuración estática:

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

### Opción A: desde el panel de Vercel

1. Sube el proyecto a GitHub, GitLab o Bitbucket.
2. En [vercel.com](https://vercel.com), selecciona **Add New → Project** e
   importa el repositorio.
3. Vercel detectará Vite automáticamente. Confirma:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Pulsa **Deploy**. Al terminar, Vercel entrega una URL pública con HTTPS.

### Opción B: con la CLI de Vercel

```bash
npm install -g vercel
vercel
```

Sigue las instrucciones de la CLI. Para publicar directamente en producción:

```bash
vercel --prod
```

> La aplicación es una SPA de una sola ruta y no usa enrutamiento del lado del
> cliente, por lo que no requiere reglas de reescritura adicionales. Todo el
> estado (tema e historial) se guarda únicamente en `localStorage` del
> navegador.

## Estructura del proyecto

```text
.
├── public/
│   └── favicon.svg
├── src/
│   ├── components/          # Header, Hero, pestañas, panel, fórmula, historial…
│   ├── data/
│   │   └── units.ts         # Categorías, unidades y factores exactos
│   ├── hooks/
│   │   ├── useHistory.ts    # Historial persistido en localStorage
│   │   └── useTheme.ts      # Tema oscuro/claro persistido
│   ├── lib/
│   │   ├── conversion.ts    # Validación, conversión y formato decimal
│   │   └── conversion.test.ts
│   ├── types.ts             # Tipos compartidos
│   ├── App.tsx              # Composición y estado principal
│   ├── index.css            # Tokens visuales, Tailwind y animaciones
│   └── main.tsx             # Punto de entrada de React
├── index.html
├── vercel.json
├── vite.config.ts
└── vitest.config.ts
```

## Contexto académico

Proyecto desarrollado para el **Taller #1 de Física** del programa **ADSO**.
El objetivo es demostrar el uso de factores de conversión internacionales y
evitar los errores de precisión típicos de los tipos de punto flotante.
