import permit from "@/lib/permit";
import { ShoutAttributes } from "@/types/shout";
import { NextRequest, NextResponse } from "next/server";

const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) => {
  const { key: shoutKey } = await params;
  console.log({ shoutKey });

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

export { GET };
