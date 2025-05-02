import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import permit from "@/lib/permit";
import { isValidReplyMode, Shout, ShoutReplyType } from "@/types/shout";
import { v4 as uuidv4 } from "uuid";
import { PermishoutUserAttributes } from "@/types/user";

const POST = async (request: NextRequest) => {
  const { userId } = getAuth(request) || "";

  if (!userId) return NextResponse.json({ success: false }, { status: 403 });
  const { content, replyMode } = await request.json();

  if (!isValidReplyMode(replyMode) || !content)
    return NextResponse.json({ success: false }, { status: 400 });
  const permitUser = await permit.api.getUser(userId);

  const shoutKey = `shout_${uuidv4()}`;

  try {
    const shout = await permit.api.resourceInstances.create({
      resource: "shout",
      key: shoutKey,
      tenant: "default",
      attributes: {
        content,
        replyMode,
      },
    });

    console.log("Created shout", shout);

    const shoutAttrs = shout.attributes as {
      content: string;
      replyMode: ShoutReplyType;
    };

    await permit.api.roleAssignments.assign({
      user: permitUser.key,
      role: "shouter",
      resource_instance: `shout:${shoutKey}`,
      tenant: "default",
    });

    console.log("Set role assignment");
    console.log("Trying to set up relationship with " + userId);
    await permit.api.relationshipTuples.create({
      subject: `shout:${shoutKey}`,
      relation: "belongs",
      object: `profile:profile_${userId}`,
      tenant: "default",
    });

    console.log("created relationship");

    const attrs = permitUser.attributes as PermishoutUserAttributes | undefined;

    const responseShout: Omit<Shout, "key"> = {
      content: shoutAttrs.content,
      replyMode: shoutAttrs.replyMode,
      createdAt: new Date().toISOString(),
      name: permitUser.first_name || "" + permitUser.last_name || "",
      userId,
      username: attrs?.username || "",
    };
    return NextResponse.json(responseShout);
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
