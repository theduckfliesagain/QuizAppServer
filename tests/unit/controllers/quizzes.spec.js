const quizzesController = require('../../../controllers/quizzes')
const Quiz = require('../../../models/Quiz');
const User = require('../../../models/User');

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(() => ({ send: mockSend, json: mockJson, end: jest.fn() }))
const mockRes = { status: mockStatus }

describe('quizzes controller', () => {
    beforeEach(() => jest.clearAllMocks());

    afterAll(() => jest.resetAllMocks());

    describe('index', () => {
        test('it returns quizzes with a 200 status code', async () => {
            let testQuizzes = [{ id: '1' }, { id: '2' }]

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
                id: 1,
            }
            jest.spyOn(Quiz, 'findById')
                .mockResolvedValue(new Quiz(testQuiz));

            const mockReq = { params: { id: 1 } }
            await quizzesController.show(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(new Quiz(testQuiz));
        })
    });

    describe('showUsers', () => {
        test('it returns a list of users 200 status code', async () => {
            let testUsers = [{ id: 1, id: 2 }];
            let testQuiz = new Quiz({ id: 1 });

            jest.spyOn(Quiz, 'findById')
                .mockResolvedValue(testQuiz);
            jest.spyOn(Quiz.prototype, 'getUsers')
                .mockResolvedValue(testUsers);

            const mockReq = { params: { id: 1 } }
            await quizzesController.showUsers(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(testUsers);
        })
    });

    describe('create', () => {
        test('it returns a new quiz with a 201 status code', async () => {
            let testQuiz = { id: 1 }
            jest.spyOn(Quiz, 'create')
                .mockResolvedValue(new Quiz(testQuiz));

            const mockReq = { body: testQuiz }
            await quizzesController.create(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(new Quiz(testQuiz));
        })
    });

    describe('update', () => {
        test('it returns an updated quiz with a 200 status code', async () => {
            let testQuiz = { id: 1, length: 1 }
            let resultQuiz = { id: 1, length: 2 }
            jest.spyOn(Quiz, 'findById')
                .mockResolvedValue(new Quiz(testQuiz));
            jest.spyOn(Quiz.prototype, 'update').mockResolvedValue(new Quiz(resultQuiz))
            const mockReq = { params: {id: 1 }, body: {length: 2} }
            await quizzesController.update(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(new Quiz(resultQuiz));
        })
    });

    describe('updateUserScore', () => {
        test('it returns the new score with 200 status code', async () => {
            let testQuiz = { id: 1 };
            let testUserScore = { id: 1, name: "test", score: 1 };

            jest.spyOn(Quiz, 'findById')
                .mockResolvedValue(new Quiz(testQuiz));
            jest.spyOn(User, 'findByName')
                .mockResolvedValue({ id: 1, name: "test" });
            jest.spyOn(Quiz.prototype, 'updateUserScore')
                .mockResolvedValue(testUserScore);

            const mockReq = { params: { id: 1, name: 'test' }, body: { score: 1 } }
            await quizzesController.updateUserScore(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(testUserScore);
        })
    });

})