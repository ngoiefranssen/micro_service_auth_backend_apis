const yup = require('yup');
const Utilisateur = require('../../db/models/admin/utilisateurModel');
const ProfilUtilisateur = require('../../db/models/admin/profilUtilisateurModel')
const bcrypt = require('bcrypt');
const { ValidationError } = require('sequelize');
const Upload = require('../../utils/Upload');
const Profil = require('../../db/models/admin/profilModel');
const TypeUtilisateurModel = require('../../db/models/admin/typeUtilisateurModel');
const GenreModel = require('../../db/models/Others/genreModel');
const NationaliteModel = require('../../db/models/Others/nationaliteModel');
const EtatCivileModel = require('../../db/models/Others/etatCivilModel');

/**
 * Recupérer la liste des utilisateurs
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns
 */
const getUtilisateurs = async (req, res) => {
    try {

        const option = {
            attributes: { exclude: 'PASSWORD,ID_TYPE_USER,ID_NATIONALITE,ID_GENRE,ID_ETAT_CIVIL'},
            include:[
                {
                    model: GenreModel,
                    as: "GENRES",
                    attributes: ['ID_GENRE', 'NAME_GENER'],
                },
                {
                    model: EtatCivileModel,
                    as: "ETAT_CIVILS",
                    attributes: ['ID_ETAT_CIVIL', 'DESCR_ETAT_CIVIL'],
                },
                {
                    model: TypeUtilisateurModel,
                    as: "TYPE_USERS",
                    attributes: ['ID_TYPE_USER', 'DESCR_TYPE_UTILISATEUR'],
                },
                {
                    model: NationaliteModel,
                    as: "NATIONALITES",
                    attributes: ['ID_NATIONALITE', 'NAME_NATIONALITE'],
                },
            ]
        }
    
        const data = await Utilisateur.findAndCountAll(option);

        res.json({
            httpStatus: 200,
            message: 'Utilisateurs recupérés avec succès',
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
 * Créer un utilisateur
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const createUtilisateur = async (req, res) => {

    const PROFIL_PICTURE = req?.files?.PROFIL_PICTURE ? req?.files?.PROFIL_PICTURE : null
    const PATH_SIGNATURE = req?.files?.PATH_SIGNATURE
    const PATH_PHOTO_PASSEPORT = req?.files?.PATH_PHOTO_PASSEPORT
    const PATH_EXTRAIT_CASIER_JUDICIARE = req?.files?.PATH_EXTRAIT_CASIER_JUDICIARE ? req?.files?.PATH_EXTRAIT_CASIER_JUDICIARE : null

    const PROFILS = JSON.parse(req?.body?.PROFILS || '[]')

    // Géstion d'erreur de toute la méthode
    const utilisateurSchema = yup.lazy(() => yup.object({
        USERNAME: yup.string().required(),
        ID_TYPE_USER: yup.number().required(),
        ID_GENRE: yup.number().required(),
        ID_NATIONALITE: yup.number().required(),
        ID_ETAT_CIVIL: yup.number().required(),
        EMAIL: yup.string().email().required(),
        PASSWORD: yup.string().required().min(8),
        CONFIRM_PASSWORD: yup.string().required().oneOf([yup.ref('PASSWORD'), null], 'Passwords must match'),
        NOM: yup.string().required(),
        PRENOM: yup.string().required(),
        TELEPHONE1: yup.string().notRequired(),
        TELEPHONE1: yup.string().notRequired(),
        ADRESSE: yup.string().notRequired(),

        PROFIL_PICTURE: yup.mixed("you here").test("fileSize", "Le fichier est trop volumineux", (value) => {
            if (!value?.size) return true
            return value.size <= 200_000
        }),

        PATH_SIGNATURE: yup.mixed("you here").test("fileSize", "Le fichier est trop volumineux", (value) => {
            if (!value?.size) return true
            return value.size <= 200_000
        }),

        PATH_PHOTO_PASSEPORT: yup.mixed("you here").test("fileSize", "Le fichier est trop volumineux", (value) => {
            if (!value?.size) return true
            return value.size <= 200_000
        }),

        PATH_EXTRAIT_CASIER_JUDICIARE: yup.mixed("you here").test("fileSize", "Le fichier est trop volumineux", (value) => {
            if (!value?.size) return true
            return value.size <= 200_000
        }),

        DATE_ENTREE: yup.date().required(),

        DATE_SORTIE: yup.date()
            .notRequired()
            .test('is-greater', 'La date de sortie doit être postérieure à la date de début', function (value) {
                const { DATE_ENTREE } = this.parent;

                // Si la DATE_SORTIE n'est pas fourni, la validation passe
                if (value === undefined) {
                    return true;
                }

                // Si la DATE_ENTREE est fourni, vérifiez si DATE_SORTIE est supérieur
                return DATE_ENTREE ? value > DATE_ENTREE : true;
            }),

        PROFILS: yup.array()
    }));

    let validatedData;

    // Géstion d'erreur de validation des données
    try {
        validatedData = await utilisateurSchema.validate(
            {
                ...req.body,
                PROFIL_PICTURE,
                PATH_SIGNATURE,
                PATH_PHOTO_PASSEPORT,
                PATH_EXTRAIT_CASIER_JUDICIARE,
                PROFILS
            },
            { abortEarly: false, stripUnknown: true }
        );
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

    // Géstion d'erreur d'insertion des données
    try {

        const uploadedFileProfilPicture = PROFIL_PICTURE ? await Upload.save(PROFIL_PICTURE, { destination: 'utilisateurs/pictures' }) : {};
        const uploadedFileSignature = PATH_SIGNATURE ? await Upload.save(PATH_SIGNATURE, { destination: 'utilisateurs/signatures' }) : {};
        const uploadedFilePassPort = PATH_PHOTO_PASSEPORT ? await Upload.save(PATH_PHOTO_PASSEPORT, { destination: 'utilisateurs/documents' }) : {};
        const uploadedFileDocsJudiciare = PATH_EXTRAIT_CASIER_JUDICIARE ? await Upload.save(PATH_EXTRAIT_CASIER_JUDICIARE, { destination: 'utilisateurs/documents' }) : {};

        const salt = await bcrypt.genSalt(10)
        const PASSWORD = await bcrypt.hash(validatedData.PASSWORD, salt)

        const data = await Utilisateur.create({
            ...validatedData,
            PROFIL_PICTURE: uploadedFileProfilPicture?.fileInfo?.fileName,
            PATH_SIGNATURE: uploadedFileSignature?.fileInfo?.fileName,
            PATH_PHOTO_PASSEPORT: uploadedFilePassPort?.fileInfo?.fileName,
            PATH_EXTRAIT_CASIER_JUDICIARE: uploadedFileDocsJudiciare?.fileInfo?.fileName,
            PASSWORD
        });

        delete data?.dataValues?.PASSWORD

        if (validatedData?.PROFILS) {
            ProfilUtilisateur.bulkCreate(
                validatedData?.PROFILS?.map(profil => ({
                    USER_ID: data?.dataValues?.USER_ID,
                    PROFIL_ID: profil?.PROFIL_ID
                }))
            )
        }

        res.status(201).json({
            httpStatus: 201,
            message: 'Utilisateur crée avec succès',
            data: data.dataValues
        });

    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(422).json({
                message: 'Erreur de validation des données',
                httpStatus: 422,
                data: null,
                errors: error?.errors.reduce((acc, curr) => {
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
 * Trouver un seul utilisateur
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const getUtilisateur = async (req, res) => {
    try {
        const utilisateur = await Utilisateur.findByPk(req?.params?.ID_utilisateur, {
            attributes: { exclude: 'PASSWORD' },
            include: {
                model: Profil,
                as: 'PROFILS',
                through: { attributes: [] }
            }
        });

        if (!utilisateur) {
            return res.status(404).json({
                httpStatus: 200,
                message: 'Utilisateur non trouvé',
                data: utilisateur
            });
        }

        res.json({
            httpStatus: 200,
            message: 'Utilisateurs trouvé avec succès',
            data: utilisateur
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
 * Modifier un utilisateur
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const updateUtilisateur = async (req, res) => {
    try {

        const utilisateur = Utilisateur.findByPk(req?.params?.ID_utilisateur);

        if (!utilisateur) {
            return res.status(404).json({
                httpStatus: 404,
                message: 'Utilisateur non trouvé',
                data: null
            });
        }

        const PROFIL_PICTURE = req?.files?.PROFIL_PICTURE ? req?.files?.PROFIL_PICTURE : null
        const PATH_SIGNATURE = req?.files?.PATH_SIGNATURE
        const PATH_PHOTO_PASSEPORT = req?.files?.PATH_PHOTO_PASSEPORT
        const PATH_EXTRAIT_CASIER_JUDICIARE = req?.files?.PATH_EXTRAIT_CASIER_JUDICIARE ? req?.files?.PATH_EXTRAIT_CASIER_JUDICIARE : null

        const PROFILS = JSON.parse(req?.body?.PROFILS || '[]')

        let validatedData;

        try {
            const updateSchema = yup.lazy(() => yup.object({
                USERNAME: yup.string().required().optional(),
                ID_TYPE_USER: yup.number().required().optional(),
                ID_GENRE: yup.number().required().optional(),
                ID_NATIONALITE: yup.number().required().optional(),
                ID_ETAT_CIVIL: yup.number().required().optional(),
                EMAIL: yup.string().email().required().optional(),
                NOM: yup.string().required().optional(),
                PRENOM: yup.string().required().optional(),
                TELEPHONE1: yup.string().notRequired(),
                TELEPHONE1: yup.string().notRequired(),
                ADRESSE: yup.string().notRequired(),
        
                PROFIL_PICTURE: yup.mixed().test("fileSize", "Le fichier est trop volumineux", (value) => {
                    if (!value?.size) return true
                    return value.size <= 200_000
                }),
        
                PATH_SIGNATURE: yup.mixed().test("fileSize", "Le fichier est trop volumineux", (value) => {
                    if (!value?.size) return true
                    return value.size <= 200_000
                }),
        
                PATH_PHOTO_PASSEPORT: yup.mixed().test("fileSize", "Le fichier est trop volumineux", (value) => {
                    if (!value?.size) return true
                    return value.size <= 200_000
                }),
        
                PATH_EXTRAIT_CASIER_JUDICIARE: yup.mixed().test("fileSize", "Le fichier est trop volumineux", (value) => {
                    if (!value?.size) return true
                    return value.size <= 200_000
                }),
        
                DATE_ENTREE: yup.date().required().optional(),
        
                DATE_SORTIE: yup.date()
                .notRequired()
                .test('is-greater', 'La date de sortie doit être postérieure à la date de début', function (value) {
                        const { DATE_ENTREE } = this.parent;

                        // Si la DATE_SORTIE n'est pas fourni, la validation passe
                        if (value === undefined) {
                            return true;
                        }

                        // Si la DATE_ENTREE est fourni, vérifiez si DATE_SORTIE est supérieur
                        return DATE_ENTREE ? value > DATE_ENTREE : true;
                }),
                PROFILS: yup.array()
            }));

            validatedData = await updateSchema.validate(
                {
                    ...req.body,
                    PROFIL_PICTURE,
                    PATH_SIGNATURE,
                    PATH_PHOTO_PASSEPORT,
                    PATH_EXTRAIT_CASIER_JUDICIARE,
                    PROFILS
                }, { abortEarly: false, stripUnknown: true });

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

        const uploadedFileProfilPicture = PROFIL_PICTURE ? await Upload.save(PROFIL_PICTURE, { destination: 'utilisateurs' }) : {};
        const uploadedFileSignature = PATH_SIGNATURE ? await Upload.save(PATH_SIGNATURE, { destination: 'utilisateurs/signatures' }) : {};
        const uploadedFilePassPort = PATH_PHOTO_PASSEPORT ? await Upload.save(PATH_PHOTO_PASSEPORT, { destination: 'utilisateurs/documents' }) : {};
        const uploadedFileDocsJudiciare = PATH_EXTRAIT_CASIER_JUDICIARE ? await Upload.save(PATH_EXTRAIT_CASIER_JUDICIARE, { destination: 'utilisateurs/documents' }) : {};

        await Utilisateur.update({
            ...validatedData,
            PROFIL_PICTURE: uploadedFileProfilPicture?.fileInfo?.fileName,
            PATH_SIGNATURE: uploadedFileSignature?.fileInfo?.fileName,
            PATH_PHOTO_PASSEPORT: uploadedFilePassPort?.fileInfo?.fileName,
            PATH_EXTRAIT_CASIER_JUDICIARE: uploadedFileDocsJudiciare?.fileInfo?.fileName,
        }, {
            where: { USER_ID: req?.params?.ID_utilisateur },
            returning: true,
        })

        if (validatedData?.PROFILS) {
            ProfilUtilisateur.destroy({ where: { USER_ID: req?.params?.ID_utilisateur } })
            ProfilUtilisateur.bulkCreate(
                validatedData?.PROFILS?.map(profil => ({
                    USER_ID: req?.params?.ID_utilisateur,
                    PROFIL_ID: profil?.PROFIL_ID
                })), { updateOnDuplicate: ['USER_ID', 'PROFIL_ID'] }
            )
        }

        res.json({
            httpStatus: 200,
            message: 'Utilisateur modifié avec succès',
            data: utilisateur
        });


    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(422).json({
                message: 'Erreur de validation des données',
                httpStatus: 422,
                data: null,
                errors: error?.errors.reduce((acc, curr) => {
                    if (curr.path) {
                        return { ...acc, [curr.path]: curr.message }
                    }
                }, {})
            });
        }

        res.status(500).json({
            message: 'Erreur interne du serveur',
            httpStatus: 500,
            data: error.message
        })
    }
}

/**
 * Trouver un seul utilisateur
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const deleteUtilisateur = async (req, res) => {
    try {
        const USERS = JSON.parse(req?.body?.USER_IDS);

        await ProfilUtilisateur.destroy({ where: { USER_ID: USERS } })
        await Utilisateur.destroy({ where: { USER_ID: USERS } })

        res.json({
            httpStatus: 200,
            message: `${USERS.length} utilisateur(s) supprimé(s) avec succès`,
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
    getUtilisateurs,
    createUtilisateur,
    getUtilisateur,
    updateUtilisateur,
    deleteUtilisateur
};