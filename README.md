### lol-api

Simple API to fetch LOL stats

## Installation

Requires Node 18.

Clone this repo and run `yarn` to install the packages.

Then create the following environment variables:

_LOL_API_PORT_ - The port where the server will run. Defaults to 3001
_LOL_API_KEY_ - The RIOT Api Key
_LOL_CLIENT_APP_URL_ - The URL of the client app that will be making calls to this API. Used for CORS policy.

Then run `yarn dev`

## Testing

Run `yarn test` to run the tests.
