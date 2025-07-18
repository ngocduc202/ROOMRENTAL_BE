import db from "../models";
import { Op } from "sequelize";
import { v4 as generateId } from "uuid";
import generateCode from "../ultis/generateCode";
import moment from "moment";
import generateDate from "../ultis/genarateDate";

moment.locale("vi");
export const getPostsService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Post.findAll({
        raw: true,
        nest: true,
        include: [
          { model: db.image, as: "images", attributes: ["image"] },
          {
            model: db.Attribute,
            as: "attributes",
            attributes: ["price", "acreage", "published", "hashtag"],
          },
          { model: db.User, as: "user", attributes: ["name", "zalo", "phone"] },
        ],
        attributes: ["id", "title", "star", "address", "description"],
      });
      resolve({
        err: response ? 0 : 1,
        msg: response ? "Success" : "Fail to get posts",
        response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getPostsLimitService = (
  page,
  { limitPost, order, ...query },
  { priceNumber, areaNumber }
) =>
  new Promise(async (resolve, reject) => {
    try {
      let offset = !page || +page <= 1 ? 0 : +page - 1;
      const queries = { ...query };
      const limit = +limitPost || +process.env.LIMIT;
      queries.limit = limit;
      if (priceNumber) query.priceNumber = { [Op.between]: priceNumber };
      if (areaNumber) query.areaNumber = { [Op.between]: areaNumber };
      if (order) queries.order = [order];
      const response = await db.Post.findAndCountAll({
        where: query,
        raw: true,
        nest: true,
        offset: offset * limit,
        ...queries,
        include: [
          { model: db.image, as: "images", attributes: ["image"] },
          {
            model: db.Attribute,
            as: "attributes",
            attributes: ["price", "acreage", "published", "hashtag"],
          },
          {
            model: db.User,
            as: "user",
            attributes: ["name", "zalo", "phone", "avatar", "createdAt"],
          },
          { model: db.overview, as: "overviews" },
          { model: db.Label, as: "labelData", attributes: ["code", "value"] },
        ],
        attributes: ["id", "title", "star", "address", "description"],
      });
      resolve({
        err: response ? 0 : 1,
        msg: response ? "Success" : "Fail to get posts",
        response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getNewPostService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Post.findAll({
        raw: true,
        nest: true,
        offset: 0,
        order: [["createdAt", "DESC"]],
        limit: +process.env.LIMIT,
        include: [
          { model: db.image, as: "images", attributes: ["image"] },
          {
            model: db.Attribute,
            as: "attributes",
            attributes: ["price", "acreage", "published", "hashtag"],
          },
        ],
        attributes: ["id", "title", "star", "createdAt"],
      });
      resolve({
        err: response ? 0 : 1,
        msg: response ? "Success" : "Fail to get posts",
        response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const createNewPostService = (body, userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const attributesId = generateId();
      const imagesId = generateId();
      const overviewId = generateId();
      const labelCode = generateCode(body.label);
      const hashtag = `#${Math.floor(Math.random() * Math.pow(10, 6))}`;
      const currentDate = generateDate();
      await db.Post.create({
        id: generateId(),
        title: body.title,
        labelCode,
        address: body.address || null,
        attributesId,
        categoryCode: body.categoryCode,
        description: JSON.stringify(body.description) || null,
        userId,
        overviewId,
        imagesId,
        areaCode: body.areaCode || null,
        priceCode: body.priceCode || null,
        provinceCode: body?.province?.includes("Thành phố")
          ? generateCode(body?.province?.replace("Thành phố ", ""))
          : generateCode(body?.province?.replace("Tỉnh ", "")) || null,
        priceNumber: body.priceNumber,
        areaNumber: body.areaNumber,
      });
      await db.Attribute.create({
        id: attributesId,
        price:
          +body?.priceNumber < 1
            ? `${+body?.priceNumber * 1000000} đồng/tháng`
            : `${body?.priceNumber} triệu/tháng`,
        acreage: `${body?.areaNumber} m²`,
        published: moment(new Date()).format("DD/MM/YYYY"),
        hashtag: hashtag,
      });
      await db.image.create({
        id: imagesId,
        image: JSON.stringify(body?.images),
      });
      await db.overview.create({
        id: overviewId,
        code: hashtag,
        area: body?.label,
        type: body?.category,
        target: body?.target,
        bonus: "Tin thường",
        created: currentDate.today,
        expired: currentDate.expireDay,
      });
      await db.Province.findOrCreate({
        where: {
          [Op.or]: [
            { value: body?.province?.replace("Thành phố ", "") },
            { value: body?.province?.replace("Tỉnh ", "") },
          ],
        },
        defaults: {
          code: body?.province?.includes("Thành phố")
            ? generateCode(body?.province?.replace("Thành phố ", ""))
            : generateCode(body?.province?.replace("Tỉnh ", "")),
          value: body?.province?.includes("Thành phố")
            ? body?.province?.replace("Thành phố ", "")
            : body?.province?.replace("Tỉnh ", ""),
        },
      });
      await db.Label.findOrCreate({
        where: {
          code: labelCode,
        },
        defaults: {
          code: labelCode,
          value: body?.label,
        },
      });

      resolve({
        err: 0,
        msg: "Ok",
      });
    } catch (error) {
      reject(error);
    }
  });

export const getPostsLimitAdminService = (page, id, query) =>
  new Promise(async (resolve, reject) => {
    try {
      let offset = !page || +page <= 1 ? 0 : +page - 1;
      const queries = { ...query, userId: id };
      const response = await db.Post.findAndCountAll({
        where: queries,
        raw: true,
        nest: true,
        offset: offset * +process.env.LIMIT,
        limit: +process.env.LIMIT,
        order: [["createdAt", "DESC"]],
        include: [
          { model: db.image, as: "images", attributes: ["image"] },
          {
            model: db.Attribute,
            as: "attributes",
            attributes: ["price", "acreage", "published", "hashtag"],
          },
          { model: db.User, as: "user", attributes: ["name", "zalo", "phone"] },
          { model: db.overview, as: "overviews" },
        ],
        // attributes :['id' , 'title' , 'star' , 'address' , 'description']
      });
      resolve({
        err: response ? 0 : 1,
        msg: response ? "Success" : "Fail to get posts",
        response,
      });
    } catch (error) {
      reject(error);
    }
  });

const parseExpiredDate = (expiredStr) => {
  if (!expiredStr) return null;

  // Bỏ phần "Thứ ...," giữ lại "10:10 16/2/2025"
  const parts = expiredStr.split(", ");
  if (parts.length < 2) return null; // Sai định dạng

  const datePart = parts[1]; // Lấy "10:10 16/2/2025"

  const parsed = moment(datePart, "HH:mm DD/M/YYYY", true);
  return parsed.isValid() ? parsed : null;
};

export const getAllPosts = (page, query) =>
  new Promise(async (resolve, reject) => {
    try {
      const limit = +process.env.POST_LIMIT || 10;
      const currentPage = !page || +page <= 1 ? 1 : +page;
      const offset = (currentPage - 1) * limit;

      const response = await db.Post.findAndCountAll({
        where: query || {},
        raw: true,
        nest: true,
        order: [["createdAt", "DESC"]],
        limit,
        offset,
        include: [
          { model: db.image, as: "images", attributes: ["image"] },
          {
            model: db.Attribute,
            as: "attributes",
            attributes: ["price", "acreage", "published", "hashtag"],
          },
          { model: db.User, as: "user", attributes: ["name", "zalo", "phone"] },
          { model: db.overview, as: "overviews" },
        ],
      });

      resolve({
        err: response ? 0 : 1,
        msg: response ? "Success" : "Failed to get posts",
        posts: response.rows,
        pagination: {
          total: response.count,
          pageSize: limit,
          currentPage,
          totalPages: Math.ceil(response.count / limit),
        },
      });
    } catch (error) {
      reject(error);
    }
  });

export const updatePost = ({
  postId,
  overviewId,
  imagesId,
  attributesId,
  ...body
}) =>
  new Promise(async (resolve, reject) => {
    try {
      const labelCode = generateCode(body.label);
      await db.Post.update(
        {
          title: body.title,
          labelCode,
          address: body.address || null,
          categoryCode: body.categoryCode,
          description: JSON.stringify(body.description) || null,
          areaCode: body.areaCode || null,
          priceCode: body.priceCode || null,
          provinceCode: body?.province?.includes("Thành phố")
            ? generateCode(body?.province?.replace("Thành phố ", ""))
            : generateCode(body?.province?.replace("Tỉnh ", "")) || null,
          priceNumber: body.priceNumber,
          areaNumber: body.areaNumber,
        },
        {
          where: { id: postId },
        }
      );
      await db.Attribute.update(
        {
          price:
            +body?.priceNumber < 1
              ? `${+body?.priceNumber * 1000000} đồng/tháng`
              : `${body?.priceNumber} triệu/tháng`,
          acreage: `${body?.areaNumber} m²`,
        },
        {
          where: { id: attributesId },
        }
      );
      await db.image.update(
        {
          image: JSON.stringify(body?.images),
        },
        {
          where: { id: imagesId },
        }
      );
      await db.overview.update(
        {
          area: body?.label,
          type: body?.category,
          target: body?.target,
        },
        {
          where: {
            id: overviewId,
          },
        }
      );
      await db.Province.findOrCreate({
        where: {
          [Op.or]: [
            { value: body?.province?.replace("Thành phố ", "") },
            { value: body?.province?.replace("Tỉnh ", "") },
          ],
        },
        defaults: {
          code: body?.province?.includes("Thành phố")
            ? generateCode(body?.province?.replace("Thành phố ", ""))
            : generateCode(body?.province?.replace("Tỉnh ", "")),
          value: body?.province?.includes("Thành phố")
            ? body?.province?.replace("Thành phố ", "")
            : body?.province?.replace("Tỉnh ", ""),
        },
      });
      await db.Label.findOrCreate({
        where: {
          code: labelCode,
        },
        defaults: {
          code: labelCode,
          value: body?.label,
        },
      });
      resolve({
        err: 0,
        msg: "Updated",
      });
    } catch (error) {
      reject(error);
    }
  });

export const deletePost = (postId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Post.destroy({
        where: { id: postId },
      });
      resolve({
        err: response > 0 ? 0 : 1,
        msg: response > 0 ? "Deleted" : "No post delete",
      });
    } catch (error) {
      reject(error);
    }
  });
