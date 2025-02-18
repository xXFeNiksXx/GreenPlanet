document.addEventListener('DOMContentLoaded', () => {
    parallaxMouse({
      elements: '.block',
      moveFactor: 10,
      wrap: '.wrap',
      perspective: '10px'
    });
  });
$(document).ready(function () {
    axios.get(`/createadmin`)
});
$(document).ready(function () {
    axios.get(`/auth/check-token`)
    .then(res => {
        console.log("Користувач авторизований:", res.data);
        window.location.href = `/admin/${res.data.userId}`;
    })
    .catch(err => {
        console.log("Користувач не авторизований або токен недійсний");
    });
});

$('#loginBtn').click(function () { 
    let data = {
        username: $('#username').val(),
        password: $('#password').val()
    }
    axios.post(`/login`, data)
    .then(res => {
        console.log(res);
        window.location.href = `/admin/${res.data.userId}`;
    })
    .catch(err => {
        console.error(err);
    });
});
let isBWMode = localStorage.getItem('themeb') === 'grey';

function updateBWMode() {
        $('.spinnerContainer').toggleClass('grayscale-mode', isBWMode);
        $('.wrap').toggleClass('grayscale-mode', isBWMode);
}
updateBWMode();