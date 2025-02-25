import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../Pool";

export async function GET(req: NextRequest, { params }: { params: { eventId: string } }) {
  const eventId = params.eventId;

  try {
    // 直接 pool.query を使い、接続の確立と解放を自動化
    const result = await pool.query(
      `
      SELECT
        t.url,
        t.last_edit,
        h.history_id,
        h.payer_name,
        h.pay_amount,
        h.pay_time,
        h.note
      FROM
        treat t
      JOIN
        history h
      ON
        t.event_id = h.event_id
      WHERE
        t.url = $1
      `,
      [eventId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "error" });
  }
}
