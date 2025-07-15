const templateService = require('../../service/app/template.service');
const { default: mongoose } = require("mongoose");
const statusCodes = require('../../helper/statusCodes');
const responseHelper = require('../../helper/response');
const templateModel = require('../../model/template.model');
class templateController {
    add = async (request, response) => {
        try {
            const data = templateService.add(request);
            return responseHelper.success(response, `Template added successfully`, data, statusCodes.CREATED);
        } catch (error) {
            console.error(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    update = async (request, response) => {
        try {
            const data = await templateService.update(request);
            return responseHelper.success(response, `Template updated successfully`, data, statusCodes.OK);
        } catch (error) {
            console.error(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    delete = async (request, response) => {
        try {
            const objectId = responseHelper.mongooseObjectIdError(request?.query?._id, response, "_id");
            if (objectId) return;
            const templateInfo = await templateModel.findOne({ _id: new mongoose.Types.ObjectId(request?.query?._id) })
            if (!templateInfo) {
                return responseHelper.Forbidden(response, "Template not exists", null, statusCodes.OK);
            } else if (templateInfo.is_deleted === '1') {
                return responseHelper.Forbidden(response, "Template is Already deleted", null, statusCodes.OK);
            }
            const data = await templateService.delete(request);
            return responseHelper.success(response, `Template deleted successfully`, data, statusCodes.OK);
        } catch (error) {
            console.error(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    getAll = async (request, response) => {
        try {
            // const objectId = responseHelper.mongooseObjectIdError(request?.query?._id, response, "_id");
            // if (objectId) return;
            // const templateInfo = await templateModel.findOne({ _id: new mongoose.Types.ObjectId(request?.query?._id) })
            // if (!templateInfo) {
            //     return responseHelper.Forbidden(response, "Template  not exists", null, statusCodes.OK);
            // } else if (templateInfo.is_deleted === '1') {
            //     return responseHelper.Forbidden(response, "Template  is deleted", null, statusCodes.OK);
            // } else if (templateInfo.status === 'inactive') {
            //     return responseHelper.Forbidden(response, "Template  is Inactive", null, statusCodes.OK);
            // }
            const data = await templateService.getAll(request);
            return responseHelper.success(response, `All templates fetched successfully`, data, statusCodes.OK);
        } catch (error) {
            console.error(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };
}
module.exports = new templateController();

