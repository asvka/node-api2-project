const express = require('express')
const db = require('./data/db')

const router = express.Router()


//GET
router.get('/', (req, res) => {
    db.find()
        .then((posts) => {
            res.status(200).json(posts)
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).json({
                message: 'The db information could not be retrieved.',
            })
        });
})
router.get('/:id', (req, res) => {
    db.findById(req.params.id)
        .then((post) => {
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
    db.findCommentById(req.params.id)
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
    db.insert(req.body)
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
    db.findById(req.params.id)
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
                db.insertComment(req.body, req.params.id)
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

//DELETE, refactored
router.delete('/:id', async (req, res) => {
    const posts = await db.findById(req.params.id)
    console.log(posts)
        if (posts.length > 0) {
                db.remove(req.params.id)
                .then((count) => {
                    if (count > 0) {
                        res.status(200).json(posts)
                    }
                })
                .catch((err) => {
                    console.log(err)
                    res.status(404).json({
                        message: 'The post with the specified ID does not exist.'
                    })
                })
            }
            else {
                return res.status(500).json({
                error: 'The post could not be removed'
            })}
})
//original .DELETE code
// router.delete('/:id', (req, res) => {
//     db.findById(req.params.id)
//         .then((post) => {
//             if (post) {
//                 db.remove(req.params.id)
//                 .then((count) => {
//                     if (count > 0) {
//                         res.status(200).json({
//                             post
//                         })
//                     }
//                 })
//                 .catch((err) => {
//                     console.log(err)
//                     res.status(404).json({
//                         message: 'The post with the specified ID does not exist.'
//                     })
//                 })
//             }
//         })
//         .catch((err) => {
//             console.log(err)
//             res.status(500).json({
//                 error: 'The post could not be removed'
//             })})
//         });

//PUT
router.put('/:id', async (req, res) => {
    if (!req.body.title || !req.body.contents ){
        return res.status(400).json({
            errorMessage: 'Please provide title and contents for the post.'
        })
    }
    db.update(req.params.id, req.body)
        .then((posts) => {
            if (posts) {
                res.status(200).json(req.body)
            } else {
                res.status(404).json({
                    message: 'The post with the specified ID does not exist.'
                })
            }
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).json({
                error: 'The post information could not be modified.'
            })
        })
})

module.exports = router