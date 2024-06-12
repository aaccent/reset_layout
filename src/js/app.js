const isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
}; 


function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const lockPaddingElements = document.querySelector("header");

function lockBody() {
    let paddingValue = window.innerWidth - document.documentElement.clientWidth;
    if (lockPaddingElements && paddingValue) {
        lockPaddingElements.style.paddingRight = paddingValue + "px"
    }
    document.body.classList.add("body_lock")
}

function unlockBody () {
    if (lockPaddingElements) {
        lockPaddingElements.style.paddingRight = ""
    }
    document.body.classList.remove("body_lock")
}

function openPopup(popup = undefined) {
    lockBody()
    if (popup) {
        popup.classList.add("popup--open")
    } else {
        console.log("Give me a popup")
    }
}

function closePopup() {
    let popup = document.querySelector(".popup--open")

    popup.classList.remove("popup--open");
    popup.addEventListener("transitionend", () =>  {
        if (!document.querySelector(".header__burger--open") && !document.querySelector(".header__submenu--open")) {
            unlockBody() 
        }

        // if (popup.querySelector(".form-block_sent")) {
        //     popup.classList.remove("popup_white")
        //     popup.querySelector(".form-block_sent").classList.remove("form-block_sent")
        // }

        // if (popup.querySelector("form")) {
        //     popup.querySelector("form").reset()
        // }
    }, {once: true})
}

function validateForm(form) {    
    const reqFiedls = form.querySelectorAll("[class$='input--required']")

    // function changeContentPage(form) {
    //     const formBlockEl = form.closest(".form-block__body");
        
    //     formBlockEl.style.opacity = "0"
    //     if (formBlockEl.closest(".popup")) {
    //         formBlockEl.closest(".popup").classList.add("popup_white")
    //     }
    //     formBlockEl.addEventListener("transitionend", () => {
    //         form.closest(".form-block").classList.add("form-block_sent")
    //         formBlockEl.style.opacity = "1"
    //     }, { once: true })
    // }

    let errors = 0;
    for (let i = 0; i < reqFiedls.length; i++) {
        if (reqFiedls[i].getAttribute("name") === "name") {
            if (reqFiedls[i].value.trim() === "") {
                reqFiedls[i].closest(".form__control").classList.add("form__control--error");
                errors++;
            }
        }
        if (reqFiedls[i].getAttribute("name") === "phone") {
            if (reqFiedls[i].value.trim() === "" || reqFiedls[i].value.length < 15) {
                reqFiedls[i].closest(".form__control").classList.add("form__control--error");
                errors++;
            }
        }
    }

    if (errors) {
        console.log("Fill req fields");
    } else {
        form.classList.add("form--sending")
        form.querySelectorAll("input, textarea").forEach(formField => formField.disabled = true)
        setTimeout(() => {
            // changeContentPage(form)
            resetForm(form)
        }, 200)
    }

    function resetForm(form) {
        form.reset();
        form.classList.remove("form--sending")
        form.querySelectorAll(".form__control").forEach(controlEl => controlEl.className = "form__control")
        form.querySelectorAll("input, textarea").forEach(inputEl => inputEl.disabled = false)
    }
}



