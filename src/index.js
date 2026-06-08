document.addEventListener('DOMContentLoaded', () => {
    chargerDonnees();
    configurerPe();
});

// Pour stocker les données chargées
let donneesGlobales = [];

async function chargerDonnees() {
    try {
        const response = await fetch('data/Global_AI_Content_Impact_Dataset.csv');
        const text = await response.text();
        donneesGlobales = analyserCSV(text);
        
        calculerIndicateurs(donneesGlobales);
        afficherGraphiques(donneesGlobales);
    } catch (error) {
        console.error('Erreur chargement données:', error);
        // En cas d'erreur, afficher un message utilisateur
    }
}

function analyserCSV(texte) {
    const lignes = texte.split('\n').filter(l => l.trim());
    const enTetes = lignes[0].split(',').map(h => h.trim());
    
    return lignes.slice(1).map(ligne => {
        const valeurs = ligne.split(','); 
        const rang = {};
        
        enTetes.forEach((entete, index) => {
            let val = valeurs[index] ? valeurs[index].trim() : '';
            
            // Conversion numérique si applicable
            if (entete.includes('%') || entete.includes('Volume') || entete.includes('Year')) {
                const num = parseFloat(val);
                rang[entete] = isNaN(num) ? val : num;
            } else {
                rang[entete] = val;
            }
        });
        return rang;
    });
}
    
function animerValeur(idObjet, debut, fin, duree) {
    const obj = document.getElementById(idObjet);
    let topDepart = null;
    const etape = (horodatage) => {
        if (!topDepart) topDepart = horodatage;
        const progression = Math.min((horodatage - topDepart) / duree, 1);
        obj.innerHTML = Math.floor(progression * (fin - debut) + debut).toLocaleString();
        if (progression < 1) {
            window.requestAnimationFrame(etape);
        }
    };
    window.requestAnimationFrame(etape);
}

function calculateAverage(donnees, cle) {
    const somme = donnees.reduce((acc, ligne) => acc + (ligne[cle] || 0), 0);
    return somme / donnees.length;
}

function calculerIndicateurs(donnees) {
    // 1. Volume total de contenu généré par l'IA
    const volumeTotal = donnees.reduce((acc, ligne) => acc + (ligne['AI-Generated Content Volume (TBs per year)'] || 0), 0);
    
    // 2. Adoption moyenne de l'IA
    const adoptionMoyenne = calculateAverage(donnees, 'AI Adoption Rate (%)');
    
    // 3. Impact global sur l'emploi
    const perteEmploiMoyenne = calculateAverage(donnees, 'Job Loss Due to AI (%)');

    // Mise à jour du DOM
    animerValeur('indicateur-volume', 0, Math.floor(volumeTotal), 2000);
    
    // Affectation directe pour les pourcentages 
    document.getElementById('indicateur-adoption').textContent = adoptionMoyenne.toFixed(1) + '%';
    document.getElementById('indicateur-emplois').textContent = '-' + perteEmploiMoyenne.toFixed(1) + '%';
}

// Couleurs Système et Mise en Page Commune
const couleurs = {
    sarcelle: '#0d9488',
    indigo: '#2563eb',
    rose: '#e11d48',
    ambre: '#d97706',
    texte: '#1e293b',
    grille: '#cbd5e1'
};

const miseEnPageCommune = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: {
        family: 'Inter, sans-serif',
        color: couleurs.texte
    },
    xaxis: {
        gridcolor: 'rgba(203, 213, 225, 0.5)',
        zerolinecolor: 'rgba(203, 213, 225, 0.5)'
    },
    yaxis: {
        gridcolor: 'rgba(203, 213, 225, 0.5)',
        zerolinecolor: 'rgba(203, 213, 225, 0.5)'
    },
    margin: { t: 30, r: 20, l: 40, b: 40 }
};

// Aggrégation des données pour les graphiques
function agregerDonnees(donnees, cleX, cleY, tailleSeau) {
    const agreger = {};
    
    donnees.forEach(d => {
        const valX = d[cleX] || 0;
        const agrege = Math.floor(valX / tailleSeau) * tailleSeau;
        if (!agreger[agrege]) agreger[agrege] = { total: 0, count: 0 };
        agreger[agrege].total += (d[cleY] || 0);
        agreger[agrege].count++;
    });

    const labels = Object.keys(agreger).map(k => parseFloat(k)).sort((a,b) => a-b);
    const valeurs = labels.map(k => agreger[k].total / agreger[k].count);

    return { x: labels, y: valeurs };
}

