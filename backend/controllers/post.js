const auth = require('../middleware/auth');
const fs = require('fs');

const Post = require('../models/post');

exports.getAllPosts = (req, res, next) => {
    Post.find().sort({timestamp:-1})
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({ error }));
};

exports.getOnePost = (req, res, next) => {
    Post.findOne({ _id: req.params.id })
        .then(post => res.status(200).json(post))
        .catch(error => res.status(404).json({ error }));
};

exports.createPost = (req, res, next) => {
    const postObject = req.body;
    delete postObject._id;
    delete postObject._userId;
    const post = new Post({
        ...postObject,
        userId: req.auth.userId,
        timestamp: Date.now(),
        imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null,
        likes: parseInt(0),
        dislikes: parseInt(0),
        usersLiked: [],
        usersDisliked: []
    });

    post.save()
        .then(() => { res.status(201).json({ message: 'Post saved!' }) })
        .catch(error => { res.status(400).json({ error }) });
};

exports.updatePost = (req, res, next) => {
    const newPostObject = req.file ? {
        ...JSON.parse(req.body.post),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...JSON.parse(req.body.post) };

    delete newPostObject._userId;
    Post.findOne({ _id: req.params.id })
        .then((post) => {
            if (!req.auth.isAdmin && post.userId != req.auth.userId) {
                res.status(403).json({ message: 'Unauthorized request' });
            } else {
                if (post.imageUrl && req.file) {
                    const originalFileName = post.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${originalFileName}`, (err => {
                        if (err) {
                            console.error(err);
                        }                        
                    }));
                }
                Post.updateOne({ _id: req.params.id }, { ...newPostObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Post updated!' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch(error => res.status(401).json({ error }));
};

exports.removePost = (req, res, next) => {
    Post.findOne({ _id: req.params.id })
        .then(post => {
            if (!req.auth.isAdmin && post.userId != req.auth.userId) {
                res.status(401).json({ message: 'Unauthorized' });
            } else {
                if (post.imageUrl) {
                    const filename = post.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, err => {
                        if (err) {
                            console.error(err);
                        }                        
                    });
                }
                Post.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Post removed!' }))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
};

exports.likePost = (req, res, next) => {
    Post.findOne({ _id: req.params.id })
        .then(post => {
            switch (req.body.like) {
                case parseInt(1):
                    if (!(post.usersLiked.includes(req.body.userId)) && !(post.usersDisliked.includes(req.body.userId))) {
                        post.likes++;
                        post.usersLiked.push(req.body.userId);
                    }
                    else if (!(post.usersLiked.includes(req.body.userId)) && post.usersDisliked.includes(req.body.userId)) {
                        post.likes++;
                        post.usersLiked.push(req.body.userId);
                        const userIndex = post.usersDisliked.findIndex(id => id == req.body.userId);
                        post.usersDisliked.splice(userIndex, 1);
                        post.dislikes--;
                    }
                    break;
                case parseInt(-1):
                    if (!(post.usersDisliked.includes(req.body.userId)) && !(post.usersLiked.includes(req.body.userId))) {
                        post.dislikes++;
                        post.usersDisliked.push(req.body.userId);
                    }
                    else if (!(post.usersDisliked.includes(req.body.userId)) && post.usersLiked.includes(req.body.userId)) {
                        post.dislikes++;
                        post.usersDisliked.push(req.body.userId);
                        const userIndex = post.usersLiked.findIndex(id => id == req.body.userId);
                        post.usersLiked.splice(userIndex, 1);
                        post.likes--;
                    }
                    break;
                case parseInt(0):
                    if (post.usersLiked.includes(req.body.userId)) {
                        const userIndex = post.usersLiked.findIndex(id => id == req.body.userId);
                        post.usersLiked.splice(userIndex, 1);
                        post.likes--;
                    }
                    if (post.usersDisliked.includes(req.body.userId)) {
                        const userIndex = post.usersDisliked.findIndex(id => id == req.body.userId);
                        post.usersDisliked.splice(userIndex, 1);
                        post.dislikes--;
                    }
                    break;
                default:
                    return post;
                }
            Post.updateOne({ _id: req.params.id }, post)
                .then(() => res.status(200).json({ message: 'Post updated!' }))
                .catch(error => res.status(401).json({ error }));
            }
        )
        .catch(error => res.status(500).json({ error }));
}