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