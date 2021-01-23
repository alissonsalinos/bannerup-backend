const mongoose = require("mongoose");


const campaignSchema = new mongoose.Schema({
    title: {type: String, required: true},
    userId: {type: String, required: true},
    pEmpresas: {type: String, required: false},
    pUsuarios: {type: String, required: false},
    pRedes: {type: String, required: false},
    pInst: {type: String, required: false},
    app: {type: String, required: false},
    pBnnImgUrl: {type: String, require: false},
    pBnnImgLink: {type: String, require: false},
    pBnnEmbedCode: {type: String, reqire: false},
    appBnnImgUrl: {type: String, require: false},
    appBnnImgLink: {type: String, require: false},
    appBnnEmbedCode: {type: String, reqire: false},
    startDate: {type: String, required: true},
    endDate: {type: String, required: true},
    active: {type: String, required: true},
    userCreator: {type: String, require: true},
    userUpdater: {type: String, require: false},
    updatedAt: {type: String, require: false},
    createdAt: {type: Date, default: new Date()} 

},);

module.exports = Campaign = mongoose.model("campaign", campaignSchema);