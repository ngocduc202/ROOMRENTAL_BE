import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import db from "../models";
require("dotenv").config();

const hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const registerService = ({ phone, password, name, role }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOrCreate({
        where: { phone },
        defaults: {
          id: v4(),
          phone,
          name,
          password: hashPassword(password),
          role: role || "user",
        },
      });

      const isNewUser = response[1];
      const user = response[0];

      const token = isNewUser
        ? jwt.sign(
            {
              id: user.id,
              phone: user.phone,
              role: user.role,
            },
            process.env.SECRET_KEY,
            { expiresIn: "2d" }
          )
        : null;

      resolve({
        err: token ? 0 : 2,
        msg: token ? "Register is successfully!" : "Phone number is existed!",
        token: token || null,
        user: token
          ? {
              id: user.id,
              name: user.name,
              phone: user.phone,
              role: user.role,
            }
          : null,
      });
    } catch (error) {
      reject(error);
    }
  });

//create login
export const loginService = ({ phone, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOne({
        where: { phone },
        raw: true,
      });

      if (response) {
        const checkPassword = bcrypt.compareSync(password, response.password);

        if (checkPassword) {
          const token = jwt.sign(
            {
              id: response.id,
              phone: response.phone,
              role: response.role,
            },
            process.env.SECRET_KEY,
            { expiresIn: "2d" }
          );

          resolve({
            err: 0,
            msg: "Login successfully!",
            token: token,
            user: {
              id: response.id,
              name: response.name,
              phone: response.phone,
              role: response.role,
            },
          });
        } else {
          resolve({
            err: 1,
            msg: "Sai mật khẩu!",
          });
        }
      } else {
        resolve({
          err: 2,
          msg: "Số điện thoại không tồn tại!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
