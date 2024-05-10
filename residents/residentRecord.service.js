const config = require('config.json');
const { Op } = require('sequelize');
const db = require('_helpers/db');

module.exports = {
    createCertificate,
    getAll,
    getById
}

function basicDetails(residentRecord) {
    const { id, certificatePurpose, createdAt } = residentRecord;
    return { id, certificatePurpose, createdAt };
}

async function createCertificate(params) {
    const residentRecord = new db.ResidentRecord(params);

    // save resident
    await residentRecord.save();

    return basicDetails(residentRecord);
}


async function getAll() {
    const residentRecords = await db.ResidentRecord.findAll();
    return residentRecords.map(x => basicDetails(x));
}

async function getById(id) {
    const residentRecord = await getRecords(id);
    return basicDetails(residentRecord);
}


// helper functions

async function getRecords(id) {
    const residentRecord = await db.ResidentRecord.findByPk(id);
    if (!residentRecord) throw 'Resident Record not found';
    return residentRecord;
}