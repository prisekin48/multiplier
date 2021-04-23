'use strict';

console.log({secrets});

import {loadPicker}  from './picker.js';
import {switchState, showAuth}  from './utils.js';

// Client ID and API key from the Developer Console
const CLIENT_ID = '605926474697-ul1ih9mdj9ce4k23rg6aq3s2o42ol14p.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCsyhSCJWf64H7jl5lLYBdfIE1AI3AG_wc';


// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive';

let oauthToken;
const authorizeButton = document.querySelector('#authorize_button');
const signoutButton = document.querySelector('#signout_button');
const showAuthText = document.querySelector('#show-auth');


/**
 *  On load, called to load the auth2 library and API client library.
 */
window.handleClientLoad = () => {
  gapi.load('client:auth2', initClient);
  loadPicker();
};

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
const initClient = () => {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function(error) {
    appendPre(JSON.stringify(error, null, 2));
  });
};

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
const updateSigninStatus = (isSignedIn) => {
  if (isSignedIn) {
    let currentUser = gapi.auth2.getAuthInstance().currentUser.get();
    let userName = currentUser.getBasicProfile().getName();
    let userEmail = currentUser.getBasicProfile().getEmail();
    let userAuthData = currentUser.getAuthResponse(true);
    oauthToken = userAuthData.access_token;
    switchState(true);
    showAuth(userName, userEmail);
  } else {
    switchState(false);
    showAuthText.textContent = `Please authorize to use the script`;
  }
};

/**
 *  Sign in the user upon button click.
 */
const handleAuthClick = (event) => {
  gapi.auth2.getAuthInstance().signIn();
};

/**
 *  Sign out the user upon button click.
 */
const handleSignoutClick = (event) => {
  gapi.auth2.getAuthInstance().signOut();
  oauthToken = '';

};


/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
const appendPre = (message) => {
  const pre = document.getElementById('content');
  let textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
};

export {oauthToken, API_KEY};

