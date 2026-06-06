const NOTION_VERSION = "2022-06-28";

/** Notion DB 속성명 */
export const PROPERTY_NAMES = {
  title: "제목",
  tags: "과목",
  description: "설명",
  thumbnail: "썸네일",
  url: "URL",
  date: "날짜",
  published: "공개여부",
  priority: "우선순위",
  worksheet: "활동지",
  grade: "학년",
  unit: "단원",
  playTime: "플레이 시간",
} as const;

export type WorksheetFile = {
  name: string;
  url: string;
};

export type GameItem = {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  url: string | null;
  tags: string[];
  date: string | null;
  published: boolean;
  priority: number;
  worksheets: WorksheetFile[];
  grades: string[];
  unit: string;
  playTime: string;
};

/** 학년 미입력 시 마이그레이션 기본값 */
export const DEFAULT_GRADE_MIGRATION = "전학년";

type NotionRichText = { plain_text: string };

type NotionFile = {
  name?: string;
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

function getSelect(prop: unknown): string | null {
  const p = prop as { select?: { name: string } | null } | undefined;
  return p?.select?.name ?? null;
}

/** 과목: 다중 선택 또는 단일 선택 모두 지원 */
function getSubjectTags(prop: unknown): string[] {
  const multi = getMultiSelect(prop);
  if (multi.length > 0) return multi;
  const single = getSelect(prop);
  return single ? [single] : [];
}

/** 학년: Multi-select 우선, Select 호환, 미입력 시 전학년 */
function getGrades(prop: unknown): string[] {
  const multi = getMultiSelect(prop);
  if (multi.length > 0) return multi;
  const single = getSelect(prop);
  if (single) return [single];
  return [DEFAULT_GRADE_MIGRATION];
}

/** rich_text → select → number 순서로 fallback */
function getTextOrSelect(prop: unknown): string {
  const text = getPlainText(prop);
  if (text) return text;
  const sel = getSelect(prop);
  if (sel) return sel;
  const num = (prop as { number?: number | null } | undefined)?.number;
  if (num != null) return String(num);
  return "";
}

function getCheckbox(prop: unknown): boolean {
  const p = prop as { checkbox?: boolean } | undefined;
  return p?.checkbox ?? false;
}

function getDate(prop: unknown): string | null {
  const p = prop as { date?: { start: string | null } | null } | undefined;
  return p?.date?.start ?? null;
}

function getNumber(prop: unknown): number {
  const p = prop as { number?: number | null } | undefined;
  return p?.number ?? 0;
}

function resolveFileUrl(file: NotionFile): string | null {
  return file.type === "external"
    ? (file.external?.url ?? null)
    : (file.file?.url ?? null);
}

function getFileUrl(prop: unknown): string | null {
  const p = prop as { files?: NotionFile[] } | undefined;
  const file = p?.files?.[0];
  if (!file) return null;
  return resolveFileUrl(file);
}

/** 파일과 미디어 속성의 모든 파일 (활동지 등) */
function getFiles(prop: unknown): WorksheetFile[] {
  const p = prop as { files?: NotionFile[] } | undefined;
  if (!p?.files?.length) return [];

  return p.files.flatMap((file, index) => {
    const url = resolveFileUrl(file);
    if (!url) return [];
    return [
      {
        name: file.name?.trim() || `활동지 ${index + 1}`,
        url,
      },
    ];
  });
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
    tags: getSubjectTags(p[PROPERTY_NAMES.tags]),
    date: getDate(p[PROPERTY_NAMES.date]),
    published: getCheckbox(p[PROPERTY_NAMES.published]),
    priority: getNumber(p[PROPERTY_NAMES.priority]),
    worksheets: getFiles(p[PROPERTY_NAMES.worksheet]),
    grades: getGrades(p[PROPERTY_NAMES.grade]),
    unit: getPlainText(p[PROPERTY_NAMES.unit]),
    playTime: getTextOrSelect(p[PROPERTY_NAMES.playTime]),
  };
}

/** 우선순위 내림차순 (큰 숫자가 먼저) */
export function sortByPriority(games: GameItem[]): GameItem[] {
  return [...games].sort((a, b) => b.priority - a.priority);
}

/** 과목(다중 선택) 태그에서 필터 목록 추출 */
const SUBJECT_ORDER = [
  "국어",
  "수학",
  "사회",
  "과학",
  "영어",
  "도덕",
  "음악",
  "미술",
  "체육",
  "실과",
  "창의",
  "통합",
];

export function extractSubjects(games: GameItem[]): string[] {
  const set = new Set<string>();
  for (const game of games) {
    for (const tag of game.tags) {
      set.add(tag);
    }
  }
  return [...set].sort((a, b) => {
    const ai = SUBJECT_ORDER.indexOf(a);
    const bi = SUBJECT_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b, "ko");
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

const GRADE_ORDER = ["3학년", "4학년", "5학년", "6학년", "전학년"];

export function extractGrades(games: GameItem[]): string[] {
  const set = new Set<string>();
  for (const game of games) {
    for (const grade of game.grades) {
      set.add(grade);
    }
  }
  return [...set].sort((a, b) => {
    const ai = GRADE_ORDER.indexOf(a);
    const bi = GRADE_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b, "ko");
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

/** 학년 필터 매칭: 5학년 → 5학년 또는 전학년 태그 게임 포함 */
export function matchesGradeFilter(game: GameItem, filter: string): boolean {
  if (filter === "전체") return true;
  if (filter === "전학년") return game.grades.includes("전학년");
  return (
    game.grades.includes(filter) || game.grades.includes("전학년")
  );
}

/** 단원 필터 목록 (비어 있지 않은 단원만) */
export function extractUnits(games: GameItem[]): string[] {
  const set = new Set<string>();
  for (const game of games) {
    const unit = game.unit.trim();
    if (unit) set.add(unit);
  }
  return [...set].sort((a, b) =>
    a.localeCompare(b, "ko", { numeric: true, sensitivity: "base" }),
  );
}

export function matchesSearch(game: GameItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    game.title.toLowerCase().includes(q) ||
    game.description.toLowerCase().includes(q)
  );
}

export function filterGames(
  games: GameItem[],
  {
    search = "",
    subject = "전체",
    grade = "전체",
    unit = "전체",
  }: {
    search?: string;
    subject?: string;
    grade?: string;
    unit?: string;
  },
): GameItem[] {
  return games.filter((game) => {
    if (!matchesSearch(game, search)) return false;
    if (subject !== "전체" && !game.tags.includes(subject)) return false;
    if (!matchesGradeFilter(game, grade)) return false;
    if (unit !== "전체" && game.unit.trim() !== unit) return false;
    return true;
  });
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
        sorts: [
          {
            property: PROPERTY_NAMES.priority,
            direction: "descending",
          },
        ],
      }),
      next: { revalidate: 60 },
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Notion API 오류 (${res.status}): ${err}`);
  }

  const data = (await res.json()) as { results: NotionPage[] };
  return sortByPriority(data.results.map(mapPageToGameItem));
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
