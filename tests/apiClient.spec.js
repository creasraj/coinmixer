const axios = require('axios');
const apiClient = require('../apiClient');

jest.mock('axios');
jest.mock('winston');

describe('apiClient', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('getTransactions', () => {
        it('return response if ok', async () => {
            axios.request.mockResolvedValueOnce({
                data: [
                    {
                        toAddress: "Alice",
                        amount: "50",
                    }]
            });

            const response = await apiClient.getTransactions();
            expect(axios.request).toHaveBeenCalledWith({
                baseURL: "https://jobcoin.gemini.com/maggot-saved/api/",
                method: "get",
                url: "transactions"
            });
            expect(response.length).toEqual(1);
            expect(response[0].amount).toEqual('50');
            expect(response[0].toAddress).toEqual('Alice');
        });

        it('throw error if fetch throws error', async () => {
            const err = new Error('test error');
            axios.request.mockRejectedValueOnce(err);
            try {
                await expect(apiClient.getTransactions());
            } catch (e) {
                expect(e).toEqual(err);
            }
        });

    });

    describe('getAddressInfo', () => {
        it('return response if ok', async () => {
            axios.request.mockResolvedValueOnce({
                data:
                    {
                      balance: 50,
                    },
                transactions: [
                    {
                      toAddress: 'Bob',
                      amount: 100,
                    }
                ]
            });

            const response = await apiClient.getAddressInfo('Alice');
            expect(axios.request).toHaveBeenCalledWith({
                baseURL: "https://jobcoin.gemini.com/maggot-saved/api/",
                method: "get",
                url: "addresses/Alice"
            });
            expect(response.balance).toEqual(50);
        });

    });

    describe('postTransaction', () => {
        it('return response if ok', async () => {
            axios.request.mockResolvedValueOnce('foo');

            await apiClient.postTransaction('Alice', 'Bob', 50);
            expect(axios.request).toHaveBeenCalledWith({
                baseURL: "https://jobcoin.gemini.com/maggot-saved/api/",
                method: "post",
                url: "transactions",
                params: {
                    amount: 50,
                    fromAddress: 'Alice',
                    toAddress: 'Bob'
                }
            });
        });

    });
})
