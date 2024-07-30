import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../Pool";

export async function GET(req: NextRequest, {params}: {params:{ eventId: string }}) {

  const eventId = params.eventId;

  try {

    const client = await pool.connect();
    const result = await client.query(`
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
    `, [eventId]);

    client.release();

    const data = result.rows;

    return NextResponse.json(data);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "error" });
  }
}