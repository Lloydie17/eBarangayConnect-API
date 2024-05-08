const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        residentId: { type: DataTypes.INTEGER, allowNull: false },
        documentType: { type: DataTypes.STRING, allowNull: false },
        documentContent: { type: DataTypes.TEXT, allowNull: false },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updatedAt: { type: DataTypes.DATE }
    };

    return sequelize.define('ResidentRecord', attributes);
}
