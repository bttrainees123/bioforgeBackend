const jwt = require("jsonwebtoken");
const responseHelper = require("../helper/response");
const secretKey = "RobertRDalgadoverses";
const userModel = require("../model/user.model");
const statusCodes=require("../helper/statusCodes")
const mongoose = require("mongoose");
const userMiddleWare = async (request, response, nextFunction) => {
    try {
        const BearerToken = request.headers["authorization"];
        if (!BearerToken) {
            return responseHelper.unauthorized(response,request.t("Authorization_token_is_missing"),statusCodes.UNAUTHORIZED);
        }
        const tokenParts = BearerToken.split(" ");
        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            return responseHelper.unauthorized(response,request.t("Invalid_token_format_Use_Bearer_token"),statusCodes.UNAUTHORIZED);
        }
        const token = tokenParts[1];
        jwt.verify(token, secretKey, async (err, decodedToken) => {
            if (err) {
                return responseHelper.unauthorized(response,request.t("Invalid_or_expired_token"),statusCodes.UNAUTHORIZED);
            }
            if (!["user","admin"].includes(decodedToken?.type)) {
                return responseHelper.unauthorized(response,request.t("Access_denied_Invalid_user_type"),statusCodes.UNAUTHORIZED);
            }
            try {
                const userData = await userModel.findOne({ _id: new mongoose.Types.ObjectId(decodedToken?._id) });
                if (!userData) {
                    return responseHelper.unauthorized(response,request.t("User_does_not_exist"), statusCodes.UNAUTHORIZED);
                } else if (userData.is_deleted === "1") {
                    return responseHelper.unauthorized(response, userData?.name+" "+request.t("your_account_is_deleted"), statusCodes.UNAUTHORIZED);
                } else if (userData.status === "inactive") {
                    return responseHelper.unauthorized(response, userData?.name + " "+request.t("your_account_is_inactive_Please_contact_to_admin"),  statusCodes.UNAUTHORIZED);
                } else if (userData.isEmailVerified === false && userData?.type!=='admin') {
                    return responseHelper.unauthorized(response, userData?.name + " "+ request.t("your_account_is_unverified_Please_verify_your_email"),  statusCodes.UNAUTHORIZED);
                }
                decodedToken.resData = { token };
                request.auth = decodedToken;
                nextFunction();
            } catch (dbError) {
                console.error("Database Error:", dbError);
                return responseHelper.error(response,request.t("Internal_server_error_while_fetching_user_details"),statusCodes.INTERNAL_SERVER_ERROR);
            }
        });
    } catch (error) {
        console.error("Unexpected Error:", error);
        return responseHelper.error(response,request.t("An_unexpected_error_occurred"),statusCodes.INTERNAL_SERVER_ERROR);
    }
};
module.exports = userMiddleWare;
