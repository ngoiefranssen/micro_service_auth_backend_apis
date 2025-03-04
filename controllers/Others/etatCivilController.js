const etatCivileModel = require("../../db/models/Others/etatCivilModel")

/**
 * GET de la liste de de type civiles
 * @param {Express.Request} req
 * @param {Express.Response} res
 */

const findAllElement =  async (req, res) => {
    try {
        const data = await etatCivileModel.findAndCountAll()

        return res.json({
            httpStatus: 200,
            message: 'Etat civile recupérés avec succès',
            data: data
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur interne du serveur',
            httpStatus: 500,
            data: null
        })
    }
}

module.exports = {
    findAllElement
}