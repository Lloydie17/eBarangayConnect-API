const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        title: { type: DataTypes.STRING, allowNull: false },
        firstName: { type: DataTypes.STRING, allowNull: false },
        lastName: { type: DataTypes.STRING, allowNull: false },
        fullName: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.getDataValue('firstName')} ${this.getDataValue('lastName')}`;
            },
            set(value) {
                throw new Error('Do not try to set the `fullname` value manually. It is automatically calculated from `firstName` and `lastName`.');
            }
        },
        address: { type: DataTypes.STRING, allowNull: false },
        latitude: { type: DataTypes.STRING, allowNull: false },
        longitude: { type: DataTypes.STRING, allowNull: false},
        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated: { type: DataTypes.DATE },
    };

    return sequelize.define('residents', attributes);
}