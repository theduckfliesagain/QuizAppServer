const Quiz = require('../../../models/Quiz');

const pg = require('pg');
const SQL = require('sql-template-strings');
const axios = require('axios');
jest.mock('pg');
jest.mock('sql-template-strings');
jest.mock('axios');

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
            
            axios.get({ data: { response_code: 0, results: [{question: ""}] } });


            const result = await Quiz.create(quizData);
            // expect(result).toHaveProperty('id', 1)
            // expect(result).toHaveProperty('name', 'TestQuiz')
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
    })
})