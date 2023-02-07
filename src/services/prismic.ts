import { createClient } from "@prismicio/client";

const repositoryEndpoint = process.env.PRISMIC_ENDPOINT!

export const prismic = createClient(repositoryEndpoint, {
  accessToken: process.env.PRISMIC_ACCESS_TOKEN,
});