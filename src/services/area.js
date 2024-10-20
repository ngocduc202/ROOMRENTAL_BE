import db from "../models";

export const getAreaService = () => new Promise(async (resolve, reject) => {
  try {
    const response = await db.Area.findAll({
      raw : true ,
      attributes : ['code' , 'value', 'order']
    })
    resolve({
      err : response ? 0 : 1,
      msg : response ? "Success" : "Fail to get areas",
      response
    })
  } catch (error) {
    reject(error)
  }
})