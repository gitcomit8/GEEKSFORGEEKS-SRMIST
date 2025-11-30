import { createClient } from 'contentful';

const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_PAT;

if (!space || !accessToken) {
  console.error(
    'Contentful environment variables are missing. Please check your .env.local file.\n' +
    'Required: NEXT_PUBLIC_CONTENTFUL_SPACE_ID, NEXT_PUBLIC_CONTENTFUL_PAT'
  );
}

export const contentfulClient = createClient({
  space: space || 'SUBSTITUTE_SPACE_ID', // Prevent crash during build if missing
  accessToken: accessToken || 'SUBSTITUTE_ACCESS_TOKEN',
});
