const express = require('express');
const router = express.Router();
const quizzesController = require('../controllers/quizzes')

router.get('/', quizzesController.index)
router.get('/:id', quizzesController.show)
router.post('/', quizzesController.create)
router.put('/:id', quizzesController.update)
// router.delete('/:id', quizzesController.destroy)

module.exports = router;