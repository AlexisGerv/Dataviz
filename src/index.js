import downloadData from "./helpers/downloadData.js";
import unpack from "./helpers/unpack.js";

// Common layout settings for dark theme
const commonLayout = {
  plot_bgcolor: "rgba(0,0,0,0)",
  paper_bgcolor: "rgba(0,0,0,0)",
  font: {
    family: "Inter, sans-serif",
    color: "#1e293b", // Slate 800
  },
  xaxis: {
    gridcolor: "#e2e8f0", // Slate 200
    zerolinecolor: "#e2e8f0",
    tickfont: {
      color: "#64748b", // Slate 500
    },
    titlefont: {
      color: "#1e293b",
    },
  },
  yaxis: {
    gridcolor: "#e2e8f0",
    zerolinecolor: "#e2e8f0",
    tickfont: {
      color: "#64748b",
    },
    titlefont: {
      color: "#1e293b",
    },
  },
  margin: {
    t: 40,
    r: 20,
    b: 60,
    l: 60,
  },
  hoverlabel: {
    bgcolor: "#ffffff",
    bordercolor: "#e2e8f0",
    font: {
      color: "#1e293b",
    },
  },
};

// Data for Chart Explanations
const chartDetails = {
  scatterplotaicontentvsmarketshare: {
    title: "Volume de Contenu vs Part de Marché",
    size: "100%",
    description: `
      <p>Ce graphique explore la relation entre la quantité de contenu généré par l'IA et la domination du marché par les entreprises technologiques. Chaque point représente un pays, sa taille est proportionnelle à l'augmentation des revenus générés par l'IA.</p>
      
      <h4>Analyse Clé :</h4>
      <ul>
        <li><strong>Corrélation Positive :</strong> On observe une tendance générale où une augmentation du volume de contenu généré par l'IA est corrélée à une plus grande part de marché des entreprises d'IA.</li>
        <li><strong>Impact Revenu :</strong> Les plus grandes bulles (revenus élevés) se situent souvent dans la zone supérieure droite, indiquant que l'adoption massive de l'IA est un vecteur de croissance économique.</li>
        <li><strong>Disparités Régionales :</strong> Certains pays, malgré un volume de contenu modéré, bénéficient d'une forte part de marché, suggérant une spécialisation qualitative plutôt que quantitative.</li>
      </ul>

      <h4>Implications Stratégiques :</h4>
      <p>Pour rester compétitives, les entreprises ne doivent pas seulement produire plus de contenu via l'IA, mais aussi l'intégrer stratégiquement pour capturer des parts de marché.</p>
    `,
  },
  barchartaiadoptionvscontentvolume: {
    title: "Adoption de l'IA vs Augmentation des Revenus",
    description: `
      <p>Ce graphique compare deux indicateurs économiques cruciaux pour chaque pays : le taux d'adoption de l'IA (en violet) et l'augmentation des revenus attribuée à l'IA (en bleu ciel).</p>

      <h4>Observations :</h4>
      <ul>
        <li><strong>Retour sur Investissement (ROI) :</strong> Dans la majorité des cas, un taux d'adoption élevé se traduit par une augmentation significative des revenus.</li>
        <li><strong>Efficacité Variable :</strong> Certains pays montrent une augmentation des revenus disproportionnée par rapport à leur taux d'adoption, signalant une implémentation très efficace de l'IA (haute valeur ajoutée).</li>
        <li><strong>Potentiel de Croissance :</strong> Les pays avec une forte adoption mais des revenus encore modérés pourraient être en phase d'investissement ou de transition technologique.</li>
      </ul>
    `,
  },
  "box-plot-revenue-vs-ai-tools": {
    title: "Revenus vs Outils IA",
    description: `
      <p>Ce diagramme en boîte (box plot) montre la distribution de l'augmentation des revenus en fonction des outils d'IA utilisés (ex: TensorFlow, PyTorch). Il permet d'identifier quels outils sont associés aux meilleures performances économiques.</p>

      <h4>Tendances Outils :</h4>
      <ul>
        <li><strong>Médianes :</strong> Comparez la ligne centrale de chaque boîte pour voir quel outil offre, en moyenne, le meilleur gain de revenus.</li>
        <li><strong>Volatilité :</strong> Une boîte haute indique que les résultats sont très variables d'une entreprise à l'autre pour cet outil. Une boîte compacte suggère des résultats plus prévisibles.</li>
        <li><strong>Performance Maximale :</strong> Les "moustaches" (lignes verticales) montrent l'étendue des gains possibles. Certains outils spécialisés peuvent permettre des gains exceptionnels dans des cas précis.</li>
      </ul>
    `,
  },
  "heatmap-country-industry-ai-volume-market-share": {
    title: "Concentration de l'IA par Pays et Industrie",
    description: `
      <p>Cette carte thermique (heatmap) visualise l'intensité de la production de contenu IA à travers différentes industries et pays. Les couleurs plus claires (jaune/vert) indiquent un volume plus élevé.</p>

      <h4>Points Chauds :</h4>
      <ul>
        <li><strong>Secteurs Dominants :</strong> Identifiez rapidement quelles industries (ex: Tech, Finance) sont les plus grandes consommatrices de contenu IA dans chaque pays.</li>
        <li><strong>Spécialisation Nationale :</strong> Certains pays peuvent montrer une intensité particulière dans un secteur unique, reflétant une stratégie nationale ou un écosystème local fort.</li>
        <li><strong>Opportunités :</strong> Les zones sombres peuvent représenter des marchés ou des secteurs encore sous-exploités où l'adoption de l'IA a un fort potentiel de croissance.</li>
      </ul>
    `,
  },
  "scatter-plot-ai-adoption-vs-job-loss": {
    title: "Adoption de l'IA et Impact sur l'Emploi",
    description: `
      <p>Ce graphique met en relation le taux d'adoption de l'IA avec le pourcentage de perte d'emploi estimé. Il aborde la question sensible du remplacement technologique.</p>

      <h4>Réalité des Données :</h4>
      <ul>
        <li><strong>Pas de Corrélation Directe Simple :</strong> Contrairement aux idées reçues, une forte adoption ne signifie pas toujours une forte perte d'emploi. L'IA peut créer de nouveaux rôles.</li>
        <li><strong>Nuance par Pays :</strong> Certains pays gèrent mieux la transition grâce à la formation et à la politique sociale, limitant les pertes d'emplois malgré une forte automatisation.</li>
        <li><strong>Transformation vs Remplacement :</strong> Dans de nombreux cas, l'IA transforme les tâches plutôt que de supprimer les postes entiers.</li>
      </ul>
    `,
  },
  "scatter-plot-human-ai-collaboration-vs-job-loss": {
    title: "Collaboration Humain-IA vs Perte d'Emploi",
    description: `
      <p>Ce scatter plot examine si une collaboration étroite entre humains et IA (Human-in-the-loop) permet d'atténuer les pertes d'emplois.</p>

      <h4>L'Hypothèse de la Collaboration :</h4>
      <ul>
        <li><strong>Rôle Protecteur :</strong> On cherche à voir si les pays favorisant la collaboration (plutôt que l'automatisation totale) subissent moins de destructions d'emplois.</li>
        <li><strong>Synergie :</strong> Une forte collaboration suggère une utilisation de l'IA comme un outil d'augmentation des capacités humaines, et non comme un substitut.</li>
      </ul>
    `,
  },
  "bar-chart-human-ai-collaboration-by-industry": {
    title: "Niveau de Collaboration Humain-IA par Industrie",
    description: `
      <p>Comparaison du taux moyen de collaboration Humain-IA dans différents secteurs d'activité.</p>

      <h4>Insights Sectoriels :</h4>
      <ul>
        <li><strong>Secteurs Créatifs vs Techniques :</strong> Observez si les secteurs demandant plus de créativité ou d'empathie (Santé, Arts) ont des taux de collaboration plus élevés.</li>
        <li><strong>Automatisation Industrielle :</strong> Les secteurs industriels peuvent avoir des taux plus bas si l'objectif est l'automatisation complète des chaînes de production.</li>
        <li><strong>Futur du Travail :</strong> Les industries avec des taux élevés préfigurent probablement le modèle de travail hybride du futur.</li>
      </ul>
    `,
  },
  "choropleth-job-loss-by-country": {
    title: "Carte Mondiale des Pertes d'Emploi liées à l'IA",
    description: `
      <p>Cette carte choroplèthe offre une vue géographique de l'impact de l'IA sur l'emploi. L'intensité de la couleur rouge indique le pourcentage de perte d'emploi.</p>

      <h4>Géographie de l'Impact :</h4>
      <ul>
        <li><strong>Zones à Risque :</strong> Identifiez les régions les plus touchées. S'agit-il de pays développés à forte automatisation ou de pays en développement ?</li>
        <li><strong>Résilience :</strong> Les pays avec des couleurs claires montrent une meilleure résilience de leur marché du travail face à l'arrivée de l'IA.</li>
        <li><strong>Facteurs Politiques :</strong> Ces données peuvent refléter l'efficacité des politiques de protection de l'emploi et de reconversion professionnelle.</li>
      </ul>
    `,
  },
};

