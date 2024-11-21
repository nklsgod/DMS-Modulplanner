# Digital Media Systems Modulverlaufsplanner

## Beschreibung

Der Digital Media Systems Modulverlaufsplanner ist ein interaktives Webtool für Studierende des Studiengangs Digital Media Systems an der Technischen Hochschule Mittelhessen (THM). Mit diesem Tool können Studierende ihren individuellen Studienverlauf planen, indem sie Module für die Semester 3, 4 und 5 auswählen und ihren ECTS-Fortschritt verfolgen.

## Funktionen

- **Vertiefungsauswahl**: Studierende können zwischen den Vertiefungsrichtungen Informatik, BWL und Medien wählen.
- **Modulübersicht**: Anzeige der festgelegten Module für die Semester 1, 2 und 6.
- **Modulauswahl**: Interaktive Auswahl von Modulen für die Semester 3, 4 und 5.
- **ECTS-Tracking**: Fortschrittsanzeige für Wahlpflicht-, Überfachliche- und Vertiefungsmodule.
- **Persistenz**: Speicherung der ausgewählten Module im lokalen Speicher des Browsers.

## Technologien

- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5.3.3
- Bootstrap Icons

## Installation

1. Klonen Sie das Repository:
   ```bash
   git clone git@github.com:nklsgod/DMS-Modulplanner.git
   
2. Navigieren Sie in das Projektverzeichnis:
    cd DMS-Modulplanner 

3. Installieren Sie die Abhängigkeiten:
    npm install

4. Starten Sie den Server:
    node server/server.js


## Projektstruktur 
DMS-Modulplanner/
│
├── public/
│   ├── img/
│   │   └── image.png
│   └── index.html
│
├── server/
│   └── server.js
│
├── src/
│   ├── scripts/
│   │   └── script.js
│   └── styles/
│       └── stylesheet.css
│
├── package.json
├── package-lock.json
└── README.md

## Verwendung 
Öffnen Sie die Anwendung in Ihrem Browser unter http://localhost:3000
Wählen Sie Ihre Vertiefungsrichtung aus dem Dropdown-Menü
Fügen Sie Module zu den Semestern 3, 4 und 5 hinzu
Verwalten Sie Ihre Modulauswahl mit den Hinzufügen/Entfernen-Funktionen
Verfolgen Sie Ihren ECTS-Fortschritt in der Fortschrittsanzeige

## API-Endpunkte
GET /module - Ruft alle verfügbaren Module ab

## Entwicklung
Server läuft standardmäßig auf Port 3000
Frontend nutzt Bootstrap für das responsive Design
Lokale Speicherung der Moduldaten im localStorage