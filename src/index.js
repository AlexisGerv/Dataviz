import downloadData from "./helpers/downloadData.js";
import unpack from "./helpers/unpack.js";

// Common layout settings for dark theme
const commonLayout = {
  plot_bgcolor: 'rgba(0,0,0,0)',
  paper_bgcolor: 'rgba(0,0,0,0)',
  font: {
    family: 'Inter, sans-serif',
    color: '#f8fafc'
  },
  xaxis: {
    gridcolor: '#334155',
    zerolinecolor: '#334155',
    tickfont: { color: '#94a3b8' },
    titlefont: { color: '#f8fafc' }
  },
  yaxis: {
    gridcolor: '#334155',
    zerolinecolor: '#334155',
    tickfont: { color: '#94a3b8' },
    titlefont: { color: '#f8fafc' }
  },
  margin: { t: 40, r: 20, b: 60, l: 60 },
  hoverlabel: {
    bgcolor: '#1e293b',
    bordercolor: '#38bdf8',
    font: { color: '#f8fafc' }
  }
};

function ScatterPlotAiContentsMarketShare(rows) {
  const x = unpack(rows, 'AI-Generated Content Volume (TBs per year)');
  const y = unpack(rows, 'Market Share of AI Companies (%)');
  const country = unpack(rows, 'Country');
  const year = unpack(rows, 'Year');
  const industry = unpack(rows, 'Industry');
  const adoption = unpack(rows, 'AI Adoption Rate (%)');
  const revenue = unpack(rows, 'Revenue Increase Due to AI (%)');

  const data = [{
    x,
    y,
    mode: 'markers',
    type: 'scatter',
    marker: {
      size: revenue,
      sizemode: 'area',
      sizeref: 2.0 * Math.max(...revenue) / (40 ** 2),
      color: adoption,
      colorscale: 'Viridis',
      opacity: 0.8,
      line: { width: 1, color: '#f8fafc' }
    },
    text: country.map((c, i) => 
      `<b>${c}</b><br>Année : ${year[i]}<br>Secteur : ${industry[i]}<br>` +
      `Contenu IA : ${x[i]} TB<br>Part de marché : ${y[i]}%`
    ),
    hoverinfo: 'text',
  }];

  const layout = {
    ...commonLayout,
    title: {
      text: "Volume de contenu vs Part de marché",
      font: { size: 16, color: '#f8fafc' }
    },
    xaxis: {
      ...commonLayout.xaxis,
      title: 'Volume de contenu IA généré (TB/an)'
    },
    yaxis: {
      ...commonLayout.yaxis,
      title: 'Part de marché des entreprises IA (%)'
    },
    hovermode: 'closest'
  };

  Plotly.newPlot("scatterplotaicontentvsmarketshare", data, layout, {responsive: true});
}

function BarChartAiAdoptionVsContentVolume(rows) {
  const countries = unpack(rows, 'Country');
  const adoptionRaw = unpack(rows, 'AI Adoption Rate (%)');
  const revenueRaw = unpack(rows, 'Revenue Increase Due to AI (%)');

  const toNumber = v => {
    if (v === undefined || v === null) return null;
    const n = parseFloat(String(v).replace(',', '.').replace('%', '').trim());
    return Number.isFinite(n) ? n : null;
  };

  const agg = {};
  for (let i = 0; i < countries.length; i++) {
    const c = countries[i];
    if (!c) continue;
    const a = toNumber(adoptionRaw[i]);
    const r = toNumber(revenueRaw[i]);
    if (!agg[c]) agg[c] = { adoptionSum: 0, revenueSum: 0, adoptionCount: 0, revenueCount: 0 };
    if (a !== null) { agg[c].adoptionSum += a; agg[c].adoptionCount += 1; }
    if (r !== null) { agg[c].revenueSum += r; agg[c].revenueCount += 1; }
  }

  const countryKeys = Object.keys(agg);
  const countryAverages = countryKeys.map(c => {
    const item = agg[c];
    const avgAdoption = item.adoptionCount ? item.adoptionSum / item.adoptionCount : 0;
    const avgRevenue = item.revenueCount ? item.revenueSum / item.revenueCount : 0;
    return { country: c, avgAdoption, avgRevenue };
  });

  countryAverages.sort((a, b) => b.avgRevenue - a.avgRevenue);

  const x = countryAverages.map(d => d.country);
  const revenue = countryAverages.map(d => Number(d.avgRevenue.toFixed(2)));
  const adoption = countryAverages.map(d => Number(d.avgAdoption.toFixed(2)));

  const data = [
    {
      x,
      y: revenue,
      name: "Augmentation des revenus (%)",
      type: "bar",
      marker: { color: "#38bdf8" },
      hovertemplate: "%{x}<br>Revenus : %{y}%<extra></extra>"
    },
    {
      x,
      y: adoption,
      name: "Taux d'adoption de l'IA (%)",
      type: "bar",
      marker: { color: "#818cf8" },
      hovertemplate: "%{x}<br>Adoption : %{y}%<extra></extra>"
    }
  ];

  const layout = {
    ...commonLayout,
    title: {
      text: "Revenus vs Adoption par Pays",
      font: { size: 16, color: '#f8fafc' }
    },
    xaxis: { ...commonLayout.xaxis, title: "Pays", tickangle: -45 },
    yaxis: { ...commonLayout.yaxis, title: "Pourcentage (%)" },
    barmode: "group",
    legend: {
      orientation: 'h',
      y: -0.2,
      font: { color: '#94a3b8' }
    }
  };

  Plotly.newPlot("barchartaiadoptionvscontentvolume", data, layout, { responsive: true });
}