function afficherGraphiques(donnees) {
    
    // Graphique 1: Volume vs Part de Marché (Bar Chart Agrégé avec Ligne)
    // Aggrégation par tranche de 10 TB
    const dataPartMarche = agregerDonnees(donnees, 'AI-Generated Content Volume (TBs per year)', 'Market Share of AI Companies (%)', 10);
    
    const trace1 = {
        x: dataPartMarche.x.map(x => x + "-" + (x+10)), // Labels "0-10", "10-20"
        y: dataPartMarche.y,
        type: 'bar',
        marker: {
            color: couleurs.indigo,
            opacity: 0.8
        }
    };
    
    // Ajout d'une ligne de tendance pour améliorer la lecture
    const trace1Line = {
        x: dataPartMarche.x.map(x => x + "-" + (x+10)),
        y: dataPartMarche.y,
        type: 'scatter',
        mode: 'lines',
        line: { color: couleurs.sarcelle, shape: 'spline' },
        name: 'Tendance'
    };

    Plotly.newPlot('graphique1', [trace1, trace1Line], {
        ...miseEnPageCommune,
        showlegend: false,
        title: { text: '', font: { size: 12 } },
        xaxis: { ...miseEnPageCommune.xaxis, title: 'Volume (TB / an)' },
        yaxis: { ...miseEnPageCommune.yaxis, title: 'Part de Marché Moyenne (%)' }
    }, { responsive: true });


    // Graphique 2: Revenus vs Adoption (Line Chart Agrégé)
    // Aggrégation par tranche de 10% d'adoption
    const dataRevenus = agregerDonnees(donnees, 'AI Adoption Rate (%)', 'Revenue Increase Due to AI (%)', 10);

    const trace2 = {
        x: dataRevenus.x,
        y: dataRevenus.y,
        mode: 'lines+markers',
        type: 'scatter',
        line: {
            color: couleurs.indigo,
            width: 3,
            shape: 'spline'
        },
        marker: {
            size: 8,
            color: couleurs.sarcelle
        },
        fill: 'tozeroy', // Remplissage pour visualiser le "volume" de revenu
        fillcolor: 'rgba(37, 99, 235, 0.1)'
    };

    Plotly.newPlot('graphique2', [trace2], {
        ...miseEnPageCommune,
        xaxis: { ...miseEnPageCommune.xaxis, title: 'Adoption (%)' },
        yaxis: { ...miseEnPageCommune.yaxis, title: 'Augmentation Revenus Moyenne (%)' }
    }, { responsive: true });


    // Graphique 3: Efficacité des Outils IA (Box Plot)
    const trace3 = {
        y: donnees.map(d => d['Revenue Increase Due to AI (%)']),
        x: donnees.map(d => d['Top AI Tools Used']),
        type: 'box',
        marker: { color: couleurs.indigo },
        boxpoints: 'all',
        jitter: 0.3,
        pointpos: -1.8
    };

    Plotly.newPlot('graphique3', [trace3], {
        ...miseEnPageCommune,
        xaxis: { ...miseEnPageCommune.xaxis, title: 'Outil IA' },
        yaxis: { ...miseEnPageCommune.yaxis, title: 'Impact Revenus (%)' }
    }, { responsive: true });


    // Graphique 4: Adoption vs Emploi (Bar Chart Agrégé)
    // On veut voir si plus d'adoption = plus de perte d'emploi moyenne
    const dataAdoptionEmploi = agregerDonnees(donnees, 'AI Adoption Rate (%)', 'Job Loss Due to AI (%)', 10);

    const trace4 = {
        x: dataAdoptionEmploi.x.map(x => x + "-" + (x+10) + "%"),
        y: dataAdoptionEmploi.y,
        type: 'bar',
        marker: {
            color: couleurs.indigo,
            opacity: 0.9,
            line: { width: 1.5, color: '#fff' } // Style plus "clean"
        },
        name: 'Perte Emploi Moyenne'
    };

    Plotly.newPlot('graphique4', [trace4], {
        ...miseEnPageCommune,
        xaxis: { ...miseEnPageCommune.xaxis, title: "Tranche d'Adoption de l'IA" },
        yaxis: { ...miseEnPageCommune.yaxis, title: 'Perte Emploi Moyenne (%)' }
    }, { responsive: true });


    // Graphique 5: Collaboration vs Perte Emploi (Line Chart Agrégé avec Tendance)
    // Hypothèse: Collaboration réduit la perte d'emploi
    const dataCollabEmploi = agregerDonnees(donnees, 'Human-AI Collaboration Rate (%)', 'Job Loss Due to AI (%)', 10);

    const trace5 = {
        x: dataCollabEmploi.x,
        y: dataCollabEmploi.y,
        mode: 'lines+markers',
        type: 'scatter',
        line: {
            color: couleurs.indigo,
            width: 4,
            shape: 'spline' // Courbe plus douce
        },
        marker: {
            size: 10,
            color: couleurs.sarcelle,
            symbol: 'diamond'
        },
        name: 'Impact Collaboration'
    };

    Plotly.newPlot('graphique5', [trace5], {
        ...miseEnPageCommune,
        xaxis: { ...miseEnPageCommune.xaxis, title: 'Taux de Collaboration Humain-IA (%)' },
        yaxis: { ...miseEnPageCommune.yaxis, title: 'Perte Emploi Moyenne (%)' }
    }, { responsive: true });


    // Graphique 6: Heatmap Multi-Dimensionnelle par Industrie
    // Au lieu d'un seul score, on compare plusieurs KPIs par secteur pour voir les profils complets
    const industries = [...new Set(donnees.map(d => d['Industry']))].sort();
    
    // Métriques à comparer
    const metricsDef = [
        { key: 'Human-AI Collaboration Rate (%)', label: 'Collab. Humain-IA' },
        { key: 'Revenue Increase Due to AI (%)', label: 'Hausse Revenus' },
        { key: 'AI Adoption Rate (%)', label: 'Taux Adoption' },
        { key: 'Job Loss Due to AI (%)', label: 'Perte Emploi' }
    ];

    // Construction de la matrice Z (Lignes = Métriques, Colonnes = Industries)
    const zValues = metricsDef.map(m => {
        return industries.map(ind => {
            const subset = donnees.filter(d => d.Industry === ind);
            return calculateAverage(subset, m.key);
        });
    });

    const trace6 = {
        z: zValues,
        x: industries,
        y: metricsDef.map(m => m.label),
        type: 'heatmap',
        colorscale: 'Blues', 
        reversescale: false,
        showscale: true
    };

    Plotly.newPlot('graphique6', [trace6], {
        ...miseEnPageCommune,
        margin: { t: 30, r: 20, l: 120, b: 80 },
        xaxis: { 
            ...miseEnPageCommune.xaxis, 
            tickangle: -45,
            title: ''
        },
        yaxis: { 
            ...miseEnPageCommune.yaxis,
            title: ''
        }
    }, { responsive: true });


    // Graphique 7: Carte Monde de la résilience à la perte d'emploi due à l'IA
    // Calcul de la résilience moyenne par pays
    const resiliencePays = {};
    donnees.forEach(d => {
        if (!resiliencePays[d.Country]) resiliencePays[d.Country] = [];
        resiliencePays[d.Country].push(100 - d['Job Loss Due to AI (%)']);
    });

    const locations = Object.keys(resiliencePays);
    const z = locations.map(c => {
        const arr = resiliencePays[c];
        return arr.reduce((a,b)=>a+b,0) / arr.length;
    });

    const trace7 = {
        type: 'choropleth',
        locationmode: 'country names',
        locations: locations,
        z: z, // Score sur 100
        zmin: 0,
        zmax: 100,
        text: locations.map((loc, i) => `${loc}<br>Résilience: ${z[i].toFixed(1)}%`),
        colorscale: 'Blues', // Uniformisation vers Bleus
        autocolorscale: false,
        reversescale: false,
        marker: { line: { color: 'rgb(255,255,255)', width: 0.5 } },
        colorbar: { 
            title: 'Indice de Résilience', 
            thickness: 15,
            titleside: 'right'
        }
    };

    Plotly.newPlot('graphique7', [trace7], {
        ...miseEnPageCommune,
        geo: {
            showframe: false,
            showcoastlines: true,
            coastlinecolor: '#cbd5e1',
            projection: { type: 'mercator' },
            bgcolor: 'rgba(0,0,0,0)',
            lakecolor: 'rgba(0,0,0,0)',
            landcolor: '#f1f5f9' // Couleur par défaut des pays sans données
        }
    }, { responsive: true });
}

