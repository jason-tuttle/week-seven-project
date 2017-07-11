'use strict';

function getAllActivities () {
  const activitiesContainer = document.querySelector('.activities-container');
  var headers = new Headers();
  var myInit = { method: 'GET',
                 headers: headers,
                 mode: 'no-cors',
                 cache: 'default',
                 credentials: 'include' };

  fetch('http://localhost:3000/activities', myInit).then(function(response) {
    if (response.ok) {
      return response;
    }
  }).then(function(results) {
    console.log(results);
  }).catch(function(error) {
    console.log('There has been a problem with your fetch operation: ' + error.message);
  });
}

(function() {
  getAllActivities();
})();
