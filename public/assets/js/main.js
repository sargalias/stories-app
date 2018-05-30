$(document).foundation();

function storyHandler() {
    const storyDeleteBtns = document.querySelectorAll('[data-story-delete]');
    for (let btn of storyDeleteBtns) {
        btn.addEventListener('click', deleteStoryHandler);
    }

    function deleteStoryHandler(e) {
        if (!confirm("Are you sure you want to delete this story?"))
            e.preventDefault();
    }
}

function commentEditHandler() {
    function applyEventListenerToNodes(nodes, eventType, func) {
        for (let node of nodes) {
            node.addEventListener(eventType, func);
        }
    }

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
    storyHandler();
    commentEditHandler();
}
