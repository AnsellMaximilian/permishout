import permit from "@/lib/permit";
import { PermishoutUserAttributes } from "@/types/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const userId = searchParams.get("user");

    if (!userId) {
      return NextResponse.json(
        { error: "No userId provided." },
        { status: 400 }
      );
    }

    const resourcesAndActions = JSON.parse(
      searchParams.get("resourcesAndActions") || "[]"
    );

    const checkPermissions = async (resourceAndAction: {
      resource: string;
      action: string;
      userAttributes?: PermishoutUserAttributes;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resourceAttributes?: Record<string, any>;
    }) => {
      const { resource, action, userAttributes, resourceAttributes } =
        resourceAndAction;

      return permit.check(
        {
          key: userId,
          attributes: userAttributes,
        },
        action,
        {
          type: resource,
          attributes: resourceAttributes,
          tenant: "default",
        }
      );
    };

    const permittedList = await Promise.all(
      resourcesAndActions.map(checkPermissions)
    );

    return NextResponse.json({ permittedList }, { status: 200 });
  } catch (error) {
    console.error("Permission check error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
