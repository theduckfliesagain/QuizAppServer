const usersController = require('../../../controllers/users')
const User = require('../../../models/User');

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(() => ({ send: mockSend, json: mockJson, end: jest.fn() }))
const mockRes = { status: mockStatus }

describe('users controller', () => {
    beforeEach(() =>  jest.clearAllMocks());

    afterAll(() => jest.resetAllMocks());

    describe('index', () => {
        test('it returns users with a 200 status code', async () => {
            let testUsers =[{name: 'user1'}, {name: 'user2'}]

            jest.spyOn(User, 'all', 'get')
                 .mockResolvedValue(testUsers);
            await usersController.index(null, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(testUsers);
        })
    });

    describe('show', () => {
        test('it returns a user with a 200 status code', async () => {
            let testUser = {
                id: 1, name: 'User1'
            }
            jest.spyOn(User, 'findByName')
                .mockResolvedValue(new User(testUser));
                
            const mockReq = { params: { name: 'User1' } }
            await usersController.show(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(new User(testUser));
        })
    });

    describe('create', () => {
        test('it returns a new user with a 201 status code', async () => {
            let testUser = {
                id: 1, name: 'Test User'
            }
            jest.spyOn(User, 'create')
                .mockResolvedValue(new User(testUser));
                
            const mockReq = { body: testUser }
            await usersController.create(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(new User(testUser));
        })
    });

    describe('update', () => {
        test('it returns an updated user with a 200 status code', async () => {
            let testUser = {
                id: 1, name: 'Test User', highscore: 1
            }
            const resultUser = {
                id: 1, name: 'Test User', highscore: 10}
            jest.spyOn(User, 'findByName')
                .mockResolvedValue({...new User(testUser), update: function(highscore) {
                    return new User({...testUser, highscore: highscore})} });
                
            const mockReq = { params: {name: 'Test User' }, body: 10 }
            await usersController.update(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(new User(resultUser));
        })
    });
})