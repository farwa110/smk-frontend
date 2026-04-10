import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Ikke logget ind" }, { status: 401 });
    }
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: { role: "admin" },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("SET ADMIN ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
