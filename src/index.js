import downloadData from "./helpers/downloadData.js";
import unpack from "./helpers/unpack.js";

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
      line: { width: 1, color: '#444' }
    },
    text: country.map((c, i) => 
      `${c}<br>Année : ${year[i]}<br>Secteur : ${industry[i]}<br>` +
      `Contenu IA : ${x[i]}%<br>Part de marché : ${y[i]}%`
    ),
    hoverinfo: 'text',
  }];

  const layout = {
    width: 900,
    height: 600,
    title: {
      text: "Corrélation entre volume de contenu IA et part de marché",
      font: { size: 22 }
    },
    xaxis: {
      title: 'Volume de contenu IA généré (TB/an)',
      gridcolor: '#e0e0e0'
    },
    yaxis: {
      title: 'Part de marché des entreprises IA (%)',
      gridcolor: '#e0e0e0'
    },
    plot_bgcolor: '#fafafa',
    paper_bgcolor: '#fafafa',
    hoverlabel: { bgcolor: "#f0f0f0", font: { size: 14 } },
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

  // Aggregate by country (compute average adoption rate and average revenue increase)
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
  // compute averages (use available values)
  const countryAverages = countryKeys.map(c => {
    const item = agg[c];
    const avgAdoption = item.adoptionCount ? item.adoptionSum / item.adoptionCount : 0;
    const avgRevenue = item.revenueCount ? item.revenueSum / item.revenueCount : 0;
    return { country: c, avgAdoption, avgRevenue };
  });

  // Sort by avgRevenue descending so "most productive" countries appear first
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
      marker: { color: "#1f77b4" },
      hovertemplate: "%{x}<br>Revenus : %{y}%<extra></extra>"
    },
    {
      x,
      y: adoption,
      name: "Taux d'adoption de l'IA (%)",
      type: "bar",
      marker: { color: "#ff7f0e" },
      hovertemplate: "%{x}<br>Adoption : %{y}%<extra></extra>"
    }
  ];

  const layout = {
    title: "Les pays les plus productifs (hausses de revenus) vs. taux d'adoption de l'IA",
    xaxis: { title: "Pays", tickangle: -45, automargin: true },
    yaxis: { title: "Pourcentage (%)" },
    barmode: "group",
    plot_bgcolor: '#fafafa',
    paper_bgcolor: '#fafafa',
    hoverlabel: { bgcolor: "#f0f0f0", font: { size: 14 } }
  };

  Plotly.newPlot("barchartaiadoptionvscontentvolume", data, layout, { responsive: true });
}

async function main() {
  let rows = await downloadData("data/Global_AI_Content_Impact_Dataset.csv");
  console.log(rows);
  ScatterPlotAiContentsMarketShare(rows, 'Market Share of AI Companies (%)');
  BarChartAiAdoptionVsContentVolume(rows);
}

main();
