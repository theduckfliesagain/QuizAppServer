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
        });
        test('it rejects with an error on unsuccessful db query', async () => {
            jest.spyOn(db, 'query')
                .mockRejectedValueOnce('Invalid Query');
            await Quiz.all.catch(e => 
                expect(e).toBe('Error retrieving quizzes: Invalid Query')
            );
        });
    });

    describe('findById', () => {
        test('it resolves with a certain quiz on a successful db query', async () => {
            let quizzesData = [{ id: 1, category: 1 }, { id: 2, category: 2 }];
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: quizzesData });
            const result = await Quiz.findById(1);
            expect(result).toBeInstanceOf(Quiz);
        });
        test('it rejects with an error on unsuccessful db query', async () => {
            jest.spyOn(db, 'query')
                .mockRejectedValueOnce('Invalid Query');
            await Quiz.findById(1).catch(e => 
                expect(e).toBe('Error retrieving quiz: Invalid Query')
            );
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
        });
        test('it rejects with an error on unsuccessful api query', async () => {
            let quizData = {
                category: 20, difficulty: 'easy', length: 10,
                users: [1, 2]
            }
            axios.get = jest.fn()
            axios.get.mockResolvedValueOnce({ data: { response_code: 100, results: [{ question: "" }] } })
            await Quiz.create(quizData).catch(e => 
                expect(e).toBe('Error creating quiz: Error: Could not return results')
            );
        });
        test('it rejects with an error on unsuccessful db query', async () => {
            let quizData = {
                category: 20, difficulty: 'easy', length: 10,
                users: [1, 2]
            }
            axios.get = jest.fn()
            axios.get.mockResolvedValueOnce({ data: { response_code: 0, results: [{ question: "" }] } })
            jest.spyOn(db, 'query')
                .mockRejectedValueOnce('Invalid Query');
            await Quiz.create(quizData).catch(e => 
                expect(e).toBe('Error creating quiz: Invalid Query')
            );
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
        test('it rejects with an error on unsuccessful db query', async () => {
            let quiz = new Quiz({ id: 1, name: 'TestQuiz', highscore: 0 });
            jest.spyOn(db, 'query')
                .mockRejectedValueOnce('Invalid Query');
            await quiz.getUsers().catch(e => 
                expect(e).toBe('Error retrieving quiz users: Invalid Query')
            );
        });
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
        test('it rejects with an error on unsuccessful db query', async () => {
            const mockUpdate = { highscore: 3 };
            let quiz = new Quiz({ id: 1, name: 'TestQuiz', highscore: 0 })
            jest.spyOn(db, 'query')
                .mockRejectedValueOnce('Invalid Query');
            await quiz.update(mockUpdate).catch(e => 
                expect(e).toBe('Error updating quiz 1: Invalid Query')
            );
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
        test('it resolves with existing user score on successful db query if new score is lower', async () => {
            let quiz = new Quiz({ id: 1, name: 'TestQuiz', highscore: 6, length: 1 });
            const mockUser = new User({id: 9, name: "TestDude", highscore: 10});
            const mockData = [{user_id: 9, quiz_id: 1, score: 10}];
            jest.spyOn(db, 'query').mockResolvedValueOnce({rows: mockData});
            const result = await quiz.updateUserScore({user: mockUser, score: 6});
            expect(result.score).toEqual(10);
        });
        test('it rejects with an error on unsuccessful db query', async () => {
            let quiz = new Quiz({ id: 1, name: 'TestQuiz', highscore: 0, length: 1 });
            const mockUser = new User({id: 9, name: "TestDude", highscore: 1});
            const mockData = [{user_id: 9, quiz_id: 1, score: 10}];
            jest.spyOn(db, 'query')
                .mockRejectedValueOnce('Invalid Query');
            await quiz.updateUserScore({user: mockUser, score: 10}).catch(e => 
                expect(e).toBe('Error updating user 9 score for quiz 1: Invalid Query')
            );
        });
    });
});