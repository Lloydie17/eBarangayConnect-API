const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const residentService = require('./resident.service');
const Role = require('_helpers/role');

// routes
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);
//router.post('/generateCertificate', generateCertificate);

module.exports = router;

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
    const schema = {
        title: Joi.string().empty(''),
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        birthDate: Joi.date().iso().empty(''),
        occupation: Joi.string().allow(null, '').empty(''),
        address: Joi.string().empty(''),
        contactNumber: Joi.string().empty(''),
        latitude: Joi.string().empty(''),
        longitude: Joi.string().empty('')
    };

    validateRequest(req, next, schema);
}

function update(req, res, next) {
    // admins or staff can update any residents
    if (req.user.role !== Role.Admin && req.user.role !== Role.Staff) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    residentService.updateResidents(req.params.id, req.body)
        .then(resident => res.json(resident))
        .catch(next);
}

function _delete(req, res, next) {
    // admins can delete any account
    if (req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

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