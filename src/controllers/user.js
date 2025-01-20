import * as service from "../services/user";

export const getCurrent = async (req, res) => {
    const {id} = req.user
    try {
        const response = await service.getOne(id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at user controller: " + error,
        });
    }
}

export const updateUser = async (req, res) => {
    const {id} = req.user
    const payload = req.body
    try {
        if(!payload) return res.status(400).json({err: 1 , msg : "Missing input !!"})
        const response = await service.updateUser(payload , id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at user controller: " + error,
        });
    }
}