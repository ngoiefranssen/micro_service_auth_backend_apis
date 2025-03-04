const { DataTypes } = require('sequelize');
const sequelize = require('../index').sequelize;

const nationaliteModel = sequelize.define('nationalites', {
    
    ID_NATIONALITE: {
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true,
    },

    NAME_NATIONALITE: {
        type: DataTypes.STRING(200),
        unique: true,
    },

}, {
    timestamps: false,
})


module.exports = nationaliteModel;