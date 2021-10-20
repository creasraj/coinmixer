## Description

Job Coin Mixer is one way to maintain your privacy on bitcoin network

## Features

- Configure the Fee and House Account address using config files.
- Future enhancements ->  caching, fault tolerance.

## Running Application

- Run the command npm run.
- At command prompt, enter the addresses with comma separated (Alice, Bob). Application will provide random deposit address
- Press enter to start the process.
- Application will poll on deposit address to see if the transaction made from source address to deposit address
- Go to https://jobcoin.gemini.com/maggot-saved, transfer the amount to deposit address
- Application will capture the transaction and transfer the coins to houseAccount address, which is configured in ./config/development.js
- Application will dole out coins in increments to addresses (Alice, Bob)
- Go to https://jobcoin.gemini.com/maggot-saved to see the transactions

## Configuration

Config for different environments can be done found in the `config` directory. By default, there are three config files:

- development.js
- test.js
- production.js

The appropriate config file for your environment is then decided by looking at the `NODE_ENV` environment variable and read in by having the following line in your main `app.js`:

```js
const config = require('./config');
```

#### Commands
All npm commands can be run inside the docker container started by docker-compose by prefixing them with `docker exec where-is-my-quote`

- `npm install`:To install necessary dependencies.
- `npm run test`: Runs app tests. 
- `npm run coverage`: Runs app tests with coverage report. Report is displayed in the screen
  and stored in client and app `coverage` folders in html and lcov format. You can also run `npm run coverage:client`
  or `npm run coverage:app` to target each one individually.
- `npm start`: the command to run the app.



## Testing

In 'Commands' below you can see a full list of npm commands available to run subsections of tests, e.g. `npm run test`

### Unit Tests
Tests for all individual chunks of logic. Dependencies mocked with jest. These tests should be fast to run. Unit tests have the suffix `.spec.js`.

## Contributing

Author: Raj Gannamaneni
