"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

// SnapWidgetのフリープランでは、iPhone Safari(モバイル)で埋め込み欄が
// 真っ白のまま表示されないという問題が解消しなかったため、Instagram公式の
// 埋め込み機能(無料・トークン不要)に切り替えました。
//
// 仕組み: Instagramの投稿ページで「埋め込み」を選ぶと発行されるのと同じ、
// 公式の <blockquote class="instagram-media"> + embed.js を使用しています。
// この方式はInstagram自身のスクリプトが投稿の高さに合わせて自動でリサイズ
// してくれるため、SnapWidgetのように高さがずれて見切れる心配がありません。
//
// 注意点(SnapWidgetとの違い):
// ・自動で最新投稿に更新される「フィード」ではなく、指定した投稿を
//   個別に埋め込む方式です。表示する投稿は管理画面(/admin/settings)から
//   編集できます(データはsite_content.instagram_post_idsに保存)。
//
// FALLBACK_POSTSは、設定が未保存/取得エラー時のための最後の保険です。
// 2026-09-08: 表示順(上下/左右)を入れ替えてほしいとの要望で並び順を変更しました。
//
// 2026-09-18: 投稿を2件並べると、片方(常に1件目)の高さだけ潰れて
// 見えなくなる不具合が判明。原因はInstagram公式embed.js側で、複数の
// 投稿を処理した際にリサイズ用iframeのid("instagram-embed-N")の
// 割り当てや高さ反映がずれること。embed.js自身の内部処理に依存せず、
// 各投稿のiframeが自分自身で送ってくる高さ通知(postMessage)を
// event.source(送信元iframeそのもの)で確実に紐付けて、こちら側で
// 直接高さを反映するようにして回避しています。
//
// 2026-09-18: 上記修正後も1件目が2pxの高さに潰れたまま表示される
// 問題が再発。調査の結果、コードの不具合ではなく投稿Dc0IKxsAeJS
// 自体がInstagram側で削除済み(埋め込みが空)だったことが判明したため、
// 有効な投稿IDに差し替え。あわせて、今後同様に投稿が削除された場合に
// 空の枠が残り続けないよう、一定時間経っても高さが閾値を超えない
// 埋め込みは自動で非表示にするフォールバックを追加しています。
const FALLBACK_POSTS = ["DdV0mYFgzz2", "DMSg-YPIQQX"];

// embed.js の読み込み・高さ反映を待つ猶予(ミリ秒)。これを過ぎても
// 高さがMIN_VISIBLE_HEIGHT_PX未満(投稿削除時などは2px前後になる)の
// ままの埋め込みは、空の白枠を表示し続けないよう非表示にする。
const EMBED_TIMEOUT_MS = 8000;
const MIN_VISIBLE_HEIGHT_PX = 60;

function isInstagramMeasureMessage(
  data: unknown,
): data is { type: string; details: { height: number } } {
  if (!data || typeof data !== "object") return false;
  const value = data as { type?: unknown; details?: { height?: unknown } };
  return value.type === "MEASURE" && typeof value.details?.height === "number";
}

