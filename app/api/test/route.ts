import permit from "@/lib/permit";
import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    checkShout: await permit.check(
      "user_2wXYc2FqUp04xGvq7c1r52ALcdR",
      "reply",
      "shout:shout_008f7ff3-6e0c-402d-ace4-cdefbea8a0c4"
    ),
    checkAdmin: await permit.check(
      "user_2wXYc2FqUp04xGvq7c1r52ALcdR",
      "create",
      "topic"
    ),

    checkShoutComplete: await permit.check(
      {
        key: "user_2wXYc2FqUp04xGvq7c1r52ALcdR",
      },
      "reply",
      {
        type: "shout:shout_979723d8-8e78-4066-996c-fee2c4da7f04",
      }
    ),
    followed: await permit.api.getAssignedRoles(
      "user_2wTvO4ZXJulS1YoK2SIjRoogEGP"
    ),
    follower: await permit.api.getAssignedRoles(
      "user_2wXYc2FqUp04xGvq7c1r52ALcdR"
    ),
  });
};
