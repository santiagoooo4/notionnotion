import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { remark } from 'remark';
import html from 'remark-html';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });

const databaseId = process.env.NOTION_DATABASE_ID;

export async function getPosts() {
  if (!databaseId) {
    throw new Error('NOTION_DATABASE_ID is not set in the environment variables');
  }

  const response = await notion.databases.query({
    database_id: databaseId,
    sorts: [
      {
        property: 'Date',
        direction: 'descending',
      },
    ],
  });

  return response.results.map((page) => {
    return {
      id: page.id,
      title: page.properties.Name.title[0].plain_text,
      date: page.properties.Date.date.start,
      excerpt: page.properties.Excerpt.rich_text[0].plain_text,
    };
  });
}

export async function getPostContent(pageId: string) {
  const page = await notion.pages.retrieve({ page_id: pageId });
  const mdblocks = await n2m.pageToMarkdown(pageId);
  const mdString = n2m.toMarkdownString(mdblocks);
  
  const processedContent = await remark()
    .use(html)
    .process(mdString);
  const contentHtml = processedContent.toString();

  return {
    id: page.id,
    title: page.properties.Name.title[0].plain_text,
    date: page.properties.Date.date.start,
    content: contentHtml,
  };
}