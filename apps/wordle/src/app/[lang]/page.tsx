// app/[lang]/page.tsx（Server）
import { initI18n } from "@/i18n/server";
import Header from "@/components/Header";
import Board from "@/components/Board";

export function generateStaticParams() {
  return [{ lang: "ja" }, { lang: "en" }];
}

type Props = {
  params: Promise<{ lang: "ja" | "en" }>;
};

export default async function Page({ params }: Props) {
  const { lang } = await params;

  const i18n = await initI18n(lang);
  const t = i18n.getFixedT(lang);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <Header />
      <section>
        <h1 className="text-3xl font-bold">{t("title")}</h1>

        <p className="mt-4">{t("description")}</p>

        {/*
        <h2 className="mt-6 text-xl font-semibold">{t('howto')}</h2>
        <ul className="list-disc pl-6">
          <li>英単語を入力して Enter</li>
          <li>色でヒントを確認</li>
          <li>毎日1問チャレンジ</li>
        </ul>
				*/}
      </section>

      <Board />
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Wordle Clone with Dark Mode
      </p>
    </main>
  );
}