// --- Refactored Chart Functions to attach data to DOM ---

function storeChartData(elementId, data, layout) {
  const el = document.getElementById(elementId);
  if (el) {
    el._chartData = data;
    el._chartLayout = layout;
  }
}

function ScatterPlotAiContentsMarketShare(rows) {
  const x = unpack(rows, "AI-Generated Content Volume (TBs per year)");
  const y = unpack(rows, "Market Share of AI Companies (%)");
  const country = unpack(rows, "Country");
  const year = unpack(rows, "Year");
  const industry = unpack(rows, "Industry");
  const adoption = unpack(rows, "AI Adoption Rate (%)");
  const revenue = unpack(rows, "Revenue Increase Due to AI (%)");

  const data = [
    {
      x,
      y,
      mode: "markers",
      type: "scatter",
      marker: {
        size: revenue,
        sizemode: "area",
        sizeref: (2.0 * Math.max(...revenue)) / 40 ** 2,
        color: adoption,
        colorscale: "Viridis",
        opacity: 0.8,
        line: {
          width: 1,
          color: "#ffffff",
        },
      },
      text: country.map(
        (c, i) =>
          `<b>${c}</b><br>Année : ${year[i]}<br>Secteur : ${industry[i]}<br>` +
          `Contenu IA : ${x[i]} TB<br>Part de marché : ${y[i]}%`,
      ),
      hoverinfo: "text",
    },
  ];

  const layout = {
    ...commonLayout,
    title: undefined, // Remove title for card view (handled by HTML) or keep simple
    xaxis: {
      ...commonLayout.xaxis,
      title: "Volume de contenu IA généré (TB/an)",
    },
    yaxis: {
      ...commonLayout.yaxis,
      title: "Part de marché des entreprises IA (%)",
    },
    hovermode: "closest",
    margin: { t: 20, r: 20, b: 60, l: 60 }, // Reduced top margin
  };

  const elementId = "scatterplotaicontentvsmarketshare";
  Plotly.newPlot(elementId, data, layout, {
    responsive: true,
    displayModeBar: false,
  });
  storeChartData(elementId, data, layout);
}

