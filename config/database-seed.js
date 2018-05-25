const db = require('../config/database');
const User = require('../models/User');
const Story = require('../models/Story');
const Comment = require('../models/Comment');
const async = require('async');


function createStory(authorId, authorName, title, body, allowComments=true, privacy='PUBLIC') {
    let newStory = {};
    newStory.title = title;
    newStory.body = body;
    newStory.allowComments = allowComments;
    newStory.privacy = privacy;
    newStory.authorId = authorId;
    newStory.authorName = authorName;
    return newStory;
}

function createUser(googleId, name) {
    return {
        googleId: googleId,
        name: name,
    };
}


db.dropDatabase((err) => {
    if (err) {
        console.log(err);
    }
    console.log('Seeding database');
    // Create a first user
    let newUser = createUser('1', 'Name: 1');
    User.create(newUser, (err, user) => {
        async.parallel([
            function(callback) {
                let newStory = createStory(user.id, user.name, 'Title: 1', "<p>Bob is awesome.</p><p>Bob is indeed awesome. <strong>Bolded stuff</strong>. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid aspernatur consectetur corporis culpa, cum dicta dolor dolore doloremque eius est fuga in iste, magni natus non, porro temporibus voluptatum. Quia.",);
                Story.create(newStory, (err, story) => {
                    user.stories.push(story);
                    user.save(callback);
                });
            }
    //         }, function(callback) {
    //             let newStory = createStory(user.id, user.name, 'Title: 2', "Bob is awesome\nBob is indeed awesome.<strong>Bolded stuff</strong>", true, 'PRIVATE');
    //             Story.create(newStory, (err, story) => {
    //                 user.stories.push(story);
    //                 user.save(callback);
    //             });
    //         }, function(callback) {
    //             let newStory = createStory( user.id, user.name, 'Title: 3', "Bob is awesome\nBob is indeed awesome.<strong>Bolded stuff</strong>", false );
    //             Story.create(newStory, (err, story) => {
    //                 user.stories.push(story);
    //                 user.save(callback);
    //             });
    //         }, function(callback) {
    //             let newStory = createStory( user.id, user.name, 'Title: 4', "Bob is awesome\nBob is indeed awesome.<strong>Bolded stuff</strong>", true, 'UNLISTED' );
    //             Story.create(newStory, (err, story) => {
    //                 user.stories.push(story);
    //                 user.save(callback);
    //             });
    //         }, function(callback) {
    //             let newStory = createStory( user.id, user.name, 'Title: 5', "Bob is awesome\nBob is indeed awesome.<strong>Bolded stuff</strong>", false );
    //             Story.create(newStory, (err, story) => {
    //                 user.stories.push(story);
    //                 user.save(callback);
    //             });
    //         }
    //     ], function() {
    //         console.log('created first user and stories');
    //     });
    // });
    //
    // // Repeat for a second user
    // let secondUser = createUser('2', 'Name: 2');
    // User.create(secondUser, (err, user) => {
    //     async.parallel([
    //         function(callback) {
    //             let newStory = createStory( user.id, user.name, 'Title: 6', "Bob is awesome\nBob is indeed awesome.<strong>Bolded stuff</strong>", );
    //             Story.create(newStory, (err, story) => {
    //                 user.stories.push(story);
    //                 user.save(callback);
    //             });
    //         }, function(callback) {
    //             let newStory = createStory( user.id, user.name, 'Title: 7', "Bob is awesome\nBob is indeed awesome.<strong>Bolded stuff</strong>", true, 'PRIVATE' );
    //             Story.create(newStory, (err, story) => {
    //                 user.stories.push(story);
    //                 user.save(callback);
    //             });
    //         }, function(callback) {
    //             let newStory = createStory( user.id, user.name, 'Title: 8', "Bob is awesome\nBob is indeed awesome.<strong>Bolded stuff</strong>", false );
    //             Story.create(newStory, (err, story) => {
    //                 user.stories.push(story);
    //                 user.save(callback);
    //             });
    //         }, function(callback) {
    //             let newStory = createStory( user.id, user.name, 'Title: 9', "Bob is awesome\nBob is indeed awesome.<strong>Bolded stuff</strong>", true, 'UNLISTED' );
    //             Story.create(newStory, (err, story) => {
    //                 user.stories.push(story);
    //                 user.save(callback);
    //             });
    //         }, function(callback) {
    //             let newStory = createStory( user.id, user.name, 'Title: 10', "Bob is awesome\nBob is indeed awesome.<strong>Bolded stuff</strong>", false );
    //             Story.create(newStory, (err, story) => {
    //                 user.stories.push(story);
    //                 user.save(callback);
    //             });
    //         }
        ], function() {
            console.log('created second user and stories');
        });
    });
});

