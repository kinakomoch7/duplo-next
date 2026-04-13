import { NextRequest, NextResponse } from "next/server";
import { pool } from "../Pool";
import { getEventIdByPageId } from "../historyHelpers";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const client = await pool.connect();

  try {
    if (!data.pageId) {
      return NextResponse.json({ message: "pageId is required" }, { status: 400 });
    }

    if (!Array.isArray(data.historyIds) || data.historyIds.length === 0) {
      return NextResponse.json({ message: "historyIds are required" }, { status: 400 });
    }

    const eventId = await getEventIdByPageId(client, data.pageId);

    if (!eventId) {
      return NextResponse.json({ message: "event not found" }, { status: 404 });
    }

    await client.query(
      `
        UPDATE history
        SET is_included = true
        WHERE event_id = $1
          AND history_id = ANY($2::int[])
          AND is_included = false
      `,
      [eventId, data.historyIds]
    );

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "error" }, { status: 500 });
  } finally {
    client.release();
  }
}
