function getUserIdFromUrl() {
    const path = window.location.pathname;
    let index = path.indexOf('/admin/');
    const id = path.substring(index + '/admin/'.length);
    return id;
}

const userId = getUserIdFromUrl();
    console.log('User ID:', userId);
    axios.post('/adminchek', { ID: userId })
    .then(res => {
        console.log(res);
        if (res.data.username !== 'admin') {
            console.log('Access denied: User is not admin');
            $('.goodsContainer').css('display', 'none');
            $('.addGoodsBtn').css('display', 'none');
            $('.logoOrder').css('display', 'none');
            $('.orderContainer').css('display', 'none');
            $('.adressContainerView').css('display', 'none');
            $('.articlechekerContainerText').css('display', 'none');
            $('.ArticleContainer').css('display', 'none');
            $('.ourAdressAdmin').css('display', 'none');
            $('.sendMessageBtn').css('display', 'none');
            $('.changeAdressBtn').css('display', 'none');
            $('.fidBackContainer').css('display', 'flex');
            $('.articleContainer').css('display', 'flex');
        }
    })
$('.addGoods').click(()=>{
    const title = $('#title').val();
    const price = $('#price').val();
    const photo = $('#photo')[0].files[0];
    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('photo', photo);
    axios.post('/add-goods', formData)
        .then(res=>{
            console.log(res);
        })
})
$('#confirmBtnnnn').click((e)=>{
    let data = {
        username: $('#usernameN').val(),
        password: $('#passwordN').val(),
        id: userId
    }
    axios.post('/updateuser', data)
        .then(res=>{
            console.log(res);
        }).catch(err => {
            console.error('Error updating user:', err);
        });
})
$('.sendButAdress').click(()=>{
    let data = {
        adress: $('#adress').val()
    }

    axios.post('/adress', data)
            location.reload();
})


function toBase64(buffer) {
    const binary = [];
    const bytes = new Uint8Array(buffer);
    bytes.forEach(byte => binary.push(String.fromCharCode(byte)));
    return btoa(binary.join(''));
}

function viewProduct() {
    axios.get('/goods')
        .then(res => {
            console.log('Response from /goods:', res.data);

            $('.goodsContainer').empty();

            if (res.data && Array.isArray(res.data)) {
                res.data.forEach(el => {
                    console.log('Processing product:', el);

                    let base64Data = '';
                    if (el.data && el.data.data) {
                        try {
                            base64Data = toBase64(el.data.data);
                        } catch (err) {
                            console.error('Error converting to Base64:', err);
                        }
                    } else {
                        console.warn('No image data for product:', el.title);
                    }

                    $('.goodsContainer').append(`
                        <div class='cardgoods'>
                            <img class="goodsImg" src="${base64Data ? `data:${el.contentType};base64,${base64Data}` : 'placeholder.jpg'}" alt="Product Image">
                            <div class='goodsDesc'>
                                <h3 class="nameGoods">${el.title}</h3>
                                <p class="priceGoods">${el.price}$</p>
                                <button class="delBut" id="${el._id}">Delete</button>
                            </div>
                        </div>
                    `);
                });

                $('.delBut').click(function (e) {
                    const productId = e.target.id;
                    axios.delete(`/goods/${productId}`)
                        .then(res => {
                            console.log('Product deleted:', res.data);
                            viewProduct();
                        })
                        .catch(err => {
                            console.error('Error deleting product:', err);
                        });
                });
            } else {
                console.error('No products found or invalid data format');
            }
        })
        .catch(err => {
            console.error('Error fetching products:', err);
        });
}
viewProduct();


axios.get('/getorders')
    .then(res => {
        if(res.data.length === 0){
            $('.orderContainer').append(`<div class="mesText"><h1 class="orderTextInfo">No orders</h1></div>`);
        }else{
        console.log(res.data);
        let doneid;
        let dataOrder;

        for (let el of res.data) {
            let goods = '';
            let cardId = el._id;
            console.log(cardId);
            for (let item of el.list) {
                goods += item.title + ' ';
            }
            console.log(el);
            let date = new Date(el.time);
            $('.orderContainer').append(`<div class='orderItem'>
            <h3>${el.name}</h3>
            <div>${el.phone}</div>
            <div class="productContainer">${goods}</div>
            <div class="orderButs">
            <button class="deleteOrderBtn" id="${el._id}">delete</button>
            </div>
            <div>
                 <div>${date.getDate()}/${date.getMonth()}/${date.getFullYear()}</div>
                  <div>${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</div>
            </div>
            
        </div>`)
        doneid = el._id + 'donebtn';
        console.log(doneid);
        }
        $(`.deleteOrderBtn`).click(function (e) { 
            axios.delete(`/orders/${e.target.id}`)
            .then(res => {
                location.reload();
            })
        });
    }
    })







let cheker = true;
let pop = document.getElementById('pop');
let wrbox = document.getElementById('box');
$(`.addGoodsBtn`).click(function () { 
    if (cheker == true) {
        pop.style.display = 'flex';
        cheker = false;
        wrbox.style.filter = 'blur(1px)';
    }else{
        pop.style.display = 'none';
        cheker = true;
        wrbox.style.filter = 'blur(0px)';
    }
});







