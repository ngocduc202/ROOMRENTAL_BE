import db from "../models";

export const getProvincesService = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Province.findAll({
            raw : true ,
            attributes : ['code' , 'value']
        })
        resolve({
            err : response ? 0 : 1,
            msg : response ? "Success" : "Fail to get provinces",
            response
        })
    } catch (error) {
        reject(error)
    }
})