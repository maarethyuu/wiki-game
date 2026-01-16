# Wiki Game

> **Projekt zaliczeniowy: Algorytmy Grafowe**  
> Autor: **Nadia Zatorska**

Interaktywna aplikacja webowa, która wizualizuje proces znajdowania najkrótszej ścieżki między dwoma artykułami w Wikipedii. Projekt łączy surową logikę algorytmów z unikalnym stylem **retro-pop**, zamieniając abstrakcyjne dane w "plac zabaw dla mózgu".

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat&logo=vite)
![ReactFlow](https://img.shields.io/badge/ReactFlow-11-FF0072?style=flat&logo=react)
![License](https://img.shields.io/badge/Status-Completed-success)

---

## O Projekcie

Celem projektu było stworzenie narzędzia, które nie tylko oblicza wynik (najkrótszą drogę), ale przede wszystkim **pokazuje proces myślowy algorytmu**.

### Stylistyka
- **Paleta Peach & Ink:** Ciepła brzoskwinia i cyfrowy błękit przełamane atramentowym granatem.
- **Grube kontury i twarde cienie:** Estetyka inspirowana interfejsami lat 90. w wersji HD.
- **Mikro-interakcje:** Sprężyste animacje (bouncy physics) i responsywne elementy.

---

## Kluczowe funkcjonalności

### 1. Wizualizacja drzewa poszukiwań (BFS)
- Algorytm nie pokazuje tylko jednej linii. Rysuje **całe drzewo eksploracji** (piramidę), pokazując skalę problemu.
- **Główna ścieżka:** Zawsze wycentrowana (oś X=0), wyróżniona grubą, atramentową linią.
- **Tło (Ghost Nodes):** Pozostałe sprawdzone strony są wyświetlane jako subtelne tło, co pozwala zrozumieć, ile pracy wykonał algorytm.

### 2. Inteligentne Zarządzanie Danymi
- **Limit per level:** Aby uniknąć "wybuchu" przeglądarki (Wikipedia ma miliony połączeń), wizualizator inteligentnie ogranicza liczbę wyświetlanych węzłów tła do 25 na poziom głębokości.
- **Gwarancja spójności:** Nawet przy limitach wizualizacji, algorytm zawsze "wstrzykuje" brakujące ogniwa zwycięskiej ścieżki, aby wynik był kompletny.

### 3. Interaktywne karty wiedzy
- Po kliknięciu w dowolny węzeł otwiera się **retro-modal**.
- Aplikacja pobiera na żywo z API Wikipedii:
    - Miniaturkę artykułu.
    - Krótki abstrakt (streszczenie).
    - Bezpośredni link do źródła.

---

## Architektura i technologie

Projekt został zbudowany w oparciu o nowoczesny stos technologiczny (React + Vite), z wyraźnym podziałem na warstwy:

### Struktura
src/
├── components/         # Warstwa Prezentacji (UI)
│   ├── ControlPanel    # Panel sterowania (inputy, historia)
│   ├── GraphVisualizer # Wrapper na silnik grafowy
│   └── WikiNode        # Customowy węzeł (Retro styl)
├── services/           # Warstwa Logiki
│   ├── wikiApi.js      # Komunikacja z MediaWiki API
│   └── graphLogic.js   # Czysta implementacja BFS
└── App.jsx             # Główny stan i layout

### Zastosowane Algorytmy
*   **BFS (Breadth-First Search):** Przeszukiwanie wszerz. Gwarantuje znalezienie najkrótszej ścieżki w grafie nieważonym.
*   **Tree layout algorithm:** Autorski algorytm rozmieszczania węzłów na ekranie (centrowanie ścieżki + rozkładanie tła na boki).

---

## Jak uruchomić?

1.  **Zainstaluj zależności:**
    ```bash
    npm install
    ```

2.  **Uruchom serwer developerski:**
    ```bash
    npm run dev
    ```

3.  Otwórz w przeglądarce adres: `http://localhost:5173`

---

## Autor

**Nadia Zatorska**  
Projekt realizowany w ramach przedmiotu **Algorytmy Grafowe**.  
*„Making data fun again.”*
