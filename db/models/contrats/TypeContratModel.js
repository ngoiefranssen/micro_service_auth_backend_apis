const { DataTypes } = require('sequelize');
const sequelize = require('../index').sequelize;

const TypeContratModel = sequelize.define('type_contrats', {
    ID_TYPE_CONTRAT: {
        type: DataTypes.TINYINT,
        primaryKey: true,
        autoIncrement: true,
    },

    TYPE_CONTRAT_NAME: {
        type: DataTypes.STRING(100),
        unique: true,
    },

}, {
    timestamps: false,
})


module.exports = TypeContratModel;