function BarChartAiAdoptionVsContentVolume(rows) {
  const countries = unpack(rows, "Country");
  const adoptionRaw = unpack(rows, "AI Adoption Rate (%)");
  const revenueRaw = unpack(rows, "Revenue Increase Due to AI (%)");

  const toNumber = (v) => {
    if (v === undefined || v === null) return null;
    const n = parseFloat(String(v).replace(",", ".").replace("%", "").trim());
    return Number.isFinite(n) ? n : null;
  };

  const agg = {};
  for (let i = 0; i < countries.length; i++) {
    const c = countries[i];
    if (!c) continue;
    const a = toNumber(adoptionRaw[i]);
    const r = toNumber(revenueRaw[i]);
    if (!agg[c])
      agg[c] = {
        adoptionSum: 0,
        revenueSum: 0,
        adoptionCount: 0,
        revenueCount: 0,
      };
    if (a !== null) {
      agg[c].adoptionSum += a;
      agg[c].adoptionCount += 1;
    }
    if (r !== null) {
      agg[c].revenueSum += r;
      agg[c].revenueCount += 1;
    }
  }

  const countryKeys = Object.keys(agg);
  const countryAverages = countryKeys.map((c) => {
    const item = agg[c];
    const avgAdoption = item.adoptionCount
      ? item.adoptionSum / item.adoptionCount
      : 0;
    const avgRevenue = item.revenueCount
      ? item.revenueSum / item.revenueCount
      : 0;
    return {
      country: c,
      avgAdoption,
      avgRevenue,
    };
  });

  countryAverages.sort((a, b) => b.avgRevenue - a.avgRevenue);

  const x = countryAverages.map((d) => d.country);
  const revenue = countryAverages.map((d) => Number(d.avgRevenue.toFixed(2)));
  const adoption = countryAverages.map((d) => Number(d.avgAdoption.toFixed(2)));

  const data = [
    {
      x,
      y: revenue,
      name: "Augmentation des revenus (%)",
      type: "bar",
      marker: {
        color: "#2563eb", // Blue 600
      },
      hovertemplate: "%{x}<br>Revenus : %{y}%<extra></extra>",
    },
    {
      x,
      y: adoption,
      name: "Taux d'adoption de l'IA (%)",
      type: "bar",
      marker: {
        color: "#4f46e5", // Indigo 600
      },
      hovertemplate: "%{x}<br>Adoption : %{y}%<extra></extra>",
    },
  ];

  const layout = {
    ...commonLayout,
    title: undefined,
    xaxis: { ...commonLayout.xaxis, title: "Pays", tickangle: -45 },
    yaxis: { ...commonLayout.yaxis, title: "Pourcentage (%)" },
    barmode: "group",
    legend: {
      orientation: "h",
      y: -0.2,
      font: {
        color: "#64748b",
      },
    },
    margin: { t: 20, r: 20, b: 60, l: 60 },
  };

  const elementId = "barchartaiadoptionvscontentvolume";
  Plotly.newPlot(elementId, data, layout, {
    responsive: true,
    displayModeBar: false,
  });
  storeChartData(elementId, data, layout);
}

