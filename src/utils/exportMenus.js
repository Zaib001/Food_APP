// src/utils/exportMenus.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // <- default import, call as function

// Helpers
const fmtDate = (iso) => {
  const dt = new Date(iso);
  return isNaN(dt)
    ? iso || "—"
    : dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

const toRecipeObjects = (recipeIds = [], recipesById = {}) =>
  recipeIds
    .map((rid) => (typeof rid === "string" ? recipesById[rid] : rid))
    .filter(Boolean);

// ---------- CSV ----------
export const exportMenusToCSV = (menus = [], recipesById = {}) => {
  if (!menus?.length) {
    alert("No menus to export.");
    return;
  }

  const rows = menus.map((m) => {
    const recipes = toRecipeObjects(m.recipeIds, recipesById);
    const recipeNames = recipes.map((r) => r?.name || "Unnamed").join(" | ");
    return {
      Date: fmtDate(m.date),
      Meal: m.mealType || "",
      Base: m.base || "",
      "Menu Name": m.menuName || "",
      "Recipes (names)": recipeNames,
      "Recipe Count": recipes.length,
    };
  });

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      headers
        .map((h) => {
          const v = String(r[h] ?? "");
          // Quote if contains comma, quote, or newline
          return /[,"\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "menus.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

// ---------- PDF (Weekly) ----------
export const exportMenusToWeeklyPDF = (menus = [], recipesById = {}) => {
  if (!menus?.length) {
    alert("No menus to export.");
    return;
  }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(16);
  doc.text("Weekly Menu Report", pageWidth / 2, 16, { align: "center" });

  // Group menus by date
  const grouped = menus.reduce((acc, m) => {
    const k = m.date || "—";
    (acc[k] = acc[k] || []).push(m);
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));
  let startY = 24;

  dates.forEach((d, i) => {
    // Date heading
    doc.setFontSize(12);
    doc.text(fmtDate(d), 14, startY);
    startY += 4;

    const body = [];
    grouped[d].forEach((m, idx) => {
      const recipes = toRecipeObjects(m.recipeIds, recipesById);
      const names = recipes.map((r) => r?.name || "Unnamed").join(", ");

      body.push(
        ["Meal", m.mealType || ""],
        ["Base", m.base || ""],
        ["Menu Name", m.menuName || ""],
        ["Recipe Count", String(recipes.length)],
        ["Recipes", names || "—"]
      );

      // Separator row (blank) between menus of same day
      if (idx < grouped[d].length - 1) body.push(["", ""]);
    });

    autoTable(doc, {
      startY,
      head: [["Field", "Value"]],
      body,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [235, 64, 84] }, // subtle rose-ish header
      margin: { left: 14, right: 14 },
     
    });

    startY = doc.lastAutoTable.finalY + 8;

    // Optional spacing/page break between days
    if (i < dates.length - 1 && startY > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage();
      startY = 24;
    }
  });

  doc.save("weekly_menus.pdf");
};


export const exportInventoryToCSV = (data) => {
  const headers = ['Ingredient', 'Supplier', 'Quantity', 'Unit', 'Date', 'Status'];
  const rows = data.map(item => [
    item.ingredientName,
    item.supplier,
    item.quantity,
    item.unit,
    item.date,
    item.quantity <= 0 ? 'Out of Stock' : item.quantity < 5 ? 'Low Stock' : 'In Stock',
  ]);

  const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'inventory.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
export const exportReportsToCSV = (data) => {
  const rows = [
    ['Month', 'Total Menus', 'Ingredients Used', 'Cost ($)', 'Total KCAL', 'Avg. Cost/Menu'],
    ...data.map((d) => [
      d.month,
      d.menus,
      d.ingredients,
      d.cost,
      d.kcal,
      (d.cost / d.menus).toFixed(2)
    ]),
  ];

  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'monthly_report.csv';
  link.click();
};