const swiper = new Swiper('.swiper', {
    direction: 'horizontal',
    loop: true,
    slidesPerView: 2,
    spaceBetween: 30,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  });
  function toBase64(buffer) {
    const binary = [];
    const bytes = new Uint8Array(buffer);
    bytes.forEach(byte => binary.push(String.fromCharCode(byte)));
    return btoa(binary.join(''));
}

axios.get('/getfeedback')
    .then(res => {
        console.log('Feedbacks:', res);
        res.data.forEach(el => {
            console.log(el);

            const imageBase64 = el.data ? `data:${el.contentType};base64,${toBase64(el.data.data)}` : '/img/userAccaunt.png';
            const feedbackContent = `
                <div class="swiper-slide">
                    <div class="feedback-item">
                        <img class="feedbackImg" src="${imageBase64}" alt="Feedback Image">
                        <h4>${el.username}</h4>
                        <h5>${el.message}</h5>
                    </div>
                </div>
            `;
            $('.swiper-wrapper').append(feedbackContent);
        });
        swiper.update();
    })
    .catch(err => {
        console.error('Error fetching feedbacks:', err);
    });

  axios.get(`/ouradress`)
.then(res=>{
    for(let el of res.data){
        console.log(el);
        $('#myAdress').append(`<h3 class='adressText'>${el.adress}</h3>`)

    }
})
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailPattern.test(email);
  }
$('#subscribe').click(async function () {
    let data = {
        email: $('#email').val()
    };
    if(validateEmail(data.email)){
        axios.post('/send-mail', data)
        .then(res => {
            console.log(res);
        })
    }
});
$('#pushMes').click(async function () { 
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
        document.cookie = "pushmessage=true;";
    }
});
const dropdownButton = document.getElementById('dropdownButton');
const dropdownContent = document.getElementById('dropdownContent');
dropdownButton.addEventListener('click', () => {
    const isDisplayed = dropdownContent.style.display === 'block';
    dropdownContent.style.display = isDisplayed ? 'none' : 'block';
});
document.addEventListener('click', (event) => {
    if (!event.target.closest('.dropdown')) {
        dropdownContent.style.display = 'none';
    }
});
let isDarkTheme = localStorage.getItem('theme') === 'dark';

function updateTheme() {
    if (isDarkTheme) {
        $('.wrap').css('background', '#333');
        $('.menuWrap').css('background', '#333');
        $('.menuWrap a').css('color', '#fff');
        $('html').css('color', '#fff');
    } else {
        $('.wrap').css('background', '#fff');
        $('.menuWrap').css('background', '#fff');
        $('.menuWrap a').css('color', '#333');
        $('html').css('color', '#333');
    }
}
updateTheme();

$('#bgColor').click(function () {
    isDarkTheme = !isDarkTheme;
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    updateTheme();
});
let isBWMode = localStorage.getItem('themeb') === 'grey';

function updateBWMode() {
        $('.cartPopup').toggleClass('grayscale-mode', isBWMode);
        $('.spinnerContainer').toggleClass('grayscale-mode', isBWMode);
        $('.wrap').toggleClass('grayscale-mode', isBWMode);
}
updateBWMode();

$('#bgColor1').click(function () {
    isBWMode = !isBWMode;
    localStorage.setItem('themeb', isBWMode ? 'grey' : 'normal');
    updateBWMode();
});
let menucheker = true;

$('#burger').click(function (e) {
    e.stopPropagation();
    if (menucheker) {
        $('.menublock').css('left', '0');
        $('.wrapContainer').css('background', 'rgba(0, 0, 0, 0.4)');
        $('.wrapContainer').css('filter', 'brightness(0.6)');
        menucheker = false;
    } else {
        $('.menublock').css('left', '-300px');
        $('.wrapContainer').css('background', 'rgba(0, 0, 0, 0.0)');
        $('.wrapContainer').css('filter', 'brightness(1)');
        menucheker = true;
    }
});
$(document).click(function () {
    if (!menucheker) {
        $('.menublock').css('left', '-300px');
        $('.wrapContainer').css('background', 'rgba(0, 0, 0, 0.0)');
        $('.wrapContainer').css('filter', 'brightness(1)');
        menucheker = true;
    }
});
$('.menublock').click(function (e) {
    e.stopPropagation();
});