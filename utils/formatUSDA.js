export function formatUSDAResult(food, userInput = "該食物") {
  if (!food) return `找不到「${userInput}」的營養資料 😢`;

  const nutrientGroups = {
    base: {
      label: "📊 基本營養素（每100克）",
      items: {
        Energy: "熱量 (kcal)",
        Protein: "蛋白質 (g)",
        "Total lipid (fat)": "脂肪 (g)",
        "Carbohydrate, by difference": "碳水化合物 (g)",
        "Fiber, total dietary": "膳食纖維 (g)",
        "Sugars, total including NLEA": "糖分 (g)",
        Cholesterol: "膽固醇 (mg)",
        "Sodium, Na": "鈉 (mg)",
      },
    },
    minerals: {
      label: "🧲 礦物質",
      items: {
        "Calcium, Ca": "鈣 (mg)",
        "Iron, Fe": "鐵 (mg)",
        "Magnesium, Mg": "鎂 (mg)",
        "Phosphorus, P": "磷 (mg)",
        "Potassium, K": "鉀 (mg)",
        "Zinc, Zn": "鋅 (mg)",
        "Copper, Cu": "銅 (mg)",
        "Manganese, Mn": "錳 (mg)",
        "Selenium, Se": "硒 (µg)",
      },
    },
    vitamins: {
      label: "🌿 維生素",
      items: {
        "Vitamin A, RAE": "維生素A (µg)",
        "Vitamin B-1": "維生素B1 (mg)",
        "Vitamin B-2": "維生素B2 (mg)",
        Niacin: "維生素B3 / 菸鹼酸 (mg)",
        "Vitamin B-6": "維生素B6 (mg)",
        "Folate, total": "葉酸 (µg)",
        "Vitamin B-12": "維生素B12 (µg)",
        "Vitamin C, total ascorbic acid": "維生素C (mg)",
        "Vitamin D (D2 + D3)": "維生素D (µg)",
        "Vitamin E (alpha-tocopherol)": "維生素E (mg)",
        "Vitamin K (phylloquinone)": "維生素K (µg)",
      },
    },
  };

  // 建立營養對照表
  const allNutrients = {};
  food.foodNutrients.forEach((n) => {
    if (n.nutrientName && n.value != null) {
      allNutrients[n.nutrientName] = n.value;
    }
  });

  let result = `🔍「${userInput}」的營養資料（每100克）：\n`;

  for (const group of Object.values(nutrientGroups)) {
    let groupText = "";
    for (const [key, label] of Object.entries(group.items)) {
      if (allNutrients[key] !== undefined) {
        groupText += `- ${label}：${allNutrients[key]}\n`;
      }
    }
    if (groupText) {
      result += `\n${group.label}\n${groupText}`;
    }
  }

  return result.trim();
}
