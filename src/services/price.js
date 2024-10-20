import db from "../models";

export const getPriceService = () => new Promise(async (resolve, reject) => {
  try {
    const response = await db.Price.findAll({
      raw : true ,
      attributes : ['code' , 'value', 'order']
    })
    resolve({
      err : response ? 0 : 1,
      msg : response ? "Success" : "Fail to get prices",
      response
    })
  } catch (error) {
    reject(error)
  }
})