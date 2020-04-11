const express = require('express')
const posts = require('./data/db')

const router = express.Router()


//GET
router.get('/', (req, res) => {
    posts.find()
        .then((posts) => {
            res.status(200).json(posts)
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).json({
                message: 'The posts information could not be retrieved.',
            })
        });
})
router.get('/:id', (req, res) => {
    posts.findById(req.params.id)
        .then((post) => {
            console.log(post);
            if (post.length == 0) {
                res.status(404).json({
                    message: 'The post with the specified ID does not exist.',
                })
            } else {
                res.status(200).json(post)
            }
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).json({
                error: 'The post information could not be retrieved.'
            })
        });
})
router.get('/:id/comments', (req, res) => {
    posts.findCommentById(req.params.id)
        .then((comment) => {
            if (comment.length == 0) {
                res.status(404).json({
                    message: 'The post with the specified ID does not exist.',
                })
            } else {
                res.status(200).json(comment)
            }
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).json({
                error: 'The comments information could not be retrieved.',
            })
        });
})

//POST
router.post('/', (req, res) => {
    if (!req.body.title || !req.body.contents) {
        return res.status(400).json({
            errorMessage: 'Please provide title and contents for the post.',
        })
    }
    posts.insert(req.body)
        .then((post) => {
            res.status(201).json(post)
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({
                error: 'There was an error while saving the post to the database',
            })
        });
})
router.post('/:id/comments', (req, res) => {
    posts.findById(req.params.id)
        .then((post) => {
            if (!post[0]) {
                res.status(404).json({
                    message: 'The post with the specified ID does not exist.',
                })
                if (req.body.length < 1) {
                    res.status(400).json({
                        errorMessage: 'Please provide text for the comment.'
                    })
                }
            } else {
                posts.insertComment(req.body, req.params.id)
                .then((post) => {
                    res.status(200).json(post)
                } )
                .catch((err) => {
                    console.log(err);
                })
            }
        })
            .catch((err) => {
                    console.log(err)
                    return res.status(500).json({
                        error: 'There was an error while saving the comment to the database',
                        })
                    });
                })

module.exports = router