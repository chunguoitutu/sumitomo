import jwt, { JwtPayload } from "jsonwebtoken";
import { UserModel } from "~/server/app/models/UserModel";

export async function verifyToken(token: string = "") {
  const { data } = jwt.verify(
    token,
    process.env.JWT_SECRET || ""
  ) as JwtPayload;

  const currentUser = await UserModel.findById(data._id);

  if (!currentUser) {
    throw new Error("User not found");
  }

  return currentUser.toObject();
}
