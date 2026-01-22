Prompt pour Gemini 3 Pro (Antigravity IDE)
Rôle : Tu es un Expert Senior en Data Visualization et Développeur Front-End (Spécialiste UX/UI). Tu travailles pour un cabinet d'analyse prestigieux.

Tâche : Créer une "Single Page Application" (SPA) d'analyse de données sur l'impact de l'IA (2choix : Économique & Social). Le site doit être entièrement en Français.

Fichiers disponibles : Tu as accès à un fichier CSV dans le répertoire courant (nommé par défaut data.csv ou similaire, analyse sa structure pour adapter les colonnes).

1. Spécifications Techniques
Tech Stack : HTML5, CSS3 (Moderne, Flexbox/Grid), JavaScript Vanilla (ES6+).

Librairie Graphique : Plotly.js (via CDN). Pas de D3.js complexe, utilise la puissance native de Plotly pour le comportement SVG et responsive.

Architecture :

index.html : Structure sémantique.

style.css : Design system complet.

script.js : Parsing CSV, logique de rendu Plotly, gestion des événements (modales).

Performance : Code léger, animations CSS douces (fade-in au scroll).

2. Design System & UI (Style "High-End Corporate")
Palette : Fond sombre profond (ex: #0f172a), Texte blanc cassé (#f8fafc).

Accents : Utilise une palette catégorielle sophistiquée pour les graphiques (ex: Teal #14b8a6, Indigo #6366f1, Rose #f43f5e, Amber #f59e0b).

Layout :

Header "Hero" immersif avec titre, sous-titre et résumé des KPIs globaux.

Grille de cartes (Cards) pour les graphiques. Chaque carte contient :

Le graphique (Plotly).

Une explication brève latérale ou en dessous (2-3 lignes).

Un bouton/icône "Agrandir / Détails".

Interactivité (Critique) :

Au clic sur un graphique ou le bouton détail : Ouverture d'une Modale Plein Écran.

La modale affiche le graphique en grand et une Analyse Détaillée (texte généré contextuellement qui explique la tendance).

3. Les Données et Visualisations (Mapping)
Tu dois parser le CSV et générer les 7 graphiques suivants. Si les noms de colonnes exacts manquent, déduis-les ou simule des données cohérentes basées sur le contexte fourni.

Section A : Dynamique du Marché (Économie)

Scatter Plot : Volume contenu IA (TB/an) vs Part de Marché (%).

But : Corrélation production/avantage concurrentiel.

Trendline : Oui.

Bar Chart (Grouped) ou Scatter : Productivité Nationale vs Taux d'adoption IA.

But : L'IA comme moteur d'innovation nationale.

Box Plot ou Violin : Outil IA (Midjourney, ChatGPT, etc.) vs Revenus/Part de marché.

But : Comparer la rentabilité selon les outils.

Section B : Effets Sociaux et Emploi 4. Scatter Plot avec régression : Taux d'adoption IA vs Perte d'emploi (%). * But : Coût social de l'automatisation. 5. Heatmap ou Correlation Matrix : Score Collaboration Humain-IA vs Réduction perte d'emploi. * But : Prouver que la collaboration protège l'emploi. 6. Radar Chart : Industrie vs Score Collaboration Humain-IA. * But : Identifier les secteurs adaptatifs. 7. Choropleth Map (Carte Monde) : Indice de Résilience de l'Emploi par Pays. * But : Géographie des turbulences.

4. Instructions de Génération de Code
HTML : Crée une structure propre avec des conteneurs IDs pour chaque graphique (#chart1, #chart2...). Ajoute les textes d'explication "brève" et "détaillée" en dur dans le HTML (cachés pour la modale) ou dans un objet JS.

CSS : Soigne la typographie (Police sans-serif propre comme 'Inter' ou 'Roboto'). Les graphiques doivent avoir un fond transparent pour se fondre dans le design.

JS :

Fonction loadData() pour lire le CSV.

Fonction renderCharts(data) qui configure Plotly avec un thème sombre (layout.paper_bgcolor='rgba(0,0,0,0)', layout.plot_bgcolor='rgba(0,0,0,0)', police blanche).

Système de modale simple : Click -> Ajoute classe .active à la modale -> Affiche le graph en grand (relayout Plotly pour remplir l'écran).

Génère maintenant le code complet (HTML, CSS, JS)  en fichiers séparés clairs : 
index.html
 
styles.css
 
index.js
  . Le résultat doit être prêt à l'emploi.