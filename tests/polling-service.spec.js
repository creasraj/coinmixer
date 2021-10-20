const axios = require('axios');
const cron = require('node-cron');

const pollingService = require('../services/polling-service');

jest.mock('axios');
jest.mock('winston');
jest.mock('node-cron');

describe('polling-service', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    const callback = jest.fn();

    it('return response if ok', async () => {
        axios.request.mockResolvedValueOnce({
            data: {
                balance: "0.1",
                transactions: [
                    {
                        timestamp: "2021-09-19T07:03:39.256Z",
                        fromAddress: "Bob",
                        toAddress: "727bc86e",
                        amount: "10"
                    }]
            }
        });

        await pollingService.prototype.getAddressInfo('test', callback);
        expect(axios.request).toHaveBeenCalledWith({
            baseURL: "https://jobcoin.gemini.com/maggot-saved/api/",
            method: "get",
            url: "addresses/test"
        });
    });

    it('should perform poll', async () => {
        await pollingService.prototype.poll('test', callback);
        expect(cron.schedule).toHaveBeenCalledTimes(1);
    })

})
