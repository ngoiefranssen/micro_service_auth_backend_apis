const yup = require('yup');
const { ValidationError } = require('sequelize');
const Marque = require('../../db/models/vehicules/marqueModel');

/**
 * Recupérer la liste des marques
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns
 */
const findAllElementDatas = async (req, res) => {

    try {
        const data = await Marque.findAndCountAll()

        res.json({
            httpStatus: 200,
            message: 'Marques recupérés avec succès',
            data
        });

    } catch (error) {
        return res.json({
            message: 'Erreur interne du serveur',
            httpStatus: 500,
            data: null,
        });
    }
}

/**
 * Trouver un seul marque
 * @param {Express.Request} req
 * @param {Express.Response} res
 */

const findOneElementData = async (req, res) => {

    try {
        const marque = await Marque.findByPk(req?.params?.ID_MARQUE)
    
        if(!marque){
            return res.status(404).json({
                httpStatus: 200,
                message: 'Marque non trouvé',
                data: marque
            });
        }
        
        res.json({
            httpStatus: 200,
            message: 'Marques trouvé avec succès',
            data: marque
        });
    } catch (error) {
        res.json({
            message: 'Erreur interne du serveur',
            httpStatus: 500,
            data: null
        })
    }
}


/**
 * Créer un marque
 * @param {Express.Request} req
 * @param {Express.Response} res
 */

const createdMarques = async (req, res) => {

    const marqueSchema = yup.lazy(() => yup.object({
        NAME_MARQUE: yup.string(100).required()
    }))

    let validatedData

    // Géstion d'erreur de validation des données
    try {
        validatedData = await marqueSchema.validate({
            ...req.body,
        },{ abortEarly: false, stripUnknown: true })

    } catch (e) {
        return res.status(422).json({
            httpStatus: 422,
            message: 'Erreur de validation des données',
            data: null,
            errors: e.inner.reduce((acc, curr) => {
                if (curr.path) {
                    return { ...acc, [curr.path]: curr.errors[0] }
                }
            }, {}),
        })
    }

    try {
        const data = await Marque.create({
            ...validatedData
        })

        res.status(200).json({
            httpStatus: 200,
            message: 'Marque crée avec succès',
            data: data
        });

    } catch (e) {
        res.status(500).json({
            message: 'Erreur interne du serveur',
            httpStatus: 500,
            data: null
        })
    }
}

/**
 * Modifier un marque
 * @param {Express.Request} req
 * @param {Express.Response} res
 */

const updatedMarque = async (req, res) => {
    const ID_MARQUE = await Marque.findByPk(req?.params?.ID_MARQUE)

    try {

        if(!ID_MARQUE) {
            return res.status(404).json({
                httpStatus: 404,
                message: 'Marque non trouvé',
                data: null
            });
        }

        const marqueSchema = yup.lazy(() => yup.object({
            NAME_MARQUE: yup.string(100).optional()
        }))

        validatedData = await marqueSchema.validate({
            ...req.body,
        },{ abortEarly: false, stripUnknown: true })

        await Marque.update(
            validatedData,
            {
                where: { ID_MARQUE: req?.params?.ID_MARQUE },
                returning: true,
            }
        );

        res.json({
            httpStatus: 200,
            message: 'Marque modifié avec succès',
            data: ID_MARQUE
        });

    } catch (error) {
        res.status(500).json({
            message: 'Erreur interne du serveur',
            httpStatus: 500,
            data: null
        })
    }
}

/**
 * Supprimer une seule marque
 * @param {Express.Request} req
 * @param {Express.Response} res
 */

const deletedMarque = async (req, res)  => {
    
    const IDS_MARQUES = JSON.parse(req?.body?.ID_MARQUES)

    if (!IDS_MARQUES) {
        return res.status(404).json({
            httpStatus: 404,
            message: 'Marque y n\'existant',
            data: null
        });
    }
    
    try {

        await Marque.destroy({where : {
            ID_MARQUE: IDS_MARQUES
        }})
        
        res.json({
            httpStatus: 200,
            message: `${IDS_MARQUES?.length} Marque supprimé(s) avec succès`,
            data: null
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur interne du serveur',
            httpStatus: 500,
            data: null
        })
    }
}

module.exports = {
    findAllElementDatas,
    findOneElementData,
    createdMarques,
    updatedMarque,
    deletedMarque
}