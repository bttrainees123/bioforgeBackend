const { default: mongoose } = require("mongoose")
const helper = require("../../helper/helper")
const userModel = require("../../model/user.model")
const templateModel = require("../../model/template.model")
const userService = {}

userService.add = async (request) => {
    const hashpassword = await helper.createPassword(request.body.password)
    request.body.password = hashpassword
    const data = await userModel.create(request.body)
    return data
}
userService.update = async (request) => {
    if (request?.body?.password) {
        const hashpassword = await helper.createPassword(request.body.password)
        request.body.password = hashpassword
    }
    await userModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request?.body?._id) }, request?.body)
}
userService.get = async (request) => {
    const search = request?.query?.search || "";
    const page = Number(request?.query?.page) || 1;
    const limit = Number(request?.query?.limit) || 10;
    const skip = (page - 1) * limit;
    const data = await userModel.aggregate([
        {
            $match: {
                is_deleted: "0",
                $or: [
                    { username: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ]
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $project: {
                username: 1,
                email: 1,
                status: 1,
                reportStatus: 1
            }
        },
        helper.applyPagination(skip, limit),
    ])
    const response = {
        getData: data ? data[0].paginatedResults : {},
        count: data[0].totalCount[0] ? data[0].totalCount[0].total : 0
    };
    return response
}
userService.delete = async (request) => {
    await userModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request?.query?._id) }, { is_deleted: "1" })
}
userService.status = async (request) => {
    const userInfo = await userModel.findOne({ _id: new mongoose.Types.ObjectId(request?.query?._id) })
    if (userInfo.status === 'active') {
        await userModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request?.query?._id) }, { status: "inactive" })
    } else {
        await userModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request?.query?._id) }, { status: "active" })
    }
}
userService.templateStatus = async (request) => {
    const templateInfo = await templateModel.findOne({ _id: new mongoose.Types.ObjectId(request?.query?._id) })
    if (templateInfo.status === 'active') {
        await templateModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request?.query?._id) }, { status: "inactive" })
    } else {
        await templateModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request?.query?._id) }, { status: "active" })
    }
}
module.exports = userService