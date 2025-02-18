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
$('#signUpBtn').click(function () { 
    const username = $('#username').val();
    const password = $('#password').val();
    const photo = $('#photo')[0].files[0]; 

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('photo', photo);
    axios.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    .then(res => {
        console.log(res);
        window.location.href = `/admin/${res.data.userId}`;
    })
    .catch(err => {
        console.error(err);
    });
});

const fileInput = document.getElementById('photo');
const imgbut = document.querySelector('.img');


imgbut.style.backgroundImage = `url(/img/userAccaunt.png)`;

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imgbut.style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(file);
    } else {
        imgbut.style.backgroundImage = `url(/img/userAccaunt.png)`;
    }
});
let isBWMode = localStorage.getItem('themeb') === 'grey';

function updateBWMode() {
        $('.spinnerContainer').toggleClass('grayscale-mode', isBWMode);
        $('.wrap').toggleClass('grayscale-mode', isBWMode);
}
updateBWMode();