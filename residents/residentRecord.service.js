const config = require('config.json');
const { Op } = require('sequelize');
const db = require('_helpers/db');
const pdf = require('html-pdf');

module.exports = {
    createCertificate,
    getAll,
    getById,
    generateCertificate,
    getAllByResidentId
}

function basicDetails(residentRecord) {
    const { id, residentId, certificatePurpose, createdAt } = residentRecord;
    return { id, residentId, certificatePurpose, createdAt };
}

async function createCertificate(params) {
    const residentRecord = new db.ResidentRecord(params);

    // save resident
    await residentRecord.save();

    return residentRecord;
}


async function getAll() {
    const residentRecords = await db.ResidentRecord.findAll();
    return residentRecords.map(x => basicDetails(x));
}

async function getById(id) {
    const residentRecord = await getRecords(id);
    return basicDetails(residentRecord);
}

async function generateCertificate(residentId, certificatePurpose) {
    // Fetch the resident and residentRecord based on residentId and certificatePurpose
    const resident = await db.Resident.findByPk(residentId);
    const residentRecord = await db.ResidentRecord.findOne({
        where: { residentId, certificatePurpose }
    });

    if (!resident || !residentRecord) {
        throw 'Resident or Resident Record not found';
    }

    return new Promise((resolve, reject) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December'
        ];

        const currentDate = new Date();
        const formattedDate = `${months[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

        const certificateHTML = `
            <div style="text-align: center;">
                <table style="margin: 0 auto;">
                    <tr>
                        <td>
                            <img src="C:/Users/yy122/Desktop/eBarangayConnect-API/Images/ErmitaLogo.png" alt="Barangay Seal" style="width:100px;height:100px;">
                        </td>
                        <td style="text-align: center;">
                            <h2>Republic of the Philippines</h2>
                            <h3>City of Cebu</h3>
                            <h3>Barangay Ermita</h3>
                            <p>Office of Barangay Captain</p>
                            <p>Barangay Hall, Kawit St.</p>
                            <p>Telephone No. 417-4636</p>
                        </td>
                        <td>
                            <img src="C:/Users/yy122/Desktop/eBarangayConnect-API/Images/CityLogo.png" alt="Cebu City Seal" style="width:100px;height:100px;">
                        </td>
                    </tr>
                </table>
                <h2>Barangay Certification</h2>
                <p>To Whom It May Concern:</p>

                <p>This is to certify that <b>${resident.firstName} ${resident.lastName}</b>, legal age,
                married/single, is a bona fide resident at <b>${resident.address}</b>,
                Barangay Ermita, Cebu City who is known in the community
                and is a Registered Voter</p>

                <p>FURTHER, THIS IS ALSO TO CERTIFY that he/she
                has No Derogatory Records, as per Barangay Log Book of
                records, a person with Good Moral Character and Probity.
                This issued to attest the veracity of the foregoing
                Certification is for <b>${residentRecord.certificatePurpose}</b> Purpose/s.</p>

                <p>Issued on this day <b>${formattedDate}</b> at Barangay
                Hall, Kawit St., Barangay Ermita Cebu City, Philippines.</p>

                <p>HON. MARK RIZALDY V. MIRAL</p>
                <p>Ermita Barangay Captain</p>

                <p><b>${resident.firstName} ${resident.lastName}</b><br>
                Requestor's Specimen Signature</p>
            </div>
        `;

        pdf.create(certificateHTML).toFile(`C:/Users/yy122/Desktop/eBarangayConnect-API/certificates/${resident.fullName}_${residentRecord.certificatePurpose}_Certificate.pdf`, function (err, res) {
            if (err) {
                console.log(err);
                reject('Error generating certificate');
            } else {
                console.log('Certificate generated successfully');
                resolve(res);
            }
        });
    });
}

async function getAllByResidentId(residentId) {
    return await db.ResidentRecord.findAll({ where: { residentId } });
}


// helper functions

async function getRecords(id) {
    const residentRecord = await db.ResidentRecord.findByPk(id);
    if (!residentRecord) throw 'Resident Record not found';
    return residentRecord;
}