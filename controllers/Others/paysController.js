const yup = require('yup');
const { ValidationError, where } = require('sequelize');
const PaysModel = require('../../db/models/Others/paysModel');

/**
 * Recupérer la liste des pays
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns
 */

const findAllElments = async (req, res) => {

    try {
        const data = await PaysModel.findAndCountAll()
        
        res.json({
            httpStatus: 200,
            message: 'Pays recupérés avec succès',
            data
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur interne du serveur',
            httpStatus: 500,
            data: null
        })
    }
}

/**
 * Trouver un seul pays
 * @param {Express.Request} req
 * @param {Express.Response} res
 */

const findOneElement = async (req, res) => {
    try {
        const pays = await PaysModel.findByPk(
            req?.params?.ID_PAYS
        )
    
        if (!pays) {
            return res.status(404).json({
                httpStatus: 404,
                message: 'Pays non trouvé',
                data: pays
            });
        }
    
        res.json({
            httpStatus: 200,
            message: 'Pays trouvé avec succès',
            data: pays
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
 * Créer un pays
 * @param {Express.Request} req
 * @param {Express.Response} res
 */

const createdPays = async (req, res) => {

    const paysSchema = yup.lazy(() => yup.object({
        NAME_PAYS: yup.string(100).required()
    }))

    let validatedData;

    try {
        validatedData = await paysSchema.validate({
            ...req.body
        }, { abortEarly: false, stripUnknown: true })
    } catch (ex) {
        return res.status(422).json({
            httpStatus: 422,
            message: 'Erreur de validation des données',
            data: null,
            errors: ex.inner.reduce((acc, curr) => {
                if (curr.path) {
                    return { ...acc, [curr.path]: curr.errors[0] }
                }
            }, {}),
        })
    }

    try {
        const data = await PaysModel.create({
            ...validatedData
        })

        res.status(200).json({
            httpStatus: 201,
            message: 'pays crée avec succès',
            data: data
        });
    } catch (e) {
        if (e instanceof ValidationError) {
            return res.status(422).json({
                message: 'Erreur de validation des données',
                httpStatus: 422,
                data: null,
                errors: e?.errors.reduce((acc, curr) => {
                    if (curr.path) {
                        return { ...acc, [curr.path]: curr.message }
                    }
                }, {})
            });
        }

        res.status(500).json({
            message: 'Erreur interne du serveur',
            httpStatus: 500,
            data: null
        })
    }
}
/**
 * Modifier un pays
 * @param {Express.Request} req
 * @param {Express.Response} res
 */

const updatedPays = async (req, res) => {

    const pays = await PaysModel.findByPk(req?.params?.ID_PAYS);

    if (!pays) {
        return res.status(404).json({
            httpStatus: 404,
            message: 'pays non trouvé',
            data: null
        });
    }

     try {

        const paysSchema = yup.lazy(() => yup.object({
            NAME_PAYS: yup.string().optional()
        }))
    
        const validatedData = await paysSchema.validate(
            req.body, { abortEarly: false, stripUnknown: true }
        );

       await PaysModel.update(validatedData, { where: { ID_PAYS: req?.params?.ID_PAYS}}) 
       
       res.json({
            httpStatus: 200,
            message: 'Pays modifié avec succès',
            data: pays
        });

     } catch (e) {
        res.status(500).json({
            message: 'Erreur interne du serveur',
            httpStatus: 500,
            data: null,
            errors: e?.errors
        });
     }
}

/**
 * Supprimer un seul pays
 * @param {Express.Request} req
 * @param {Express.Response} res
 */

const deletedPays = async (req, res) => {
    try {
        const PAYS_IDS = JSON.parse(req?.body?.ID_PAYS);

        const pays = await PaysModel.findAll({
            where: { ID_PAYS: PAYS_IDS },
            attributes: ['ID_PAYS']
        });

        if (!pays) {
            return res.status(404).json({
                httpStatus: 404,
                message: 'Pays non trouvé',
                data: null
            });
        }

        const canal = await PaysModel.destroy({ where: { ID_PAYS: PAYS_IDS } })

        res.json({
            httpStatus: 200,
            message: 'Pays supprimé avec succès',
            data: canal
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
    findAllElments,
    findOneElement,
    createdPays,
    updatedPays,
    deletedPays
}