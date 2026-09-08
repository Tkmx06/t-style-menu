// InstagramのURL(例: https://www.instagram.com/p/XXXXXXXXXXX/ や
// https://www.instagram.com/reel/XXXXXXXXXXX/)から投稿IDだけを取り出します。
// すでにID単体(例: XXXXXXXXXXX)が入力された場合はそのまま返します。
export function extractInstagramPostId(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/instagram\.com\/(?:p|reel)\/([^/?#]+)/);
  return match ? match[1] : trimmed;
}
