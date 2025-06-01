import vision from "@google-cloud/vision";

const keyFilename =
  process.env.NODE_ENV === "production"
    ? "/etc/secrets/vision-key.json" // Render 雲端路徑
    : "../etc/secrets/vision-key.json"; // 本地開發路徑

/**
 * 使用 Google Cloud Vision 的 webDetection 模式來取得食物名稱
 * @param {Buffer} buffer - 圖片 buffer
 * @returns {Promise<string|null>}
 */
export async function detectFoodLabelFromBuffer(buffer) {
  try {
    const [result] = await visionClient.webDetection({
      image: { content: buffer },
    });
    const labels = result.webDetection?.bestGuessLabels;
    const guess = labels?.[0]?.label;
    return guess || null;
  } catch (err) {
    console.error("❌ 圖片辨識錯誤：", err);
    return null;
  }
}
