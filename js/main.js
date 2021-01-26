'use strict';

const COUNTRY_NAMES = {
  'RU': 'RUSSIAN',
  'LV': 'LATVIAN',
  'RO': 'ROMANIAN',
  'KK': 'KAZAKH',
  'UZ': 'UZBEK',
  'UK': 'UKRANIAN',
  'PT': 'PORTUGUESE',
  'IT': 'ITALIAN',
  'FR': 'FRENCH',
  'KO': 'KOREAN',
  'JA': 'JAPANESE',
  'DE': 'GERMAN',
  'ES': 'SPANISH',
  'ZH': 'CHINESE',
  'MN': 'MONGOLIAN',
  'CA': 'CATALAN'
};

let fileId;
let file;

const substring = document.querySelector('#substring');
const multiplyButton = document.querySelector('#multiply-button');
const allLangsInputs = document.querySelectorAll('.lang');
const fileName = document.querySelector('#file-name');

const showFileName = (file) => {
  fileName.textContent = `You chose ${file.name}`;
  fileName.classList.remove(`hidden`);
};


const getFile = (id) => {
  gapi.client.request({
    'path': `https://www.googleapis.com/drive/v3/files/${id}?fields=name,parents,id`
  }).then((response) => {
    file = response.result;
    showFileName(file);
    fileId = file.id;
    console.log(file.id);
  }, (error) => {
    console.log(error);
    alert(error.result.error.message || `File can't be found`);
  })
};

const alertTemplate = document.querySelector('.alert-template').content.querySelector('#alert');
const alertsBox = document.querySelector('.alerts');

const closeAlert = (alert) => {
  alert.parentNode.removeChild(alert);
};

const setAlertCloseTimer = (alert) => {
  let timerId = setTimeout(() => {closeAlert(alert)}, 4000);
  alert.timerId = timerId;
  console.log(timerId);

  alert.addEventListener('mouseover', () => {
    clearTimeout(timerId);
  });

  alert.addEventListener('mouseout', () => {
    timerId = setTimeout(() => {closeAlert(alert)}, 2000);
  });

};

const showAlert = (message, isError) => {
  const alert = alertTemplate.cloneNode(true);
  if (isError) {
    alert.classList.add('alert-warning');
  }
  else {
    alert.classList.add('alert-success');
  }
  alert.innerHTML = `<strong>${message}</strong> has been created
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
  alert.style.position = 'relative';
  alertsBox.appendChild(alert);
  setAlertCloseTimer(alert);
};


const createFile = (name) => {
  gapi.client.drive.files.copy({
    'fileId': file.id,
    'name': name,
    'parents': [file.parents[0]]
  }).then((response) => {
    console.log(response);
    showAlert(response.result.name, false)
  }, (error) => {
    console.log(error);
    showAlert(error, true)
  })
};

const multiply = () => {

  if (!fileId) {
    alert(`Please specify file ID or choose a file`);
    return;
  };

  if (substring.value === ``) {
    alert(`Please specify the substring for changing`);
    return;
  };


  let selectedLangs = [];
  for (var i = 0; i < allLangsInputs.length; i++) {
    if (allLangsInputs[i].checked === true) {
      selectedLangs.push(allLangsInputs[i].value);
    }
  };

  if (selectedLangs.length === 0) {
    alert(`Please choose at least one language`);
    return;
  };

  const subToBeChanged = substring.value.trim();
  const name = file.name;
  const toChangePos = name.indexOf(subToBeChanged);
  if (toChangePos === -1) {
    alert(`The substring you specified for changing isn't found in the file title. Please check it up and correct.`);
  } else {
    const part1 = name.slice(0, toChangePos);;
    const part2 = name.slice(toChangePos + subToBeChanged.length);
    for (let i = 0; i < selectedLangs.length; i++) {
      createFile(part1 + `${selectedLangs[i]} (${COUNTRY_NAMES[selectedLangs[i]]})` + part2);
    };
  }
};

const spiner = document.querySelector('.spinner-border');

const showProcces = (flag) => {
  if (flag) {
    console.log(spiner);
  }
  if (!flag) {
    console.log(spiner.classList);
  }
};

multiplyButton.addEventListener('click', () => {
  multiply();
});

export { getFile };
