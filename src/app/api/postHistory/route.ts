import { NextRequest, NextResponse } from "next/server";
import { pool } from "../Pool";

export async function POST(req: NextRequest) {

  const data = await req.json();
  const client = await pool.connect();

  console.log(typeof data.payTime);

  try {
  
    await client.query(`
      INSERT INTO
        history(
          event_id,
          payer_name,
          pay_amount,
          pay_time,
          note
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5
        )
    
      `, [data.eventId, data.payerName, data.amount, data.payTime, data.note]);
  
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