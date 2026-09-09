// 管理画面のfetch呼び出しは、サーバーが常にJSONを返す前提で `res.json()` を
// 直接呼んでいました。しかし写真アップロードでファイルサイズの上限を超えた
// 場合など、サーバーのコードに届く前にVercel側でエラーになるケースでは、
// レスポンスがJSONではなくHTMLのエラーページになることがあります。この場合
// `res.json()` 自体が失敗し、「The string did not match the expected
// pattern.」というブラウザ内部の分かりにくいエラーがそのまま表示されて
// いました(2026-09-09、実際にMENU/LUNCHへの写真追加時に発生)。
//
// レスポンスの解析に失敗した場合は、状況に応じた分かりやすい日本語の
// エラーメッセージに変換します。
export async function readJsonResponse<T = Record<string, unknown>>(
  res: Response,
): Promise<T> {
  try {
    return (await res.json()) as T;
  } catch {
    if (res.status === 413) {
      throw new Error(
        "写真のファイルサイズが大きすぎるため送信できませんでした。もう少し軽い写真を選ぶか、時間をおいて再度お試しください。",
      );
    }
    if (!res.ok) {
      throw new Error(
        `サーバーとの通信に失敗しました(エラーコード: ${res.status})。時間をおいて再度お試しください。`,
      );
    }
    throw new Error("サーバーの応答を読み取れませんでした。時間をおいて再度お試しください。");
  }
}