export function InstagramFeed({ postIds }: { postIds?: string[] }) {
  const posts = postIds && postIds.length > 0 ? postIds : FALLBACK_POSTS;
  const postsKey = posts.join(",");
  const [hiddenShortcodes, setHiddenShortcodes] = useState<string[]>([]);

  // 表示する投稿の組み合わせが変わったら、非表示状態をリセットする。
  // (レンダー中にpropsの変化を検知してstateを更新する、Reactが推奨する
  // 「keyの変化に応じたstateリセット」パターン。useEffectでは行わない)
  const [prevPostsKey, setPrevPostsKey] = useState(postsKey);
  if (postsKey !== prevPostsKey) {
    setPrevPostsKey(postsKey);
    setHiddenShortcodes([]);
  }

  useEffect(() => {
    // Instagram公式iframeが読み込み完了時に送ってくる高さ通知を、
    // 送信元iframe(event.source)で直接特定して自前で反映する。
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.instagram.com") return;

      let data: unknown = event.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }
      if (!isInstagramMeasureMessage(data)) return;

      const iframes = document.querySelectorAll<HTMLIFrameElement>(
        "iframe.instagram-media",
      );
      const target = Array.from(iframes).find(
        (iframe) => iframe.contentWindow === event.source,
      );
      if (!target) return;

      const height = `${data.details.height}px`;
      target.style.height = height;
      target.setAttribute("height", String(data.details.height));

      // 正常な高さが届いた投稿は、非表示リストに載っていても復帰させる。
      if (data.details.height >= MIN_VISIBLE_HEIGHT_PX) {
        const shortcode = target.closest<HTMLElement>(
          "[data-instagram-shortcode]",
        )?.dataset.instagramShortcode;
        if (shortcode) {
          setHiddenShortcodes((prev) =>
            prev.includes(shortcode)
              ? prev.filter((code) => code !== shortcode)
              : prev,
          );
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // ページ遷移(クライアントサイドナビゲーション)で再訪した際、
  // embed.js は既に読み込み済みでonLoadが発火しないことがあるため、
  // マウント時にも明示的に process() を呼んで埋め込みを描画させます。
  useEffect(() => {
    window.instgrm?.Embeds.process();
  }, []);

  // 投稿が削除/非公開などでembed.jsが中身を描画できなかった場合、
  // 高さが潰れた(2px前後の)空の白枠だけが残ってしまう。一定時間
  // 待っても十分な高さに広がらない埋め込みは、枠ごと非表示にする。
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const wrappers = document.querySelectorAll<HTMLElement>(
        "[data-instagram-shortcode]",
      );
      const stalled = Array.from(wrappers)
        .filter((wrapper) => {
          const iframe = wrapper.querySelector<HTMLIFrameElement>(
            "iframe.instagram-media",
          );
          const height = iframe?.getBoundingClientRect().height ?? 0;
          return height < MIN_VISIBLE_HEIGHT_PX;
        })
        .map((wrapper) => wrapper.dataset.instagramShortcode)
        .filter((shortcode): shortcode is string => Boolean(shortcode));

      if (stalled.length > 0) {
        setHiddenShortcodes((prev) => [
          ...prev,
          ...stalled.filter((code) => !prev.includes(code)),
        ]);
      }
    }, EMBED_TIMEOUT_MS);

    return () => window.clearTimeout(timer);
  }, [postsKey]);

  const allHidden =
    posts.length > 0 && hiddenShortcodes.length === posts.length;

  return (
    <section
      className="flex flex-col items-center gap-4 bg-white px-4 py-12"
      hidden={allHidden}
    >
      <div className="mx-auto flex w-full max-w-[700px] flex-col items-center gap-6 md:flex-row md:flex-wrap md:items-start md:justify-center">
        {posts.map((shortcode) => (
          <div
            key={shortcode}
            data-instagram-shortcode={shortcode}
            hidden={hiddenShortcodes.includes(shortcode)}
          >
            <blockquote
              className="instagram-media"
              data-instgrm-permalink={`https://www.instagram.com/p/${shortcode}/`}
              data-instgrm-version="14"
              style={{
                background: "#FFF",
                border: 0,
                borderRadius: 3,
                margin: 0,
                maxWidth: 400,
                minWidth: 300,
                width: "100%",
                padding: 0,
              }}
            >
              <a
                href={`https://www.instagram.com/p/${shortcode}/`}
                target="_blank"
                rel="noreferrer"
              >
                Instagramで投稿を見る
              </a>
            </blockquote>
          </div>
        ))}
      </div>
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="afterInteractive"
        onLoad={() => {
          window.instgrm?.Embeds.process();
        }}
      />
    </section>
  );
}
