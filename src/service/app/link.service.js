const linkModel = require('../../model/link.model');
const { default: mongoose } = require("mongoose");
const userModel = require('../../model/user.model');
const helper = require('../../helper/helper');
const fs = require('fs');
const path = require('path');

const linkService = {}

linkService.add = async (request) => {
  const userId = request.auth._id;
  const body = request.body;
  body.userId = userId;
  if (body.linkLogo) {
    const processed = await helper.moveFileFromFolder(body.linkLogo, "linkLogo");
    if (!processed) {
      throw new Error("Failed to process uploaded logo.");
    }
    body.linkLogo = processed;
  }
  const created = await linkModel.create(body);
  return created;
};

linkService.update = async (request) => {
    const linkData = await linkModel.findOne({ _id: request?.body?._id });
    const oldImage = linkData.linkLogo || "";
    const newImage = request.body.linkLogo || "";
    const tempUploadPath = path.join("public", "tempUploads", newImage);
    if (newImage && fs.existsSync(tempUploadPath)) {
        await helper.moveFileFromFolder(newImage, "linkLogo");
        if (oldImage && oldImage !== newImage) {
            const oldImagePath = path.join("public", "linkLogo", oldImage);
            if (fs.existsSync(oldImagePath)) {
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error(`Failed to delete old image: ${err.message}`);
                    } else {
                        console.log(`Deleted old image: ${oldImage}`);
                    }
                });
            }
        }
        request.body.linkLogo = newImage;
    }
    await linkModel.findByIdAndUpdate(
        { _id: new mongoose.Types.ObjectId(request?.body?._id) },
        request.body
    );
    return;
}
linkService.delete = async (request) => {
    const link = await linkModel.findOne({ _id: new mongoose.Types.ObjectId(request?.query?._id) });
    if (link && link.linkLogo) {
        const logoPath = path.join("public", "linkLogo", link.linkLogo);
        if (fs.existsSync(logoPath)) {
            fs.unlink(logoPath, (err) => {
                if (err) {
                    console.error(`Failed to delete linkLogo: ${err.message}`);
                }
            });
        }
    }
    await linkModel.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(request?.query?._id) });
}
linkService.updateStatus = async (request)=>{
    const linkUpdate = await linkModel.findOne({_id:new mongoose.Types.ObjectId(request?.query?._id)});
    if(linkUpdate.status === 'active'){
        await linkModel.findByIdAndUpdate({_id:new mongoose.Types.ObjectId(request?.query?._id)},{status:"inactive"})
    }
    else {
        await linkModel.findByIdAndUpdate({_id:new mongoose.Types.ObjectId(request?.query?._id)},{status:'active'})
    } 
}
linkService.get = async (request) => {
    const userId = request?.auth?._id;
    return await linkModel.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
            }
        },
        {
            $project:{
                linkTitle:1,
                linkUrl:1,
                linkLogo:1,
                type:1,
                status:1
            }
        }
    ]);
}

module.exports = linkService;