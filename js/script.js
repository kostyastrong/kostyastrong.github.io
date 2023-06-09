// post form

document.getElementById('contact').addEventListener('submit', function (form) {
    form.preventDefault();
    const name = document.querySelector('#contact-name').value;
    const tel = document.querySelector('#contact-phone').value;
    const email = document.querySelector('#contact-email').value;
    const description = document.querySelector('#contact-description').value;
    // TODO: how to rewrite these fields as if i wanted to reuse them?
    if (validatePrevent(name, tel, email, description)) {
        return;
    }
    const button = form.submitter;
    console.log();
    button.textContent = "Sending...";
    document.body.style.cursor = 'wait';
    delay(3000).then(() => createPost({
        title: name,
        body: tel,
    })).then(() => {
        button.textContent = "Submitted!";
        button.disabled = true;
        console.log(button);
        button.style.background = 'lightgreen';
        document.body.style.cursor = 'default';
    }).catch(
        () => {
            button.style.background = 'red';
            button.textContent = "Server Error";
        }
    );
});

function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function createPost(newPost) {
    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
            title: newPost.title,
            body: newPost.body
        })
    }).then(res => res.json()).then((post) => {
        console.log(post);

    });

}


// validate form
function validatePrevent(name, tel, email, description) {
    if (alertEmpty(tel, 'Phone number') || alertEmpty(name, "Name field")) {
        return true;
    }
    if (checkLang(name, 'name') || (description !== null && description !== '' && checkLang(description, 'description'))) {
        return true;
    }
    if (alertNonEmptyEmail(email)) {
        return true;
    }
    if (alertNonEmptyPhone(tel)) {
        return true;
    }
    return false;
}

function alertEmpty(s, field) {
    if (s === "" || s === null) {
        alert(field + ' is required to submit the form')
        return true
    }
    return false;
}