const parseNumber = (v) => {
  if (v === undefined || v === null) return null;
  const n = parseFloat(String(v).replace(",", ".").replace("%", "").trim());
  return Number.isFinite(n) ? n : null;
};

function BoxPlotRevenueVsAiTools(rows) {
  const tools = unpack(rows, "Top AI Tools Used");
  const revenueRaw = unpack(rows, "Revenue Increase Due to AI (%)");
  const revenue = revenueRaw.map(parseNumber);

  const data = [
    {
      y: revenue,
      x: tools,
      type: "box",
      marker: {
        color: "#2563eb",
      },
      boxpoints: "all",
      jitter: 0.3,
      pointpos: -1.8,
    },
  ];

  const layout = {
    ...commonLayout,
    title: undefined,
    xaxis: { ...commonLayout.xaxis, title: "Outils IA" },
    yaxis: { ...commonLayout.yaxis, title: "Augmentation des revenus (%)" },
    margin: { t: 20, r: 20, b: 60, l: 60 },
  };

  const elementId = "box-plot-revenue-vs-ai-tools";
  Plotly.newPlot(elementId, data, layout, {
    responsive: true,
    displayModeBar: false,
  });
  storeChartData(elementId, data, layout);
}

function HeatmapCountryIndustryAiVolume(rows) {
  const countries = unpack(rows, "Country");
  const industries = unpack(rows, "Industry");
  const volumeRaw = unpack(rows, "AI-Generated Content Volume (TBs per year)");
  const volume = volumeRaw.map(parseNumber);

  const data = [
    {
      x: industries,
      y: countries,
      z: volume,
      type: "heatmap",
      colorscale: "Viridis",
      colorbar: {
        title: "Volume (TB)",
        titlefont: {
          color: "#1e293b",
        },
        tickfont: {
          color: "#64748b",
        },
      },
    },
  ];

  const layout = {
    ...commonLayout,
    title: undefined,
    xaxis: { ...commonLayout.xaxis, title: "Industrie", tickangle: -45 },
    yaxis: { ...commonLayout.yaxis, title: "Pays" },
    margin: { t: 20, r: 20, b: 100, l: 100 },
  };

  const elementId = "heatmap-country-industry-ai-volume-market-share";
  Plotly.newPlot(elementId, data, layout, {
    responsive: true,
    displayModeBar: false,
  });
  storeChartData(elementId, data, layout);
}

