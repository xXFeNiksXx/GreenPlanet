$('.clickBut').click(function () { 
    let inpvalue = $('#inp').val();
    axios.post('/chatbotask', { inpvalue })
    .then(res => {
        console.log(res);
        $('#generated-content').empty();
        $('#inp').val('');
        function formatText(text) {
            const result = [];
            let i = 0;
            while (i < text.length) {
              if (text[i] === '*') {
                if (text[i + 1] === '*') {
                  result.push('<strong>');
                  i += 2;
                  while (i < text.length && text[i] !== '*') {
                    result.push(text[i]);
                    i++;
                  }
                  result.push('</strong>');
                } else {
                  result.push('\n');
                  i++;
                }
              } else {
                result.push(text[i]);
                i++;
              }
            }
            console.log(result.join(''));
            $('#generated-content').append('<div>' + result.join('') + '</div>');
                  }
          formatText(res.data);
    })
});
let isDarkTheme = localStorage.getItem('theme') === 'dark';

function updateTheme() {
    if (isDarkTheme) {
        $('.wrap').css('background', '#333');
        $('html').css('color', '#fff');
    } else {
        $('.wrap').css('background', '#fff');
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