function checkLang(s, field_abbreviation) {
    if (s === null || typeof s !== 'string') {
        return false;
    }
    const regex = /^[a-zA-Zа-яА-Я0-9_.,'"!?;:& ]+$/i;
    if (!s.match(regex)) {
        alert('Please provide en/ru ' + field_abbreviation);
        return true;
    }
    return false;
}

function alertNonEmptyPhone(phone) {
    if (phone !== '' && !validatePhone(phone)) {
        alert('Please provide correct phone');
        return true;
    }
    return false;
}

function alertNonEmptyEmail(email) {
    if (email !== '' && !validateEmail(email)) {
        alert('Please provide correct email or do not fill that field');
        return true;
    }
    return false;
}

const validateEmail = (email) => {
    if (email === null || typeof email !== 'string') {
        return false;
    }
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
    return email.match(regex);
};

const validatePhone = (phone) => {
    if (phone === null || typeof phone !== 'string') {
        return false;
    }
    const regex = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/i;
    return phone.match(regex);
};

const validate = () => {
    var result = document.getElementById('contact-email-result');
    const email = document.getElementById('contact-email').value;
    result.innerHTML = '';
    if (email === '') {
        return;
    }

    if (validateEmail(email)) {
        result.innerHTML = email + ' is valid.';
        result.style.color = 'green';
    } else {
        result.innerHTML = email + ' is invalid.';
        result.style.color = 'red';
    }
};

document.getElementById('contact-email').addEventListener('input', validate);


// gallery
const decreasePhotoButton = document.querySelectorAll('[data-decrease-click]');
const increasePhotoButton = document.querySelectorAll('[data-increase-click]');

decreasePhotoButton.forEach(button => {
    button.addEventListener('click', () => {
        const gallery = document.querySelector(button.dataset.decreaseClick);
        updateGallery(gallery, -1 + Number(gallery.dataset.index));
    });
});

increasePhotoButton.forEach(button => {
    button.addEventListener('click', () => {
        const gallery = document.querySelector(button.dataset.increaseClick);
        updateGallery(gallery, 1 + Number(gallery.dataset.index));
    });
});

function setSrcImg(img, s) {
    img.setAttribute('src', s);
}

function updateGallery(gallery, newIndex) {
    if (!gallery.classList.contains('gallery')) return;

    const imgs = document.querySelector('.storage').querySelectorAll('img');
    if (newIndex >= imgs.length) {
        newIndex -= imgs.length;
    } else if (newIndex < 0) {
        newIndex += imgs.length;
    }
    if (newIndex === 0) {
        gallery.querySelector('.click-side.left').hidden = true;
        gallery.querySelector('.click-side.right').hidden = false;
    } else if (newIndex === imgs.length - 1) {
        gallery.querySelector('.click-side.right').hidden = true;
        gallery.querySelector('.click-side.left').hidden = false;
    } else {
        gallery.querySelector('.click-side.left').hidden = false;
        gallery.querySelector('.click-side.right').hidden = false;
    }
    gallery.dataset.index = newIndex;
    setSrcImg(gallery.querySelector('.gallery__main'), imgs[newIndex].getAttribute('src'));
}

// pop-up methods
const openPopButtons = document.querySelectorAll('[data-pop-up-target]');
const closePopButtons = document.querySelectorAll('[data-pop-up-close]');
const overlay = document.getElementById('overlay');

openPopButtons.forEach(button => {
    button.addEventListener('click', () => {
        const popup = document.querySelector(button.dataset.popUpTarget);
        openPopUp(popup);
    });
});

overlay.addEventListener('click', () => {
    const popups = document.querySelectorAll('.pop-up.active');
    popups.forEach(popup => {
        closePopUp(popup);
    });
});

closePopButtons.forEach(button => {
    button.addEventListener('click', () => {
        const popup = button.closest('.pop-up');
        closePopUp(popup);
    });
});

function openPopUp(popup) {
    console.log(popup);
    if (popup == null) return;  // no pop-up inside
    popup.classList.add('active');
    overlay.classList.add('active');
}

function closePopUp(popup) {
    if (popup == null) return;  // no pop-up inside
    updateGallery(popup, 0);
    popup.classList.remove('active');
    overlay.classList.remove('active');
}


// theme

const themeSwitcher = document.getElementById('theme-switcher');

function switchSrcFolders(obj, searchValue, replaceValue) {

    obj.setAttribute('src', obj.getAttribute('src').replace(searchValue, replaceValue));
}

themeSwitcher.addEventListener('click', () => {
    const currentStyle = stylesheet.href;

    const lightTheme = "css/light-theme-var.css";
    const darkTheme = "css/dark-theme-var.css";
    let searchValue = "dark";
    let replaceValue = 'light';

    if (currentStyle.indexOf(lightTheme) !== -1) {
        stylesheet.href = darkTheme;
        searchValue = 'light';
        replaceValue = 'dark';
    }
    else {
        stylesheet.href = lightTheme;
    }

    const icons = document.querySelectorAll('.icon');
    icons.forEach(img => {
        switchSrcFolders(img, searchValue, replaceValue);
    });
});


// cookies
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function alertCookie() {
    console.log('alert cookie = ', getCookie('alert'));
    if (getCookie('alert') == null) {
        setTimeout(() => {
            alert('We are waiting a call from you!');
            setCookie('alert', true, 1);
        }, 30000); // 30s
    }
}

alertCookie();


//snow
const snowflakeButton = document.getElementById('snow-starting');
let isSnowing = false;

snowflakeButton.addEventListener('click', () => {
    const snow = document.getElementById('snow');
    const snowFade = document.getElementById('snow-fade');
    if (isSnowing) {
        snow.classList.remove('snow');
        snowFade.classList.remove('snow-fade');
    } else {
        snow.classList.add('snow');
        snowFade.classList.add('snow-fade');
    }
    isSnowing = !isSnowing;
});