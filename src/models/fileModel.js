import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    originalName: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    directory: {
        type: String,
        default: ''
    },
    relativePath: {
        type: String,
        default: ''
    },
    modul: {
        type: String,
        default: ''
    },
    firmaGuid: {
        type: String,
        default: ''
    },
    fisTurId: {
        type: String,
        default: ''
    },
    satirGuid: {
        type: String,
        default: ''
    },
}, {
    timestamps: true
});

const File = mongoose.model('File', fileSchema);

export default File;