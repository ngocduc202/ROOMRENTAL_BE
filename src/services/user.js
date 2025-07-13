import db from "../models";

export const getOne = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOne({
        where: { id },
        raw: true,
        attributes: {
          exclude: ["password"],
        },
      });
      resolve({
        err: response ? 0 : 1,
        msg: response ? "Success" : "Fail to get user",
        response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateUser = (payload, id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.update(payload, {
        where: { id },
      });
      resolve({
        err: response[0] > 0 ? 0 : 1,
        msg: response[0] > 0 ? "Updated" : "Fail to update user",
        response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllUsers = (page, status, limitCount) =>
  new Promise(async (resolve, reject) => {
    try {
      const limit = +limitCount || 10;
      const currentPage = !page || +page <= 1 ? 1 : +page;
      const offset = (currentPage - 1) * limit;
      const whereCondition = {};
      if (status == 0 || status == 1) {
        whereCondition.isBlocked = +status;
      }

      const response = await db.User.findAndCountAll({
        where: whereCondition,
        attributes: { exclude: ["password"] },
        order: [["createdAt", "DESC"]],
        limit,
        offset,
        raw: true,
        nest: true,
      });

      const totalBlockedUser = await db.User.count({
        where: { isBlocked: 1 },
      });

      resolve({
        err: response ? 0 : 1,
        msg: response ? "Success" : "Failed to get users",
        users: response.rows,
        pagination: {
          total: response.count,
          pageSize: limit,
          currentPage,
          totalPages: Math.ceil(response.count / limit),
        },
        totalBlockedUser,
      });
    } catch (error) {
      reject(error);
    }
  });

export const blockUserService = (targetId, currentUserId) =>
  new Promise(async (resolve, reject) => {
    try {
      if (targetId === currentUserId) {
        return resolve({
          err: 3,
          msg: "Bạn không thể tự block chính mình!",
        });
      }

      const user = await db.User.findByPk(targetId);

      if (!user) {
        return resolve({
          err: 1,
          msg: "Không tìm thấy user",
        });
      }

      if (user.isBlocked) {
        return resolve({
          err: 2,
          msg: "User này đã bị khóa rồi!",
        });
      }

      await db.User.update({ isBlocked: true }, { where: { id: targetId } });

      resolve({
        err: 0,
        msg: "Block user thành công!",
      });
    } catch (error) {
      reject(error);
    }
  });
