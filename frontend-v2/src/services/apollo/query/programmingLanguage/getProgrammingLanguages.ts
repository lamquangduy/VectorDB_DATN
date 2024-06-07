import client from "@apolloClient/client";
import gql from "graphql-tag";

const GET_PROGRAMMING_LANGUAGES = gql`
  query getProgrammingLanguages($filter: ProgrammingLanguageFilterInput!) {
    getProgrammingLanguages(filter: $filter) {
      status_code
      message
      data {
        programming_languages {
          id
          programming_language_name
        }
        total
        page
        limit
      }
      error
    }
  }
`;

const fetchGetProgrammingLanguages = async () => {
  const result = await client.query({
    query: GET_PROGRAMMING_LANGUAGES,
    variables: {
      filter: {
        pagination: {
          page: 1,
          limit: 999,
        },
      },
    },
  });
  const { data } = result;
  const { getProgrammingLanguages } = data;
  const programming_languages: IProgrammingLanguage[] =
    getProgrammingLanguages.data.programming_languages?.map((item: any) => {
      const programming_language: IProgrammingLanguage = {
        id: item.id || "",
        programming_language_name: item.programming_language_name || "",
      };
      return programming_language;
    });
  return programming_languages;
};

export default fetchGetProgrammingLanguages;
