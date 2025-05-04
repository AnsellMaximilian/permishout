import permit from "@/lib/permit";
import { joinName } from "@/lib/utils";
import { PermishoutUser, PermishoutUserAttributes } from "@/types/user";
import { NextResponse } from "next/server";

const GET = async () => {
  try {
    const users = await permit.api.users.list({ perPage: 100 });

    const permiShoutUsers = users.data.map((user) => {
      const attrs = user.attributes as PermishoutUserAttributes | undefined;

      const permishoutUser: PermishoutUser = {
        key: user.key,
        createdAt: user.created_at,
        email: user.email || "",
        name: joinName(user.first_name, user.last_name),
        country: attrs?.country || "",
        username: attrs?.username || "",
        yearBorn: attrs?.yearBorn || 1990,
        roles: user.roles?.map((r) => r.role) || [],
      };
      return permishoutUser;
    });
    return NextResponse.json(permiShoutUsers);
  } catch {
    return NextResponse.json(
      { success: false, message: "Unknown error" },
      { status: 400 }
    );
  }
};
export { GET };
