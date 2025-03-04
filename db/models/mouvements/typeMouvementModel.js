const { DataTypes } = require('sequelize');
const sequelize = require('../index').sequelize;

const TypeMouvementModel = sequelize.define('type_mouvements', {
    
    ID_TYPE_MOUVEMENT: {
        type: DataTypes.TINYINT,
        primaryKey: true,
        autoIncrement: true,
    },

    DESCR_TYPE_MOUVEMENT: {
        type: DataTypes.STRING(100),
        unique: true,
    },

}, {
    timestamps: false,
})

module.exports = TypeMouvementModel;