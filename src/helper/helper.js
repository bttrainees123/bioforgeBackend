const bcrypt = require("bcrypt");
const path = require("path")
const otpGenerator = require('otp-generator');
const jwt = require("jsonwebtoken");
const { mkdir } = require('node:fs/promises');
const jetpack = require("fs-jetpack");
const fs = require("fs");
const helper = {}
const saltnumber = 10
const secretkey = "RobertRDalgadoverses"
helper.createPassword = async (password) => {
    return await bcrypt.hash(password, saltnumber);
}
helper.comparePassword = async (password, hashPassword) => {
    return await bcrypt.compare(password, hashPassword)
}
helper.generateTokken = (Data) => {
    return jwt.sign(Data, secretkey, { expiresIn: "24h" })
}
helper.otp = () => {
    const response = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });
    return response
}
helper.applyPagination = (skip, limit) => {
    return {
        $facet: {
            paginatedResults: [
                { $skip: skip },
                { $limit: limit }
            ],
            totalCount: [{ $count: "total" }]
        }
    };
};
helper.getFilteredTopic = (language) => ({
    $filter: {
        input: "$topic",
        as: "t",
        cond: { $eq: ["$$t.language", language] },
    },
});

helper.moveFileFromFolder = async (filename, targetFolder) => {
    let desPath = '';
    const uploadDirFile = path.join(__dirname, "../../public/tempUploads/" + filename);
    const uploadfilePath = path.join(__dirname, "../../public/" + targetFolder);
    if (fs.existsSync(uploadfilePath)) {
        desPath = uploadfilePath;
    } else {
        desPath = path.join(__dirname, "../../public/" + targetFolder);
        await mkdir(desPath, { recursive: true });
    }
    if (fs.existsSync(uploadDirFile)) {
        const src = jetpack.cwd("public/tempUploads");
        const dst = jetpack.cwd("public/" + targetFolder);
        src.find({ matching: filename }).forEach(desPath => {
            src.move(desPath, dst.path(desPath));
        });
    } else {
        console.log(`File "${filename}" does not exist in tempUploads`);
    }
}
helper.keys = [
    "holy_sacrifice_of_the_mass", "the_real_presence", "words_of_christ", "holy_scriptures", "imitation_of_christ",
    "reparation_of_sins", "communion", "all_souls", "psalms", "holy_family", "the_saints", "victim_souls", "holy_mass", "daily",
    "rosary_jesus_servants_prayer", "essential", "via_crucis", "litanys"
];
helper.imagerequired=[
    "the_saints","the_saints","victim_souls"
]
helper.imagesnotRequired = ["holy_sacrifice_of_the_mass", "the_real_presence", "words_of_christ", "holy_scriptures", "imitation_of_christ",
    "reparation_of_sins", "communion", "all_souls", "psalms","holy_mass", "daily",
]
helper.twoSubcategory = ['communion', 'holy_mass']
helper.threeSubcategory = ['daily', 'rosary_jesus_servants_prayer']
helper.isSubscribe=["holy_sacrifice_of_the_mass","holy_scriptures","communion","holy_family","holy_mass","essential"]
module.exports = helper