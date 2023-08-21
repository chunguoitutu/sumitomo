import { get } from "lodash";
import { NextResponse } from "next/server";
import { UserModel } from "~/server/app/models/UserModel";
import { connectToDB } from "~/server/db/connect";
import { MESSAGE_500 } from "~/ultis/constants/common";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const newReq = await req.json();

    const page = get(newReq, ["pagination", "page"], 1);
    const rowsPerPage = get(newReq, ["pagination", "rowsPerPage"], 10);

    const match = {};
    const rows = await UserModel.aggregate(
      [
        {
          $match: match,
        },
        {
          $skip: (+page - 1) * rowsPerPage,
        },
        {
          $limit: +rowsPerPage,
        },
        { $unset: "password" },
      ],
      { allowDiskUse: true }
    );

    const count = await UserModel.aggregate([
      {
        $match: match,
      },
      {
        $count: "total",
      },
    ]);

    const total = count[0] ? count[0].total : 0;

    return NextResponse.json({
      error: false,
      message: "success",
      data: {
        rows,
        pagination: {
          page,
          rowsPerPage,
          total,
        },
      },
    });
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: MESSAGE_500,
    });
  }
}
