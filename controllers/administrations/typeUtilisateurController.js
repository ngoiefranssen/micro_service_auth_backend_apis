const yup = require('yup');
const { ValidationError } = require('sequelize');
const TypeUtilisateur = require('../../db/models/admin/typeUtilisateurModel');

/**
 * Recupérer la liste des types utilisateurs
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns
 */

const findAllElments = async (req, res) => {
    try {
        const data = await TypeUtilisateur.findAndCountAll();

        res.json({
            httpStatus: 200,
            message: 'Types utilisateurs recupérés avec succès',
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
 * Trouver un seul type utilisateur
 * @param {Express.Request} req
 * @param {Express.Response} res
 */

const findOneElement = async (req, res) => {
    
    try {

        const typeUser = await TypeUtilisateur.findByPk(
            req?.params?.ID_TYPE_USER,
            {
                attributes: { 
                    exclude: 'typeUtilisateurIDTYPEUSER' 
                }
            }
        )

        if (!typeUser) {
            return res.status(404).json({
                httpStatus: 200,
                message: 'Type utilisateur non trouvé',
                data: typeUser
            });
        }
    
        res.json({
            httpStatus: 200,
            message: 'Type utilisateur trouvé avec succès',
            data: typeUser
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
 * Créer un type utilisateur
 * @param {Express.Request} req
 * @param {Express.Response} res
 */

const createdTypeUsers = async (req, res) => {
    
    const typeUserSchema = yup.lazy(() => yup.object({
        DESCR_TYPE_UTILISATEUR: yup.string(50).required()
    }))

    let validatedData;
    // Géstion d'erreur de validation des données
    try {
        validatedData = await typeUserSchema.validate({
            ...req.body,
        },{ abortEarly: false, stripUnknown: true })

    } catch (e) {
        return res.status(422).json({
            httpStatus: 422,
            message: 'Erreur de validation des données',
            data: null,
        })
    }

     // Géstion d'erreur d'insertion des données
    try {
        const data = await TypeUtilisateur.create({
            ...validatedData
        })

        res.status(200).json({
            httpStatus: 201,
            message: 'Type utilisateur crée avec succès',
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
 * Modifier un type utilisateur
 * @param {Express.Request} req
 * @param {Express.Response} res
 */

const updatedTypeUser = async (req, res) => {
    try {
        const typeUser = await TypeUtilisateur.findByPk(req?.params?.ID_TYPE_USER, {
            attributes: { 
                exclude: 'typeUtilisateurIDTYPEUSER' 
            }
        });

        if (!typeUser) {
            return res.status(404).json({
                httpStatus: 404,
                message: 'Type utilisateur non trouvé',
                data: null
            });
        }

        let validatedData;

        const typeUserSchema = yup.Lazy(() => yup.object({
            DESCR_TYPE_UTILISATEUR: yup.string().optional()
        }));

        validatedData = await typeUserSchema.validate(
        {
            ...req.body
        }, { abortEarly: false, stripUnknown: true }
        );
        
        await TypeUtilisateur.update(
            ...validatedData,
            {
                where: { ID_TYPE_USER: req?.params?.ID_TYPE_USER },
                returning: true,
            }
        );

        res.json({
            httpStatus: 200,
            message: 'Type utilisateur modifié avec succès',
            data: typeUser
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(422).json({
                message: 'Erreur de validation des données',
                httpStatus: 422,
                data: null,
                errors: error.errors.reduce((acc, curr) => {
                    if (curr.path) {
                        return { ...acc, [curr.path]: curr.message };
                    }
                    return acc; 
                }, {})
            });
        }
        
        res.status(500).json({
            message: 'Erreur interne du serveur',
            httpStatus: 500,
            data: error.message
        });
    }
};

/**
 * Supprimer un seul type user
 * @param {Express.Request} req
 * @param {Express.Response} res
 */

const deletedTypeUser = async (req, res) => {

    try {
        const TYPE_USERS = JSON.parse(req?.body?.ID_TYPE_USERS)

        await TypeUtilisateur.destroy({ where: { ID_TYPE_USER: TYPE_USERS }})

        res.json({
            httpStatus: 200,
            message: `${TYPE_USERS.length} Type(s) utilisateur(s) supprimé(s) avec succès`,
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
    findAllElments,
    findOneElement,
    createdTypeUsers,
    updatedTypeUser,
    deletedTypeUser
}