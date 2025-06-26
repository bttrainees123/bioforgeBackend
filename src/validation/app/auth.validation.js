const Joi = require("joi");

class authValidation {
    /**
     * Returns the registration validation schema.
     * @returns {Joi.ObjectSchema}
     */
    static register() {
        return Joi.object({
            username: Joi.string()
                .min(3)
                .max(20)
                .pattern(/^\S+$/)
                .required()
                .messages({
                    "string.empty": "Name is required",
                    "string.min": 'Name must be less than characters',
                    "string.max": "Name must be at least characters long",
                    "string.pattern.base": "Username must not contain spaces",
                }),
            // profile_img: Joi.string()
            //     .required()
            //     .messages({
            //         "string.base": "Profile image must be a string",
            //         "string.empty": "Profile image is required",
            //     }),
            // bio: Joi.string()
            //     .min(3)
            //     .max(1000)
            //     .required()
            //     .messages({
            //         "string.empty": "bio text is required",
            //         "string.min": "bio text must be at least 3 characters long",
            //         "string.max": "bio text must not exceed 1000 characters",
            //     }),
            // theme: Joi.any().optional().messages({
            //     "any.required": "Theme is required",
            // }),
            email: Joi.string()
                .email({ tlds: { allow: false } })
                .pattern(/^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
                .required()
                .messages({
                    "string.empty": "Email_is_required",
                    "string.email": "Please_provide_a_valid_email_address",
                    "string.pattern.base": "Email_must_contain_only_letters_digits_and_periods_before",
                }),
            password: Joi.string().min(6).required().messages({
                "string.empty": "Password_is_required",
                "string.min": "Password_must_be_at_least_6_characters_long",
            }),
           
        });
    }

    /**
     * Returns the login validation schema.
     * @returns {Joi.ObjectSchema}
     */
    static login() {
        return Joi.object({
            email: Joi.string()
                .email({ tlds: { allow: false } })
                .pattern(/^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
                .required()
                .messages({
                    "string.empty": "Email is required",
                    "string.email": "Please provide a valid email address",
                    "string.pattern.base": "Email_must_contain_only_letters_digits_and_periods_before",
                }),
            password: Joi.string().required().messages({
                "string.empty": "Password_is_required",
            }),
        });
    }
    /**
     * Returns the login validation schema.
     * @returns {Joi.ObjectSchema}
     */
    static sendOtp(t) {
        return Joi.object({
            email: Joi.string()
                .email({ tlds: { allow: false } })
                .pattern(/^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
                .required()
                .messages({
                    "string.empty": t("Email_is_required"),
                    "string.email": t("Please_provide_a_valid_email_address"),
                    "string.pattern.base": t("Email_must_contain_only_letters_digits_and_periods_before"),
                }),
            type: Joi.string()
                .valid("forget", "verify")
                .required()
                .messages({
                    "any.only": t("type_must_be_either_forget_or_forget"),
                    "string.empty": t("type_is_required"),
                }),
        });
    }
    /**
     * Returns the login validation schema.
     * @returns {Joi.ObjectSchema}
     */

    static forgetPassword(t) {
        return Joi.object({
            userId: Joi.string()
                .pattern(/^[a-fA-F0-9]{24}$/)
                .required()
                .messages({
                    "string.empty": t("User_ID_is_required"),
                    "string.pattern.base": t("Invalid_User_ID_format_Must_be_a_valid_MongoDB_ObjectId"),
                }),
            password: Joi.string().min(6).required().messages({
                "string.empty": t("Password_is_required"),
                "string.min": t("Password_must_be_at_least_6_characters_long"),
            }),
        });
    }
    /**
     * Returns the login validation schema.
     * @returns {Joi.ObjectSchema}
     */

    static verifyOpt(t) {
        return Joi.object({
            type: Joi.string()
                .valid("forget", "verify")
                .required()
                .messages({
                    "any.only": t("type_must_be_either_forget_or_forget"),
                    "string.empty": t("type_is_required"),
                }),
            userId: Joi.string()
                .pattern(/^[a-fA-F0-9]{24}$/)
                .required()
                .messages({
                    "string.empty": t("User_ID_is_required"),
                    "string.pattern.base": t("Invalid_User_ID_format_Must_be_a_valid_MongoDB_ObjectId"),
                }),
            otp: Joi.string()
                .length(6)
                .pattern(/^\d+$/)
                .required()
                .messages({
                    "string.empty": t("OTP_is_required"),
                    "string.length": t("OTP_must_be_exactly_6_digits"),
                    "string.pattern.base": t("OTP_must_contain_only_digits"),
                }),


        });
    }
    static changePassword(t) {
        return Joi.object({
            oldPassword: Joi.string().required().min(6).messages({
                "string.empty": t("OldPassword_is_required"),
                "string.min": t("Old_Password_must_be_at_least_6_characters_long"),
            }),
            newPassword: Joi.string().required().min(6)
                .messages({
                    "string.empty": t("NewPassword_is_required"),
                    "string.min": t("New_Password_must_be_at_least_6_characters_long"),
                }),


        });
    }
    static accountDelete(t) {
        return Joi.object({
            password: Joi.string().required().messages({
                "string.empty": t("Password_is_required"),
            }),



        });
    }



    /**
     * Validate user registration data.
     * @param {Object} data - The user input data.
     * @returns {Object} - Validation result.
     */
    static validateRegister(data) {
        return authValidation.register().validate(data, { abortEarly: false });
    }

    /**
     * Validate user login data.
     * @param {Object} data - The user input data.
     * @returns {Object} - Validation result.
     */
    static validateLogin(data) {
        return authValidation.login().validate(data, { abortEarly: false });
    }
    /**
  * Validate user forget password data.
  * @param {Object} data - The user input data.
  * @returns {Object} - Validation result.
  */

    static validateSendOtp(data, t) {
        return authValidation.sendOtp(t).validate(data, { abortEarly: false });
    }
    /**
  * Validate user forget password data.
  * @param {Object} data - The user input data.
  * @returns {Object} - Validation result.
  */

    static validateForgetPassword(data, t) {
        return authValidation.forgetPassword(t).validate(data, { abortEarly: false });
    }
    /**
  * Validate user forget password data.
  * @param {Object} data - The user input data.
  * @returns {Object} - Validation result.
  */

    static validateVerifyOpt(data, t) {
        return authValidation.verifyOpt(t).validate(data, { abortEarly: false });
    }
    /**
  * Validate user forget password data.
  * @param {Object} data - The user input data.
  * @returns {Object} - Validation result.
  */

    static validateChangePassword(data, t) {
        return authValidation.changePassword(t).validate(data, { abortEarly: false });
    }
    /**
  * Validate user forget password data.
  * @param {Object} data - The user input data.
  * @returns {Object} - Validation result.
  */

    static validateAccountDelete(data, t) {
        return authValidation.accountDelete(t).validate(data, { abortEarly: false });
    }
}

module.exports = authValidation;
