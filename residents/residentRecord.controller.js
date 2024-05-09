const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const residentRecordService = require('./residentRecord.service');

// routes
router.post('/', createSchema, create);
router.get('/', getAll);
router.get('/:id', getById);

module.exports = router;

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
        purpose: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    residentRecordService.createCertificate(req.body)
        .then(resident => res.json(resident))
        .catch(next);
}

/*

function generateCertificate(req, res, next) {
    residentService.generateCertificate(req.body)
        .then(() => {
            // Send the PDF file as a response
            res.sendFile('C:/Users/pc/Desktop/test/certificate.pdf');
        })
        .catch(next);
}*/