$(document).foundation();


// UTILITY
function applyClass(nodes, className) {
    for (let node of nodes) {
        node.classList.add(className);
    }
}

function removeClass(nodes, className) {
    for (let node of nodes) {
        node.classList.remove(className);
    }
}

function applyEventListenerToNodes(nodes, eventType, func) {
    for (let node of nodes) {
        node.addEventListener(eventType, func);
    }
}

// STORY / COMMENT DELETE WARNINGS
function deleteWarning(e, text) {
    if (!confirm(text))
        e.preventDefault();
}

function storyDeleteWarning(e) {
    deleteWarning(e, "Are you sure you want to delete this story?");
}


function commentDeleteWarning(e) {
    deleteWarning(e, "Are you sure you want to delete this comment?");
}


// SETUP
function storyDeleteHandler() {
    const storyDeleteBtns = document.querySelectorAll('[data-story-delete]');
    applyEventListenerToNodes(storyDeleteBtns, 'click', storyDeleteWarning);
}

function commentDeleteHandler() {
    const commentDeleteBtns = document.querySelectorAll('[data-comment-delete]');
    applyEventListenerToNodes(commentDeleteBtns, 'click', commentDeleteWarning);
}



function commentEditHandler() {
    const commentEditBtns = document.querySelectorAll('[data-comment-edit-btn]');
    applyEventListenerToNodes(commentEditBtns, 'click', editComment);

    const commentEditCancelBtns = document.querySelectorAll('[data-comment-cancel-btn]');
    applyEventListenerToNodes(commentEditCancelBtns, 'click', cancelEditComment);

    function getRelevantCommentNodes(id) {
        return {
            btnCont: document.querySelector(`[data-comment-button-cont="${id}"]`),
            editCont: document.querySelector(`[data-comment-edit-form-cont="${id}"]`),
            commentText: document.querySelector(`[data-comment-id="${id}"]`),
            commentInput: document.querySelector(`[data-comment-input="${id}"]`)
        }
    }
    function editComment(e) {
        const id = e.currentTarget.getAttribute('data-comment-edit-btn');
        const {btnCont, editCont, commentText, commentInput} = getRelevantCommentNodes(id);

        applyClass([commentText, btnCont], 'display-none');
        removeClass([editCont], 'display-none');

        // Give textarea correct body
        commentInput.value = commentText.textContent.trim();
    }

    function cancelEditComment(e) {
        const id = e.currentTarget.getAttribute('data-comment-cancel-btn');
        const {btnCont, editCont, commentText, commentInput} = getRelevantCommentNodes(id);

        removeClass([commentText, btnCont], 'display-none');
        applyClass([editCont], 'display-none');
    }
}


document.addEventListener('DOMContentLoaded', main, false);

function main() {
    storyDeleteHandler();
    commentEditHandler();
    commentDeleteHandler();
}
