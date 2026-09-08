"use client";

import Script from "next/script";
import { useEffect } from "react";

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
const FALLBACK_POSTS = ["Dc0IKxsAeJS", "DMSg-YPIQQX"];

export function InstagramFeed({ postIds }: { postIds?: string[] }) {
  const posts = postIds && postIds.length > 0 ? postIds : FALLBACK_POSTS;

  // ページ遷移(クライアントサイドナビゲーション)で再訪した際、
  // embed.js は既に読み込み済みでonLoadが発火しないことがあるため、
  // マウント時にも明示的に process() を呼んで埋め込みを描画させます。
  useEffect(() => {
    window.instgrm?.Embeds.process();
  }, []);

  return (
    <section className="flex flex-col items-center gap-4 bg-white px-4 py-12">
      <div className="mx-auto flex w-full max-w-[700px] flex-col items-center gap-6 md:flex-row md:flex-wrap md:items-start md:justify-center">
        {posts.map((shortcode) => (
          <blockquote
            key={shortcode}
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
