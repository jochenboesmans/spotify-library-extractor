# How to run

## Installation

These examples run on Node.js. On [its website](http://www.nodejs.org/download/) you can find instructions on how to install it. You can also follow [this gist](https://gist.github.com/isaacs/579814) for a quick and easy way to install Node.js and npm.

Once installed, clone this repository and install its dependencies running:

    $ npm install

### Create your own Spotify credentials
You will need to register your app and get your own credentials from the Spotify for Developers Dashboard.

To do so, go to [your Spotify for Developers Dashboard](https://beta.developer.spotify.com/dashboard) and create your application. You will also need to register this Redirect URI:

* http://localhost:8888/callback

Once you have created your app, create `.client_id.js` and `.client_secret.js` files in the main directory and fill the files with your Spotify app's `client_id` and `client_secret` like: 

```javascript
module.exports = CLIENT_ID_OR_SECRET_GOES_HERE
```

Afterwards, add your Spotify app's `redirect_uri` to `app.js`.

## Run
In the main directory, run:

    $ node app.js
    
Then, open `http://localhost:8888` in a browser. Once you authorize your app to access your account, your library will be written to `tracks.json` in the main directory.
