const express = require('express');
const router = express.Router();
const quizzesController = require('../controllers/quizzes')

router.get('/', quizzesController.index)
router.post('/', quizzesController.create)

router.get('/:id', quizzesController.show)
router.put('/:id', quizzesController.update)

router.get('/:id/users', quizzesController.showUsers)
// router.delete('/:id', quizzesController.destroy)

module.exports = router;