// Logique pour la fenêtre plein écran (pe)
function configurerPe() {
    const pe = document.getElementById('pe-detail');
    const boutonFermer = document.querySelector('.fermer-pe');
    const boutonsAgrandir = document.querySelectorAll('.bouton-agrandir');
    const conteneurGraphiquePe = document.getElementById('conteneur-graphique-pe');
    const peTexte = document.getElementById('texte-pe');
    const peTitre = document.getElementById('titre-pe');

    boutonsAgrandir.forEach(bouton => {
        bouton.addEventListener('click', (e) => {
            const idGraphique = bouton.getAttribute('data-graphique');
            const carte = bouton.closest('.carte');
            const titre = carte.querySelector('h3').innerText;
            const analyseComplete = carte.querySelector('.analyse-complete').innerHTML;

            peTitre.innerText = titre;
            peTexte.innerHTML = analyseComplete;
            
            // Charger le graphique dans le conteneur 
            const graphiqueOriginal = document.getElementById(idGraphique);
            const data = graphiqueOriginal.data;
            const layout = graphiqueOriginal.layout;
            
            Plotly.newPlot('conteneur-graphique-pe', data, layout); 
            
            pe.classList.add('active');
            
            setTimeout(() => {
                Plotly.relayout('conteneur-graphique-pe', {
                    width: conteneurGraphiquePe.clientWidth,
                    height: conteneurGraphiquePe.clientHeight
                });
            }, 50);
        });
    });

    boutonFermer.addEventListener('click', () => {
        pe.classList.remove('active');
        Plotly.purge('conteneur-graphique-pe');
    });

    window.addEventListener('click', (e) => {
        if (e.target === pe) {
            pe.classList.remove('active');
            Plotly.purge('conteneur-graphique-pe');
        }
    });
}
