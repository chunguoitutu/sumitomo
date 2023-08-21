import bcrypt from "bcrypt";
import { isValidObjectId } from "mongoose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { IUser, UserModel, saltRounds } from "~/server/app/models/UserModel";
import { connectToDB } from "~/server/db/connect";
import { GUEST_TOKEN, MESSAGE_500 } from "~/ultis/constants/common";
import { handleGetPriority } from "~/ultis/helper/common";
import * as jose from "jose";

export async function DELETE(req: Request) {
  const id = req.url.split("/").reverse()[0];
  const token = cookies().get("token")?.value || "";

  const { payload: dataToken } = await jose.jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET || "")
  );
  const userRequest = (dataToken.data as IUser) || ({} as IUser);

  if (!isValidObjectId(id)) {
    return NextResponse.json({
      error: true,
      message: `User id "${id}" not found`,
    });
  }

  try {
    await connectToDB();

    const userWantDelete = await UserModel.findById(id);

    if (!userWantDelete) {
      return NextResponse.json({
        error: true,
        message: `User id "${id}" not found`,
      });
    }

    const priorityUserDeleted = handleGetPriority(userWantDelete.roles);
    const priorityUserRequest = handleGetPriority(userRequest.roles);

    if (priorityUserRequest > priorityUserDeleted) {
      const { deletedCount } = await UserModel.deleteOne({ _id: id });

      if (!deletedCount) {
        return NextResponse.json({
          error: true,
          message: "Cannot delete user!",
        });
      }

      return NextResponse.json({
        error: false,
        message: "success",
      });
    } else {
      return NextResponse.json({
        error: true,
        message: GUEST_TOKEN,
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      error: true,
      message: error?.message || MESSAGE_500,
    });
  }
}

export async function PUT(req: Request) {
  const id = req.url.split("/").reverse()[0];
  const token = cookies().get("token")?.value || "";

  if (!isValidObjectId(id)) {
    return NextResponse.json({
      error: true,
      message: `User id "${id}" not found`,
    });
  }

  try {
    const value = await req.json();

    const { payload: dataToken } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || "")
    );
    const userRequest = (dataToken.data as IUser) || ({} as IUser);

    const userWantUpdate = await UserModel.findById(id);

    if (!userWantUpdate) {
      return NextResponse.json({
        error: true,
        message: `User id "${id}" not found`,
      });
    }

    const priorityUserUpdate = handleGetPriority(userWantUpdate.roles);
    const priorityUserRequest = handleGetPriority(userRequest.roles);

    if (priorityUserRequest > priorityUserUpdate || id === userRequest._id) {
      const { password } = value;
      const userAfterUpdate = await UserModel.findByIdAndUpdate(
        { _id: id },
        {
          ...value,
          ...(value.password
            ? { password: bcrypt.hashSync(password, saltRounds) }
            : {}),
        }
      );

      if (!userAfterUpdate) {
        return NextResponse.json({
          error: true,
          message: MESSAGE_500,
        });
      }

      return NextResponse.json({
        error: false,
        message: "success",
      });
    } else {
      return NextResponse.json({
        error: true,
        message: GUEST_TOKEN,
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      error: true,
      message: error?.message || MESSAGE_500,
    });
  }
}