// Helper to parse numbers from CSV strings (e.g. "45%" -> 45)
const parseNumber = v => {
  if (v === undefined || v === null) return null;
  const n = parseFloat(String(v).replace(',', '.').replace('%', '').trim());
  return Number.isFinite(n) ? n : null;
};

function BoxPlotRevenueVsAiTools(rows) {
  const tools = unpack(rows, 'Top AI Tools Used');
  const revenueRaw = unpack(rows, 'Revenue Increase Due to AI (%)');
  const revenue = revenueRaw.map(parseNumber);

  const data = [{
    y: revenue,
    x: tools,
    type: 'box',
    marker: { color: '#38bdf8' },
    boxpoints: 'all',
    jitter: 0.3,
    pointpos: -1.8
  }];

  const layout = {
    ...commonLayout,
    title: {
      text: "Revenus vs Outils IA",
      font: { size: 16, color: '#f8fafc' }
    },
    xaxis: { ...commonLayout.xaxis, title: "Outils IA" },
    yaxis: { ...commonLayout.yaxis, title: "Augmentation des revenus (%)" }
  };

  Plotly.newPlot("box-plot-revenue-vs-ai-tools", data, layout, { responsive: true });
}

function HeatmapCountryIndustryAiVolume(rows) {
  const countries = unpack(rows, 'Country');
  const industries = unpack(rows, 'Industry');
  const volumeRaw = unpack(rows, 'AI-Generated Content Volume (TBs per year)');
  const volume = volumeRaw.map(parseNumber);

  const data = [{
    x: industries,
    y: countries,
    z: volume,
    type: 'heatmap',
    colorscale: 'Viridis',
    colorbar: {
      title: 'Volume (TB)',
      titlefont: { color: '#f8fafc' },
      tickfont: { color: '#94a3b8' }
    }
  }];

  const layout = {
    ...commonLayout,
    title: {
      text: "Volume de contenu : Pays vs Industrie",
      font: { size: 16, color: '#f8fafc' }
    },
    xaxis: { ...commonLayout.xaxis, title: "Industrie", tickangle: -45 },
    yaxis: { ...commonLayout.yaxis, title: "Pays" }
  };

  Plotly.newPlot("heatmap-country-industry-ai-volume-market-share", data, layout, { responsive: true });
}

function BarChartAiAdoptionVsJobLoss(rows) {
  const adoptionRaw = unpack(rows, 'AI Adoption Rate (%)');
  const jobLossRaw = unpack(rows, 'Job Loss Due to AI (%)');
  const countries = unpack(rows, 'Country');
  
  const adoption = adoptionRaw.map(parseNumber);
  const jobLoss = jobLossRaw.map(parseNumber);

  // Combine and sort by Adoption Rate
  const combined = countries.map((c, i) => ({
    country: c,
    adoption: adoption[i],
    jobLoss: jobLoss[i]
  })).filter(d => d.country && d.adoption !== null && d.jobLoss !== null);

  combined.sort((a, b) => a.adoption - b.adoption);

  const x = combined.map(d => d.country);
  const y = combined.map(d => d.jobLoss);
  const color = combined.map(d => d.adoption);

  const data = [{
    x: x,
    y: y,
    type: 'bar',
    marker: {
      color: color,
      colorscale: 'Portland',
      showscale: true,
      colorbar: {
        title: 'Taux d\'adoption (%)',
        titlefont: { color: '#f8fafc' },
        tickfont: { color: '#94a3b8' }
      }
    },
    hovertemplate: "<b>%{x}</b><br>Perte d'emploi: %{y}%<br>Adoption: %{marker.color}%<extra></extra>"
  }];

  const layout = {
    ...commonLayout,
    title: {
      text: "Perte d'emploi triée par Taux d'adoption",
      font: { size: 16, color: '#f8fafc' }
    },
    xaxis: { ...commonLayout.xaxis, title: "Pays (triés par adoption croissante)", tickangle: -45 },
    yaxis: { ...commonLayout.yaxis, title: "Perte d'emploi (%)" }
  };

  Plotly.newPlot("scatter-plot-ai-adoption-vs-job-loss", data, layout, { responsive: true });
}

