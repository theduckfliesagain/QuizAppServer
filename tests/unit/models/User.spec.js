const User = require('../../../models/User');
// const Owner = require('../../../models/Owner');

jest.mock('../../../models/Owner');

const pg = require('pg');
jest.mock('pg');

const db = require('../../../dbConfig/init');

describe('User', () => {
    beforeEach(() => jest.clearAllMocks())
    
    afterAll(() => jest.resetAllMocks())
})