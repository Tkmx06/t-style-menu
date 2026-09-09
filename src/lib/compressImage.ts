"use client";

// 管理画面から写真をアップロードする際、iPhoneの「ファイル」アプリ等から選んだ
// 元サイズの画像(特にZIPを解凍した直後のPNGなど)は数十MBになることがあります。
// Vercelのサーバー関数(このアプリのAPI)が受け取れるリクエストサイズには上限
// (約4.5MB、413 FUNCTION_PAYLOAD_TOO_LARGE)があり、これを超えるとサーバーの
// コードに届く前にエラーになってしまいます。この時ブラウザはエラーページ(HTML)
// をJSONとして読もうとして失敗し、「The string did not match the expected
// pattern.」という原因の分かりにくいエラーになっていました
// (2026-09-09、MENU/LUNCHへの写真追加で実際に発生)。
//
// アップロード前にブラウザ内で画像を長辺2000px・JPEG品質0.85程度まで縮小して
// から送ることで、上限を超えずに、表示には十分な画質のまま送信できるように
// します。既に十分小さいファイル(1.5MB以下)はそのまま使い、余計な劣化を
// 避けます。変換自体に失敗した場合は、元のファイルのままアップロードを試みます
// (それでも大きすぎる場合は、送信先でエラーメッセージが分かりやすく出ます)。
const MAX_DIMENSION = 2000;
const JPEG_QUALITY = 0.85;
const SKIP_THRESHOLD_BYTES = 1.5 * 1024 * 1024;

export async function compressImageFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.size <= SKIP_THRESHOLD_BYTES) {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", JPEG_QUALITY),
    );
    if (!blob || blob.size >= file.size) {
      return file;
    }

    const baseName = file.name.replace(/\.[^./]+$/, "") || "photo";
    return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
  } catch {
    return file;
  }
}
