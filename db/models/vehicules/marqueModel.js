const { DataTypes } = require('sequelize');
const sequelize = require('../index').sequelize;

const Marque = sequelize.define('marques', {
    ID_MARQUE: {
        type: DataTypes.SMALLINT(6),
        primaryKey: true,
        autoIncrement: true,
    },

    NAME_MARQUE: {
        type: DataTypes.STRING(100),
        unique: true,
    },

}, {
    timestamps: false,
    initialAutoIncrement: 1,
})


module.exports = Marque;