import { get } from "lodash";
import { NextResponse } from "next/server";
import { UserModel, userRole } from "~/server/app/models/UserModel";
import { connectToDB } from "~/server/db/connect";
import { MESSAGE_500 } from "~/ultis/constants/common";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { email, firstname, lastname, password, isActive, isAdmin } =
      await req.json();
    const roles = !!isAdmin ? [userRole.ADMIN] : [userRole.USER];

    // Validate the information
    await UserModel.validate({
      email,
      firstname,
      lastname,
      password,
      active: !!isActive,
      roles,
    });

    const pwdHashed = bcrypt.hashSync(password, 10);
    const user = await UserModel.create({
      email,
      firstname,
      lastname,
      roles,
      active: !!isActive,
      password: pwdHashed,
    });

    const userWithoutPassword: any = { ...user.toObject() };
    delete userWithoutPassword.password;

    return NextResponse.json({
      error: false,
      message: "success",
      info: userWithoutPassword,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: true,
      message: error?.message || MESSAGE_500,
    });
  }
}
