const NOTION_VERSION = "2022-06-28";

/** Notion DB 속성명 (한국어 기본 이름) */
export const PROPERTY_NAMES = {
  title: "제목",
  tags: "다중 선택",
  description: "텍스트",
  thumbnail: "파일과 미디어",
  url: "URL",
  date: "날짜",
  published: "체크박스",
} as const;

export type GameItem = {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  url: string | null;
  tags: string[];
  date: string | null;
  published: boolean;
};

type NotionRichText = { plain_text: string };

type NotionFile = {
  type: string;
  file?: { url: string };
  external?: { url: string };
};

type NotionPage = {
  id: string;
  properties: Record<string, unknown>;
  cover?: NotionFile | null;
};

function getPlainText(prop: unknown): string {
  const p = prop as { rich_text?: NotionRichText[] } | undefined;
  return p?.rich_text?.map((t) => t.plain_text).join("") ?? "";
}

function getTitle(prop: unknown): string {
  const p = prop as { title?: NotionRichText[] } | undefined;
  return p?.title?.map((t) => t.plain_text).join("") ?? "제목 없음";
}

function getUrl(prop: unknown): string | null {
  const p = prop as { url?: string | null } | undefined;
  return p?.url ?? null;
}

function getMultiSelect(prop: unknown): string[] {
  const p = prop as { multi_select?: { name: string }[] } | undefined;
  return p?.multi_select?.map((s) => s.name) ?? [];
}

function getCheckbox(prop: unknown): boolean {
  const p = prop as { checkbox?: boolean } | undefined;
  return p?.checkbox ?? false;
}

function getDate(prop: unknown): string | null {
  const p = prop as { date?: { start: string | null } | null } | undefined;
  return p?.date?.start ?? null;
}

function getFileUrl(prop: unknown): string | null {
  const p = prop as { files?: NotionFile[] } | undefined;
  const file = p?.files?.[0];
  if (!file) return null;
  return file.type === "external"
    ? (file.external?.url ?? null)
    : (file.file?.url ?? null);
}

function getCoverUrl(cover: NotionFile | null | undefined): string | null {
  if (!cover) return null;
  return cover.type === "external"
    ? (cover.external?.url ?? null)
    : (cover.file?.url ?? null);
}

function mapPageToGameItem(page: NotionPage): GameItem {
  const p = page.properties;

  const thumbnail =
    getFileUrl(p[PROPERTY_NAMES.thumbnail]) ??
    getCoverUrl(page.cover ?? undefined);

  return {
    id: page.id,
    title: getTitle(p[PROPERTY_NAMES.title]),
    description: getPlainText(p[PROPERTY_NAMES.description]),
    thumbnail,
    url: getUrl(p[PROPERTY_NAMES.url]),
    tags: getMultiSelect(p[PROPERTY_NAMES.tags]),
    date: getDate(p[PROPERTY_NAMES.date]),
    published: getCheckbox(p[PROPERTY_NAMES.published]),
  };
}

export async function getGamesFromNotion(): Promise<GameItem[]> {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!token || !databaseId) {
    throw new Error(
      "NOTION_TOKEN 또는 NOTION_DATABASE_ID가 .env.local에 설정되지 않았습니다.",
    );
  }

  const res = await fetch(
    `https://api.notion.com/v1/databases/${databaseId}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: {
          property: PROPERTY_NAMES.published,
          checkbox: { equals: true },
        },
        sorts: [{ property: PROPERTY_NAMES.date, direction: "descending" }],
      }),
      next: { revalidate: 60 },
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Notion API 오류 (${res.status}): ${err}`);
  }

  const data = (await res.json()) as { results: NotionPage[] };
  return data.results.map(mapPageToGameItem);
}

export function formatGameDate(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
