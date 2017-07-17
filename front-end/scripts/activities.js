'use strict';

const activitiesContainer = document.querySelector('.activities-container');
const logoutLink = document.querySelector('#logout');
logoutLink.addEventListener('click', function(e){
  e.preventDefault();
  fetch('https://stat-tracker-tiy.herokuapp.com/logout', {method: 'GET', mode:'no-cors'})
  .then(function (response) {
    if (!response.ok) {
      console.log('You have been logged out.');
    }
  })
    .then(document.location.assign('./index.html'));
});

function getAllActivities () {

  var headers = new Headers({'Content-Type': 'application/json'});
  var myInit = { method: 'GET',
                 headers: headers,
                 mode: 'no-cors',
                 cache: 'no-cache',
                 credentials: 'include' };

  fetch('https://stat-tracker-tiy.herokuapp.com/activities', myInit).then(function(response) {
    console.log(`response status: ${response.status}`);
    console.log(`response body: ${response.body}`);
    if (response.status < 400) {
      return response;
    }
  }).then(function(results) {
    console.log(results);
    displayActivities(results.data);
  }).catch(function(error) {
    console.log(error);
    return error;
  });
}

function displayActivities(data) {
  if (Object.keys(data.activities)) {
    Object.keys(data.activities).forEach(function(activity) {
      console.log('activities: '+activity);
      const activityBox = document.element.createElement('div');
      const activityName = document.createElement('h2');
      activityName.textContent = (activity);
      activityBox.appendChild(activityName);
      activitiesContainer.appendChild(activityBox);
    });
  }
}

getAllActivities();
