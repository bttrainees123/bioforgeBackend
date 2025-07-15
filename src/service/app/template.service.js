const templateModel = require('../../model/template.model');
const { default: mongoose } = require("mongoose");

const templateService = {};

templateService.add = async (request) => {
    // const userId = request.auth._id;
    const body = request.body;
    console.log(body);
    // body.userId = userId;
    const template = await templateModel.create(body);
    return template;
};
templateService.update = async (request) => {
    await templateModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request?.body?._id) },request.body);
    return
}  
templateService.delete = async (request) => {
    await templateModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request?.query?._id) },{ is_deleted: '1' });
    return;
}
templateService.getAll = async (request) => {
    return await templateModel.aggregate([
        {
            $match: {
                is_deleted: '0',
                status: 'active'
            }
        },
        {
            $project: {
                templateName: 1,
                status: 1,
            }
        }
    ])
}

module.exports = templateService;