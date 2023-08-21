import { NextResponse } from "next/server";
import { connectToDB } from "~/server/db/connect";
import { MESSAGE_500 } from "~/ultis/constants/common";

import { DocumentModel } from "~/server/app/models/DocumentModel";

export async function POST(req: Request) {
  try {
    await connectToDB();

    console.log("Processing...");

    const { from, to } = await req.json();

    let newTo: Date | string | undefined;

    if (to) {
      newTo = new Date(to);
      newTo.setDate(newTo?.getDate() + 1);
      newTo = newTo.toISOString();
    }
    const matchesCreatedAtArr = [];
    from && matchesCreatedAtArr.push(["$gt", new Date(from)]);
    newTo && matchesCreatedAtArr.push(["$lt", new Date(newTo)]);

    const matches = matchesCreatedAtArr.length
      ? {
          createdAt: Object.fromEntries(matchesCreatedAtArr),
        }
      : {};

    const data = await DocumentModel.aggregate([
      {
        $match: matches,
      },
      { $group: { _id: "$analyzedStatus", count: { $sum: 1 } } },
    ]);

    const total = data.reduce((a, b) => a + b.count, 0);
    const result = data.reduce(
      (a, b) => {
        return {
          ...a,
          [b._id]: b.count,
        };
      },
      { total }
    );

    return NextResponse.json({
      error: false,
      message: "success",
      data: result,
    });
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: MESSAGE_500,
    });
  }
}
