const statusCodes = require("../../helper/statusCodes")
const responseHelper = require("../../helper/response");
const userModel = require("../../model/user.model");
const linkService = require("../../service/app/addlink.service");


class linkController {
    addLinks = async (request, response) => {
        try {
            const userId = String(request.auth._id);
            const user = await userModel.findOne({ _id: request.body.userId });
            if (!user || String(user._id) !== userId) {
                return responseHelper.Forbidden(response, "You are not authorized to review this add link process.", null, statusCodes.OK);
            }
            const result = await linkService.addLinks(request);
            return responseHelper.success(response, "Links added successfully", result.links, statusCodes.OK);
        } catch (error) {
            console.error("Add Links Error:", error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };
    updateLink = async (request, response) => {
        try {
            const updatedLink = await linkService.updateLink(request);
            return responseHelper.success(response, "Link updated successfully", updatedLink, statusCodes.OK);
        } catch (error) {
            console.error("Update Link Error:", error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };
    deleteLink = async (request, response) => {
        try {
            const ObjectIdError = responseHelper.mongooseObjectIdError(request?.query?._id, response, "_id");
            if (ObjectIdError) return;
             const userId = String(request.auth._id);
            const user = await userModel.findOne({ _id: request.query.userId, is_deleted: '0' });
            if (!user || String(user._id) !== userId) {
                return responseHelper.Forbidden(response, "You are not authorized to review this deleted link.", null, statusCodes.OK);
            }
            const deletedLink = await linkService.deleteLink(request);
            return responseHelper.success(response, "Link deleted successfully", deletedLink, statusCodes.OK);
        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}
module.exports =new linkController