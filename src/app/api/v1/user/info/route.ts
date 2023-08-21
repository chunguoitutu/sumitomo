import { NextResponse } from "next/server";
import { IS_PRODUCTION, MESSAGE_500 } from "~/ultis/constants/common";
import { verifyToken } from "~/ultis/helper/verify";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const token = cookies().get("token")?.value || "";
    const currentUser = await verifyToken(token);

    return NextResponse.json({
      erorr: false,
      message: "success",
      data: currentUser,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: true,
      message: MESSAGE_500,
      error1: error?.message,
    });
  }
}
