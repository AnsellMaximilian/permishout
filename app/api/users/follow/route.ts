import permit from "@/lib/permit";
import { PermishoutUserAttributes } from "@/types/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const POST = async (request: NextRequest) => {
  const { userId } = getAuth(request) || "";

  if (!userId) return NextResponse.json({ success: false }, { status: 403 });
  const { userToFollowKey } = await request.json();

  const currentUser = await permit.api.getUser(userId);

  try {
    const userToFollow = await permit.api.getUser(userToFollowKey);

    if (userToFollow.key === currentUser.key)
      return NextResponse.json({
        success: false,
        message: "You cannot follow yourself",
      });

    await permit.api.roleAssignments.assign({
      user: userToFollow.key,
      role: "followed",
      resource_instance: `profile:profile_${currentUser.key}`,
      tenant: "default",
    });

    await permit.api.roleAssignments.assign({
      user: currentUser.key,
      role: "follower",
      resource_instance: `profile:profile_${userToFollow.key}`,
      tenant: "default",
    });

    const userToFollowAttrs =
      userToFollow.attributes as PermishoutUserAttributes;
    return NextResponse.json({
      success: true,
      message: `Followed user @${userToFollowAttrs.username}`,
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
