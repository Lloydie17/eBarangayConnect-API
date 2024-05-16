const config = require('config.json');
const { Op } = require('sequelize');
const db = require('_helpers/db');
const pdf = require('html-pdf');

module.exports = {
    createCertificate,
    getAll,
    getById,
    generateCertificate
}

function basicDetails(residentRecord) {
    const { id, residentId, certificatePurpose, createdAt } = residentRecord;
    return { id, residentId, certificatePurpose, createdAt };
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

async function generateCertificate(residentId, certificatePurpose) {
    const resident = await db.Resident.findByPk(residentId);
    if (!resident) throw 'Resident not found';

    const residentRecord = await db.ResidentRecord.create({ residentId, certificatePurpose });
    if (!residentRecord) throw 'Error creating resident record';

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
    ];

    const currentDate = new Date();
    const formattedDate = `${months[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

    // Generate HTML for the certificate
    const certificateHTML = `
        <div style="text-align: center;">
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

            <p>This is to certify that ${resident.fullName}, legal age,
            married/single, is a bona fide resident at ${resident.address},
            Barangay Ermita, Cebu City who is known in the community
            and is a Registered Voter</p>

            <p>FURTHER, THIS IS ALSO TO CERTIFY that he/she
            has No Derogatory Records, as per Barangay Log Book of
            records, a person with Good Moral Character and Probity.
            This issued to attest the veracity of the foregoing
            Certification is for ${certificatePurpose} Purpose/s.</p>

            <p>Issued on this day ${formattedDate} at Barangay
            Hall, Kawit St., Barangay Ermita Cebu City, Philippines.</p>

            <p>HON. MARK RIZALDY V. MIRAL</p>
            <p>Ermita Barangay Captain</p>

            <p>${resident.fullName}<br>
            Requestor's Specimen Signature</p>
        </div>
    `;

    const pdfFilePath = `C:/Users/pc/Desktop/test/certificate_${residentRecord.id}.pdf`;

    // Generate PDF from HTML
    pdf.create(certificateHTML).toFile(pdfFilePath, function(err, res) {
        if (err) {
            console.log(err);
            throw new Error('Error generating certificate');
        } else {
            console.log('Certificate generated successfully');
        }
    });

    return pdfFilePath;
}



// helper functions

async function getRecords(id) {
    const residentRecord = await db.ResidentRecord.findByPk(id);
    if (!residentRecord) throw 'Resident Record not found';
    return residentRecord;
}