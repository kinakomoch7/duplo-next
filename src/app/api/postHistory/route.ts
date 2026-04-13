import { NextRequest, NextResponse } from "next/server";
import { pool } from "../Pool";
import {
  getEventIdByPageId,
  normalizeIsIncluded,
} from "../historyHelpers";

export async function POST(req: NextRequest) {

  const data = await req.json();
  const client = await pool.connect();


  try {
    const eventId = data.pageId
      ? await getEventIdByPageId(client, data.pageId)
      : data.eventId;

    if (!eventId) {
      return NextResponse.json({
          message: "event not found"
        }, {
          status: 404
        }
      );
    }
  
    await client.query(`
      INSERT INTO
        history(
          event_id,
          payer_name,
          pay_amount,
          pay_time,
          note,
          is_included
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6
        )
    
      `, [
        eventId,
        data.payerName,
        data.amount,
        data.payTime,
        data.note,
        normalizeIsIncluded(data.isIncluded),
      ]);
  
    return NextResponse.json({
        message: "success"
      }, {
        status: 200
      }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json({
        message: error
      }, {
        status: 500
      }
    );
  } finally {
    client.release();
  }
}
