const { DataTypes } = require('sequelize');
const sequelize = require('../index').sequelize;

const statutModel = sequelize.define('statuts', {
    
    ID_STATUT: {
        type: DataTypes.TINYINT,
        primaryKey: true,
        autoIncrement: true,
    },

    STATUT_NAME: {
        type: DataTypes.STRING(50),
        unique: true,
    },

}, {
    timestamps: false,
})


module.exports = statutModel;