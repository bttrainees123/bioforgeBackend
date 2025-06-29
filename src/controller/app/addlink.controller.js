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
    addUserLinks = async (request, response) => {
        try {
            const userIdFromToken = String(request.auth._id);
            const userIdFromBody = String(request.body.userId);
            const links = request.body?.links;

            // 1. Authorization check
            if (!userIdFromBody || userIdFromToken !== userIdFromBody) {
                return responseHelper.Forbidden(
                    response,
                    "You are not authorized to add links for this user.",
                    null,
                    statusCodes.OK
                );
            }

            // 2. Validation check
            if (!Array.isArray(links) || links.length === 0) {
                return responseHelper.Forbidden(response, "A non-empty array of links is required.");
            }

            for (const link of links) {
                if (!link.linkTitle || !link.linkUrl || !link.linkLogo) {
                    return responseHelper.Forbidden(response, "Each link must include linkTitle, linkUrl, and linkLogo.");
                }
            }

            // 3. Call service
            const result = await linkService.addUserLinks(userIdFromToken, links);
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
    updateLinkById = async (request, response) => {
        try {
            const userId = String(request.auth._id);
            const targetUserId = request.params.userId;
            const linkId = request.query.linkId;
            const updateData = request.body;

            if (!linkId) {
                return responseHelper.BadRequest(response, "Missing linkId in query");
            }

            if (userId !== targetUserId) {
                return responseHelper.Forbidden(
                    response,
                    "You are not authorized to update links for this user.",
                    null,
                    statusCodes.FORBIDDEN
                );
            }

            const updatedLink = await linkService.updateLinkById(userId, linkId, updateData);
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
    deleteLinkById = async (request, response) => {
        try {
            if (!request.auth || !request.auth._id) {
                return responseHelper.Forbidden(response, "Unauthorized: Missing token", null, statusCodes.UNAUTHORIZED);
            }

            const userIdFromToken = String(request.auth._id);
            const userId = String(request.params.userId);
            const linkId = request.query.linkId;

            if (!linkId) {
                return responseHelper.BadRequest(response, "Missing linkId in query");
            }

            if (userIdFromToken !== userId) {
                return responseHelper.Forbidden(response, "You are not allowed to delete links for this user", null, statusCodes.FORBIDDEN);
            }

            const updatedLinks = await linkService.deleteLinkById(userId, linkId);
            return responseHelper.success(response, "Link deleted successfully", updatedLinks, statusCodes.OK);
        } catch (error) {
            console.error("Delete Link Error:", error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };
}
module.exports = new linkController