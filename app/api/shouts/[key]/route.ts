import permit from "@/lib/permit";
import { ShoutAttributes } from "@/types/shout";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) => {
  const { key: shoutKey } = await params;

  try {
    const shout = await permit.api.resourceInstances.getByKey(
      `shout:${shoutKey}`
    );

    const shoutAttrs = shout.attributes as ShoutAttributes;

    return NextResponse.json({
      key: shoutKey,
      ...shoutAttrs,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Shout not found",
      },
      { status: 404 }
    );
  }
};

const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) => {
  const { key: shoutKey } = await params;
  const { userId } = getAuth(request);

  try {
    const shout = await permit.api.resourceInstances.getByKey(
      `shout:${shoutKey}`
    );

    const isUserAllowedToDelete = await permit.check(userId || "", "delete", {
      type: "shout",
      key: shout.key,
    });

    if (!isUserAllowedToDelete) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not allowed to delete this shout",
        },
        { status: 403 }
      );
    }

    await permit.api.resourceInstances.delete(`shout:${shout.key}`);

    const shoutAttrs = shout.attributes as ShoutAttributes;

    return NextResponse.json({
      key: shoutKey,
      ...shoutAttrs,
    });
  } catch (e) {
    console.log("SWAGGER");
    return NextResponse.json(
      {
        success: false,
        message: e instanceof Error ? e.message : "Shout not found",
      },
      { status: 404 }
    );
  }
};

export { GET, DELETE };
