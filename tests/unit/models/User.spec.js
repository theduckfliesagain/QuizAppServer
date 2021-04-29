const User = require('../../../models/User');

const pg = require('pg');
const SQL = require('sql-template-strings');
jest.mock('pg');
jest.mock('sql-template-strings');

const db = require('../../../dbConfig/init');

describe('User', () => {
    beforeEach(() => jest.clearAllMocks())

    afterAll(() => jest.resetAllMocks())

    describe('all', () => {
        test('it resolves with users on successful db query', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ id: 1 }, { id: 2 }, { id: 3 }] });
            const all = await User.all;
            expect(all).toHaveLength(3)
        });
        test('it rejects with an error on unsuccessful db query', async () => {
            jest.spyOn(db, 'query')
                .mockRejectedValue('Invalid Query');
            await User.all.catch(e => 
                expect(e).toBe('Error retrieving users: Invalid Query')
            );
        });
    });

    describe('findByName', () => {
        test('it resolves with a certain user on a successful db query', async () => {
            let usersData = [{ id: 1, name: 'TestUser' }, { id: 2, name: 'TestUser2' }];
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: usersData });
            const result = await User.findByName('TestUser');
            expect(result).toBeInstanceOf(User);
        });
        test('it rejects with an error with no results from the database', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({rows: []});
            await User.findByName('Testuser').catch(e => 
                expect(e).toBe('Error retrieving user: Error: No user with the name Testuser.')
            );
        });
        test('it rejects with an error on unsuccessful db query', async () => {
            jest.spyOn(db, 'query')
                .mockRejectedValue('Invalid Query');
            await User.findByName('Testuser').catch(e => 
                expect(e).toBe('Error retrieving user: Invalid Query')
            );
        });
    });

    describe('create', () => {
        test('it resolves with user on successful db query', async () => {
            let userData = { name: 'TestUser' };
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ ...userData, id: 1 }] });

            const result = await User.create(userData);
            expect(result).toHaveProperty('id', 1)
            expect(result).toHaveProperty('name', 'TestUser');
        });
        test('it rejects with an error on unsuccessful db query', async () => {
            let userData = { name: 'TestUser' };
            jest.spyOn(db, 'query')
                .mockRejectedValue('Invalid Query');
            await User.create(userData).catch(e => 
                expect(e).toBe('Error creating user: Invalid Query')
            );
        });
    });

    describe('update', () => {
        test('it resolves with user on successful db query', async () => {
            const mockUpdate = { highscore: 3 };
            let user = new User({ id: 1, name: 'TestUser', highscore: 0 })
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ ...user, ...mockUpdate }] })
            const result = await user.update(mockUpdate);
            expect(result.highscore).toEqual(3);
        });
        test('it rejects with an error on unsuccessful db query', async () => {
            const mockUpdate = { highscore: 3 };
            let user = new User({ id: 1, name: 'TestUser', highscore: 0 })
            jest.spyOn(db, 'query')
                .mockRejectedValue('Invalid Query');
            await user.update(mockUpdate).catch(e => 
                expect(e).toBe('Error updating highscore for user TestUser: Invalid Query')
            )
        });
    })
})