const NOTION_VERSION = "2022-06-28";

export type AboutContent = {
  title: string;
  paragraphs: string[];
  profileImage: string | null;
  bannerImage: string;
};

export const DEFAULT_ABOUT: AboutContent = {
  title: "바이브클래스 소개",
  paragraphs: [
    "안녕하세요. 저는 서울의 초등학교에서 근무하는 현직 교사입니다.",
    "학생들이 수업 속에서 더 몰입하고 즐겁게 배울 수 있도록 교육용 게임과 시뮬레이션을 직접 제작하고 있습니다.",
    "이 사이트의 콘텐츠는 실제 수업 경험을 바탕으로 설계되었으며, 교실에서 바로 활용할 수 있도록 제작되었습니다.",
  ],
  profileImage: null,
  bannerImage: "/og-image.png",
};

type NotionRichText = { plain_text: string };

type NotionBlock = {
  id: string;
  type: string;
  has_children?: boolean;
  paragraph?: { rich_text: NotionRichText[] };
  heading_1?: { rich_text: NotionRichText[] };
  heading_2?: { rich_text: NotionRichText[] };
  heading_3?: { rich_text: NotionRichText[] };
  bulleted_list_item?: { rich_text: NotionRichText[] };
  numbered_list_item?: { rich_text: NotionRichText[] };
  quote?: { rich_text: NotionRichText[] };
  image?: { type: string; external?: { url: string }; file?: { url: string } };
};

type NotionCover = {
  type: string;
  external?: { url: string };
  file?: { url: string };
};

type NotionTitleProperty = {
  type?: string;
  title?: NotionRichText[];
};

function getNotionHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };
}

function richTextToPlain(rich?: NotionRichText[]): string {
  return rich?.map((t) => t.plain_text).join("") ?? "";
}

function getCoverUrl(cover: NotionCover | null | undefined): string | null {
  if (!cover) return null;
  return cover.type === "external"
    ? (cover.external?.url ?? null)
    : (cover.file?.url ?? null);
}

function getImageBlockUrl(block: NotionBlock): string | null {
  const img = block.image;
  if (!img) return null;
  return img.type === "external"
    ? (img.external?.url ?? null)
    : (img.file?.url ?? null);
}

function normalizeNotionPageId(value: string): string {
  const compactValue = value.replace(/-/g, "");
  const match = compactValue.match(/[0-9a-fA-F]{32}/);
  return match?.[0] ?? value;
}

function getPageTitle(
  properties: Record<string, unknown> | undefined,
): string {
  if (!properties) return "";

  for (const property of Object.values(properties)) {
    const titleProperty = property as NotionTitleProperty;
    if (titleProperty.type === "title" || titleProperty.title) {
      const title = richTextToPlain(titleProperty.title).trim();
      if (title) return title;
    }
  }

  return "";
}

function blockToParagraph(block: NotionBlock): string | null {
  const type = block.type;
  const data = block[type as keyof NotionBlock] as
    | { rich_text?: NotionRichText[] }
    | undefined;
  if (!data?.rich_text) return null;
  const text = richTextToPlain(data.rich_text).trim();
  return text || null;
}

type BlocksData = {
  bannerImage: string | null;
  paragraphs: string[];
};

async function fetchBlocksData(
  token: string,
  blockId: string,
): Promise<BlocksData> {
  const allBlocks: NotionBlock[] = [];
  let cursor: string | undefined;

  do {
    const url = new URL(
      `https://api.notion.com/v1/blocks/${blockId}/children`,
    );
    url.searchParams.set("page_size", "100");
    if (cursor) url.searchParams.set("start_cursor", cursor);

    const res = await fetch(url.toString(), {
      headers: getNotionHeaders(token),
      next: { revalidate: 300 },
    });

    if (!res.ok) break;

    const data = (await res.json()) as {
      results: NotionBlock[];
      has_more: boolean;
      next_cursor: string | null;
    };

    allBlocks.push(...data.results);
    cursor = data.has_more ? (data.next_cursor ?? undefined) : undefined;
  } while (cursor);

  const firstImageIndex = allBlocks.findIndex((b) => b.type === "image");
  const bannerImage =
    firstImageIndex >= 0 ? getImageBlockUrl(allBlocks[firstImageIndex]) : null;

  const startIndex = firstImageIndex >= 0 ? firstImageIndex + 1 : 0;
  const paragraphs: string[] = [];
  for (const block of allBlocks.slice(startIndex)) {
    const text = blockToParagraph(block);
    if (text) paragraphs.push(text);
  }

  return { bannerImage, paragraphs };
}

/**
 * 별도 Notion 일반 페이지(NOTION_ABOUT_PAGE_ID)에서 소개 섹션을 불러옵니다.
 * - 제목: 페이지 Title
 * - Hero Banner: 본문 첫 번째 이미지 블록 (없으면 기본 배너)
 * - 내용: 첫 번째 이미지 블록 이후의 문단
 * - 프로필: 페이지 Cover 이미지(선택)
 */
export async function getAboutFromNotion(): Promise<AboutContent> {
  const token = process.env.NOTION_TOKEN;
  const pageId = process.env.NOTION_ABOUT_PAGE_ID
    ? normalizeNotionPageId(process.env.NOTION_ABOUT_PAGE_ID)
    : undefined;

  if (!token || !pageId) {
    return DEFAULT_ABOUT;
  }

  try {
    const pageRes = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      headers: getNotionHeaders(token),
      next: { revalidate: 300 },
    });

    if (!pageRes.ok) return DEFAULT_ABOUT;

    const page = (await pageRes.json()) as {
      properties?: Record<string, unknown>;
      cover?: NotionCover | null;
    };

    const title = getPageTitle(page.properties) || DEFAULT_ABOUT.title;
    const { bannerImage, paragraphs } = await fetchBlocksData(token, pageId);
    const profileImage = getCoverUrl(page.cover ?? undefined);

    return {
      title,
      paragraphs: paragraphs.length > 0 ? paragraphs : DEFAULT_ABOUT.paragraphs,
      profileImage,
      bannerImage: bannerImage ?? DEFAULT_ABOUT.bannerImage,
    };
  } catch {
    return DEFAULT_ABOUT;
  }
}
