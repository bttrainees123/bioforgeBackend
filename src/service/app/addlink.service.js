const helper = require("../../helper/helper");
const userModel = require("../../model/user.model");
const mongoose = require("mongoose");

const linkService ={}

linkService.addLinks = async (request) => {
    const userId = request.auth._id
    // const userId = request.body?.userId;
    const links = request.body?.links;

    if (!userId || !Array.isArray(links) || links.length === 0) {
        throw new Error("userId and a non-empty links array are required");
    }
    const user = await userModel.findOne({ _id: new mongoose.Types.ObjectId(userId), is_deleted: "0" });
    if (!user) {
        throw new Error("User not found");
    }
    if (String(user._id) !== String(userId)) {
        throw new Error("You are unauthorized to add this link");
    }
    if (!Array.isArray(user.links)) {
        user.links = [];
    }
    user.links.push(...links);
    await user.save();
    return user;
};
linkService.updateLink = async (request) => {
    const { userId, linkId, linkTitle, linkUrl, linkLogo,is_index } = request.body;
    if (!userId || !linkId || !linkTitle || !linkUrl || !linkLogo) {
        throw new Error("userId, linkId, and all link fields are required");
    }
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(linkId)) {
        throw new Error("Invalid userId or linkId format");
    }
    const user = await userModel.findOne({ _id: userId, is_deleted: "0" });
    if (!user) throw new Error("User not found");
    const link = user.links.id(linkId);
    if (!link) throw new Error("Link not found");
    link.linkTitle = linkTitle;
    link.linkUrl = linkUrl;
    link.linkLogo = linkLogo;
    link.is_index = is_index;
    await user.save();
    return link; 
};
linkService.deleteLink = async (request) => {
    const linkId = request?.query?._id;
    const userId = request?.query?.userId;
    if (!mongoose.Types.ObjectId.isValid(linkId) || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid userId or linkId format");
    }
    const user = await userModel.findOne({ _id: userId, is_deleted: "0" });
    if (!user) throw new Error("User not found");
    if (String(user._id) !== String(request.auth._id)) {
        throw new Error("You are not authorized to delete this link");
    }
    const link = user.links.id(linkId);
    console.log("-------link",link)
    if (!link) throw new Error("Link not found");
    user.links.pull(linkId);
    await user.save();
    return { success: true };
};
module.exports = linkService