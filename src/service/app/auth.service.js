const helper = require("../../helper/helper")
const userModel = require("../../model/user.model")
const otpModel = require("../../model/otp.model")
const sendEmail = require("../../helper/sendVerificationEmail");
const emailTemplateImage = require("../../config/template")
const authService = {}
authService.register = async (request) => {
    const hashpassword = await helper.createPassword(request.body.password)
    request.body.password = hashpassword
    if (request.body.profile_img) {
        request.body.profile_img = await helper.moveFileFromFolder(request.body.profile_img, "profile");
    }
    const data = await userModel.create(request.body)
    // authService.sendOtp(data, "verify")
    return data
}
authService.login = async (data) => {
    const user = data.toObject();
    user.token = await helper.generateTokken(user);
    delete user.password;
    delete user.subscriptionExpiry;
    delete user.subscription;
    delete user.isEmailVerified;
    delete user.status;
    delete user.is_deleted;
    delete user.createdAt;
    delete user.updatedAt;
    delete user.__v;
    return user;
};
authService.sendOtp = async (data, type) => {
    const opt = await helper.otp()
    let html = ""
    let subject = ""
    if (type === 'forget') {
        subject = "Forget Password"
        html = ` <table width="100%" cellpadding="0" cellspacing="0" border="0"
            style="max-width: 450px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <tr>
                <td
                    style="padding: 40px 0;     background-color: #f2e5cc;
              border-radius: 8px 8px 0 0; text-align: center;">
                    <img src=${emailTemplateImage.logo} alt="Logo"
                        style="width: 130px;">
                </td>
            </tr>
            <tr>
                <td style="padding: 20px; text-align: center;">
                    <h3 style="margin: 20px 0;
                line-height: 1.4;
                color: #333333;
                font-family: Kreon, serif;
                font-weight: 500;
                text-shadow: 0 4px 4px #00000040;
                font-size: 20px;">
                      Welcome to the Credo In Deum app.
                            Please copy and paste the OTP code below into the Forgot Email field to proceed.</h3>
                    <div style=" margin: 30px auto;
                            background-image: url(${emailTemplateImage.background});
                            background-position: 50%;
                            border: none;
                            border-radius: 15px;
                            box-shadow: 0 7px 4px 0 #875505f2;
                            color: #000;
                            font-size: 22px;
                            font-weight: 400;
                            padding: 12px 26px;
                            text-transform: uppercase;
                            width: 150px;  font-family: Kreon, serif;
                        ">
                        ${opt}
                    </div>
                    <div
                        style="font-size: 16px; color: #333333; margin-top: 30px; font-family: Kreon, serif;">
                        Humbly,
                    </div>
                    <div
                        style="font-size: 14px; color: #666666; margin-top: 5px; font-family: Kreon, serif;">
                        Credo In Deum
                    </div>
                </td>
            </tr>
            <tr>
                <td
                    style="text-align: center; padding: 20px; font-size: 14px; color: #999999;font-family: Kreon, serif;">
                    &copy; 2024 Credo In Deum. All rights reserved.
                </td>
            </tr>
        </table>`
    } else {
        subject = "Email Verification"
        html = ` <table width="100%" cellpadding="0" cellspacing="0" border="0"
            style="max-width: 450px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <tr>
                <td
                    style="padding: 40px 0;     background-color: #f2e5cc;
                  border-radius: 8px 8px 0 0; text-align: center;">
                    <img src=${emailTemplateImage.logo} alt="Logo"
                        style="width: 130px;">
                </td>
            </tr>
            <tr>
                <td style="padding: 20px; text-align: center;">
                    <h3 style="margin: 20px 0;
                    line-height: 1.4;
                    color: #333333;
                    font-family: Kreon, serif;
                    font-weight: 500;
                    text-shadow: 0 4px 4px #00000040;
                    font-size: 20px;">
                        Welcome
                        to Credo In Deum app. Please
                        copy and paste the verification code below into the email verification box.</h3>
                    <div style=" margin: 30px auto;
                                background-image: url(${emailTemplateImage.background});
                                background-position: 50%;
                                border: none;
                                border-radius: 15px;
                                box-shadow: 0 7px 4px 0 #875505f2;
                                color: #000;
                                font-size: 22px;
                                font-weight: 400;
                                padding: 12px 26px;
                                text-transform: uppercase;
                                width: 150px;  font-family: Kreon, serif;
                            ">
                        ${opt}
                    </div>
                    <div
                        style="font-size: 16px; color: #333333; margin-top: 30px; font-family: Kreon, serif;">
                        Humbly,
                    </div>
                    <div
                        style="font-size: 14px; color: #666666; margin-top: 5px; font-family: Kreon, serif;">
                        Credo In Deum
                    </div>
                </td>
            </tr>
            <tr>
                <td
                    style="text-align: center; padding: 20px; font-size: 14px; color: #999999;font-family: Kreon, serif;">
                    &copy; 2024 Credo In Deum. All rights reserved.
                </td>
            </tr>
        </table>`
    }
    sendEmail(data?.email, subject, html)
    const otpData = await otpModel.create({
        userId: data?._id,
        otp: opt
    })
    return otpData
}
authService.forgetPassword = async (request) => {
    const hashpassword = await helper.createPassword(request.body.password)
    await userModel.findByIdAndUpdate({ _id: request.body.userId }, { password: hashpassword })
}
authService.changePassword = async (request) => {
    const hashpassword = await helper.createPassword(request.body.newPassword)
    await userModel.findByIdAndUpdate({ _id: request?.auth?._id }, { password: hashpassword })
}
authService.accountDelete = async (request) => {
    await userModel.findByIdAndUpdate({ _id: request?.auth?._id }, { is_deleted: "1" })
}
module.exports = authService