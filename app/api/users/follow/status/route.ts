import permit from "@/lib/permit";
import { NextRequest, NextResponse } from "next/server";

const GET = async (req: NextRequest) => {
  const { searchParams } = req.nextUrl;
  const userKey = searchParams.get("userKey");
  try {
    if (!userKey) throw new Error("Missing userKey");

    const roles = await permit.api.getAssignedRoles(userKey);

    const following = roles
      .filter((r) => r.role === "follower")
      .map((r) => {
        const profileKey = r.resource_instance?.split("profile_")[1];
        return profileKey || null;
      })
      .filter(Boolean);

    const followers = roles
      .filter((r) => r.role === "followed")
      .map((r) => {
        const profileKey = r.resource_instance?.split("profile_")[1];
        return profileKey || null;
      })
      .filter(Boolean);

    return NextResponse.json({ followers, following });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ followers: [], following: [] }, { status: 400 });
  }
};

export { GET };
