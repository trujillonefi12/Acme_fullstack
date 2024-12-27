import { db } from "@vercel/postgres";
import { NextResponse } from "next/server";

async function listInvoices() {
  const client = await db.connect();
  try {
    const data = await client.sql`
      SELECT invoices.amount, customers.name
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE invoices.amount = 666;
    `;

    return data.rows;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw new Error("Failed to fetch invoices");
  } finally {
    client.release(); // Always release the client after usage
  }
}

export async function GET() {
  try {
    const invoices = await listInvoices();
    return NextResponse.json({ invoices });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
