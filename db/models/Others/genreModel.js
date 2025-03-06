const { DataTypes } = require('sequelize');
const sequelize = require('../index').sequelize;

const genreModel = sequelize.define('genres', {
    
    ID_GENRE: {
        type: DataTypes.TINYINT,
        primaryKey: true,
        autoIncrement: true,
    },

    NAME_GENER: {
        type: DataTypes.STRING(20),
        unique: true,
    },

}, {
    timestamps: false,
})

module.exports = genreModel;