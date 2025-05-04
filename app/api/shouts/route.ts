import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import permit from "@/lib/permit";
import {
  isValidReplyMode,
  Shout,
  ShoutAttributes,
  ShoutReplyType,
} from "@/types/shout";
import { v4 as uuidv4 } from "uuid";
import { PermishoutUserAttributes } from "@/types/user";
import { getPermishoutUsers, joinName, sortByDateDesc } from "@/lib/utils";

const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const shouterkey = searchParams.get("shouterKey");
  const replyTo = searchParams.get("replyTo");

  try {
    const shouts = await permit.api.resourceInstances.list({
      resource: "shout",
      tenant: "default",
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

    // if replyTo is provided, filter the shoutList
    if (replyTo) {
      const filteredShouts = shoutList.filter(
        (shout) => shout.replyTo === replyTo
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
  const { content, replyMode, replyTo } = await request.json();

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
      replyMode: replyTo ? ShoutReplyType.EVERYONE : replyMode,
      name: joinName(permitUser.first_name, permitUser.last_name),
      userId,
      createdAt: new Date().toISOString(),
      username: userAttrs?.username || "",
      replyTo: replyTo || undefined,
    };

    if (replyTo && replyMode !== ShoutReplyType.EVERYONE && !permit.check) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not allowed to reply to his message",
        },
        { status: 403 }
      );
    }
    const shout = await permit.api.resourceInstances.create({
      resource: "shout",
      key: shoutKey,
      tenant: "default",
      attributes: shoutAttrs,
    });

    // if reply mode is for people mentioned
    if (replyMode === ShoutReplyType.MENTIONED) {
      const users = await permit.api.users.list({ perPage: 100 });

      const permishoutUsers = getPermishoutUsers(users.data);

      // Extract all @usernames from the content
      const mentionRegex = /@(\w+)/g;
      const matches = Array.from(
        content.matchAll(mentionRegex)
      ) as RegExpMatchArray[];

      const mentionedUsernames = matches.map((match) => match[1]);

      // Deduplicate
      const uniqueUsernames = [...new Set(mentionedUsernames)];

      // Match usernames to Permit users
      const mentionedUsers = permishoutUsers.filter((user) =>
        uniqueUsernames.includes(user.username)
      );

      // Assign role for each
      for (const user of mentionedUsers) {
        await permit.api.roleAssignments.assign({
          user: user.key,
          role: "mentioned",
          resource_instance: `shout:${shoutKey}`,
          tenant: "default",
        });
      }
    } else if (replyMode === ShoutReplyType.ADMIN) {
      const users = await permit.api.users.list({ perPage: 100 });
      const admins = users.data.filter((user) =>
        user.roles?.some((r) => r.role === "admin")
      );
      for (const user of admins) {
        await permit.api.roleAssignments.assign({
          user: user.key,
          role: "mentioned",
          resource_instance: `shout:${shoutKey}`,
          tenant: "default",
        });
      }
    }

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
