const templateModel = require('../../model/template.model');
const { default: mongoose } = require("mongoose");

const templateService = {};

const sanitizeHtml = require('sanitize-html');

templateService.add = async (request) => {
    const body = request.body;
    console.log('Original body:', body);
    
   
    if (body.templateContent) {
        body.templateContent = sanitizeHtml(body.templateContent, {
            allowedTags: [
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'p', 'br', 'hr',
                'strong', 'b', 'em', 'i', 'u', 's',
                'ul', 'ol', 'li',
                'a', 'img',
                'div', 'span',
                'table', 'thead', 'tbody', 'tr', 'td', 'th',
                'blockquote', 'pre', 'code'
            ],
            allowedAttributes: {
                'a': ['href', 'title', 'target'],
                'img': ['src', 'alt', 'width', 'height', 'title'],
                'table': ['border', 'cellpadding', 'cellspacing'],
                'td': ['colspan', 'rowspan'],
                'th': ['colspan', 'rowspan'],
                '*': ['class', 'id', 'style']
            },
            allowedSchemes: ['http', 'https', 'mailto', 'tel'],
            allowedSchemesByTag: {
                img: ['http', 'https', 'data']
            },
           
            disallowedTagsMode: 'discard',
            allowedClasses: {
                '*': ['*'] 
            }
        });
        
        console.log('Sanitized templateContent');
    }
    
    if (body.templateName) {
        body.templateName = sanitizeHtml(body.templateName, {
            allowedTags: [], 
            allowedAttributes: {}
        });
    }
    
    console.log('Sanitized body:', body);
    
  
    const template = await templateModel.create(body);
    return template;
};

templateService.update = async (request) => {
    await templateModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request?.body?._id) },request.body);
    return
};  
templateService.delete = async (request) => {
    await templateModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request?.query?._id) },{ is_deleted: '1' });
    return;
};
templateService.getAll = async (request) => {
    return await templateModel.aggregate([
        {
            $match: {
                is_deleted: '0',
                status: 'active'
            }
        },
        {
            $project: {
                templateName: 1,
                status: 1,
            }
        }
    ])
};

module.exports = templateService;