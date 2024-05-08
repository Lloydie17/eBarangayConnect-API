const config = require('config.json');
const { Op } = require('sequelize');
const db = require('_helpers/db');
//const pdf = require('html-pdf');
//const fs = require('fs');

module.exports = {
    createResidents,
    updateResidents,
    getAll,
    getById,
    delete: _delete
    //generateCertificate
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

/*
async function generateCertificate(certificateData) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
    ];

    const currentDate = new Date();
    const formattedDate = `${months[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

    // Generate HTML for the certificate
    const certificateHTML = `
        <div style="text-align: center;>
            <table style="margin: 0 auto;">
                <tr>
                    <td>
                        <img src="/Images/ErmitaLogo.png" alt="Barangay Seal" style="width:100px;height:100px;">
                    </td>
                    <td style="text-align: left;">
                        <h2>Republic of the Philippines</h2>
                        <h3>City of Cebu</h3>
                        <h3>Barangay Ermita</h3>
                        <p>Office of Barangay Captain</p>
                        <p>Barangay Hall, Kawit St.</p>
                        <p>Telephone No. 417-4636</p>
                    </td>
                    <td>
                        <img src="/Images/CityLogo.png" alt="Cebu City Seal" style="width:100px;height:100px;">
                    </td>
                </tr>
            </table>
            <h2>Barangay Certification</h2>
            <p>To Whom It May Concern:</p>

            <p>This is to certify that ${certificateData.name}, legal age,
            ${certificateData.maritalStatus}, is a bona fide resident at ${certificateData.address},
            Barangay ${certificateData.barangay}, ${certificateData.city}, who is known in the community
            and ${certificateData.voter ? 'is a Registered voter.' : 'is not a Registered voter.'}</p>

            <p>FURTHER, THIS IS ALSO TO CERTIFY that he/she
            has No Derogatory Records, as per Barangay Log Book of
            records, a person with Good Moral Character and Probity.
            This issued to attest the veracity of the foregoing
            Certification is for Employment Purpose/s.</p>

            <p>Issued on this day ${formattedDate} at Barangay
            Hall, Kawit St., Barangay ${certificateData.barangay}, ${certificateData.city}, Philippines.</p>

            <p>HON. MARK RIZALDY V. MIRAL</p>
            <p>Ermita Barangay Captain</p>

            <p>${certificateData.name}<br>
            Requestor's Specimen Signature</p>
        </div>
    `;

    // Generate PDF from HTML
    return new Promise((resolve, reject) => {
        pdf.create(certificateHTML).toFile('C:/Users/pc/Desktop/test/certificate.pdf', function(err, res) {
            if (err) {
                console.log(err);
                reject('Error generating certificate');
            } else {
                console.log('Certificate generated successfully');
                resolve(res);
            }
        });
    });
}*/

// helper functions

async function getResident(id) {
    const resident = await db.Resident.findByPk(id);
    if (!resident) throw 'Resident not found';
    return resident;
}