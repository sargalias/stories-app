$(document).foundation();

const storyDeleteBtns = document.querySelectorAll('[data-story-delete]');
for (let btn of storyDeleteBtns) {
    btn.addEventListener('click', deleteStoryHandler);
}

function deleteStoryHandler(e) {
    if (!confirm("Are you sure you want to delete this story?"))
        e.preventDefault();
}

const commentEditBtns = document.querySelectorAll('[data-comment-edit]');
for (let btn of commentEditBtns) {
    btn.addEventListener('click', editComment);
}

const commentCancelEditBtns = document.querySelectorAll((['data-comment-cancel']));
for (let btn of commentCancelEditBtns) {
    btn.addEventListener('click', cancelEditComment);
}

// Get all edit buttons
// Add an event listener to create a textarea.
    // Hide the buttons and create two new buttons for submit, cancel.
// If the textarea is submitted, an ajax request is made.
// If ajax responds, reload the page.

// Also hide the comment text when the editor comes up.

function editComment(e) {
    // hide the button container
    console.log('clicked');
    const id = e.currentTarget.getAttribute('data-comment-edit');
    const btnCont = document.querySelector(`[data-comment-button-cont="${id}"]`);
    const editCont = document.querySelector(`[data-edit-cont="${id}"]`);

    // Hide button container
    btnCont.classList.add('display-none');
    // Unhide edit container
    editCont.classList.remove('display-none');
}

function cancelEditComment(e) {
    console.log('clicked');
    const id = e.currentTarget.getAttribute('data-comment-edit');

    const btnCont = document.querySelector(`[data-comment-button-cont="${id}"]`);
    const editCont = document.querySelector(`[data-edit-cont="${id}"]`);

    // Hide button container
    btnCont.classList.remove('display-none');
    // Unhide edit container
    editCont.classList.add('display-none');
}