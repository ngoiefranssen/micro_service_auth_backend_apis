const { DataTypes } = require('sequelize');
const sequelize = require('../index').sequelize;

const typeVersementModel = sequelize.define('versement_types', {
    
    ID_TYPE_VERSEMENT: {
        type: DataTypes.TINYINT,
        primaryKey: true,
        autoIncrement: true,
    },

    DESCR_TYPE_VERSEMENT: {
        type: DataTypes.STRING(50),
        unique: true,
    },

}, {
    timestamps: false,
})


module.exports = typeVersementModel;