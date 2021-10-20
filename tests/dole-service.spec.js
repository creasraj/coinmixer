const axios = require('axios');

const TransactionRecord = require('../models/TransactionRecord');
const doleService = require('../services/dole-service');

jest.mock('axios');
jest.mock('winston');

describe('dole-service', () => {
    const mapper = new Map();
    const transactionRecord = new TransactionRecord();
    transactionRecord.setPublicFromAddress('foo');
    transactionRecord.setAmount(10);
    transactionRecord.setPublicToAddress(['bar', 'test']);
    mapper.set('test', transactionRecord);

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('return response if ok', async () => {
        axios.request.mockResolvedValueOnce({
            data: {
                status: "ok",
            }
        });

        await doleService.prototype.doleOut(mapper);
        expect(axios.request).toHaveBeenCalledWith({
            baseURL: "https://jobcoin.gemini.com/maggot-saved/api/",
            method: "post",
            params: {
                amount: 5,
                fromAddress: "5a7f7407-a11f-4724-8845-5edab837f808",
                toAddress: "test"
            },
            url: "transactions"
        });
    });

    it('throw error if insufficient funds throws error', async () => {
        const err = new Error('Insufficient funds');
        axios.request.mockRejectedValueOnce(err);
        try {
            await expect(doleService.prototype.doleOut(mapper));
        } catch (e) {
            expect(e).toEqual(err);
        }
    });

})
