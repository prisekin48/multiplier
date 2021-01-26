'use strict';

import {oauthToken, API_KEY} from './auth.js';
import {getFile} from './main.js';

const APP_ID = 'tpp-multiplyer-1609334916052';
const idInput = document.querySelector('#id');
let pickerApiLoaded = false;

// Use the Google API Loader script to load the google.picker script.
const loadPicker = () => {
  gapi.load('picker', {'callback': onPickerApiLoad});
};

const onPickerApiLoad = () => {
  pickerApiLoaded = true;
  console.log('Picker loaded');
};

// Create and render a Picker object for searching images.
const createPicker = () => {
  if (pickerApiLoaded && oauthToken) {
    const view = new google.picker.View(google.picker.ViewId.DOCS);
    const picker = new google.picker.PickerBuilder()
      .enableFeature(google.picker.Feature.NAV_HIDDEN)
      .setAppId(APP_ID)
      .setOAuthToken(oauthToken)
      .addView(view)
      .addView(new google.picker.DocsUploadView())
      .setDeveloperKey(API_KEY)
      .setCallback(pickerCallback)
      .build();
    picker.setVisible(true);
  }
};

// A simple callback implementation.
const pickerCallback = (data) => {
  if (data.action == google.picker.Action.PICKED) {
    getFile(data.docs[0].id);
    idInput.value = '';
  }
};

export {loadPicker, createPicker};
