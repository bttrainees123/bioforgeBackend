const helper = require("../../helper/helper");
const statusCodes = require("../../helper/statusCodes")
const responseHelper = require("../../helper/response");
const userModel = require("../../model/user.model");
const authService = require("../../service/app/auth.service");
const authValidation = require("../../validation/app/auth.validation");
const optModel = require("../../model/otp.model");
const moment = require("moment");
const { request } = require("express");
class authController {
    register = async (request, response) => {
        try {

            const { error } = await authValidation.validateRegister(request.body,);
            const validationError = responseHelper.validatIonError(response, error);
            if (validationError) return;
            if (await userModel.findOne({ email: new RegExp(`^${request.body.email}$`, 'i'), is_deleted: "0" })) {
                return responseHelper.Forbidden(response, "Email already exists", null, statusCodes.OK);
            }
            const data = await authService.register(request);
            return responseHelper.success(response, data.username + " " + "is registered successfully", null, statusCodes.OK);
        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };
    login = async (request, response) => {
        try {
            const { error } = await authValidation.validateLogin(request.body,);
            const validationError = responseHelper.validatIonError(response, error);
            if (validationError) return;
            const userData = await userModel.findOne({ email: new RegExp(`^${request.body.email}$`, 'i') });
            if (!userData) {
                return responseHelper.Forbidden(response, "Email not exists", null, statusCodes.OK);
            } else if (userData.is_deleted === '1') {
                return responseHelper.Forbidden(response, userData?.username + " " + "your account is deleted", null, statusCodes.OK);
            } else if (userData.status === 'inactive') {
                return responseHelper.Forbidden(response, userData?.username + " " + "your account is inactive Please contact to admin", null, statusCodes.OK);
            }
            if (!await helper.comparePassword(request?.body?.password, userData?.password)) {
                return responseHelper.BadRequest(response, "Password_is_wrong", null, statusCodes.OK);
            }
            else if (userData?.isEmailVerified === false && userData?.type !== 'admin') {
                return responseHelper.Forbidden(response, userData?.username + " " + "your account is unverified Please verify your email", { isEmailVerified: false, userId: userData?._id }, statusCodes.OK,);
            }
            const data = await authService.login(userData);
            response.cookie('token', data.token, {
                httpOnly: true,
                secure: 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000
            });
            return responseHelper.success(response, data.username + " " + "is login successfully", data, statusCodes.OK);

        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        };
    }
    sendOtp = async (request, response) => {
        try {
            const { error } = await authValidation.validateSendOtp(request.body,);
            const validationError = responseHelper.validatIonError(response, error);
            if (validationError) return;
            const userData = await userModel.findOne({ email: new RegExp(`^${request.body.email}$`, 'i') }, { password: 0 });
            if (!userData) {
                return responseHelper.Forbidden(response, "Email_not_exists", null, statusCodes.OK);
            } else if (userData.is_deleted === '1') {
                return responseHelper.Forbidden(response, userData?.name + " " + "your_account_is_deleted", null, statusCodes.OK);
            } else if (userData.status === 'inactive') {
                return responseHelper.Forbidden(response, userData?.name + " " + "your_account_is_inactive_Please_contact_to_admin", null, statusCodes.OK);
            }
            const data = await authService.sendOtp(userData, request?.body?.type);
            return responseHelper.success(response, data?.otp + " " + "Otp_is_sent_to_your_register_email_please_verify_the_email", userData, statusCodes.OK);
        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    verifyOpt = async (request, response) => {
        try {
            const { error } = await authValidation.validateVerifyOpt(request.body,);
            const validationError = responseHelper.validatIonError(response, error);
            if (validationError) return;
            const userData = await userModel.findOne({ _id: request.body.userId }, { password: 0 });
            if (!userData) {
                return responseHelper.Forbidden(response, "User_does_not_exist", null, statusCodes.OK);
            } else if (userData.is_deleted === '1') {
                return responseHelper.Forbidden(response, userData?.name + " " + "your_account_is_deleted", null, statusCodes.OK);
            } else if (userData.status === 'inactive') {
                return responseHelper.Forbidden(response, userData?.name + " " + "your_account_is_inactive_Please_contact_to_admin", null, statusCodes.OK);
            }
            const otpData = await optModel.findOne({ userId: request?.body?.userId })
            if (!otpData) {
                return responseHelper.BadRequest(response, "OTP_has_expired_Please_request_a_new_OTP", null, statusCodes.OK);
            }
            else if (moment(otpData.createdAt).add(2, 'minutes').isBefore(moment())) {
                return responseHelper.BadRequest(response, "OTP_has_expired_Please_request_a_new_OTP", null, statusCodes.OK);
            }
            else if (otpData.otp !== request?.body?.otp) {
                return responseHelper.BadRequest(response, "Incorrect_OTP_Please_enter_the_correct_OTP", null, statusCodes.OK);
            }
            if (request?.body?.type === 'verify') {
                await userModel.findByIdAndUpdate({ _id: request.body.userId }, { isEmailVerified: true });
            }
            return responseHelper.success(response, "OTP_verification_successful", userData, statusCodes.OK);
        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    forgetPassword = async (request, response) => {
        try {
            const { error } = await authValidation.validateForgetPassword(request.body,);
            const validationError = responseHelper.validatIonError(response, error);
            if (validationError) return;
            const userData = await userModel.findOne({ _id: request.body.userId });
            if (!userData) {
                return responseHelper.Forbidden(response, "User_does_not_exist", null, statusCodes.OK);
            } else if (userData.is_deleted === '1') {
                return responseHelper.Forbidden(response, userData?.name + " " + "your_account_is_deleted", null, statusCodes.OK);
            } else if (userData.status === 'inactive') {
                return responseHelper.Forbidden(response, userData?.name + " " + "your_account_is_inactive_Please_contact_to_admin", null, statusCodes.OK);
            }
            await authService.forgetPassword(request);
            return responseHelper.success(response, "Password_Update_successfully", null, statusCodes.OK);

        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);

        }
    }
    changePassword = async (request, response) => {
        try {
            const { error } = await authValidation.validateChangePassword(request.body,);
            const validationError = responseHelper.validatIonError(response, error);
            if (validationError) return;
            const userPassword = await userModel.findOne({ _id: request?.auth?._id })
            if (!await helper.comparePassword(request?.body?.oldPassword, userPassword?.password)) {
                return responseHelper.BadRequest(response, "Please_Enter_correct_old_password", null, statusCodes.OK);
            }
            if (request?.body?.oldPassword === request?.body?.newPassword) {
                return responseHelper.BadRequest(response, "Look_like_you_enter_same_password", null, statusCodes.OK);
            }
            await authService.changePassword(request);
            return responseHelper.success(response, "Password_Update_successfully", null, statusCodes.OK);
        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    accountDelete = async (request, response) => {
        try {
            const { error } = await authValidation.validateAccountDelete(request.body,);
            const validationError = responseHelper.validatIonError(response, error);
            if (validationError) return;
            const userPassword = await userModel.findOne({ _id: request?.auth?._id })
            if (!await helper.comparePassword(request?.body?.password, userPassword?.password)) {
                return responseHelper.BadRequest(response, "Please_Enter_correct_password", null, statusCodes.OK);
            }
            await authService.accountDelete(request);
            return responseHelper.success(response, "Account_delete_successfully", null, statusCodes.OK);
        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    upateProfile = async (request, response) => {
        try {
            const userData = await userModel.findOne({ _id: request?.body?._id, is_deleted: '0' });
            if (!userData) {
                return responseHelper.Forbidden(response, `user not found`, null, statusCodes.OK)
            }
            const data = await authService.updateprofile(request);
            return responseHelper.success(response, `profile updated successfully`, data, statusCodes.OK)
        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR)
        }
    }
    addLinks = async (request, response) => {
        try {
            const result = await authService.addLinks(request);
            return responseHelper.success(response, "Links added successfully", result.links, statusCodes.OK);
        } catch (error) {
            console.error("Add Links Error:", error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };
    updateLink = async (request, response) => {
        try {
            const updatedLink = await authService.updateLink(request);
            return responseHelper.success(response, "Link updated successfully", updatedLink, statusCodes.OK);
        } catch (error) {
            console.error("Update Link Error:", error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };
    updateTheme = async (request, response) => {
        try {
            const themeData = await authService.updateTheme(request);
            return responseHelper.success(response, "Theme updated successfully", themeData, statusCodes.OK);
        } catch (error) {
            console.error("Update Theme Error:", error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };
}

module.exports = new authController();

