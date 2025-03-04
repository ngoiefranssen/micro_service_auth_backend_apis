const { DataTypes } = require('sequelize');
const ProfilUtilisateur = require('./profilUtilisateurModel');
const Profil = require('./profilModel');
const TypeUtilisateurModel = require('./typeUtilisateurModel')
const EtatCivile = require('../Others/etatCivilModel')
const Genre = require('../Others/genreModel')
const Nationalite = require('../Others/nationaliteModel')
const sequelize = require('../index').sequelize;

const Utilisateur = sequelize.define('utilisateurs', {
    USER_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    ID_GENRE: {
        type: DataTypes.TINYINT,
            references: {
                model: Genre,
                key: 'ID_GENRE',
        },
    },

    ID_NATIONALITE: {
        type: DataTypes.SMALLINT,
            references: {
                model: Nationalite,
                key: 'ID_NATIONALITE',
        },
    },

    ID_ETAT_CIVIL: {
        type: DataTypes.TINYINT,
            references: {
                model: EtatCivile,
                key: 'ID_ETAT_CIVIL',
        },
    },

    ID_TYPE_USER: {
        type: DataTypes.TINYINT,
            references: {
                model: TypeUtilisateurModel,
                key: 'ID_TYPE_USER',
        },
    },

    USERNAME: {
        type: DataTypes.STRING(80),
        unique: true,
        allowNull: false,
    },

    EMAIL: {
        type: DataTypes.STRING(80),
        unique: true,
        allowNull: false
    },

    PASSWORD: {
        type: DataTypes.STRING(80),
        allowNull: false
    },

    NOM: DataTypes.STRING,
    PRENOM: DataTypes.STRING,
    TELEPHONE1: DataTypes.STRING,
    TELEPHONE2: DataTypes.STRING,
    PROFIL_PICTURE: DataTypes.STRING,
    ADRESSE: DataTypes.STRING,
    PATH_SIGNATURE: DataTypes.STRING,
    PATH_PHOTO_PASSEPORT: DataTypes.STRING,
    PATH_EXTRAIT_CASIER_JUDICIARE: DataTypes.STRING,

    DATE_ENTREE: {
        type: DataTypes.DATE,
        allowNull: false
    },

    DATE_SORTIE: {
        type: DataTypes.DATE,
        allowNull: true
    },

    IS_DELETED: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0
    },
}, {    
    timestamps: false,
})

Utilisateur.belongsToMany(Profil, { through: ProfilUtilisateur, foreignKey: 'USER_ID', as: 'PROFILS' })
Profil.belongsToMany(Utilisateur, { through: ProfilUtilisateur, foreignKey: 'PROFIL_ID', as: 'PROFILS' })
Utilisateur.belongsTo(Genre, { foreignKey: "ID_GENRE", as: "GENRES"});
Utilisateur.belongsTo(TypeUtilisateurModel, { foreignKey: "ID_TYPE_USER", as: "TYPE_USERS"});
Utilisateur.belongsTo(Nationalite, { foreignKey: "ID_NATIONALITE", as: "NATIONALITES"});
Utilisateur.belongsTo(EtatCivile, { foreignKey: "ID_ETAT_CIVIL", as: "ETAT_CIVILS"});

module.exports = Utilisateur;