function BarChartAiAdoptionVsJobLoss(rows) {
  const adoptionRaw = unpack(rows, "AI Adoption Rate (%)");
  const jobLossRaw = unpack(rows, "Job Loss Due to AI (%)");
  const countries = unpack(rows, "Country");

  const adoption = adoptionRaw.map(parseNumber);
  const jobLoss = jobLossRaw.map(parseNumber);

  const combined = countries
    .map((c, i) => ({
      country: c,
      adoption: adoption[i],
      jobLoss: jobLoss[i],
    }))
    .filter((d) => d.country && d.adoption !== null && d.jobLoss !== null);

  combined.sort((a, b) => a.adoption - b.adoption);

  const x = combined.map((d) => d.country);
  const y = combined.map((d) => d.jobLoss);
  const color = combined.map((d) => d.adoption);

  const data = [
    {
      x: x,
      y: y,
      type: "bar",
      marker: {
        color: color,
        colorscale: "Portland",
        showscale: true,
        colorbar: {
          title: "Taux d'adoption (%)",
          titlefont: {
            color: "#1e293b",
          },
          tickfont: {
            color: "#64748b",
          },
        },
      },
      hovertemplate:
        "<b>%{x}</b><br>Perte d'emploi: %{y}%<br>Adoption: %{marker.color}%<extra></extra>",
    },
  ];

  const layout = {
    ...commonLayout,
    title: undefined,
    xaxis: {
      ...commonLayout.xaxis,
      title: "Pays (triés par adoption croissante)",
      tickangle: -45,
    },
    yaxis: { ...commonLayout.yaxis, title: "Perte d'emploi (%)" },
    margin: { t: 20, r: 20, b: 80, l: 60 },
  };

  const elementId = "scatter-plot-ai-adoption-vs-job-loss";
  Plotly.newPlot(elementId, data, layout, {
    responsive: true,
    displayModeBar: false,
  });
  storeChartData(elementId, data, layout);
}

function ScatterPlotHumanAiCollaborationVsJobLoss(rows) {
  const collabRaw = unpack(rows, "Human-AI Collaboration Rate (%)");
  const jobLossRaw = unpack(rows, "Job Loss Due to AI (%)");
  const countries = unpack(rows, "Country");

  const collab = collabRaw.map(parseNumber);
  const jobLoss = jobLossRaw.map(parseNumber);

  const data = [
    {
      x: collab,
      y: jobLoss,
      mode: "markers",
      type: "scatter",
      text: countries,
      marker: {
        size: 10,
        color: "#4f46e5", // Indigo 600
        line: {
          width: 1,
          color: "#ffffff",
        },
      },
    },
  ];

  const layout = {
    ...commonLayout,
    title: undefined,
    xaxis: { ...commonLayout.xaxis, title: "Collaboration Humain-IA (%)" },
    yaxis: { ...commonLayout.yaxis, title: "Perte d'emploi (%)" },
    margin: { t: 20, r: 20, b: 60, l: 60 },
  };

  const elementId = "scatter-plot-human-ai-collaboration-vs-job-loss";
  Plotly.newPlot(elementId, data, layout, {
    responsive: true,
    displayModeBar: false,
  });
  storeChartData(elementId, data, layout);
}

function BarChartHumanAiCollaborationByIndustry(rows) {
  const industries = unpack(rows, "Industry");
  const collabRaw = unpack(rows, "Human-AI Collaboration Rate (%)");

  const agg = {};
  for (let i = 0; i < industries.length; i++) {
    const ind = industries[i];
    const val = parseNumber(collabRaw[i]);
    if (!ind || val === null) continue;
    if (!agg[ind])
      agg[ind] = {
        sum: 0,
        count: 0,
      };
    agg[ind].sum += val;
    agg[ind].count++;
  }

  const labels = Object.keys(agg);
  const values = labels.map((l) => agg[l].sum / agg[l].count);

  const data = [
    {
      x: labels,
      y: values,
      type: "bar",
      marker: {
        color: values,
        colorscale: "Tealgrn",
      },
    },
  ];

  const layout = {
    ...commonLayout,
    title: undefined,
    xaxis: { ...commonLayout.xaxis, title: "Industrie", tickangle: -45 },
    yaxis: { ...commonLayout.yaxis, title: "Collaboration Moyenne (%)" },
    margin: { t: 20, r: 20, b: 100, l: 60 },
  };

  const elementId = "bar-chart-human-ai-collaboration-by-industry";
  Plotly.newPlot(elementId, data, layout, {
    responsive: true,
    displayModeBar: false,
  });
  storeChartData(elementId, data, layout);
}

