const config = require('config.json');
const { Op } = require('sequelize');
const db = require('_helpers/db');

module.exports = {
    createResidents,
    updateResidents,
    getAll,
    getById,
    delete: _delete,
    getResidentLocation,
}

function basicDetails(resident) {
    const { id, title, firstName, lastName, fullName, birthDate, age, occupation, address, contactNumber, latitude, longitude, updated } = resident;
    return { id, title, firstName, lastName, fullName, birthDate, age, occupation, address, contactNumber, latitude, longitude, updated};
}

async function createResidents(params) {
    const resident = new db.Resident(params);

    // save resident
    await resident.save();

    return basicDetails(resident);
}

async function updateResidents(id, params) {
    const resident = await getResident(id);

    // copy params to account and save
    Object.assign(resident, params);
    resident.updated = Date.now();
    await resident.save();

    return basicDetails(resident);
}

async function getAll() {
    const residents = await db.Resident.findAll();
    return residents.map(x => basicDetails(x));
}

async function getById(id) {
    const resident = await getResident(id);
    return basicDetails(resident);
}

async function _delete(id) {
    const resident = await getResident(id);
    await resident.destroy();
}

async function getResidentLocation(firstName) {
    const resident = await db.Resident.findOne({ where: { firstName: firstName } });
    if (!resident) throw 'Resident not found';
    return { latitude: resident.latitude, longitude: resident.longitude };
}

// helper functions

async function getResident(id) {
    const resident = await db.Resident.findByPk(id);
    if (!resident) throw 'Resident not found';
    return resident;
}