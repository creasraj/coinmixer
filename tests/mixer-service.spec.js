const axios = require('axios');

const mixerService = require('../services/mixer-service');

jest.mock('axios');
jest.mock('winston');
jest.mock('../services/dole-service');
describe('mixer-service', () => {

    const transactions = [
        {
            timestamp: "2021-09-20T07:03:39.256Z",
            fromAddress: "Bob",
            toAddress: "test",
            amount: "10"
        }];

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('return transaction amount after deducting fee', async () => {
        mixerService.prototype.feePercentage = 0.01;
        const response = await mixerService.prototype.getTransactionAmount(10);
        expect(response).toEqual(9.90);
    });

    it('return mapper with invalid', async () => {
        mixerService.prototype.feePercentage = 0.01;
        const response = await mixerService.prototype.mapDepositAccount('test', null);
        expect(response).toEqual(undefined);

    });

    it('verify for used address', async () => {
        axios.request.mockResolvedValueOnce({
            data: {
                balance: "0.1",
                transactions: [
                    {
                        timestamp: "2021-09-19T07:03:39.256Z",
                        fromAddress: "Bob",
                        toAddress: "test",
                        amount: "10"
                    }]
            }
        });
        mixerService.prototype.feePercentage = 0.01;
        const response = await mixerService.prototype.mapDepositAccount('test', 'Alice,Bob');
        expect(response).toEqual(undefined);
    });

    it('handlePollCallback', async () => {
        axios.request.mockResolvedValueOnce({
            data: {
                balance: "0.1",
                transactions: [
                    {
                        timestamp: "2021-09-19T07:03:39.256Z",
                        fromAddress: "Bob",
                        toAddress: "test",
                        amount: "10"
                    }]
            }
        });

        const mixer = new mixerService();
        await mixer.mapDepositAccount('test', 'Alice,Bob');
        await mixer.handlePollCallback(transactions);
        expect(axios.request).toHaveBeenCalledWith({
                baseURL: "https://jobcoin.gemini.com/maggot-saved/api/",
                method: "get",
                url: "addresses/Bob",
        });
        expect(axios.request).toHaveBeenCalledTimes(2);
    });


})
