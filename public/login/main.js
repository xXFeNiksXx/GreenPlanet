   axios.get('http://localhost:3000/auth/register')
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.error(err.response.data.message);
        $('.message').append(`<h1 class="textMessage">${err.response.data.message}</h1>`);
    });

$('#loginBtn').click(function () { 
    let data = {
        username: $('#username').val(),
        password: $('#password').val()
    }
    axios.post(`http://localhost:3000/auth/login`, data)
    .then(res => {
        console.log(res);
        window.location.href = `/admin/${res.data.userId}`;
    })
    .catch(err => {
        console.error(err.response.data.message);
        $('.message').append(`<h1 class="textMessage">${err.response.data.message}</h1>`);
        const messageElement = $('#message');
        messageElement.show();

        // Скрываем сообщение через 5 секунд
        setTimeout(function() {
            messageElement.hide();
        }, 5000);
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