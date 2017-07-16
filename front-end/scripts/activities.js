'use strict';

const activitiesContainer = document.querySelector('.activities-container');

function getAllActivities () {

  var headers = new Headers();
  var myInit = { method: 'GET',
                 headers: headers,
                 mode: 'no-cors',
                 cache: 'default',
                 credentials: 'include' };

  fetch('https://stat-tracker-tiy.herokuapp.com/activities', myInit).then(function(response) {
    if (response.ok) {
      return response;
    }
  }).then(function(results) {
    displayActivities(results.data.user);
  }).catch(function(error) {
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

(function() {
  const serverResponse = getAllActivities();
  if (serverResponse.status === 'error') {
    activitiesContainer.innerHTML = '<span class="error">There was a problem</span>';
  } else if (serverResponse.data.user.activities) {
    serverResponse.data.user.activities.keys.forEach(function(activity) {
      console.log('activities: '+activity);
      const activityBox = document.element.createElement('div');
      const activityName = document.createElement('h2');
      activityName.textContent = (activity);
      activityBox.appendChild(activityName);
      activitiesContainer.appendChild(activityBox);
    });
  }
})();
