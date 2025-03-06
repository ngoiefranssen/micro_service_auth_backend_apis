const typeVersementModel = require('../../db/models/versements/typeVersementModel')

/**
 * Authentifier un utilisateur
 * @param {Express.Request} req
 * @param {Express.Response} res
 */

const findAllElements = async (req, res) => {
    try {
        const data = await typeVersementModel.findAndCountAll()

        return res.json({
            httpStatus: 200,
            message: 'Types versements recupérés avec succès',
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

module.exports = { findAllElements }