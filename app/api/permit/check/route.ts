import permit from "@/lib/permit";
import { PermishoutUserAttributes } from "@/types/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const userId = searchParams.get("user");

    const { resourcesAndActions } = await req.json();

    console.log({ resourcesAndActions });

    if (!userId) {
      return NextResponse.json(
        { error: "No userId provided." },
        { status: 400 }
      );
    }

    const checkPermissions = async (resourceAndAction: {
      resource: string;
      action: string;
      userAttributes?: PermishoutUserAttributes;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resourceAttributes?: Record<string, any>;
    }) => {
      const { resource, action, userAttributes, resourceAttributes } =
        resourceAndAction;

      const [resourceType, resourceKey] = resource.split(":");

      console.log(
        `Checking permission for ${userId} on ${resourceKey} for action ${action}. Type: ${resourceType}`
      );

      return permit.check(
        {
          key: userId,
          attributes: userAttributes,
        },
        action,
        {
          type: resourceType,
          key: resourceKey,
          attributes: resourceAttributes,
          tenant: "default",
        }
      );
    };

    const permittedList = await Promise.all(
      resourcesAndActions.map(checkPermissions)
    );

    console.log("Permitted List: ", permittedList);

    return NextResponse.json({ permittedList }, { status: 200 });
  } catch (error) {
    console.error("Permission check error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
