const { DataTypes } = require('sequelize');
const sequelize = require('../index').sequelize;

const typeVehiculModel = sequelize.define('types_vehicules', {
    ID_TYPE_VEHICULE: {
        type: DataTypes.TINYINT,
        primaryKey: true,
        autoIncrement: true,
    },

    TYPE_NAME: { 
        type: DataTypes.STRING
    }

}, {
    timestamps: false,
})


module.exports = typeVehiculModel;