import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { utils, writeFile } from 'xlsx';

export const exportRecipesToPDF = (recipes, ingredientsMap) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Recipe Report', 14, 20);

  let yOffset = 30;

  recipes.forEach((recipe, index) => {
    let totalKcal = 0;
    let totalCost = 0;
    const portions = recipe.portions || 1;
    const yieldWeight = recipe.yieldWeight || 1;

    const body = recipe.ingredients.map((item) => {
      const ing = ingredientsMap[item.ingredientId];
      if (!ing) return ['Unknown', '-', '-', '-', '-', '-'];

      const yieldPercent = parseFloat(ing.yield) || 100;
      const adjustedQty = (parseFloat(item.quantity) || 0) / (yieldPercent / 100);
      const kcal = ((parseFloat(item.quantity) || 0) * (parseFloat(ing.kcal) || 0)) / 1000;
      const cost = adjustedQty * (parseFloat(ing.pricePerKg) || 0);

      totalKcal += kcal;
      totalCost += cost;

      return [
        ing.name,
        item.quantity,
        ing.unit,
        adjustedQty.toFixed(2),
        kcal.toFixed(2),
        '$' + cost.toFixed(2),
      ];
    });

    body.push([
      'TOTAL',
      '',
      '',
      '',
      totalKcal.toFixed(2),
      '$' + totalCost.toFixed(2),
    ]);

    autoTable(doc, {
      startY: yOffset,
      head: [[
        `${index + 1}. ${recipe.name.toUpperCase()}`,
        '', '', '', '', ''
      ]],
      theme: 'plain',
      styles: { fontStyle: 'bold', fontSize: 12 },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 2,
      head: [[
        'Ingredient',
        'Qty',
        'Unit',
        'Adj Qty',
        'KCAL',
        'Cost'
      ]],
      body,
      theme: 'grid',
      styles: { fontSize: 10 },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 4,
      body: [
        ['Portions', recipe.portions || '-', 'Yield (kg)', recipe.yieldWeight || '-'],
        ['Type', recipe.type || '-', 'Category', recipe.category || '-'],
        ['Cost / Portion', `$${(totalCost / portions).toFixed(2)}`, 'KCAL / Portion', (totalKcal / portions).toFixed(2)],
      ],
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 2 },
    });

    yOffset = doc.lastAutoTable.finalY + 12;
  });

  doc.save('recipes.pdf');
};

export const exportRecipesToCSV = (recipes, ingredientsMap) => {
  const rows = [];

  recipes.forEach((recipe) => {
    let totalKcal = 0;
    let totalCost = 0;
    const portions = recipe.portions || 1;

    rows.push([
      'Recipe Name:', recipe.name,
      'Type:', recipe.type || '',
      'Category:', recipe.category || '',
    ]);
    rows.push([
      'Portions:', recipe.portions || '',
      'Yield Weight:', recipe.yieldWeight || ''
    ]);
    rows.push([]);
    rows.push(['Ingredient', 'Qty', 'Unit', 'Adj Qty', 'KCAL', 'Cost']);

    recipe.ingredients.forEach((item) => {
      const ing = ingredientsMap[item.ingredientId];
      if (!ing) return;

      const yieldPercent = parseFloat(ing.yield) || 100;
      const adjustedQty = (parseFloat(item.quantity) || 0) / (yieldPercent / 100);
      const kcal = ((parseFloat(item.quantity) || 0) * (parseFloat(ing.kcal) || 0)) / 1000;
      const cost = adjustedQty * (parseFloat(ing.pricePerKg) || 0);

      totalKcal += kcal;
      totalCost += cost;

      rows.push([
        ing.name,
        item.quantity,
        ing.unit,
        adjustedQty.toFixed(2),
        kcal.toFixed(2),
        cost.toFixed(2),
      ]);
    });

    rows.push(['TOTAL', '', '', '', totalKcal.toFixed(2), totalCost.toFixed(2)]);
    rows.push([
      'Cost / Portion', (totalCost / portions).toFixed(2),
      'KCAL / Portion', (totalKcal / portions).toFixed(2)
    ]);
    rows.push([]); // space between recipes
  });

  const sheet = utils.aoa_to_sheet(rows);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, sheet, 'Recipes');
  writeFile(workbook, 'recipes_export.xlsx');
};


export const exportSingleRecipeToPDF = (recipe, ingredientsMap) => {
  return new Promise((resolve) => {
    const doc = new jsPDF();
    
    // Set up document
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text(recipe.name.toUpperCase(), 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Type: ${recipe.type || 'N/A'} | Portions: ${recipe.portions || 'N/A'} | Yield: ${recipe.yieldWeight || 'N/A'}g`, 14, 30);
    
    // Calculate totals
    let totalKcal = 0;
    let totalCost = 0;
    
    const tableData = recipe.ingredients.map((item) => {
      const ing = ingredientsMap[item.ingredientId];
      if (!ing) return ['Unknown', '-', '-', '-', '-', '-'];
      
      const yieldPercent = parseFloat(ing.yield) || 100;
      const adjustedQty = (parseFloat(item.quantity) || 0) / (yieldPercent / 100);
      const kcal = ((parseFloat(item.quantity) || 0) * (parseFloat(ing.kcal) || 0)) / 1000;
      const cost = adjustedQty * (parseFloat(ing.pricePerKg) || 0);
      
      totalKcal += kcal;
      totalCost += cost;
      
      return [
        ing.name,
        (parseFloat(item.quantity) || 0).toFixed(2),
        ing.originalUnit || '-',
        adjustedQty.toFixed(2),
        kcal.toFixed(2),
        '$' + cost.toFixed(2)
      ];
    });
    
    // Add total row
    tableData.push([
      'TOTAL',
      '',
      '',
      '',
      totalKcal.toFixed(2),
      '$' + totalCost.toFixed(2)
    ]);
    
    // Create ingredients table
    autoTable(doc, {
      startY: 40,
      head: [['Ingredient', 'Qty', 'Unit', 'Adj Qty', 'KCAL', 'Cost']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [79, 70, 229], // Purple color
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: { fontSize: 10 },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });
    
    // Add summary information
    const finalY = doc.lastAutoTable.finalY + 10;
    
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    
    const portions = recipe.portions || 1;
    const costPerPortion = totalCost / portions;
    const kcalPerPortion = totalKcal / portions;
    
    doc.text(`Cost per portion: $${costPerPortion.toFixed(2)}`, 14, finalY);
    doc.text(`KCAL per portion: ${kcalPerPortion.toFixed(2)}`, 14, finalY + 7);
    
    // Add procedure if available
    if (recipe.procedure && recipe.procedure.trim() !== '') {
      doc.text('Procedure:', 14, finalY + 20);
      
      const splitText = doc.splitTextToSize(recipe.procedure, 180);
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(splitText, 14, finalY + 27);
    }
    
    // Save the PDF
    const fileName = `recipe_${recipe.name.replace(/\s+/g, '_').toLowerCase()}.pdf`;
    doc.save(fileName);
    
    resolve();
  });
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
  
export const exportProductionToPDF = (logs, recipesMap) => {
  const doc = new jsPDF();
  doc.text('Production Logs', 14, 16);

  const body = logs.map(log => [
    log.date,
    recipesMap[log.recipeId]?.name || log.recipeId,
    log.quantity,
    log.base,
    log.handler
  ]);

  autoTable(doc, {
    head: [['Date', 'Recipe', 'Qty', 'Base', 'Handler']],
    body,
    startY: 20,
    styles: { fontSize: 10 },
  });

  doc.save('production_logs.pdf');
};