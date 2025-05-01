import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import permit from "@/lib/permit";
import { clerkClient } from "@/lib/clerk";
import { splitName } from "@/lib/utils";

const GET = async (request: NextRequest) => {
  const { userId } = getAuth(request) || "";

  const user = await permit.api.users.get(userId || "");

  if (!user) {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json(user);
};

const POST = async (request: NextRequest) => {
  const { userId } = getAuth(request) || "";
  const user = await clerkClient.users.getUser(userId || "");
  const { username, name, yearBorn, country } = await request.json();

  const { firstName, lastName } = splitName(name);
  await clerkClient.users.updateUser(userId || "", {
    firstName,
    lastName,
  });

  let currentTime = new Date().getTime();

  const { key: createdUser } = await permit.api.syncUser({
    key: userId || "",
    first_name: firstName,
    last_name: lastName,
    email: user?.emailAddresses[0].emailAddress || "",
    attributes: {
      username,
      yearBorn: parseInt(yearBorn),
      country,
    },
  });

  console.log(
    "Created User - Time: %d s",
    (new Date().getTime() - currentTime) / 1000
  );
  currentTime = new Date().getTime();

  await permit.api.roleAssignments.assign({
    user: createdUser,
    role: "owner",
    resource_instance: `profile:profile_${createdUser}`,
    tenant: "default",
  });

  console.log(
    "Assigned Owner Role - Time: %d s",
    (new Date().getTime() - currentTime) / 1000
  );

  return NextResponse.json({
    success: true,
  });
};

export { GET, POST };
