# Frontend Specification: React App

The frontend is a single-page React application written in TypeScript. It provides an interactive calculator interface, handles keyboard input, validates input, calls the backend microservice for computations, and maintains a calculation history.

## Tech Stack
- **Framework**: React with TypeScript (built using Vite for fast compilation).
- **Styling**: Vanilla CSS with custom properties (CSS variables), dark mode, glassmorphism, responsive grid layout, and keypress micro-animations.

## UI/UX Design (Premium Aesthetics)
1. **Theme**: Sleek dark mode by default, utilizing a slate/indigo gradient background and translucent frosted-glass panels (glassmorphism).
2. **Calculator Layout**:
   - **Display Screen**:
     - Current Expression (e.g., `12.5 × 4`) in a smaller muted font.
     - Current Value / Result in a large, high-contrast font.
     - Loading spinner / indicator when calling the API.
   - **Keypad**: Standard grid layout with color-coded interactive buttons:
     - Clear (`C`) / Delete (`⌫`) - Warning/accent colors.
     - Operators (`+`, `-`, `×`, `÷`, `^`, `√`, `%`) - Distinct brand colors (e.g., Indigo/Violet).
     - Numbers (`0-9`) and Decimal (`.`) - Neutral dark/glass buttons.
     - Equals (`=`) - High-contrast action button.
   - **History Sidebar / Panel**: Slide-out panel or side panel showing the history of recent calculations, with the option to click a history item to reload it or clear the history.
3. **Typography**: Modern sans-serif typography (e.g., 'Inter' or 'Outfit' via Google Fonts).

## Core Features
1. **Keyboard Interactivity**:
   - Numeric keys (`0-9`), decimal (`.`) mapped directly.
   - Operators (`+`, `-`, `*`, `/`, `^`, `%`) mapped to backend endpoints.
   - `Enter` or `=` triggers calculation API call.
   - `Backspace` deletes the last character.
   - `Escape` or `c`/`C` clears the calculator state.
2. **API Integration**:
   - Send payload to `/api/calculate` POST endpoint on equals/operation execution.
   - Display loading state while request is pending.
   - Show validation errors or network failures elegantly on the display screen.
3. **Input Validation**:
   - Prevent multiple consecutive decimal points (e.g., `1.2.3`).
   - Limit input length to prevent display overflow.
   - Validate client-side before sending requests (e.g. catch obvious division by zero locally to avoid redundant API calls, though backend still validates).

## Responsive Design
- **Desktop**: Centered, max-width layout (approx 400px calculator width) with the history panel displayed side-by-side or toggleable.
- **Tablet/Mobile**: Full-screen or adaptive size, maximizing screen estate. Responsive grid adjusts spacing and font sizes dynamically using CSS media queries.