function ChoroplethJobLossByCountry(rows) {
  const countries = unpack(rows, "Country");
  const jobLossRaw = unpack(rows, "Job Loss Due to AI (%)");
  const jobLoss = jobLossRaw.map(parseNumber);

  const agg = {};
  for (let i = 0; i < countries.length; i++) {
    const c = countries[i];
    const val = jobLoss[i];
    if (!c || val === null) continue;
    if (!agg[c])
      agg[c] = {
        sum: 0,
        count: 0,
      };
    agg[c].sum += val;
    agg[c].count++;
  }

  const uniqueCountries = Object.keys(agg);
  const avgJobLoss = uniqueCountries.map((c) => agg[c].sum / agg[c].count);

  const data = [
    {
      type: "choropleth",
      locationmode: "country names",
      locations: uniqueCountries,
      z: avgJobLoss,
      text: uniqueCountries,
      colorscale: "Reds",
      autocolorscale: false,
      reversescale: false,
      marker: {
        line: {
          color: "rgb(255,255,255)",
          width: 0.5,
        },
      },
      colorbar: {
        title: "Perte d'emploi (%)",
        titlefont: {
          color: "#1e293b",
        },
        tickfont: {
          color: "#64748b",
        },
      },
    },
  ];

  const layout = {
    ...commonLayout,
    title: undefined,
    geo: {
      showframe: false,
      showcoastlines: false,
      projection: {
        type: "mercator",
      },
      bgcolor: "rgba(0,0,0,0)",
      lakecolor: "rgba(0,0,0,0)",
      landcolor: "#f1f5f9", // Slate 100
      subunitcolor: "#cbd5e1", // Slate 300
    },
    margin: { t: 0, r: 0, b: 0, l: 0 },
  };

  const elementId = "choropleth-job-loss-by-country";
  Plotly.newPlot(elementId, data, layout, {
    responsive: true,
    displayModeBar: false,
  });
  storeChartData(elementId, data, layout);
}

// --- Modal Logic ---

function setupModal() {
  const modal = document.getElementById("graph-modal");
  const closeBtn = document.getElementById("modal-close");
  const chartArea = document.getElementById("modal-chart-area");
  const titleArea = document.getElementById("modal-title");
  const descArea = document.getElementById("modal-description");

  // Open Modal Listener
  document.querySelectorAll(".chart-card").forEach((card) => {
    card.addEventListener("click", () => {
      const chartContainer = card.querySelector(".chart-container");
      const chartId = chartContainer.id;

      const details = chartDetails[chartId];
      if (!details) return; // Should allow generic fallback? For now return.

      // 1. Show Modal & Lock Scroll
      modal.classList.add("active");
      document.body.style.overflow = "hidden";

      // 2. Populate Text
      titleArea.textContent = details.title;
      descArea.innerHTML = details.description;

      // 3. Render Chart (Delayed to ensure container has size)
      // Small timeout allows the modal to start rendering/transitioning so dimensions exist
      setTimeout(() => {
        const originalChartData = chartContainer._chartData;
        const originalChartLayout = chartContainer._chartLayout;

        if (originalChartData && originalChartLayout) {
          const newLayout = JSON.parse(JSON.stringify(originalChartLayout));
          newLayout.autosize = true;
          newLayout.margin = { t: 40, r: 40, b: 80, l: 80 };
          newLayout.title = undefined;
          delete newLayout.width;
          delete newLayout.height;

          chartArea.innerHTML = "";
          chartArea.removeAttribute("style"); // Clear any inline styles

          Plotly.newPlot(chartArea, originalChartData, newLayout, {
            responsive: true,
            displayModeBar: true,
          }).then(() => {
            // Fix: Force explicit resize to ensure chart fills the container
            Plotly.Plots.resize(chartArea);
            
            // Double check with relayout for strict sizing
            Plotly.relayout(chartArea, {
              width: chartArea.clientWidth,
              height: chartArea.clientHeight
            });
          });
        }
      }, 50); // 50ms is usually enough for display:flex to compute
    });
  });

  // Close Modal Logic
  const closeModal = () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    // Optional: Purge Plotly chart to save memory
    // Plotly.purge(chartArea);
  };

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
  });
}

async function main() {
  try {
    let rows = await downloadData("data/Global_AI_Content_Impact_Dataset.csv");

    ScatterPlotAiContentsMarketShare(rows);
    BarChartAiAdoptionVsContentVolume(rows);
    BoxPlotRevenueVsAiTools(rows);
    HeatmapCountryIndustryAiVolume(rows);
    BarChartAiAdoptionVsJobLoss(rows);
    ScatterPlotHumanAiCollaborationVsJobLoss(rows);
    BarChartHumanAiCollaborationByIndustry(rows);
    ChoroplethJobLossByCountry(rows);

    // Initialize Modal interactions
    setupModal();
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

main();
