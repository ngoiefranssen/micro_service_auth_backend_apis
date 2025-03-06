const { DataTypes } = require('sequelize');
const sequelize = require('../index').sequelize;

const VehiculeModel = sequelize.define('vehicule', {
    ID_VEHICULE: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    // ID_MODEL
    // ID_TRANSPORTEUR
    // ID_TYPE_VEHICULE
    // NAME_VEHICULE
    // IMMATRICULATION
    // STATUT

}, {
    timestamps: false,
    initialAutoIncrement: 1,
})

module.exports = VehiculeModel;
