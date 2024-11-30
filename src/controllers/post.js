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
  const { page, priceNumber , areaNumber , ...query } = req.query;
  try {
    const response = await service.getPostsLimitService(page , query ,{priceNumber , areaNumber});
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

export const createNewPost = async (req, res) => {
  try {
    const {categoryCode , title , priceNumber , areaNumber , label} = req.body
    const {id} = req.user
    if(!categoryCode || !id || !title || !priceNumber || !areaNumber || !label) {
      return res.status(400).json({err: 1 , msg : "Missing input !!"})
    }
    const response = await service.createNewPostService(req.body , id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at post controller: " + error,
    });
  }
};
