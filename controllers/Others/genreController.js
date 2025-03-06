const GenreModel = require("../../db/models/Others/genreModel")

/**
 * Authentifier un utilisateur
 * @param {Express.Request} req
 * @param {Express.Response} res
 */

const findAllElements = async (req, res) => {
    try {
        const data = await GenreModel.findAndCountAll()

        return res.json({
            httpStatus: 200,
            message: 'Genres recupérés avec succès',
            data: data
        })
    } catch (error) {
        res.json({
            message: 'Erreur interne du serveur',
            httpStatus: 500,
            data: null
        })
    }
}

module.exports = {
    findAllElements
}