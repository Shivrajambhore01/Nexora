import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const result = await db.collection("history").insertOne(body);

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error: any) {
    console.error("POST /api/history error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save history" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const history = await db.collection("history").find({}).toArray();

    return NextResponse.json({ success: true, data: history });
  } catch (error: any) {
    console.error("GET /api/history error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch history" },
      { status: 500 }
    );
  }
}
