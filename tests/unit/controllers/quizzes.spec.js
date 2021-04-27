const quizzesController = require('../../../controllers/quizzes')
const Quiz = require('../../../models/Quiz');

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(() => ({ send: mockSend, json: mockJson, end: jest.fn() }))
const mockRes = { status: mockStatus }

describe('quizzes controller', () => {
    beforeEach(() =>  jest.clearAllMocks());

    afterAll(() => jest.resetAllMocks());

    describe('index', () => {
        test('it returns quizzes with a 200 status code', async () => {
            let testQuizzes =[{id: '1'}, {id: '2'}]

            jest.spyOn(Quiz, 'all', 'get')
                 .mockResolvedValue(testQuizzes);
            await quizzesController.index(null, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(testQuizzes);
        })
    });

    describe('show', () => {
        test('it returns a quiz with a 200 status code', async () => {
            let testQuiz = {
                id: 1, name: 'Quiz1'
            }
            jest.spyOn(Quiz, 'findById')
                .mockResolvedValue(new Quiz(testQuiz));
                
            const mockReq = { params: { name: 'Quiz1' } }
            await quizzesController.show(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(new Quiz(testQuiz));
        })
    });

    describe('show', () => {
        test('it returns a quiz with a 200 status code', async () => {
            let testQuiz = {
                id: 1, name: 'Quiz1'
            }
            jest.spyOn(Quiz, 'findById')
                .mockResolvedValue(new Quiz(testQuiz));
                
            const mockReq = { params: { name: 'Quiz1' } }
            await quizzesController.show(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(new Quiz(testQuiz));
        })
    });

    describe('create', () => {
        test('it returns a new quiz with a 201 status code', async () => {
            let testQuiz = {
                id: 1, name: 'Test Quiz'
            }
            jest.spyOn(Quiz, 'create')
                .mockResolvedValue(new Quiz(testQuiz));
                
            const mockReq = { body: testQuiz }
            await quizzesController.create(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(new Quiz(testQuiz));
        })
    });
})