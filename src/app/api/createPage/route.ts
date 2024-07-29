import { NextRequest, NextResponse } from "next/server";
import { pool } from "../Pool";

export async function POST(req: NextRequest) {

  try {
    const data = await req.json();

    // const name = formData.get("username");
    // const email = formData.get("password");
  
    console.log(data);
  
    // const client = await pool.connect();
  
    // const comment = formData.get("comment");
    // await client.query("INSERT INTO comments (comment) VALUES ($1)", [comment]);
  
    return NextResponse.json({ message: "success" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "error" });
  }
}