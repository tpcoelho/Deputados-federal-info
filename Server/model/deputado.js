const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeputadoSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        minlength: 4
    },
    photo: {
        type: String,
        required: true
    },
    bday: {
        type: String,
        required: true
    },
    party: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    situation: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: true
    },
    period: {
        type: String,
        required: false
    },
    mainCommission: {
        type: String,
        required: false
    },
    substituteCommission: {
        type: String,
        required: false
    },
    fullAddress: {
        address: {
            type: String,
            required: true
        },
        complement: {
            type: String,
            required: true
        },
        CEP: {
            type: String,
            required: true
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Deputado', DeputadoSchema);