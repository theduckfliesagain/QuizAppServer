const Quiz = require('../models/Quiz');
const User = require('../models/User');

async function index (req, res) {
    try {
        const quizzes = await Quiz.all;
        res.status(200).json(quizzes)
    } catch (err) {
        res.status(500).json({err})
    }
}

async function show (req, res) {
    try {
        const quiz = await Quiz.findById(req.params.id);
        res.status(200).json(quiz)
    } catch (err) {
        res.status(404).json({err})
    }
}

async function showUsers (req, res) {
    try {
        const quiz = await Quiz.findById(req.params.id);
        const users = await quiz.getUsers();
        res.status(200).json(users)
    } catch (err) {
        res.status(404).json({err})
    }
}

async function create (req, res) {
    try {
        const quiz = await Quiz.create(req.body);
        res.status(201).json(quiz)
    } catch (err) {
        res.status(422).json({err})
    }
}

async function update (req, res) {
    try {
        let quiz = await Quiz.findById(req.params.id);
        quiz = await quiz.update(req.body);
        res.status(200).json(quiz)
    } catch (err) {
        res.status(422).json({err})
    }
}

async function updateUserScore (req, res) {
    try {
        const quiz = await Quiz.findById(req.params.id);
        const user = await User.findByName(req.params.name);
        const userScores = await quiz.updateUserScore({ user, score: req.body.score});
        res.status(200).json(userScores)
    } catch (err) {
        console.log(err);
        res.status(404).json({err})
    }
}

module.exports = { index, show, showUsers, create, update, updateUserScore }