import type { PoolClient } from "pg";

export const getEventIdByPageId = async (client: PoolClient, pageId: string) => {
  const result = await client.query(
    `
      SELECT event_id
      FROM treat
      WHERE url = $1
      LIMIT 1
    `,
    [pageId]
  );

  return result.rows[0]?.event_id ?? null;
};

export const normalizeIsIncluded = (value: unknown) => value !== false;
