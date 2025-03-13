import File from '../models/fileModel.js';

export const create = async (fileData) => {
    return await File.create(fileData);
};

export const findAll = async () => {
    return await File.find().sort({ createdAt: -1 });
};

export const findById = async (id) => {
    return await File.findById(id);
};

export const deleteById = async (id) => {
    return await File.findByIdAndDelete(id);
};