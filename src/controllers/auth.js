import * as authService from "../services/auth";

const register = async (req, res) => {
  const { name, password, phone, role } = req.body;
  try {
    if (!name || !password || !phone) {
      return res.status(400).json({
        err: 1,
        msg: "Missing input !",
      });
    }
    const response = await authService.registerService({
      name,
      password,
      phone,
      role: role || "user",
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Error from server" + error,
    });
  }
};

const login = async (req, res) => {
  const { password, phone } = req.body;
  try {
    if (!password || !phone) {
      return res.status(400).json({
        err: 1,
        msg: "Missing input !",
      });
    }
    const response = await authService.loginService({ password, phone });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Error from server" + error,
    });
  }
};

module.exports = {
  register,
  login,
};
