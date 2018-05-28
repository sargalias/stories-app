$(document).foundation();

const storyDeleteBtns = document.querySelectorAll('[data-story-delete]');
for (let btn of storyDeleteBtns) {
    btn.addEventListener('click', deleteStoryHandler);
}

function deleteStoryHandler(e) {
    if (!confirm("Are you sure you want to delete this story?"))
        e.preventDefault();
}
