import bcrypt from "bcrypt";
import {
  UserModel,
  saltRounds,
  userInitialData,
} from "../app/models/UserModel";

export const initialDb = () => {
  UserModel.count((_: any, count: number) => {
    if (count === 0) {
      userInitialData.forEach((userData) => {
        UserModel.create({
          ...userData,
          password: bcrypt.hashSync(userData.password, saltRounds),
        });
      });
    }
  });
};
