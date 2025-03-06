axios.get('/getarticles')
.then(res => {
    console.log(res);
    let articles = res.data;

    function displayArticles(filteredArticles) {
        $('.articlesContainer').empty();
        for (let el of filteredArticles) {
            if (el.goodinfo == true) {
            $('.articlesContainer').append(`
                <div class="article">
                    <h3 class="articletitle">${el.title}</h3>
                    <button class="showmorebtn">Show More</button>
                    <div class="articledetails" style="display: none;">
                        <h3 class="TextArtic">${el.message}</h3>
                    </div>
                </div>
            `);
            }
            updateTheme();
        }
        
        $('.showmorebtn').click(function() {
            const details = $(this).siblings('.articledetails');
            details.toggle();
            $(this).text(details.is(':visible') ? 'Show Less' : 'Show More');
        });
    }

    displayArticles(articles);

    $('#filterInput').on('input', function() {
        const filterText = $(this).val().toLowerCase();
        const filteredArticles = articles.filter(article => 
            article.title.toLowerCase().includes(filterText)
        );
        displayArticles(filteredArticles);
    });
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
        $('html').css('color', '#fff');
        $('.TextArtic').css('color', '#fff');
    } else {
        $('.wrap').css('background', '#fff');
        $('html').css('color', '#333');
        $('.TextArtic').css('color', '#333');
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