import { NextResponse } from "next/server";
import { UserModel } from "~/server/app/models/UserModel";
import { connectToDB } from "~/server/db/connect";
import { MESSAGE_500 } from "~/ultis/constants/common";
import bcrypt from "bcrypt";
import * as jose from "jose";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectToDB();

    const { email, password } = await req.json();

    // Check fields required
    if (!email || !password) {
      const messageArray = [];
      !email && messageArray.push("Email is required.");
      !password && messageArray.push("Password is required.");

      return NextResponse.json({
        error: true,
        message: messageArray.join(" "),
      });
    }

    // Find email matches
    const user = await UserModel.findOne({ email }).select("+password");

    if (!user || !user?.active) {
      return NextResponse.json({
        error: true,
        message: "Email and password are not valid.",
      });
    }

    // Check password matches
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return NextResponse.json({
        error: true,
        message: "Email and password are not valid.",
      });
    }

    const userWithoutPassword: any = {
      ...user.toObject(),
    };
    delete userWithoutPassword.password;

    const token = jwt.sign(
      {
        data: userWithoutPassword,
      },
      process.env.JWT_SECRET || ""
    );

    // Set cookie
    cookies().set("token", token);

    return NextResponse.json({
      error: false,
      token: token,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: true,
      message: error?.message || MESSAGE_500,
    });
  }
}
