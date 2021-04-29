const Quiz = require('../../../models/Quiz');
const User = require('../../../models/User');

const pg = require('pg');
const SQL = require('sql-template-strings');
const axios = require('axios');
jest.mock('pg');
jest.mock('sql-template-strings');
//jest.mock('axios');

const db = require('../../../dbConfig/init');

describe('Quiz', () => {
    beforeEach(() => jest.clearAllMocks())

    afterAll(() => jest.resetAllMocks())

    describe('all', () => {
        test('it resolves with quizzes on successful db query', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ id: 1 }, { id: 2 }, { id: 3 }] });
            const all = await Quiz.all;
            expect(all).toHaveLength(3)
        })
    });

    describe('findById', () => {
        test('it resolves with a certain quiz on a successful db query', async () => {
            let quizzesData = [{ id: 1, category: 1 }, { id: 2, category: 2 }];
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: quizzesData });
            const result = await Quiz.findById(1);
            expect(result).toBeInstanceOf(Quiz);
        });
    });

    describe('create', () => {
        test('it resolves with quiz on successful db query', async () => {
            let quizData = {
                category: 20, difficulty: 'easy', length: 10,
                users: [1, 2]
            }
            axios.get = jest.fn()
            axios.get.mockResolvedValueOnce({ data: { response_code: 0, results: [{ question: "" }] } })
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [{ ...quizData, id: 1 }] })

            //axios.get({ data: { response_code: 0, results: [{question: ""}] } });


            const result = await Quiz.create(quizData);
            expect(result.quiz).toHaveProperty('id', 1)
        })
    });

    describe('update', () => {
        test('it resolves with quiz on successful db query', async () => {
            const mockUpdate = { highscore: 3 };
            let quiz = new Quiz({ id: 1, name: 'TestQuiz', highscore: 0 })
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ ...quiz, ...mockUpdate }] })
            const result = await quiz.update(mockUpdate);
            expect(result.highscore).toEqual(3);

        });
    });

    describe('getUsers', () => {
        test('it resolves with all users in a quiz on successful db query', async () => {
            let quiz = new Quiz({ id: 1, name: 'TestQuiz', highscore: 0 });
            const mockData = [{id: 1, name: "test1", score: 10}, {id: 2, name: "test2", score: 5}];
            jest.spyOn(db, 'query').mockResolvedValueOnce({rows: mockData});
            const result = await quiz.getUsers();
            expect(result.length).toEqual(2);
            expect(result[0]).toStrictEqual(mockData[0]);
        });
    });

    describe('updateUserScore', () => {
        test('it resolves with an updated user score on successful db query', async () => {
            let quiz = new Quiz({ id: 1, name: 'TestQuiz', highscore: 0, length: 1 });
            const mockUser = new User({id: 9, name: "TestDude", highscore: 1});
            const mockData = [{user_id: 9, quiz_id: 1, score: 10}];
            jest.spyOn(db, 'query').mockResolvedValueOnce({rows: mockData}).mockResolvedValueOnce({rows: [{id: 9, name: "TestDude", highscore: 10}]});
            const result = await quiz.updateUserScore({user: mockUser, score: 10});
            expect(result.score).toEqual(10);
        });
    });
});