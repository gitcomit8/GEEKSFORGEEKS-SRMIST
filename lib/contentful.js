import { createClient } from 'contentful';

const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

if (!space || !accessToken) {
  console.error(
    'Contentful environment variables missing. Required: NEXT_PUBLIC_CONTENTFUL_SPACE_ID, NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN'
  );
}

export const contentfulClient = createClient({
  space,
  accessToken,
});