// ==========================================================================
// Ledger — Data Visualization Module (Chart.js 4)
// Handles Monthly Cashflow Trend & Expense Category Doughnut
// ==========================================================================

window.FinanceCharts = (() => {
  let cashflowInstance = null;
  let categoryInstance = null;

  let cachedMonthly = [];
  let cachedCategories = { categories: [], totals: {}, has_expenses: false };

  // Curated high-contrast, non-neon palette for expense categories
  const CATEGORY_PALETTE = {
    Food: "#f59e0b",
    Education: "#6366f1",
    Transport: "#06b6d4",
    Shopping: "#ec4899",
    Entertainment: "#8b5cf6",
    Other: "#71717a",
    Salary: "#10b981",
    Freelance: "#14b8a6",
    Investment: "#3b82f6",
    Business: "#84cc16",
    Gift: "#f97316",
  };

  function getCategoryColor(name) {
    return CATEGORY_PALETTE[name] || "#64748b";
  }

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function compactINR(value) {
    const abs = Math.abs(value);
    const sign = value < 0 ? "-" : "";
    if (abs >= 100000) return `${sign}₹${(abs / 100000).toFixed(1)}L`;
    if (abs >= 1000) return `${sign}₹${(abs / 1000).toFixed(1)}k`;
    return `${sign}₹${abs}`;
  }

  function fullINR(value) {
    return "₹" + (Number(value) || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function formatMonthLabel(ym) {
    if (!ym || !ym.includes("-")) return ym || "";
    const [year, month] = ym.split("-");
    const dt = new Date(Number(year), Number(month) - 1, 1);
    return dt.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
  }

  function renderCashflow(monthlyData) {
    cachedMonthly = Array.isArray(monthlyData) ? monthlyData : [];

    const canvas = document.getElementById("cashflowChart");
    const emptyEl = document.getElementById("cashflowEmpty");
    if (!canvas) return;

    if (cashflowInstance) {
      cashflowInstance.destroy();
      cashflowInstance = null;
    }

    if (cachedMonthly.length === 0) {
      emptyEl?.classList.remove("hidden");
      return;
    }
    emptyEl?.classList.add("hidden");

    // Backend returns newest first; reverse for chronological left-to-right chart
    const ordered = [...cachedMonthly].reverse().slice(-8);

    const labels = ordered.map((m) => formatMonthLabel(m.month));
    const incomeSeries = ordered.map((m) => Number(m.income) || 0);
    const expenseSeries = ordered.map((m) => Number(m.expense) || 0);
    const netSeries = ordered.map((m) => Number(m.savings) || 0);

    const border = cssVar("--border");
    const textMuted = cssVar("--text-muted");
    const bgSurface = cssVar("--bg-surface");
    const textPrimary = cssVar("--text-primary");
    const incomeColor = cssVar("--income");
    const expenseColor = cssVar("--expense");
    const accentColor = cssVar("--accent");

    cashflowInstance = new Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Income",
            data: incomeSeries,
            backgroundColor: incomeColor,
            borderRadius: 5,
            maxBarThickness: 22,
            order: 2,
          },
          {
            label: "Expense",
            data: expenseSeries,
            backgroundColor: expenseColor,
            borderRadius: 5,
            maxBarThickness: 22,
            order: 2,
          },
          {
            label: "Net Savings",
            data: netSeries,
            type: "line",
            borderColor: accentColor,
            backgroundColor: accentColor,
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.3,
            order: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: bgSurface,
            titleColor: textPrimary,
            bodyColor: textPrimary,
            borderColor: border,
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${fullINR(ctx.parsed.y)}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: {
              color: textMuted,
              font: { family: "Inter, sans-serif", size: 11.5 },
            },
          },
          y: {
            grid: { color: border },
            border: { display: false },
            ticks: {
              color: textMuted,
              font: { family: "JetBrains Mono, monospace", size: 11 },
              callback: (v) => compactINR(v),
            },
          },
        },
      },
    });
  }

  function renderCategories(data) {
    cachedCategories = data || { categories: [], totals: {}, has_expenses: false };

    const canvas = document.getElementById("categoryChart");
    const legendEl = document.getElementById("categoryLegend");
    const emptyEl = document.getElementById("categoryEmpty");
    const centerEl = document.getElementById("categoryTotalCenter");
    const stageEl = canvas?.parentElement;

    if (!canvas) return;

    if (categoryInstance) {
      categoryInstance.destroy();
      categoryInstance = null;
    }

    const entries = (cachedCategories.categories || [])
      .map((cat) => ({ name: cat, value: Number(cachedCategories.totals?.[cat]) || 0 }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);

    const totalSpend = entries.reduce((sum, item) => sum + item.value, 0);

    if (entries.length === 0 || totalSpend <= 0) {
      stageEl?.classList.add("hidden");
      legendEl?.classList.add("hidden");
      emptyEl?.classList.remove("hidden");
      return;
    }

    stageEl?.classList.remove("hidden");
    legendEl?.classList.remove("hidden");
    emptyEl?.classList.add("hidden");

    if (centerEl) centerEl.textContent = compactINR(totalSpend);

    const bgSurface = cssVar("--bg-surface");
    const border = cssVar("--border");
    const textPrimary = cssVar("--text-primary");

    categoryInstance = new Chart(canvas, {
      type: "doughnut",
      data: {
        labels: entries.map((e) => e.name),
        datasets: [
          {
            data: entries.map((e) => e.value),
            backgroundColor: entries.map((e) => getCategoryColor(e.name)),
            borderColor: bgSurface,
            borderWidth: 3,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "72%",
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: bgSurface,
            titleColor: textPrimary,
            bodyColor: textPrimary,
            borderColor: border,
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => {
                const pct = ((ctx.parsed / totalSpend) * 100).toFixed(1);
                return ` ${ctx.label}: ${fullINR(ctx.parsed)} (${pct}%)`;
              },
            },
          },
        },
      },
    });

    if (legendEl) {
      legendEl.innerHTML = entries
        .map((item) => {
          const pct = Math.round((item.value / totalSpend) * 100);
          return `
            <div class="legend-item">
              <span class="legend-name">
                <i class="legend-swatch" style="background:${getCategoryColor(item.name)}"></i>
                ${item.name}
              </span>
              <span class="mono muted">${pct}%</span>
            </div>
          `;
        })
        .join("");
    }
  }

  function refreshTheme() {
    renderCashflow(cachedMonthly);
    renderCategories(cachedCategories);
  }

  return {
    getCategoryColor,
    renderCashflow,
    renderCategories,
    refreshTheme,
  };
})();