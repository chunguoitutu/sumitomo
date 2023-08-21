import mongoose, { Document, Schema, Model, model } from "mongoose";

export const userRole = {
  ADMIN: "admin",
  USER: "user",
};

export interface IUser extends Document {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  roles: string[];
  active?: boolean;
}

export const saltRounds = 10;

const userSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      enum: [userRole.ADMIN, userRole.USER],
      default: [userRole.USER],
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel: Model<IUser> =
  mongoose.models.User || model("User", userSchema);

export const userInitialData = [
  {
    email: "admin@example.com",
    password: "admin@123",
    firstname: "admin",
    lastname: "sumitomo",
    roles: ["admin"],
  },
];
