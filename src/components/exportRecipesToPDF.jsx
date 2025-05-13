import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportRecipesToCSV = (recipes, ingredientsMap) => {
  const headers = ['Recipe Name', 'Ingredient', 'Quantity', 'Unit', 'KCAL', 'Cost'];
  const rows = [];

  recipes.forEach((recipe) => {
    let totalKcal = 0;
    let totalCost = 0;

    recipe.ingredients.forEach((item) => {
      const ing = ingredientsMap[item.ingredientId];
      if (!ing) return;

      const adjustedQty = item.quantity / (ing.yield / 100);
      const kcal = (item.quantity * ing.kcal) / 1000;
      const cost = adjustedQty * ing.price;

      totalKcal += kcal;
      totalCost += cost;

      rows.push([
        recipe.name,
        ing.name,
        item.quantity,
        ing.unit,
        kcal.toFixed(2),
        cost.toFixed(2),
      ]);
    });

    rows.push([
      recipe.name,
      'TOTAL',
      '',
      '',
      totalKcal.toFixed(2),
      totalCost.toFixed(2),
    ]);
  });

  const csv = [headers.join(',')].concat(rows.map((r) => r.join(','))).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'recipes.csv';
  a.click();
  URL.revokeObjectURL(url);
};

export const exportRecipesToPDF = (recipes, ingredientsMap) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Recipe Report', 14, 20);

  let yOffset = 30;

  recipes.forEach((recipe, index) => {
    let totalKcal = 0;
    let totalCost = 0;

    const body = recipe.ingredients.map((item) => {
      const ing = ingredientsMap[item.ingredientId];
      if (!ing) return ['Unknown', '-', '-', '-', '-'];

      const adjustedQty = item.quantity / (ing.yield / 100);
      const kcal = (item.quantity * ing.kcal) / 1000;
      const cost = adjustedQty * ing.price;

      totalKcal += kcal;
      totalCost += cost;

      return [
        ing.name,
        item.quantity,
        ing.unit,
        kcal.toFixed(2),
        '$' + cost.toFixed(2),
      ];
    });

    body.push(['TOTAL', '', '', totalKcal.toFixed(2), '$' + totalCost.toFixed(2)]);

    autoTable(doc, {
      startY: yOffset,
      head: [[`${index + 1}. ${recipe.name}`, 'Qty', 'Unit', 'KCAL', 'Cost']],
      body: body,
      theme: 'grid',
      styles: { fontSize: 10 },
    });

    yOffset = doc.lastAutoTable.finalY + 10;
  });

  doc.save('recipes.pdf');
};

export const exportRequisitionsToCSV = (data) => {
    const headers = ['Date', 'Requested By', 'Item', 'Quantity', 'Unit', 'Supplier', 'Status'];
  
    const rows = data.map((r) => [
      r.date,
      r.requestedBy,
      r.item,
      r.quantity,
      r.unit,
      r.supplier,
      r.status,
    ]);
  
    const csv = [headers.join(',')].concat(rows.map((row) => row.join(','))).join('\n');
  
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'requisitions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
  