let cheker3 = true;
let pop3 = document.getElementById('pop3');
$(`.changeAdressBtn`).click(function () { 
    if (cheker3 == true) {
        pop3.style.display = 'flex';
        cheker3 = false;
        wrbox.style.filter = 'blur(1px)';
    }else{
        pop3.style.display = 'none';
        cheker3 = true;
        wrbox.style.filter = 'blur(0px)';
    }
});



let cheker123 = true;
let pop123 = document.getElementById('pop123');
$(`.newPasswordBtn`).click(function () { 
    if (cheker123 == true) {
        pop123.style.display = 'flex';
        cheker123 = false;
        wrbox.style.filter = 'blur(1px)';
    }else{
        pop123.style.display = 'none';
        cheker123 = true;
        wrbox.style.filter = 'blur(0px)';
    }
});








let cheker5 = true;
let pop5 = document.getElementById('pop5');
$(`.sendMessageBtn`).click(function () { 
    if (cheker5 == true) {
        pop5.style.display = 'flex';
        cheker5 = false;
        wrbox.style.filter = 'blur(1px)';
    }else{
        pop5.style.display = 'none';
        cheker5 = true;
        wrbox.style.filter = 'blur(0px)';
    }
});
$('#mark').click(function () { 
    pop.style.display = 'none';
    cheker = true;
    wrbox.style.filter = 'blur(0px)';
});
$('#mark123').click(function () { 
    pop123.style.display = 'none';
    cheker = true;
    wrbox.style.filter = 'blur(0px)';
});



$('#mark3').click(function () { 
    pop3.style.display = 'none';
    cheker3 = true;
    wrbox.style.filter = 'blur(0px)';
});



$('#mark5').click(function () { 
    pop5.style.display = 'none';
    cheker5 = true;
    wrbox.style.filter = 'blur(0px)';
});
$('#sendMessage').click(async function () { 
    let data = {
        message: $('#message').val()
    }
    $('.messageLoad').empty();
    $('.messageLoad').append(`<div class="spinner"></div><h1>wait</h1>`);
  await axios.post(`/send-message`, data)
    .then(res => {
        console.log(res);
        $('.messageLoad').empty();
        new Notification('Daunku', {
            body: $('#message').val()
        });
    })
});






axios.get(`/ouradress`)
.then(res=>{
    if(res.data.length === 0){
        $('.adressContainerView').append(`<div class="mesText"><h1 class="orderTextInfo">No adress</h1></div>`);
    }
    for(let el of res.data){
        console.log(el);
        $('.adressContainerView').append(`<div class="adressBox"><h3 class='adressText'>${el.adress}</h3><button class="deleteAdressBtn" id="${el._id}">delete</button></div>`)

    }
    $(`.deleteAdressBtn`).click(function (e) { 
        axios.delete(`/adress/${e.target.id}`)
        .then(res => {
            location.reload();
        })
    });
})


let spinnerContainer = document.querySelector('.spinnerContainer');

window.addEventListener('load', () => {
    spinnerContainer.classList.add('hide');
})
$('#sendfidback').click(function () { 
    let message = $('#fidbackContent').val();
    let ID = userId;
    axios.post('/feedback', { message: message, ID: ID })
    .then(res => {
        console.log(res.data);
    })
});
$('#sendarticle').click(function () {
    let title = $('.titleArticle').val();
    let message = $('#articleContent').val();
    console.log(message, title);
    axios.post('http://localhost:3000/article', { message: message, title: title })
    .then(res => {
        console.log(res);
    })
});
function loadArticles() {
    axios.get('/getarticles')
        .then(res => {
            if(res.data.length === 0){
                $('.orderContainer').append(`<div class="mesText"><h1 class="orderTextInfo">No orders</h1></div>`);
            }else{
            $('.ArticleContainer').empty();
            res.data.forEach(article => {
                $('.ArticleContainer').append(`
                    <div class="articleCont">
                        <h3 class="articletitle">${article.title}</h3>
                        <h4>${article.goodinfo}</h4>
                        <button class="showmorebtn">Show More</button>
                        <div class="articledetails" style="display: none;">
                            <h3>${article.message}</h3>
                        </div>
                        <div class="buttons">
                            <button onclick="updateGoodInfo('${article._id}', true)">Yes</button>
                            <button onclick="updateGoodInfo('${article._id}', false)">No</button>
                        </div>
                    </div>
                `);
            });
        }
        })
        .catch(err => {
            console.error('Error fetching articles:', err);
        });
}

$(document).on('click', '.showmorebtn', function () {
    const details = $(this).siblings('.articledetails');
    details.toggle();
    $(this).text(details.is(':visible') ? 'Show Less' : 'Show More');
});
loadArticles();
function updateGoodInfo(articleId, goodinfo) {
    axios.post(`/goodinfo/${articleId}`, { goodinfo })
        .then(res => {
            console.log('Article updated:', res.data);
            loadArticles();
        })
        .catch(err => {
            console.error('Error updating article:', err);
        });
}
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
$('.logout').click(function () { 
    
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