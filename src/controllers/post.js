import * as service from "../services/post";

export const getPosts = async (req, res) => {
  try {
    const response = await service.getPostsService();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at post controller: " + error,
    });
  }
};

export const getPostsLimit = async (req, res) => {
  const { page , ...query } = req.query;
  try {
    const response = await service.getPostsLimitService(page , query);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at post controller: " + error,
    });
  }
};

export const getNewPosts = async (req, res) => {
  try {
    const response = await service.getNewPostService();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at post controller: " + error,
    });
  }
};
