const { DataTypes } = require('sequelize');
const sequelize = require('../index').sequelize;

const EtatCivileModel = sequelize.define('etat_civils', {
    
    ID_ETAT_CIVIL: {
        type: DataTypes.TINYINT,
        primaryKey: true,
        autoIncrement: true,
    },

    DESCR_ETAT_CIVIL: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },

}, {
    timestamps: false,
})


module.exports = EtatCivileModel;