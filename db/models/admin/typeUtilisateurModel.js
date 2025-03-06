const { DataTypes } = require('sequelize');
const sequelize = require('../index').sequelize;

const TypeUtilisateurModel = sequelize.define('type_utilisateurs', {
    
    ID_TYPE_USER: {
        type: DataTypes.TINYINT(4),
        primaryKey: true,
        autoIncrement: true,
    },

    DESCR_TYPE_UTILISATEUR: {
        type: DataTypes.STRING(50),
        unique: true
    },
}, {
    timestamps: false,
})

module.exports = TypeUtilisateurModel