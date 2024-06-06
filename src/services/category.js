import db from "../models";

export const getCategoriesService = () => new Promise(async (resolve, reject) => {
  try {
    const response = await db.category.findAll({
      raw : true ,
      attributes : ['code' , 'value']
    })
    resolve({
      err : response ? 0 : 1,
      msg : response ? "Success" : "Fail to get categories",
      response
    })
  } catch (error) {
    reject(error)
  }
})