function ScatterPlotHumanAiCollaborationVsJobLoss(rows) {
  const collabRaw = unpack(rows, 'Human-AI Collaboration Rate (%)');
  const jobLossRaw = unpack(rows, 'Job Loss Due to AI (%)');
  const countries = unpack(rows, 'Country');

  const collab = collabRaw.map(parseNumber);
  const jobLoss = jobLossRaw.map(parseNumber);

  const data = [{
    x: collab,
    y: jobLoss,
    mode: 'markers',
    type: 'scatter',
    text: countries,
    marker: {
      size: 10,
      color: '#818cf8',
      line: { width: 1, color: '#f8fafc' }
    }
  }];

  const layout = {
    ...commonLayout,
    title: {
      text: "Collaboration Humain-IA vs Perte d'emploi",
      font: { size: 16, color: '#f8fafc' }
    },
    xaxis: { ...commonLayout.xaxis, title: "Collaboration Humain-IA (%)" },
    yaxis: { ...commonLayout.yaxis, title: "Perte d'emploi (%)" }
  };

  Plotly.newPlot("scatter-plot-human-ai-collaboration-vs-job-loss", data, layout, { responsive: true });
}

function BarChartHumanAiCollaborationByIndustry(rows) {
  const industries = unpack(rows, 'Industry');
  const collabRaw = unpack(rows, 'Human-AI Collaboration Rate (%)');

  const agg = {};
  for (let i = 0; i < industries.length; i++) {
    const ind = industries[i];
    const val = parseNumber(collabRaw[i]);
    if (!ind || val === null) continue;
    if (!agg[ind]) agg[ind] = { sum: 0, count: 0 };
    agg[ind].sum += val;
    agg[ind].count++;
  }

  const labels = Object.keys(agg);
  const values = labels.map(l => agg[l].sum / agg[l].count);

  const data = [{
    x: labels,
    y: values,
    type: 'bar',
    marker: {
      color: values,
      colorscale: 'Tealgrn'
    }
  }];

  const layout = {
    ...commonLayout,
    title: {
      text: "Collaboration Humain-IA par Industrie",
      font: { size: 16, color: '#f8fafc' }
    },
    xaxis: { ...commonLayout.xaxis, title: "Industrie", tickangle: -45 },
    yaxis: { ...commonLayout.yaxis, title: "Collaboration Moyenne (%)" }
  };

  Plotly.newPlot("bar-chart-human-ai-collaboration-by-industry", data, layout, { responsive: true });
}

function ChoroplethJobLossByCountry(rows) {
  const countries = unpack(rows, 'Country');
  const jobLossRaw = unpack(rows, 'Job Loss Due to AI (%)');
  const jobLoss = jobLossRaw.map(parseNumber);
  
  const agg = {};
  for(let i=0; i<countries.length; i++) {
    const c = countries[i];
    const val = jobLoss[i];
    if(!c || val === null) continue;
    if(!agg[c]) agg[c] = { sum: 0, count: 0 };
    agg[c].sum += val;
    agg[c].count++;
  }
  
  const uniqueCountries = Object.keys(agg);
  const avgJobLoss = uniqueCountries.map(c => agg[c].sum / agg[c].count);

  const data = [{
    type: 'choropleth',
    locationmode: 'country names',
    locations: uniqueCountries,
    z: avgJobLoss,
    text: uniqueCountries,
    colorscale: 'Reds',
    autocolorscale: false,
    reversescale: false,
    marker: {
      line: {
        color: 'rgb(180,180,180)',
        width: 0.5
      }
    },
    colorbar: {
      title: 'Perte d\'emploi (%)',
      titlefont: { color: '#f8fafc' },
      tickfont: { color: '#94a3b8' }
    }
  }];

  const layout = {
    ...commonLayout,
    title: {
      text: "Carte des pertes d'emploi par pays",
      font: { size: 16, color: '#f8fafc' }
    },
    geo: {
      showframe: false,
      showcoastlines: false,
      projection: { type: 'mercator' },
      bgcolor: 'rgba(0,0,0,0)',
      lakecolor: 'rgba(0,0,0,0)',
      landcolor: '#1e293b',
      subunitcolor: '#334155'
    }
  };

  Plotly.newPlot("choropleth-job-loss-by-country", data, layout, { responsive: true });
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
    
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

main();
