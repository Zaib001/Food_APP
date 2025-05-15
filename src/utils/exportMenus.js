import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportMenusToCSV = (menus, ingredientsMap) => {
  const rows = menus.map((menu) => {
    const getName = (id) => ingredientsMap[id]?.name || id;
    return {
      Date: menu.date,
      Meal: menu.mealType,
      Base: menu.base,
      Protein: getName(menu.protein),
      Sides: menu.sides.map(getName).join(', '),
      Bread: getName(menu.bread),
      Beverage: getName(menu.beverage),
    };
  });

  const headers = Object.keys(rows[0]).join(',');
  const body = rows.map((row) => Object.values(row).join(',')).join('\n');
  const blob = new Blob([headers + '\n' + body], { type: 'text/csv' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'menus.csv';
  link.click();
};

export const exportMenusToWeeklyPDF = (menus, ingredientsMap) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Weekly Menu Report', 14, 20);

  const getName = (id) => ingredientsMap[id]?.name || id;
  const groupedByDate = menus.reduce((acc, m) => {
    if (!acc[m.date]) acc[m.date] = [];
    acc[m.date].push(m);
    return acc;
  }, {});

  let yOffset = 30;
  Object.entries(groupedByDate).sort(([a], [b]) => new Date(a) - new Date(b)).forEach(([date, dailyMenus]) => {
    doc.setFontSize(12);
    doc.text(date, 14, yOffset);
    yOffset += 6;

    dailyMenus.forEach((menu, i) => {
      const data = [
        ['Meal Type', menu.mealType],
        ['Base', menu.base],
        ['Protein', getName(menu.protein)],
        ['Sides', menu.sides.map(getName).join(', ')],
        ['Bread', getName(menu.bread)],
        ['Beverage', getName(menu.beverage)],
      ];

      autoTable(doc, {
        startY: yOffset,
        head: [['Field', 'Value']],
        body: data,
        theme: 'grid',
        styles: { fontSize: 10 },
        margin: { top: 10, bottom: 10 },
      });

      yOffset = doc.lastAutoTable.finalY + 10;
    });

    yOffset += 10;
  });

  doc.save('weekly_menus.pdf');
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