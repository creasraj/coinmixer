const logging = require('../logging');
const winston = require('winston');
const config = require('../config');

jest.mock('../config', () => ({}));

describe('initLogging', () => {
    const winstonConfigure = jest.spyOn(winston, 'configure');
    afterEach(winstonConfigure.mockReset);

    it('should have no loggers in test environment', () => {
        config.env = 'test';

        logging.initLogging();

        expect(winstonConfigure).toHaveBeenCalledWith({
            transports: [],
        });
    });

    it('should have single console logger in development environment', () => {
        config.env = 'development';

        logging.initLogging();

        expect(winstonConfigure).toHaveBeenCalledTimes(1);
        expect(winstonConfigure).toHaveBeenCalledWith({
            transports: [expect.objectContaining({
                name: 'console',
            })],
        });
    });
})
