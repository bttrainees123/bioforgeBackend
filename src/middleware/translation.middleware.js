
const i18next = require('i18next');
const translationMiddleware = async (request, response, nextFunction) => {
    const lang = request.headers['accept-language'] || 'en';
    const instance = i18next.cloneInstance();
    instance.changeLanguage(lang).then(() => {
        request.t = instance.t.bind(instance);
        nextFunction();
    });
};

module.exports = translationMiddleware;
