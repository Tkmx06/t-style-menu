import type { CSSProperties } from "react";

/**
 * 写真の「位置調整(パン)・拡大・回転」を反映したCSSスタイルを作る。
 *
 * 以前は object-position で切り抜き位置をずらし、別に transform: scale/rotate
 * を重ねていたが、写真の縦横比が表示枠(4:3)とほぼ一致する場合、
 * object-fit: cover にはそもそも動かせる余白がなく、focal_x/focal_y を
 * 変えても見た目が一切変わらない(=矢印ボタンが反応しないように見える)
 * 問題があった。
 *
 * 代わりに transform-origin を focal point に置いた上で scale することで、
 * 「その点を中心に拡大する」形になり、縦横比に関係なく常にパンが効くようにする。
 */
export function dishImageStyle(dish: {
  focal_x: number;
  focal_y: number;
  zoom: number;
  rotation: number;
}): CSSProperties {
  return {
    transformOrigin: `${dish.focal_x * 100}% ${dish.focal_y * 100}%`,
    transform: `scale(${dish.zoom}) rotate(${dish.rotation}deg)`,
  };
}
