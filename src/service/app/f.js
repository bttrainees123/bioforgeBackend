linkService.updateIndex = async (request) => {
    const { _id, is_index } = request.body;
    const userId = request.auth._id;
    
  
    if (!_id || is_index === undefined || is_index === null) {
        throw new Error("Link ID and index are required");
    }
    
    const parsedIndex = parseInt(is_index);
    if (isNaN(parsedIndex) || parsedIndex < 0) {
        throw new Error("Index must be a valid non-negative number");
    }
    
    
    const linkToUpdate = await linkModel.findOne({
        _id: new mongoose.Types.ObjectId(_id),
        userId: userId,
        status: 'active',
        is_deleted: '0'
    });
    
    if (!linkToUpdate) {
        throw new Error("Link not found or access denied");
    }
    
    const sameTypeLinks = await linkModel.find({
        userId: userId,
        type: linkToUpdate.type, 
        status: 'active',
        is_deleted: '0'
    }).sort({ is_index: 1 });
    
    if (parsedIndex >= sameTypeLinks.length) {
        throw new Error(`Index must be between 0 and ${sameTypeLinks.length - 1} for ${linkToUpdate.type} links`);
    }
    
    const linksCopy = sameTypeLinks.filter(link => !link._id.equals(_id));
    
    linksCopy.splice(parsedIndex, 0, linkToUpdate);
    
    const updatePromises = linksCopy.map((link, index) => {
        return linkModel.findByIdAndUpdate(link._id, { is_index: index });
    });
    
    await Promise.all(updatePromises);
    
    return;
};
