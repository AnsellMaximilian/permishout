import permit from "@/lib/permit";
import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    checkShout: await permit.check(
      "user_2wXYc2FqUp04xGvq7c1r52ALcdR",
      "reply",
      "shout:shout_979723d8-8e78-4066-996c-fee2c4da7f04"
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
  });
};
