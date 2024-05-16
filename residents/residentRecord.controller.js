const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const residentRecordService = require('./residentRecord.service');

// routes
router.post('/', createSchema, create);
router.get('/', getAll);
router.get('/:id', getById);
router.post('/generate', generateCertificate);
router.get('/resident/:residentId', getAllByResidentId);

module.exports = router;

function getAllByResidentId(req, res, next) {
    const { residentId } = req.params;

    // Fetch records by residentId
    residentRecordService.getAllByResidentId(residentId)
        .then(records => res.json(records))
        .catch(next);
}

function getAll(req, res, next) {
    residentRecordService.getAll()
        .then(residentRecords => res.json(residentRecords))
        .catch(next);
}

function getById(req, res, next) {
    residentRecordService.getById(req.params.id)
        .then(residentRecord => residentRecord ? res.json(residentRecord) : res.sendStatus(404))
        .catch(next);
}

function createSchema(req, res, next) {
    const schema = Joi.object({
        residentId: Joi.string().required(),
        certificatePurpose: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    residentRecordService.createCertificate(req.body)
        .then(resident => res.json(resident))
        .catch(next);
}

function generateCertificate(req, res, next) {
    const { residentId, certificatePurpose } = req.body;
    residentRecordService.generateCertificate(residentId, certificatePurpose)
        .then((pdfFilePath) => {
            // Send the PDF file path as a response
            res.json({ pdfFilePath });
        })
        .catch(next);
}