window.onload = function() {
    // HEADER
    const headerEl = document.querySelector(".header");
    const burgerMenuEl = headerEl.querySelector(".header__burger");
    const serviceMenuItemEl = headerEl.querySelector(".header__menu-item--services");
    const desktopSubmenuEl = serviceMenuItemEl.querySelector(".header__submenu");
    const desktopMenuEl = headerEl.querySelector(".header__menu-list");
    const mobileMenuEl = headerEl.querySelector(".header__menu--mobile");


    desktopMenuEl.addEventListener("click", (e) => {
        if (e.target.closest(".header__menu-item:not(.header__menu-item--services)")) {
            e.preventDefault()
            openPopup(document.querySelector(".popup"))
        }
    })

    serviceMenuItemEl.addEventListener("click", (e) => {

        if (e.target.closest(".submenu__backdrop")) {
            desktopSubmenuEl.className = "header__submenu header__submenu--close";
            desktopSubmenuEl.firstElementChild.addEventListener("transitionend", () => {
                unlockBody()
                desktopSubmenuEl.classList.remove("header__submenu--close")
            }, { once: true })
        // } else if () {

        } else if (!e.target.closest(".header__submenu")) {
            if (desktopSubmenuEl.classList.contains("header__submenu--open")) {
                desktopSubmenuEl.className = "header__submenu header__submenu--close";
                desktopSubmenuEl.firstElementChild.addEventListener("transitionend", () => {
                    unlockBody()
                    desktopSubmenuEl.classList.remove("header__submenu--close")
                }, { once: true })
            } else if (!desktopSubmenuEl.classList.contains("header__submenu--close")) {
                lockBody()
                desktopSubmenuEl.classList.add("header__submenu--open")
            }
        }
    })

    burgerMenuEl.addEventListener("click", () => {
        if (burgerMenuEl.classList.contains("header__burger--open")) {
            unlockBody()
            Array.from(mobileMenuEl.querySelectorAll(".menu__list--submenu-open")).forEach(el => {
                el.classList.remove("menu__list--submenu-open")
            })
            Array.from(mobileMenuEl.querySelectorAll(".menu--open")).forEach(el => {
                el.classList.remove("menu--open")
            })
        } else {
            lockBody()
        }
        
        burgerMenuEl.classList.toggle("header__burger--open")
        mobileMenuEl.classList.toggle("menu--open")
    })

    
    mobileMenuEl.addEventListener("click", (e) => {
        let hasSubmenu = e.target.closest(".menu__item").childElementCount === 3;

        if (!hasSubmenu) {
            return 
        }

        if (e.target.closest(".menu__back-button")) {
            e.target.closest(".menu--open").classList.remove("menu--open");
            e.target.closest(".menu__list").classList.remove("menu__list--submenu-open")
            return
        }

        e.preventDefault();

        let parentMenuListEl = e.target.closest(".menu__list");
        parentMenuListEl.classList.add("menu__list--submenu-open");

        e.target.closest(".menu__item").querySelector(".menu").classList.add("menu--open")
        
    })

    // HERO
    Array.from(document.querySelectorAll(".hero-slide__call-doctor")).forEach(buttonEl => {
        buttonEl.addEventListener("click", e => {
            openPopup(document.querySelector(".popup"))
        })
    })

    // FAQ

    const faqItemHeaderEls = document.querySelectorAll(".accordion__header");

    faqItemHeaderEls.forEach(faqItemHeaderEl => {
        let timeoutId;
        faqItemHeaderEl.addEventListener("click", e => {
            const faqItemEl = faqItemHeaderEl.parentElement;
            const faqItemBodyEl = faqItemHeaderEl.nextElementSibling;
            const faqItemTextEl = faqItemBodyEl.firstElementChild;

            if (faqItemEl.classList.contains("accordion--open")) {
                let faqItemBodyHeight = faqItemBodyEl.scrollHeight;
                faqItemBodyEl.style.height = faqItemBodyHeight + "px";
                faqItemEl.classList.remove("accordion--open")
                timeoutId = setTimeout(() => faqItemBodyEl.style.height = "")
            } else {
                clearTimeout(timeoutId)
                timeoutId = null
                faqItemEl.classList.add("accordion--open");
                faqItemBodyEl.style.height = faqItemTextEl.offsetHeight + "px";
                faqItemBodyEl.addEventListener("transitionend", () => {
                    if (timeoutId) {
                        return
                    }
                    faqItemBodyEl.style.height = "auto"
                }, { once: true })
            }
        })
    })


    // CASES
    const allCasesButtonEl = document.querySelector(".help__when-case a")

    allCasesButtonEl.addEventListener("click", e => {
        let casesPopupEl = document.querySelector(".popup--cases")
        openPopup(casesPopupEl)
    })
    
    // CERTIFICATE
    let certificatesListEl = document.querySelector(".certificates .swiper-wrapper")

    certificatesListEl.addEventListener("click", e => {
        if (!e.target.closest(".certificate__image-wrapper")) {
            return
        }

        let certificatePopupEl = document.querySelector(".popup--certificate");
        let currentImgSrc= e.target.closest("img").getAttribute.src;
        certificatePopupEl.querySelector("img").setAttribute.src = currentImgSrc;
        openPopup(certificatePopupEl)
    })

    // FOOTER

    const footerColumnEls = document.querySelectorAll(".footer__menu-column");
    const gapMeidaQuery = window.matchMedia("(max-width: 768px)");

    // const hadnleClick = (column) => {
    //     if (e.target.closest(".column__header")) {
    //         e.currentTarget.classList.toggle("column--menu-open")
    //     }
    // }
    Array.from(footerColumnEls).forEach(column => {
        column.addEventListener("click", (e) => {
            if (window.innerWidth <= 768) {
                if (e.target.closest(".column__header")) {
                    e.currentTarget.classList.toggle("column--open")
                }
            }
        })
    })

    gapMeidaQuery.addEventListener("change", e => {
        if (e.matches) {
            for (let i = 0; i < footerColumnEls.length; i++) {
                if (footerColumnEls[i].classList.contains("column--open")) {
                    footerColumnEls[i].classList.remove("column--open")
                }
            }
        }
    })

    // SWIPERs
    if (window.Swiper) {
        new Swiper(".hero__swiper", {
            slidesPerView: 1,
            speed: 800,
            loop: true,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            }
        })

        let serviceSwiper = null;
        let mediaQuery = window.matchMedia("(max-width: 992px");
        const drawSwiper = (e) => {
            if (!e.matches) {
                serviceSwiper?.destroy();
            } else {
                serviceSwiper = new Swiper(".services__swiper", {
                    slidesPerView: "auto",
                    spaceBetween: 10,
                    slidesOffsetBefore: 20,
                    slidesOffsetAfter: 20,
                    breakpoints: {
                        769: {
                            spaceBetween: 15
                        }
                    },
                })
            }
        }

        mediaQuery.addEventListener("change", drawSwiper);
        drawSwiper(mediaQuery)

        new Swiper(".our-doctors__swiper", {
            slidesPerView: "auto",
            spaceBetween: 10,
            slidesOffsetBefore: 20,
            slidesOffsetAfter: 20,
            breakpoints: {
                769: {
                    slidesPerView: 3,
                    spaceBetween: 15,
                    slidesOffsetBefore: 0,
                    slidesOffsetAfter: 0,
                },
                1280: {
                    slidesPerView: 4,
                    slidesOffsetBefore: 0,
                    slidesOffsetAfter: 0,
                }
            },
            navigation: {
                nextEl: ".our-doctors .swiper-button-next",
                prevEl: ".our-doctors .swiper-button-prev",
            },
        })

        new Swiper(".our-transport__swiper", {
            slidesPerView: "auto",
            spaceBetween: 10,
            slidesOffsetBefore: 20,
            slidesOffsetAfter: 20,
            breakpoints: {
                769: {
                    slidesPerView: 2,
                    spaceBetween: 15,
                    slidesOffsetBefore: 0,
                    slidesOffsetAfter: 0,
                },
                992: {
                    slidesPerView: 2.5,
                    slidesOffsetBefore: 0,
                    slidesOffsetAfter: 0,
                },
                1280: {
                    slidesPerView: 3,
                    slidesOffsetBefore: 0,
                    slidesOffsetAfter: 0,
                }
            },
            navigation: {
                nextEl: ".our-transport .swiper-button-next",
                prevEl: ".our-transport .swiper-button-prev",
            }
        })

        new Swiper(".help__how-steps", {
            slidesPerView: "auto",
            slidesOffsetAfter: 20,
            slidesOffsetBefore: 20,
            spaceBetween: 4,
            breakpoints: {
                993: {
                    slidesPerView: 3,
                    slidesOffsetAfter: 0,
                    slidesOffsetBefore: 0
                },
                1280: {
                    slidesPerView: 4,
                    slidesOffsetAfter: 0,
                    slidesOffsetBefore: 0
                }
            }
        })

        new Swiper(".our-advantages__about-swiper", {
            slidesPerView: "auto",
            spaceBetween: 10,
            observeParents: true,
            observeSlideChildren: true,
            observer: true
        })

        new Swiper(".reviews__swiper", {
            slidesPerView: 1,
            speed: 500,
            navigation: {
                nextEl: ".reviews .swiper-button-next",
                prevEl: ".reviews .swiper-button-prev",
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            }
        })
        new Swiper(".certificates__swiper", {
            slidesPerView: "auto",
            spaceBetween: 4,
            breakpoints: {
                992: {
                    slidesPerView: "auto",
                }
            },
            navigation: {
                nextEl: ".certificates .swiper-button-next",
                prevEl: ".certificates .swiper-button-prev",
            },
        })
    }

    // FORMs

    const inputEls = document.querySelectorAll(".form__input")
    const phoneInputEls = document.querySelectorAll(".form__input[name='phone']")
    const nameInputEls = document.querySelectorAll(".form__input[name='name']")
    const inputControlClass = "form__control"
    const textAreaEl = document.getElementById("question");

    Array.from(inputEls).forEach(inputEl => {
        let inputControlEl = inputEl.closest("." + inputControlClass)
    
        // input

        inputEl.addEventListener("input", () => {
            if (inputControlEl.classList.contains(inputControlClass + "--error")) {
                inputControlEl.classList.remove(inputControlClass + "--error")
            }
        })

        inputEl.addEventListener("change", () => {
            if (inputEl.value.trim() !== "") {
                inputControlEl.classList.add("form__control--filled")
            } else {
                inputControlEl.classList.remove("form__control--filled")
            }
        })
    })

    Array.from(phoneInputEls).forEach(inputEl => {
        inputEl.addEventListener("keypress", (e) => {
            const length = e.target.value.length;
            if (e.charCode < 48 || e.charCode > 57 || length > 17) {
                e.preventDefault();
                return;
            }
                switch (length) {
                case 0: 
                    e.target.value = "+7 (" ;
                    break;               
                case 7:
                    e.target.value += ")-";
                    break;
                case 12:
                case 15:
                    e.target.value += "-";
                    break;
                default:
                    break;
            }
        })
        inputEl.addEventListener("input", e => {e.target.value.length === 3 && (e.target.value = "")})
    })

    Array.from(nameInputEls).forEach(inputEl => {
        inputEl.addEventListener("keypress", (e) => {
            const length = e.target.value.length;
            if (e.charCode >= 48 && e.charCode <= 57) {
                e.preventDefault();
                return;
            }
        })
    })

    for (let i = 0; i < document.forms.length; i++) {
        document.forms[i].addEventListener("submit", e => {
            e.preventDefault();
            validateForm(e.target)
        })
    }

    textAreaEl.addEventListener("input", e => {
        const hiddenTextAreaEl = textAreaEl.previousElementSibling;
        let maxHeight = parseFloat(getComputedStyle(textAreaEl).maxHeight);
        hiddenTextAreaEl.value = textAreaEl.value;

        if (hiddenTextAreaEl.scrollHeight > maxHeight) {
            textAreaEl.style.overflow = "auto"
        } else {
            textAreaEl.style.overflow = ""
        }
        if (textAreaEl.offsetHeight !== hiddenTextAreaEl.scrollHeight) {
            textAreaEl.style.height = Math.max(40, hiddenTextAreaEl.scrollHeight) + "px"
        }


    }) 

    // POPUPs
    document.querySelectorAll(".popup__close").forEach(
        closeEl => closeEl.addEventListener("click", closePopup)
    )
    
    document.querySelectorAll(".popup").forEach(
        popupEl => popupEl.addEventListener("click", e => {
            if (!e.target.closest(".popup__content")) {
                closePopup()
            }
        })
    )
    
    document.addEventListener("keydown", (e) => {
        if (e.which === 27) {
            closePopup()
        }
    })
}