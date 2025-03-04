const { DataTypes } = require('sequelize');
const sequelize = require('../index').sequelize;

const paysModel = sequelize.define('pays', {
    
    ID_PAYS: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    NAME_PAYS: {
        type: DataTypes.STRING(100),
        unique: true,
    },

}, {
    timestamps: false,
})

module.exports = paysModel;