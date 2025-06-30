const linkModel = require('../../model/link.model');
const { default: mongoose } = require("mongoose");
const userModel = require('../../model/user.model');
const helper = require('../../helper/helper');

const linkService = {}

linkService.add = async (request) =>{
  request.body.userId = request.auth._id;
  if (request.body.linkLogo) {
          request.body.linkLogo = await helper.moveFileFromFolder(request.body.linkLogo, "linkLogo");
      }
  const data = await linkModel.create(request.body);
  return data;
}
linkService.update = async (request) => {
      const imageData = await linkModel.findOne({ _id: request?.body?._id });
    const oldImage = imageData.profile_img || "";
    const newImage = request.body.profile_img || "";
    if (oldImage && oldImage !== newImage) {
        const imagePath = path.join("public/profile/", oldImage);
        if (fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error(`Failed to delete image: ${err.message}`);
                } else {
                    console.log(`Deleted image: ${oldImage}`);
                }
            });
        }
    }
    if (newImage && oldImage !== newImage) {
        await helper.moveFileFromFolder(newImage, "profile");
    }
    await linkModel.findByIdAndUpdate(
        { _id: new mongoose.Types.ObjectId(request?.body?._id) },
        request.body
    );
    return;
}
linkService.delete = async (request) =>{
    await linkModel.findByIdAndDelete({_id:new mongoose.Types.ObjectId(request?.query?._id)})
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