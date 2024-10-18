import db from "../models";
import bcrypt from "bcryptjs";
import { v4 } from "uuid";
require('dotenv').config()
import nhachothue from '../../data/nhachothue.json'
import generateCode from '../ultis/generateCode'
import { dataArea, dataPrice } from "../ultis/data";
import { getNumberFromString } from "../ultis/common";
const dataBody = nhachothue.body


const hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
 }

export const insertService = () => new Promise(async (resolve, reject) => {
  try {
    dataBody.forEach(async (item) => {
      let postId = v4();
      let labelCode = generateCode(item?.header?.class?.classType)
      let attributeId = v4()
      let userId = v4()
      let imageId = v4()
      let overviewId = v4()
      let currentArea = getNumberFromString(item?.header?.attributes?.acreage)
      let currentPrice = getNumberFromString(item?.header?.attributes?.price)
      await db.Post.create({
        id : postId,
        title : item?.header?.title,
        star : item?.header?.star,
        labelCode,
        address : item?.header?.address,
        attributesId : attributeId,
        categoryCode : "NCT",
        description : JSON.stringify(item?.mainContent?.content),
        userId,
        overviewId ,
        imagesId : imageId,
        areaCode: dataArea.find(area => area.max > currentArea && area.min <= currentArea)?.code,
        priceCode: dataPrice.find(price => price.max > currentPrice && price.min <= currentPrice)?.code
      })
      await db.Attribute.create({
        id : attributeId,
        price : item?.header?.attributes?.price,
        acreage : item?.header?.attributes?.acreage,
        published : item?.header?.attributes?.published,
        hashtag : item?.header?.attributes?.hashtag
      })
      await db.image.create({
        id : imageId,
        image: JSON.stringify(item?.images)
      })
      await db.Label.findOrCreate({
        where : {code : labelCode},
        defaults : {code : labelCode , value : item?.header?.class?.classType}
      })
      await db.overview.create({
        id: overviewId,
                    code: item?.overview?.content.find(i => i.name === "Mã tin:")?.content,
                    area: item?.overview?.content.find(i => i.name === "Khu vực")?.content,
                    type: item?.overview?.content.find(i => i.name === "Loại tin rao:")?.content,
                    target: item?.overview?.content.find(i => i.name === "Đối tượng thuê:")?.content,
                    bonus: item?.overview?.content.find(i => i.name === "Gói tin:")?.content,
                    created: item?.overview?.content.find(i => i.name === "Ngày đăng:")?.content,
                    expired: item?.overview?.content.find(i => i.name === "Ngày hết hạn:",)?.content,
      })
      await db.User.create({
        id : userId,
        name : item?.contact?.content.find(i => i.name === "Liên hệ:")?.content,
        password : hashPassword('123456'),
        phone : item?.contact?.content.find(i => i.name === "Điện thoại:")?.content,
        zalo : item?.contact?.content.find(i => i.name === "Zalo")?.content
      })
    })
    resolve("Done")
  } catch (error) {
    reject(error);
  }
});