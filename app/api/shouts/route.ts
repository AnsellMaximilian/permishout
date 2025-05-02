import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import permit from "@/lib/permit";
import { isValidReplyMode, Shout, ShoutAttributes } from "@/types/shout";
import { v4 as uuidv4 } from "uuid";
import { PermishoutUserAttributes } from "@/types/user";
import { joinName, sortByDateDesc } from "@/lib/utils";

const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const shouterkey = searchParams.get("shouterKey");

  try {
    const shouts = await permit.api.resourceInstances.list({
      resource: "shout",
      tenant: "default",
      // filter: {
      //   subject: `profile:profile_${userId}`,
      // },
    });
    const shoutList: Shout[] = shouts.map((shout) => {
      const shoutAttrs = shout.attributes as ShoutAttributes;

      return {
        key: shout.key,
        ...shoutAttrs,
      };
    });
    // if shouterkey is provided, filter the shoutList
    if (shouterkey) {
      const filteredShouts = shoutList.filter(
        (shout) => shout.userId === shouterkey
      );
      // filter by createdAt in descending order
      return NextResponse.json(sortByDateDesc(filteredShouts, "createdAt"));
    }
    // if shouterkey is not provided, return all shouts
    return NextResponse.json(sortByDateDesc(shoutList, "createdAt"));
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

const POST = async (request: NextRequest) => {
  const { userId } = getAuth(request) || "";

  if (!userId) return NextResponse.json({ success: false }, { status: 403 });
  const { content, replyMode } = await request.json();

  if (!isValidReplyMode(replyMode) || !content)
    return NextResponse.json({ success: false }, { status: 400 });
  const permitUser = await permit.api.getUser(userId);

  const shoutKey = `shout_${uuidv4()}`;

  try {
    const userAttrs = permitUser.attributes as
      | PermishoutUserAttributes
      | undefined;

    const shoutAttrs: ShoutAttributes = {
      content,
      replyMode,
      name: joinName(permitUser.first_name, permitUser.last_name),
      userId,
      createdAt: new Date().toISOString(),
      username: userAttrs?.username || "",
    };
    const shout = await permit.api.resourceInstances.create({
      resource: "shout",
      key: shoutKey,
      tenant: "default",
      attributes: shoutAttrs,
    });

    console.log("Created shout", shout);

    await permit.api.roleAssignments.assign({
      user: permitUser.key,
      role: "shouter",
      resource_instance: `shout:${shoutKey}`,
      tenant: "default",
    });

    console.log("Set role assignment");
    console.log("Trying to set up relationship with " + userId);
    await permit.api.relationshipTuples.create({
      object: `shout:${shoutKey}`,
      relation: "parent",
      subject: `profile:profile_${userId}`,
      tenant: "default",
    });

    console.log("created relationship");

    const responseShout: Shout = {
      key: shout.key,
      ...(shout.attributes as ShoutAttributes),
    };

    console.log(responseShout);
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

export { POST, GET };
