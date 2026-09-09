/**
 * アップロード前に写真をブラウザ側で縮小・再エンコードするユーティリティ。
 *
 * 2026-09-09: 「iPhoneから画像を追加しようとするとこの画面から進まない
 * (処理中のまま止まる)」との不具合報告への対応で追加しました。
 * iPhoneのカメラで撮った写真はHEIC形式だったり、変換後でも数MB〜10MB超と
 * 大きいことが多く、このアプリのアップロード先(Vercel上のAPI Route)には
 * リクエストボディサイズの上限(既定で4.5MB程度)があります。上限を超えると
 * サーバーはJSON以外のエラーページを返すため、それをJSONとして読もうとした
 * 瞬間に例外が発生し、呼び出し元で「アップロード中(busy)」の状態を
 * 解除するコードに到達できず、画面が「処理中…」のまま固まって見えていました。
 *
 * 対策として、アップロード前にcanvasで長辺2000px程度・JPEG品質0.85程度まで
 * 縮小してから送信するようにし、上限を超えにくくしています(併せて、
 * DishEditCard/AddDishCard側でもtry/catch/finallyを徹底し、万一失敗しても
 * 「処理中…」表示が解除されエラーメッセージが出るようにしています)。
 */
const MAX_DIMENSION = 2000;
const JPEG_QUALITY = 0.85;
// これより小さいファイルはそのまま送る(変換コストを避けるため)。
const SKIP_RESIZE_UNDER_BYTES = 1.5 * 1024 * 1024;

export async function resizeImageFile(
  file: File,
  maxDimension: number = MAX_DIMENSION,
  quality: number = JPEG_QUALITY,
): Promise<File> {
  if (file.size < SKIP_RESIZE_UNDER_BYTES) {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", quality),
    );
    if (!blob || blob.size >= file.size) {
      // 縮小できなかった、あるいは逆に大きくなってしまった場合は元のファイルを使う。
      return file;
    }

    const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";
    return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
  } catch {
    // HEIC等ブラウザがデコードできない形式の場合などはここに来る。
    // 元のファイルをそのまま返し、アップロード側のエラー処理に委ねる。
    return file;
  }
}
