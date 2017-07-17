'use strict';

const loginLink = document.querySelector('#login-link');

loginLink.addEventListener('click', function(e){
  e.preventDefault();
  document.location.assign('./activities.html');
});
