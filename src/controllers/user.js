import * as service from "../services/user";

export const getCurrent = async (req, res) => {
  const { id } = req.user;
  try {
    const response = await service.getOne(id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at user controller: " + error,
    });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.user;
  const payload = req.body;
  try {
    if (!payload)
      return res.status(400).json({ err: 1, msg: "Missing input !!" });
    const response = await service.updateUser(payload, id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at user controller: " + error,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const status = req.query.status;
    const limitCount = req.query.limitCount;
    const response = await service.getAllUsers(page, status, limitCount);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at getUsers controller: " + error,
    });
  }
};

export const blockUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const { id } = req.user;

    const response = await service.blockUserService(targetId, id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed to block user: " + error.message,
    });
  }
};
