const yup = require('yup');
const { ValidationError } = require('sequelize');
const TypeVehiculModel = require('../../db/models/vehicules/typeVehiculeModel');

/**
 * Recupérer la liste des types vehicule
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns
 */

const findAllElments = async (req, res) => {

    try {
        const data = await TypeVehiculModel.findAndCountAll()
        
        res.json({
            httpStatus: 200,
            message: 'Types vehicules recupérés avec succès',
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
 * Trouver un seul type vehicule
 * @param {Express.Request} req
 * @param {Express.Response} res
 */

const findOneElement = async (req, res) => {
    try {
        const typeVehicule = await TypeVehiculModel.findByPk(
            req?.params?.ID_TYPE_VEHICULE
        )
    
        if (!typeVehicule) {
            return res.status(404).json({
                httpStatus: 404,
                message: 'Type vehicule non trouvé',
                data: typeVehicule
            });
        }
    
        res.json({
            httpStatus: 200,
            message: 'Type vehicule trouvé avec succès',
            data: typeVehicule
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Erreur interne du serveur',
            httpStatus: 500,
            data: null
        })
    }
}

/**
 * Créer un type vehicule
 * @param {Express.Request} req
 * @param {Express.Response} res
 */

const createdTypeVehicule = async (req, res) => {
    const typeVehiculeSchema = yup.lazy(() => yup.object({
        TYPE_NAME: yup.string(100).required()
    }))

    let validatedData;

    try {
        validatedData = await typeVehiculeSchema.validate({
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
        const data = await TypeVehiculModel.create({
            ...validatedData
        })

        res.status(200).json({
            httpStatus: 201,
            message: 'Type vehicule crée avec succès',
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
 * Modifier un type vehicule
 * @param {Express.Request} req
 * @param {Express.Response} res
 */

const updatedTypeVihicule = async (req, res) => {

    const typeVehicule = await TypeVehiculModel.findByPk(req?.params?.ID_TYPE_VEHICULE);

    if (!typeVehicule) {
        return res.status(404).json({
            httpStatus: 404,
            message: 'Type vehicule non trouvé',
            data: null
        });
    }

     try {

        const typeVehiculeSchema = yup.lazy(() => yup.object({
            TYPE_NAME: yup.string().optional()
        }))
    
        const validatedData = await typeVehiculeSchema.validate(
            req.body, { abortEarly: false, stripUnknown: true }
        );

       await TypeVehiculModel.update(validatedData, { where: { ID_TYPE_VEHICULE: req?.params?.ID_TYPE_VEHICULE}}) 
       
       res.json({
            httpStatus: 200,
            message: 'Type vehicule modifié avec succès',
            data: typeVehicule
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
 * Supprimer un seul type user
 * @param {Express.Request} req
 * @param {Express.Response} res
 */

const deletedTypeVehicule = async (req, res) => {
    try {
        const TYPE_VEHICULES = JSON.parse(req?.body?.ID_TYPE_VEHICULES);

        const types_vehicules = await TypeVehiculModel.findAll({
            where: { ID_TYPE_VEHICULE: TYPE_VEHICULES },
            attributes: ['ID_TYPE_VEHICULE']
        });

        if (!types_vehicules) {
            return res.status(404).json({
                httpStatus: 404,
                message: 'Type vehicule non trouvé',
                data: null
            });
        }

        const deletedElement = await TypeVehiculModel.destroy({ where: { ID_TYPE_VEHICULE: TYPE_VEHICULES } })

        res.json({
            httpStatus: 200,
            message: 'Type vehicule supprimé avec succès',
            data: deletedElement
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
    createdTypeVehicule,
    updatedTypeVihicule,
    deletedTypeVehicule
}