'use strict';

import {createPicker} from './picker.js';
import {getFile} from './main.js';

const chooseButton = document.querySelector('#pick');
const findFileButton = document.querySelector('#find-file-button');
const showAuthText = document.querySelector('#show-auth');
const idInput = document.querySelector('#id');
const authorizeButton = document.querySelector('#authorize_button');
const signoutButton = document.querySelector('#signout_button');
const mainSection = document.querySelector('.main');
const allLangsInputs = document.querySelectorAll('.lang');
const selectAllButton = document.querySelector('.select-all');
const deselectAllButton = document.querySelector('.deselect-all');

const switchCheckboxState = (flag) => {
  for (var i = 0; i < allLangsInputs.length; i++) {
    allLangsInputs[i].checked = flag;
  }
};

selectAllButton.addEventListener('click',  function() {
  switchCheckboxState(true);
});

deselectAllButton.addEventListener('click', function() {
  switchCheckboxState(false);
});

chooseButton.addEventListener('click', createPicker);

findFileButton.addEventListener('click', () => {
  if (idInput.value) {
    getFile(idInput.value);
  } else {
    alert('Please specify a file ID');
  };
});

const switchState = (flag) => {
  if (flag === false) {
    findFileButton.disabled = true;
    chooseButton.disabled = true;
    mainSection.classList.add(`hidden`);
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
  if (flag === true) {
    findFileButton.disabled = false;
    chooseButton.disabled = false;
    mainSection.classList.remove(`hidden`);
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    showAuthText.innerHTML = `Please click 'Authorize' button to log into you Google account`;
  }
};

const showAuth = (name, email) => {
  showAuthText.classList.remove(`hidden`);
  showAuthText.innerHTML = `<i>You are logged as ${name} (<b>${email}</b>)</i>`;
};

export { switchState, showAuth };
