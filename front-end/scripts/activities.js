'use strict';

const activitiesContainer = document.querySelector('.activities-container');

function getAllActivities () {

  var headers = new Headers();
  var myInit = { method: 'GET',
                 headers: headers,
                 mode: 'no-cors',
                 cache: 'no-cache',
                 credentials: 'include' };

  fetch('https://stat-tracker-tiy.herokuapp.com/activities', myInit).then(function(response) {
    if (response.status < 400) {
      // console.log(`server responds: ${response}`);
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
