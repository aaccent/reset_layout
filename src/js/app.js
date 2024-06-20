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

const lockPaddingElements = null //document.querySelector("header");

function lockBody() {
    let paddingValue = window.innerWidth - document.documentElement.clientWidth;
    if (lockPaddingElements && paddingValue) {
        lockPaddingElements.style.paddingRight = paddingValue + "px"
    }
    document.body.classList.add("_lock")
}

function unlockBody () {
    if (lockPaddingElements) {
        lockPaddingElements.style.paddingRight = ""
    }
    document.body.classList.remove("_lock")
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

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
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
            if (reqFiedls[i].value.trim() === "" || reqFiedls[i].value.length < 18) {
                reqFiedls[i].closest(".form__control").classList.add("form__control--error");
                errors++;
            }
        }
        const emailField = form.querySelector("input[type='email']")

        if (reqFiedls[i].getAttribute("name") === "mail") {
            if (reqFiedls[i].value.trim() === "" || (reqFiedls[i].value.trim !== "" && !validateEmail(emailField.value))) {
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

function initMap(mapContainerId) {
    function setMapPin() {
        let myCollection = new ymaps.GeoObjectCollection();
        let coords = mapEl?.dataset.mark?.split(',').map(Number) || [55.7954692462696,49.10686513125719];
        // создание и установка пинов
        myCollection.add(new ymaps.Placemark(coords, {
            iconLayout: "default#image",
            iconImageHref: imagesSrc.pinImage,
            iconImageSize: [60, 60],
        }));
        // добавление пинов на карту
        map.geoObjects.add(myCollection);
    }

    async function getCoords () {
        setTimeout(() => {
            setMapPin()
        }, 2000)
    }
    
    let mapEl = document.getElementById(mapContainerId);
    let center = mapEl?.dataset.center?.split(',').map(Number) || [49.123356, 55.782238];

    // создание карты
    mapboxgl.accessToken = "pk.eyJ1Ijoic2V2YS1hYWNjZW50IiwiYSI6ImNsd3lubWViZTFwMDAycXNhbm4yN3p4am0ifQ.puvbO9AAr4Jf8ude29ST7g";
    const map = new mapboxgl.Map({
        container: mapContainerId, // container ID
        center: center, 
        zoom: 12 // starting zoom
    });
    
    let imagesSrc = mapEl.dataset
}


window.onload = function() {
    let callDoctorPopupEl = document.querySelector(".popup--call-doctor")


    // HEADER
    const headerEl = document.querySelector(".header");
    const burgerMenuEl = headerEl.querySelector(".header__burger");
    const serviceMenuItemEl = headerEl.querySelector(".header__menu-item--services");
    const desktopSubmenuEl = serviceMenuItemEl.querySelector(".header__submenu");
    const mobileMenuEl = headerEl.querySelector(".header__menu--mobile");

    const consultationButtonEls = headerEl.querySelectorAll(".header__button");
    const buttonEls = document.querySelectorAll(".header__menu-item--prices, .header__menu-item--stocks, .column__menu-item--prices, .column__menu-item--stocks, .menu__item--stocks, .menu__item--prices")

    Array.from(buttonEls).forEach(buttonEl => {
        buttonEl.addEventListener("click", e => {
            e.preventDefault();
            openPopup(callDoctorPopupEl)
        })
    })

    Array.from(consultationButtonEls).forEach(buttonEl => {
        let popupEl = document.querySelector(".popup--consultation")
        buttonEl.addEventListener("click", e => openPopup(popupEl))
    })

    desktopSubmenuEl.addEventListener("click", (e) => {
        if (!e.target.closest(".submenu__service-link")) {
            return
        }
        e.preventDefault();
        openPopup(callDoctorPopupEl)
    })

    serviceMenuItemEl.addEventListener("click", (e) => {
        if (e.target.closest(".submenu__backdrop")) {
            desktopSubmenuEl.className = "header__submenu header__submenu--close";
            desktopSubmenuEl.firstElementChild.addEventListener("transitionend", () => {
                unlockBody()
                desktopSubmenuEl.classList.remove("header__submenu--close")
            }, { once: true })

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
            window.scrollTo(0,0)
        }
        
        burgerMenuEl.classList.toggle("header__burger--open")
        mobileMenuEl.classList.toggle("menu--open")
    })

    
    mobileMenuEl.addEventListener("click", (e) => {
        let hasSubmenu = e.target.closest(".menu__item").childElementCount === 3;
        let lastSubmenu = e.target.closest(".menu__item").childElementCount === 1 && e.target.closest(".menu__submenu")
        
        if (lastSubmenu) {
            e.preventDefault()
            openPopup(callDoctorPopupEl)
            return
        }

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

    const burgerMediaQuery = window.matchMedia("(max-width: 1280px)")
    burgerMediaQuery.addEventListener("change", e => {
        if (!e.matches && burgerMenuEl.classList.contains("header__burger--open")) {
            Array.from(document.querySelectorAll(".submenu.menu--open")).forEach(submenu => submenu.classList.remove("menu--open"))
            mobileMenuEl.querySelector(".menu__list--submenu-open")?.classList.remove("menu__list--submenu-open")
            mobileMenuEl.classList.remove("menu--open")
            burgerMenuEl.classList.remove("header__burger--open")
        }
    })

    // HERO
    Array.from(document.querySelectorAll(".hero-slide__call-doctor")).forEach(buttonEl => {
        buttonEl.addEventListener("click", e => {
            openPopup(callDoctorPopupEl)
        })
    })

    // SERVICES
    let servicesListEl = document.querySelector(".services__list")
    if (servicesListEl) {
        servicesListEl.addEventListener("click", e => {
            if (!e.target.closest(".services__service-item")) {
                return
            }
            e.preventDefault()
            openPopup(callDoctorPopupEl)
        })
    }

    // TRANSPORT 
    let transportListEl = document.querySelector(".our-transport .swiper-wrapper")
    if (transportListEl) {
        transportListEl.addEventListener("click", e => {
            if (!e.target.closest(".transport")) {
                return
            }
    
            let galleryPopupEl = document.querySelector(".popup--gallery");
            let currentImgSrc= e.target.closest("img").getAttribute("src");
            galleryPopupEl.querySelector("img").setAttribute("src", currentImgSrc);
            openPopup(galleryPopupEl)
        })
    }

    // OUR ADVANTAGES
    const moreButtonEl = document.querySelector(".our-advantages__about-more");
    if (moreButtonEl) {
        moreButtonEl.addEventListener("click", e => openPopup(callDoctorPopupEl))
    }

    // FAQ
    const makeQuestionButtonEl = document.querySelector(".faq__make-question button");
    if (makeQuestionButtonEl) {
        makeQuestionButtonEl.addEventListener("click", e => openPopup(callDoctorPopupEl));
    }

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

    // reviews & seo text
    if (document.querySelector(".article")) {
        const articleEl = document.querySelector(".article");
        const articleTextEl = articleEl.querySelector(".article__text");
        const readMoreButtonEl = articleEl.querySelector(".article__more");
        const maxHeight = parseFloat(getComputedStyle(articleTextEl).maxHeight)
    
        function changeElemHeight(elem) {
            const buttonTextEl = elem.querySelector("span")
            const className = elem.classList[1];
            if (elem.classList.contains(className + "--open")) {
                elem.classList.remove(className + "--open")
                buttonTextEl.innerHTML = "Читать полностью"
            } else {
                elem.classList.add(className + "--open")
                buttonTextEl.innerHTML = "Свернуть текст"
            }
        }
    
        function checkElemHeight(elem) {
            const className = elem.classList[1];
            const textEl = articleTextEl;
            const readMoreEl = readMoreButtonEl;
    
            if (textEl.offsetHeight < textEl.scrollHeight) {
                !elem.classList.contains(className + "--hide") && elem.classList.add(className + "--hide")
            } else {
                if (!elem.classList.contains(className + "--open")) {
                    // elem.className = className
                    elem.classList.remove(`${className}--hide`);
                } else if (textEl.offsetHeight <= maxHeight) {
                    // elem.className = className
                    elem.classList.remove(`${className}--hide`);
                    elem.classList.remove(`${className}--open`);
                    readMoreEl.querySelector("span").innerHTML = "Читать полностью"
                }
            } 
        }
    
        checkElemHeight(articleEl);
    
        readMoreButtonEl.addEventListener("click", () => changeElemHeight(articleEl))
    
        window.addEventListener("resize", () => {
            checkElemHeight(articleEl)
        })
    }

    


    // CASES
    const allCasesButtonEl = document.querySelector(".help-when__case a")
    if (allCasesButtonEl) {
        allCasesButtonEl.addEventListener("click", e => {
            let casesPopupEl = document.querySelector(".popup--cases");
            e.preventDefault();
            openPopup(casesPopupEl)
        })
    }

    
    // ADVANTAGES
    function initDigitCounter(counterEl) {
        if (counterEl) {
            animateDigitCounter(counterEl)
        }
    }
    function animateDigitCounter(counter) {
        let startTimestamp = null;
        const duration = 1200;
        const startValue = parseInt(counter.innerHTML);
        const startPosition = 0;

        const step = (timestamp) => {
            if (!startTimestamp) {
                startTimestamp = timestamp
            }
            const progress = Math.min((timestamp - startTimestamp) / duration, 1)
            counter.innerHTML = Math.floor(progress * startValue);
            if (progress < 1) {
                window.requestAnimationFrame(step)
            }
        }
        window.requestAnimationFrame(step)
    }
    
    let observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            const targetEl = entry.target;
            const digitCounter = targetEl.querySelector("[data-digit-counter]")
            if (digitCounter) {
                initDigitCounter(digitCounter)
            }
            if (entry.isIntersecting) {
                observer.unobserve(targetEl)
            }
        })
    }, { threshold: 0.3 })

    const statEls = document.querySelectorAll(".our-advantages__about-col:last-child .stat")
    
    if (statEls.length) {
        Array.from(statEls).forEach(stat => observer.observe(stat))
    }


    // CERTIFICATE
    let certificatesListEl = document.querySelector(".certificates .swiper-wrapper")

    if (certificatesListEl) {
        certificatesListEl.addEventListener("click", e => {
            if (!e.target.closest(".certificate__image-wrapper")) {
                return
            }
    
            let certificatePopupEl = document.querySelector(".popup--gallery");
            let currentImgSrc= e.target.closest("img").getAttribute("src");
            certificatePopupEl.querySelector("img").setAttribute("src", currentImgSrc);
            openPopup(certificatePopupEl)
        })
    }

    if (document.querySelector(".tab")) {
        let tabPanelEl = document.querySelector(".tab__panel")
        const categoryButtonEl = document.querySelector(".tab__head")
        const tabContentEl = tabPanelEl.nextElementSibling;

        tabPanelEl.addEventListener("click", e => {

            if (e.target.closest(".tab__head")) {
                tabPanelEl.classList.toggle("tab__panel--open")
            }
            if (!e.target.closest(".tab__button")) {
                return
            }

            const categoryEl = e.target.closest(".tab__button");
            tabPanelEl.querySelector(".tab__button--active").classList.remove("tab__button--active");
            categoryEl.classList.add("tab__button--active")
            
            categoryButtonEl.querySelector("span").innerHTML = categoryEl.innerHTML
            tabPanelEl.classList.remove("tab__panel--open")
            
            tabContentEl.querySelector(".tab__page--active").classList.remove("tab__page--active")
            tabContentEl.querySelector(".prices__services--" + categoryEl.dataset.category).classList.add("tab__page--active")
        })
    }

    // let lock = false;
    // selectEl.addEventListener("click", e => {
    //     // клик по заголовку
    //     if (e.target.closest(".select__head") && !lock) {
    //         lock = true
    //         if (selectEl.classList.contains("select_open")) {
    //             selectEl.classList.remove("select_open")
    //             selectMenu.style.height = ""
    //         } else {
    //             selectEl.classList.add("select_open")
    //             selectMenu.style.height = selectMenu.scrollHeight + "px"
    //         }
    //         selectMenu.addEventListener("transitionend", () => lock = false)
    //     }
    //     // клик по вариантам
    //     if (e.target.closest(".select__option")) {
    //         let activeOptionEl = selectEl.querySelector(".select__option_selected")
    //         let curOptionEl = e.target.closest(".select__option");

    //         activeOptionEl && activeOptionEl.classList.remove("select__option_selected")
    //         curOptionEl.classList.add("select__option_selected")

    //         selectEl.querySelector("input").value = curOptionEl.dataset.value
    //         selectLabel.innerHTML = curOptionEl.querySelector(".select__option-label").innerHTML
    //         selectEl.classList.add("select_selected")

    //         setTimeout(() => {
    //             selectEl.classList.remove("select_open")
    //             selectMenu.style.height = ""
    //         }, 200);
            
    //     }
    // })
        // let scroll = new LocomotiveScroll()
        // let formBlockEl = document.querySelector(".form-block")

        // document.querySelectorAll(".prices-section__category").forEach(categoryBlock => {
        //     categoryBlock.addEventListener("click", e => {
        //         const buttonEl = e.target.closest(".service__button")
        //         if (!buttonEl) {
        //             return
        //         }
    
        //         const textareaEl = formBlockEl.querySelector("textarea")
        //         const formControlEl = textareaEl.closest(".form__control")
        //         const serviceName = buttonEl.closest(".service").querySelector(".service__name").innerHTML
    
        //         textareaEl.value = serviceName
        //         formControlEl.classList.add("form__control_filled")
        //         formBlockEl.querySelector("input[type='hidden']").value = buttonEl.dataset["serviceName"]
        //         scroll.scrollTo(formBlockEl)            
        //     })  
        // })

    // FOOTER
    const footerEl = document.querySelector(".footer")
    const footerMenuEl = footerEl.querySelector(".footer__menu")
    const gapMeidaQuery = window.matchMedia("(max-width: 768px)");

    footerMenuEl.addEventListener("click", (e) => {
        let targetEl = e.target;
        if (targetEl.closest(".column--main")) {
            return 
        }
        
        if (gapMeidaQuery.matches) {
            if (targetEl.closest(".column__header")) {
                targetEl.closest(".column").classList.toggle("column--open")
            }
        }
        if (targetEl.closest(".column__menu-link")) {
            e.preventDefault()
            openPopup(callDoctorPopupEl)
        }
    })

    gapMeidaQuery.addEventListener("change", e => {
        if (e.matches) {
            let openColumnEls = footerEl.querySelectorAll(".column--open")
            Array.from(openColumnEls).forEach(columnEl => columnEl.classList.remove("column--open"))
        }
    })

    // LOCOMOTIVE SCROLL
    if (window.LocomotiveScroll) {
        let scroll = new LocomotiveScroll();

        let contactsLinkEls = document.querySelectorAll(".header__menu-item--contacts a, .column__menu-item--contacts, .menu__item--contacts")
        let callUsSection = document.querySelector("section.call-us");

        let aboutLinkEl = document.querySelectorAll(".header__menu-item--about, .column__menu-item--about, .menu__item--about")
        let aboutSection = document.querySelector("section.our-advantages")

        let reviewsLinkEls = document.querySelectorAll(".header__menu-item--reviews, .column__menu-item--reviews, .menu__item--reviews")
        let reviewsSection = document.querySelector("section.about-us")

        function handleLinks(linkEls, section) {
            Array.from(linkEls).forEach(linkEl => {
                linkEl.addEventListener("click", (e) => {
                    e.preventDefault();
                    if (mobileMenuEl.classList.contains("menu--open")) {
                        mobileMenuEl.classList.remove("menu--open")
                        burgerMenuEl.classList.remove("header__burger--open")
                        unlockBody()
                        mobileMenuEl.addEventListener("transitionend", () => {
                            scroll.scrollTo(section, {
                                duration: 800,
                            })
                        }, { once: true })
                    } else {
                        scroll.scrollTo(section, {
                            duration: 800,
                        })
                    }
                })
            })
        }

        handleLinks(contactsLinkEls, callUsSection)
        handleLinks(aboutLinkEl, aboutSection)
        handleLinks(reviewsLinkEls, reviewsSection)
    }

    // FANCYBOX
    if (window.Fancybox) {
        Fancybox.bind("[data-fancybox]", {
            // Your custom options
        });
        function youtubeParser(url){
            var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
            var match = url.match(regExp);
            return (match&&match[7].length==11)? match[7] : false;
        }
        let fancyboxYoutubeVideoEls = document.querySelectorAll("[data-fancybox-youtube]")

        Array.from(fancyboxYoutubeVideoEls).forEach(videoEl => {
            let videoSrc = videoEl.getAttribute("href")
            let videoId = youtubeParser(videoSrc)

            videoEl.querySelector("img").setAttribute("src", `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`)
        })
    }

    // SWIPERs
    if (window.Swiper) {
        new Swiper(".hero__swiper", {
            slidesPerView: 1,
            speed: 800,
            loop: true,
            parallax: true,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
                hideOnClick: true,
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

        new Swiper(".help-how__steps", {
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
            slidesPerView: "auto",
            spaceBetween: 20,
            centeredSlides: true,
            speed: 580,
            breakpoints: {
                768: {
                    slidesPerView: 1,
                }
            },
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

        new Swiper(".about__swiper", {
            slidesPerView: 1.4,
            spaceBetween: 10,
            breakpoints: {
                576: {
                    slidesPerView: 2
                },
                768: {
                    slidesPerView: 2.35
                },
                992: {
                    slidesPerView: 5,
                    spaceBetween: 0
                }
            }
        })

        new Swiper(".values__swiper", {
            slidesPerView: "auto",
            spaceBetween: 4,
            breakpoints: {
                768: {
                    slidesPerView: 2.25
                },
                993: {
                    slidesPerView: 3,
                },
                1360: {
                    slidesPerView: 4,
                }
            }
        })
    }

    // FORMs

    const inputEls = document.querySelectorAll(".form__input")
    const phoneInputEls = document.querySelectorAll(".form__input[name='phone']")
    const nameInputEls = document.querySelectorAll(".form__input[name='name']")
    const inputControlClass = "form__control"

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

    document.querySelector(".form__file-input").addEventListener("change", e => {
        if (e.target.files[0].size > 100 * 1024 * 1024) {
            alert("Размер файла не должен превышать 30 MB")
            return
        }
        const parentEl = e.target.closest(".form__file");
        parentEl.querySelector(".form__file-doc .text").innerHTML = e.target.files[0].name
        parentEl.classList.add("form__file_attached")
        parentEl.querySelector(".form__file-doc button").addEventListener("click", () => {
            e.target.value = "";
            parentEl.classList.remove("form__file_attached")
        }, { once: true })
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
    if (window.mapboxgl) {
        initMap("map")
    }

}