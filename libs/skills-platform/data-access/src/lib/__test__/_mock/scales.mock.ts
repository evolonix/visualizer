import gql from 'graphql-tag';
import { DegreedGqlResponse, GraphQLResponse } from '../../_core/graphql';
import { Scale, ScaleLevel } from '../../scales';
import { API as REAL_API } from '../../scales/scales.gql';

const makeGqlResponse = <T>(response: GraphQLResponse<T>): DegreedGqlResponse<T> =>
  ({
    statusText: 'ok',
    data: {
      ...response,
    },
    status: 200,
  }) as DegreedGqlResponse<T>;

export const API = {
  SCALE: {
    // Load list of scales (summary info only; not level details)
    loadSummaries: () =>
      [
        makeGqlResponse({
          data: {
            allRatingSources: {
              edges: [
                {
                  node: {
                    id: 'a13fe666-2519-4151-979d-60206532d4f6',
                    name: 'first rating source',
                    description: 'this describes it to people',
                    isPrimary: false,
                  },
                },
              ],
            },
          },
        }),
        REAL_API.SCALE.loadAll()[1],
      ] as const,
    // Load all of scales (all info including level details)
    loadAll: () => [
      makeGqlResponse({
        data: {
          allRatingSources: {
            edges: [
              {
                node: {
                  id: 'a13fe666-2519-4151-979d-60206532d4f6',
                  name: 'first rating source',
                  description: 'this describes it to people',
                  isPrimary: false,
                  levels: [],
                },
              },
            ],
          },
        },
      }),
      REAL_API.SCALE.loadAll()[1],
    ],
    // Load full scale information (includes all levels)
    load: (scaleId: string) => gql`
      query {
        ratingSources (ratingSourceId: "${scaleId}") {
          id: ratingSourceId
          name
          description
          isPrimary
        }
      }
    `,
    add: ({ name, description }: Scale) => gql`
      mutation {
        addRatingSource(name: "${name}", description: "${description}") {
          id: ratingSourceId
          name
          description
        }
      }
    `,
    delete: ({ id }: Scale) => gql`
      mutation {
        deleteRatingSource(ratingSourceId: "${id}") {
          id: ratingSourceId
          name
          description
        }
      }
    `,
    loadPrimary: () => gql`
      query {
        primaryRatingSource {
          id: ratingSourceId
          name
          description
          isPrimary
        }
      }
    `,

    setAsPrimary: ({ id }: Scale) => gql`
    mutation {
      updatePrimaryRatingSource(ratingSourceId: "${id}") {
        id: ratingSourceId
        name
      }
    }
  `,
  },
  LEVEL: {
    addLevels: (scaleId: string, levels: ScaleLevel[]) => gql`
      mutation {
        addRatingSourceLevels(
          ratingSourceId: "${scaleId}"
          ratingSourceLevels: ${JSON.stringify(levels)}
        ) {
          id: ratingSourceLevelId
          name
          description
        }
      }
    `,
    delete: (scaleId: string, levelId: string) => gql`
      mutation {
        deleteRatingSourceLevel(ratingSourceId: "${scaleId}", ratingSourceLevel: "${levelId}") {
          id: ratingSourceLevelId
          name
          description
        }
      }
    `,
    update: (scaleId: string, level: ScaleLevel) => gql`
      mutation {
        updateRatingSourceLevel(
          ratingSourceLevel: ${JSON.stringify({ ...level, ratingSourceId: scaleId })}        
        ) {
          id: ratingSourceLevelId
          name
          description
          ratingMinimumLevel
          ratingMaximumLevel
        }
      }
    `,
  },
};
