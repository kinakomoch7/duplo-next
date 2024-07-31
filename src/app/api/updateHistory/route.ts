import { NextRequest, NextResponse } from "next/server";
import { pool } from "../Pool";

export async function POST(req: NextRequest) {

  const data = await req.json();
  const client = await pool.connect();

  console.log(data)


  try {
  
    await client.query(`
      UPDATE history
        SET payer_name = $2,
            pay_amount = $3,
            pay_time = $4,
            note = $5
        WHERE history_id = $1
    
      `, [data.historyId, data.payerName, data.amount, data.payTime, data.note]);
  
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