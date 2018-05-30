const async = require('async');

function handleCommentErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        for (let error of (errors.array())) {
            req.flash('alert', error.msg);
        }
        return res.redirect('back');
    } else {
        return next();
    }
}

function updateCommentsArrayWithUpdatedComment(subdocArray, updatedComment) {
    for (let i=0; i<subdocArray.length; i++) {
        if (subdocArray[i]._id.equals(updatedComment.id)) {
            updateCommentWithNewCommentBody(subdocArray[i], updatedComment.body);
        }
    }
}

function updateCommentWithNewCommentBody(comment, newCommentBody) {
    comment.body = newCommentBody;
}

function saveCollection(collection) {
    return function (cb) {
        collection.save(cb);
    }
}

function saveCollections(collections, req, res, next) {
    let asyncFunctionsArray = [];
    collections.forEach((collection) => {
        asyncFunctionsArray.push(cch.saveCollection(collection));
    });
    async.parallel(
        asyncFunctionsArray,
        function(err, results) {
            if (err) {
                return next(err);
            }
            res.redirect('back');
        }
    );
}

function removeCommentReferenceFromArr(arr, referenceId) {
    let i = arr.indexOf(referenceId);
    arr.splice(i, 1);
}

module.exports = {
    handleCommentErrors,
    updateCommentsArrayWithUpdatedComment,
    updateCommentWithNewCommentBody,
    saveCollection,
    saveCollections,
    removeCommentReferenceFromArr,
};
