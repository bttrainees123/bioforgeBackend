const Joi = require("joi");

class userValidation {
    /**
     * Returns the registration validation schema.
     * @returns {Joi.ObjectSchema}
     */
    static add() {
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
            email: Joi.string()
                .email({ tlds: { allow: false } })
                .pattern(/^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
                .required()
                .messages({
                    "string.empty": "Email is required",
                    "string.email": "Please provide a valid email address",
                    "string.pattern.base": "Email_must_contain_only_letters_digits_and_periods_before",
                }),
            password: Joi.string().min(6).required().messages({
                "string.empty": "Password_is_required",
                "string.min": "Password_must_be_at_least_6_characters_long",
            }),
           
        });
    }
    /**
    * Returns the registration validation schema.
    * @returns {Joi.ObjectSchema}
    */
    static update() {
       return Joi.object({
        _id: Joi.string()
                        .pattern(/^[a-fA-F0-9]{24}$/)
                        .required()
                        .messages({
                            "string.empty": "User ID is required",
                            "string.pattern.base": "Invalid User ID format Must be a valid MongoDB ObjectId",
                        }),
            username: Joi.string()
                .min(3)
                .max(20)
                .pattern(/^\S+$/)
                .optional()
                .messages({
                    "string.empty": "username is required",
                    "string.min": 'username must be less than characters',
                    "string.max": "username must be at least characters long",
                    "string.pattern.base": "Username must not contain spaces",
                }),
            email: Joi.string()
                .email({ tlds: { allow: false } })
                .pattern(/^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
                .optional()
                .messages({
                    "string.empty": "Email is required",
                    "string.email": "Please provide a valid email address",
                    "string.pattern.base": "Email_must_contain_only_letters_digits_and_periods_before",
                }),
            password: Joi.string().min(6).optional().messages({
                "string.empty": "Password_is_required",
                "string.min": "Password_must_be_at_least_6_characters_long",
            }),
            status: Joi.string().valid('active','inactive').optional().messages({
                "string.empty": "Status either active or inactive",
               
            })

           
        });
    }

    /**
     * Validate user registration data.
     * @param {Object} data - The user input data.
     * @returns {Object} - Validation result.
     */
    static validateadd(data) {
        return userValidation.add().validate(data, { abortEarly: false });
    }
    /**
     * Validate user registration data.
     * @param {Object} data - The user input data.
     * @returns {Object} - Validation result.
     */
    static validateUpdate(data) {
        return userValidation.update().validate(data, { abortEarly: false });
    }


}

module.exports = userValidation;
