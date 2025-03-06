const TypeMouvement = require('../../db/models/mouvements/typeMouvementModel')

/**
 * Recupérer la liste des pays
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns
 */

const findAllElments = async (req,res) => {
    
    try {
        const data = await TypeMouvement.findAndCountAll()

        return res.json({
            httpStatus: 200,
            message: 'Types mouvements recupérés avec succès',
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
    findAllElments
}