const Joi = require("joi");
class checkoutValidation {
    static payment() {
        return Joi.object({
            amount: Joi.string()
                .valid(3.99, 43.00)
                .required()
                .messages({
                    "any.only": "amount must be either 3.99 or 43",
                    "string.empty": "amount is required",
                }),
        });
    }
    /**
     * Validate user checkout input data.
     * @param {Object} data - The user input data.
     * @returns {Object} - Validation result.
     */
    static checkoutPayment(data) {
        return checkoutValidation.payment().validate(data, { abortEarly: false });
    }
}

module.exports = checkoutValidation;
