import { NextRequest, NextResponse } from "next/server";
import { pool } from "../Pool";

export async function POST(req: NextRequest) {

  const data = await req.json();
  const client = await pool.connect();

  try {
  
    await client.query(`
      DELETE FROM history WHERE history_id = $1
      `, [data.historyId]);
  
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