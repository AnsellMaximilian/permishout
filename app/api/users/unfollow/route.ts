import permit from "@/lib/permit";
import { PermishoutUserAttributes } from "@/types/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const POST = async (request: NextRequest) => {
  const { userId } = getAuth(request) || "";

  if (!userId) return NextResponse.json({ success: false }, { status: 403 });
  const { userToUnfollowKey } = await request.json();

  const currentUser = await permit.api.getUser(userId);

  try {
    const userToUnfollow = await permit.api.getUser(userToUnfollowKey);

    if (userToUnfollow.key === currentUser.key)
      return NextResponse.json({
        success: false,
        message: "You cannot unfollow yourself",
      });

    await permit.api.roleAssignments.unassign({
      user: userToUnfollow.key,
      role: "followed",
      resource_instance: `profile:profile_${currentUser.key}`,
      tenant: "default",
    });

    const userToUnfollowAttrs =
      userToUnfollow.attributes as PermishoutUserAttributes;
    return NextResponse.json({
      success: true,
      message: `Unfollowed user @${userToUnfollowAttrs.username}`,
    });
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        message: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 400 }
    );
  }
};

export { POST };
