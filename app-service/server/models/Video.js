const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({
    uploader: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String,
    },
    videoPath: {
        type: String,
    },
    duration: {
        type: String
    },
    thumbnail: {
        type: String
    },
    jsonPath: {
        type: String
    },
    optimalGraphPath: {
        type: String
    },
    towLineGraphPath: {
        type: String
    },
    physioVideoId: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    },
    score: {
        type: String
    },
    isPatient: {
        type: Boolean,
    },
    status: {
        type: String,
        default: "panding"
    }

}, { timestamps: true })

const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }