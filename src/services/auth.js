import db from "../models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { raw } from "mysql2";
import { v4 } from "uuid";
require('dotenv').config()

const hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
 }


export const registerService = ({phone , password , name}) => new Promise(async (resolve, reject) => {
  try {
    const response  = await db.User.findOrCreate({
      where: {phone},
      defaults: {
        phone,
        name,
        password : hashPassword(password),
        id : v4()
      }
    })
    const token = response[1] &&  jwt.sign({id : response[0].id , phone : response[0].phone} , process.env.SECRET_KEY , {expiresIn : '2d'})
    resolve({
      err: token ? 0 : 2,
      mes : token ? "Register is successfully !" : "Phone number is existed !" ,
      token : token || null
    })

  } catch (error) {
    reject(error);
  }
});

//create login
export const loginService = ({phone , password}) => new Promise(async (resolve, reject) => {
  try {
    const response = await db.User.findOne({
      where : {phone},
      raw : true
    })
    if(response){
      const checkPassword = bcrypt.compareSync(password , response.password)
      if(checkPassword){
        const token = jwt.sign({id : response.id , phone : response.phone} , process.env.SECRET_KEY , {expiresIn : '2d'})
        resolve({
          err : 2,
          mes : "Login successfully !",
          token : token
        })
      }else{
        resolve({
          err : 1,
          mes : "Wrong password !"
        })
      }
    }else{
      resolve({
        err : 2,
        mes : "Phone number is not existed !"
      })
    }

  } catch (error) {
    reject(error);
  }

});

