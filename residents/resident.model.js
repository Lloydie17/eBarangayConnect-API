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
                throw new Error('Do not try to set the `fullName` value manually. It is automatically calculated from `firstName` and `lastName`.');
            }
        },
        birthDate: { type: DataTypes.DATEONLY, allowNull: false },
        age: {
            type: DataTypes.VIRTUAL,
            get() {
                const today = new Date();
                const birthdate = new Date(this.getDataValue('birthDate'));
                let age = today.getFullYear() - birthdate.getFullYear();
                const monthDiff = today.getMonth() - birthdate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
                    age--;
                }
                return age;
            }
        },
        occupation: { type: DataTypes.STRING, allowNull: true },
        address: { type: DataTypes.STRING, allowNull: false },
        contactNumber: { type: DataTypes.STRING, allowNull: false },
        latitude: { type: DataTypes.STRING, allowNull: false },
        longitude: { type: DataTypes.STRING, allowNull: false},
        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated: { type: DataTypes.DATE },
    };

    return sequelize.define('resident', attributes);
}
