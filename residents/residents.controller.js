const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const residentService = require('./resident.service');

// routes
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);
router.get('/', getAll);
router.get('/:id', getById);
router.get('/location/:firstName', getResidentLocationByName);
//router.post('/generateCertificate', generateCertificate);

module.exports = router;

function getResidentLocationByName(req, res, next) {
    residentService.getResidentLocation(req.params.firstName)
        .then(location => res.json(location))
        .catch(next);
}

function getAll(req, res, next) {
    residentService.getAll()
        .then(residents => res.json(residents))
        .catch(next);
}

function getById(req, res, next) {
    residentService.getById(req.params.id)
        .then(resident => resident ? res.json(resident) : res.sendStatus(404))
        .catch(next);
}

function createSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        birthDate: Joi.date().iso().required(),
        occupation: Joi.string().allow(null, ''),
        address: Joi.string().required(),
        contactNumber: Joi.string().required(),
        latitude: Joi.string().required(),
        longitude: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    residentService.createResidents(req.body)
        .then(resident => res.json(resident))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().empty(''),
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        birthDate: Joi.date().iso().empty(''),
        occupation: Joi.string().allow(null, '').empty(''),
        address: Joi.string().empty(''),
        contactNumber: Joi.string().empty(''),
        latitude: Joi.string().empty(''),
        longitude: Joi.string().empty('')
    });

    validateRequest(req, next, schema);
}

function update(req, res, next) {
    residentService.updateResidents(req.params.id, req.body)
        .then(resident => res.json(resident))
        .catch(next);
}

function _delete(req, res, next) {
    residentService.delete(req.params.id)
        .then(() => res.json({ message: 'Resident deleted successfully' }))
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