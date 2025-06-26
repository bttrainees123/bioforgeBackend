
const onlyJsonMiddleware = async (request, response, nextFunction) => {
    if (request.method !== "GET" && request.headers["content-type"] && !request.headers["content-type"].includes("application/json")) {
        if (!request.headers["content-type"].includes("multipart/form-data")) {
            return response.status(415).json({
                status: false,
                message: "Unsupported Media Type. Only application/json or multipart/form-data is allowed.",
            });
        }
    }
    nextFunction();
};

module.exports = onlyJsonMiddleware;
