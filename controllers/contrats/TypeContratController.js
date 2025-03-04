const yup = require('yup');
const { ValidationError } = require('sequelize');
const TypeContratModel = require('../../db/models/contrats/TypeContratModel');


/**
 * Recupérer la liste des type contrats
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns
 */

const findAllElements = async (req, res) => {

    const data = await TypeContratModel.findAndCountAll()

    try {
        res.json({
            httpStatus: 200,
            message: 'Types contrats recupérés avec succès',
            data
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
 * Trouver un seul type contrat
 * @param {Express.Request} req
 * @param {Express.Response} res
 */

const findOnElement = async (req, res) => {

    const typeContrat = await TypeContratModel.findByPk(req.params.ID_TYPE_CONTRAT)

    try {
        if(!typeContrat){
           return res.status(404).json({
                httpStatus: 404,
                message: 'Type contrat non trouvé',
                data: typeContrat
            });
        }

        res.json({
            httpStatus: 200,
            message: 'Type contrat trouvé avec succès',
            data: typeContrat
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
 * Créer un type de contrat
 * @param {Express.Request} req
 * @param {Express.Response} res
 */

const createdTypeContrat = async (req, res) => {

        const typeContratSchema = yup.lazy(() => yup.object({
            TYPE_CONTRAT_NAME: yup.string(100).required()
        }))

        let validatedData

        // Géstion d'erreur de validation des données
        try {
            validatedData = await typeContratSchema.validate({
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
            const data = await TypeContratModel.create({
                ...validatedData
            })
    
            res.status(200).json({
                httpStatus: 200,
                message: 'Type contrat crée avec succès',
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
 * Modifier un type contrat
 * @param {Express.Request} req
 * @param {Express.Response} res
 */


const updatedTypeContrat = async (req, res) => {

    const typeContrat = await TypeContratModel.findByPk(req?.params?.ID_TYPE_CONTRAT)

    if (!typeContrat) {
        return res.status(404).json({
            httpStatus: 404,
            message: 'Type contrat non trouvé',
            data: null
        });
    }
    
    try {
        const typeContratSchema = yup.lazy(() => yup.object({
            TYPE_CONTRAT_NAME: yup.string(100).optional()
        }))

        let validatedData

        validatedData = await typeContratSchema.validate({
            ...req.body,
        },{ abortEarly: false, stripUnknown: true })

        await TypeContratModel.update(
            validatedData,
            {
                where: { ID_TYPE_CONTRAT: req?.params?.ID_TYPE_CONTRAT },
                returning: true,
            }
        );

        res.json({
            httpStatus: 200,
            message: 'Type contrat modifié avec succès',
            data: typeContrat
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
 * Trouver un seul type contrat
 * @param {Express.Request} req
 * @param {Express.Response} res
 */

const deletedTypeContrat = async () => {

    const TYPE_CONTRATS = JSON.parse(req?.body?.ID_TYPE_CONTRATS)

    if (!TYPE_CONTRATS) {
        return res.status(404).json({
            httpStatus: 404,
            message: 'Type contrat y n\'existant',
            data: null
        });
    }

    try {
        await TypeContratModel.destroy({where : {
            ID_TYPE_CONTRAT: TYPE_CONTRATS
        }})
        
        res.json({
            httpStatus: 200,
            message: `${TYPE_CONTRATS.length} Type(s) contrat(s) supprimé(s) avec succès`,
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
    findAllElements,
    findOnElement,
    createdTypeContrat,
    updatedTypeContrat,
    deletedTypeContrat
}