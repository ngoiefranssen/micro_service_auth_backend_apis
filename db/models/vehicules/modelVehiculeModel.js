const { DataTypes } = require('sequelize');
const sequelize = require('../index').sequelize;
const MarqueModel = require('./MarqueModel');

const ModelVehiculeModel = sequelize.define('modele', {
    ID_MODEL: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    ID_MARQUE: {
        type: DataTypes.STRING,
        unique: true,
    },

    NAME_MODEL: {
        type: DataTypes.STRING,
        unique: true,
    },

    ANNEE: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^[0-9]{4}$/ // Pour s'assurer qu'il s'agit d'une année au format YYYY
        }
    }

}, {
    timestamps: false,
    initialAutoIncrement: 1,
})

ModelVehiculeModel.belongsToMany(MarqueModel, { through: ModelVehiculeModel, foreignKey: 'ID_MARQUE', as: 'MARQUES' })

module.exports = ModelVehiculeModel;