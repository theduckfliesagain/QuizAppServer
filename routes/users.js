const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users')

router.get('/', usersController.index)
router.get('/:name', usersController.show)
router.post('/', usersController.create)
router.put('/:name', usersController.update)
router.delete('/:id', usersController.destroy)

module.exports = router;