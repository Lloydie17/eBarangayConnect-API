const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        residentId: { type: DataTypes.INTEGER, allowNull: false },
        certificatePurpose: { type: DataTypes.STRING, allowNull: false },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    };

    return sequelize.define('residentRecord', attributes);
}