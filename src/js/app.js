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

function closePopup(popup = null) {
    if (!popup) {
        popup = document.querySelector(".popup--open")
    }

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
        let coords = mapEl?.dataset.mark?.split(',').map(Number) || [49.10686513125719, 55.7954692462696];
        // создание и установка пинов
        let marker = document.createElement("div")
        marker.insertAdjacentHTML("beforeend", `<img src="images/map-marker.svg" alt="">`)

        // добавление пинов на карту
        new mapboxgl.Marker(marker)
            .setLngLat(center)
            .addTo(map);
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
        style: 'mapbox://styles/mapbox/light-v11',
        center: center, 
        zoom: 12, // starting zoom
        dragRotate: false,
        cooperativeGestures: true,
        locale: {
            "ScrollZoomBlocker.CtrlMessage": "ctrl + scroll для увеличения масштаба карты",
            "ScrollZoomBlocker.CmdMessage" : "⌘ + scroll для увеличения масштаба карты",
            'TouchPanBlocker.Message': 'Используйте два пальца чтобы подвинуть карту',
            'NavigationControl.ZoomIn': 'Увеличить',
            'NavigationControl.ZoomOut': 'Уменьшить',
        },
    });
    getCoords()
}


window.onload = function() {
    let callDoctorPopupEl = document.querySelector(".popup--call-doctor")
    let citiesPopupEl = document.querySelector(".popup--cities")

    // HEADER
    const headerEl = document.querySelector(".header");
    const burgerMenuEl = headerEl.querySelector(".header__burger");
    const serviceMenuItemEl = headerEl.querySelector(".header__menu-item--services");
    const desktopSubmenuEl = serviceMenuItemEl.querySelector(".header__submenu");
    const mobileMenuEl = headerEl.querySelector(".header__menu--mobile");

    const locationEls = headerEl.querySelectorAll(".header__location");
    const consultationButtonEls = headerEl.querySelectorAll(".header__button");
    const bviEls = document.querySelectorAll(".header__bvi")
    // const buttonEls = document.querySelectorAll(".header__menu-item--prices, .header__menu-item--stocks, .column__menu-item--prices, .column__menu-item--stocks, .menu__item--stocks, .menu__item--prices")

    // Array.from(buttonEls).forEach(buttonEl => {
    //     buttonEl.addEventListener("click", e => {
    //         e.preventDefault();
    //         openPopup(callDoctorPopupEl)
    //     })
    // })

    Array.from(consultationButtonEls).forEach(buttonEl => {
        let popupEl = document.querySelector(".popup--consultation")
        buttonEl.addEventListener("click", e => openPopup(popupEl))
    })

    // desktopSubmenuEl.addEventListener("click", (e) => {
    //     if (!e.target.closest(".submenu__service-link")) {
    //         return
    //     }
    //     e.preventDefault();
    //     openPopup(callDoctorPopupEl)
    // })

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
        if (!e.target.closest(".menu__list")) {
            return
        }

        let hasSubmenu = e.target.closest(".menu__item").childElementCount === 3;
        // let lastSubmenu = e.target.closest(".menu__item").childElementCount === 1 && e.target.closest(".menu__submenu")
        
        // if (lastSubmenu) {
        //     e.preventDefault()
        //     openPopup(callDoctorPopupEl)
        //     return
        // }

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

    Array.from(locationEls).forEach(locationEl => locationEl.addEventListener("click", e => {
        openPopup(citiesPopupEl)
    }))

    Array.from(bviEls).forEach(bviEl => bviEl.addEventListener("click", e => {
        new isvek.Bvi({
            fontSize: 28,
            theme: "brown"
        });
    }))
    // HERO
    Array.from(document.querySelectorAll(".hero__call-doctor, .hero__button")).forEach(buttonEl => {
        buttonEl.addEventListener("click", e => {
            openPopup(callDoctorPopupEl)
        })
    })

    // SERVICES
    // let servicesListEl = document.querySelector(".services__list")
    // if (servicesListEl) {
    //     servicesListEl.addEventListener("click", e => {
    //         if (!e.target.closest(".services__service-item")) {
    //             return
    //         }
    //         e.preventDefault()
    //         openPopup(callDoctorPopupEl)
    //     })
    // }

    // DOCTORS
    let doctorsListEl = document.querySelector(".our-doctors .swiper-wrapper")
    if (doctorsListEl) {
        doctorsListEl.addEventListener("click", e => {
            if (!e.target.closest(".doctor")) {
                return
            }  

            let popupEl = document.querySelector(".popup--doctor")
            openPopup(popupEl)
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

        // let contactsLinkEls = document.querySelectorAll(".header__menu-item--contacts a, .column__menu-item--contacts, .menu__item--contacts")
        // let callUsSection = document.querySelector("section.call-us");

        // let aboutLinkEl = document.querySelectorAll(".header__menu-item--about, .column__menu-item--about, .menu__item--about")
        // let aboutSection = document.querySelector("section.our-advantages")

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

        // handleLinks(contactsLinkEls, callUsSection)
        // handleLinks(aboutLinkEl, aboutSection)
        handleLinks(reviewsLinkEls, reviewsSection)

        // let contentNavEl = document.querySelector(".content__nav")
        if (document.querySelector(".content__nav")) {

            const contentNavEl = document.querySelector(".content__nav")
            const contentBlockEls = document.querySelectorAll(".content__column > div")
    
            let lastPosY = 0,  curSection = 0, contentNavLinksEls = null;

            Array.from(contentBlockEls).forEach((blockEl, index) => {
                contentNavEl.querySelector(".nav__menu").insertAdjacentHTML("beforeend", `
                    <li class="nav__menu-item ${ index === 0 ? "nav__menu-item--active" : ''}">
                        <a href="#${ blockEl.getAttribute("id") } " class="nav__menu-link">${ blockEl.querySelector("h2").innerHTML }</a>
                    </li>
                `)
            })

            contentNavLinksEls = contentNavEl.querySelectorAll(".nav__menu-link")

            contentNavEl.addEventListener("click", e => {
                if (!window.matchMedia("(max-width: 992px").matches) {
                    return
                }
                if (e.target.closest(".nav__head")) {
                    e.target.closest(".nav").classList.toggle("nav--open")
                }
            })

            Array.from(contentNavLinksEls).forEach(navLink => {
                let sectionId = navLink.getAttribute("href")
                const target = document.getElementById(sectionId.slice(1))
                navLink.addEventListener("click", (e) => {
                    e.preventDefault()
                    e.target.closest(".nav--open")?.classList.remove("nav--open")
                    scroll.scrollTo(target, {
                            offset: -100,
                            duration: 800,
                        }
                    )
                })
            })


            window.addEventListener("scroll", () => {
                let posY = window.pageYOffset;
                
                if (posY > lastPosY) {
                    if (curSection === contentBlockEls.length - 1)
                        return
                    let sectionYOffset = contentBlockEls[curSection + 1].offsetTop
                    if (posY >= sectionYOffset - window.innerHeight / 2) {
                        contentNavLinksEls[curSection].parentElement.classList.remove("nav__menu-item--active")
                        contentNavLinksEls[curSection + 1].parentElement.classList.add("nav__menu-item--active")
                        curSection += 1
                    }
                }  else {
                    if (curSection === 0)
                        return 
                    let sectionYOffset = contentBlockEls[curSection].offsetTop
                    if (sectionYOffset - window.innerHeight / 2 >= posY) {
                        contentNavLinksEls[curSection].parentElement.classList.remove("nav__menu-item--active")
                        contentNavLinksEls[curSection - 1].parentElement.classList.add("nav__menu-item--active")
                        curSection -= 1
                    } 
                    if (curSection == 1 && posY <= 30) {
                        contentNavLinksEls[curSection].parentElement.classList.remove("nav__menu-item--active")
                        contentNavLinksEls[curSection - 1].parentElement.classList.add("nav__menu-item--active")
                        curSection -= 1
                    }
                }
                lastPosY = posY
            })
        }
        // PRICES PAGE
        if (document.querySelector("section.prices")) {
            const pricesCategories = document.querySelector(".prices__content .tab__content")
            const backCallForm = document.querySelector(".back-call")
            const hiddenServiceInputEl = backCallForm.querySelector("input[name='service-name']")
    
            pricesCategories.addEventListener("click", e => {
                if (window.innerWidth <= 768) {
                    if (e.target.closest(".service")) {
                        hiddenServiceInputEl.value = e.target.closest(".service").querySelector(".service__name").innerHTML;
                        scroll.scrollTo(backCallForm, {
                            offset: -50,
                            duration: 500,
                        })
                    }
                } else {
                    if (e.target.closest(".service__button")) {
                        hiddenServiceInputEl.value = e.target.closest(".service").querySelector(".service__name").innerHTML;
                        scroll.scrollTo(backCallForm, {
                            offset: -50,
                            duration: 500,
                        })
                    }
                }
            })
        }
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
        new Swiper(".doctor-card__certificates-swiper", {
            slidesPerView: 4,
            slidesPerView: "auto",
            spaceBetween: 12,
            observeParents: true,
            observeSlideChildren: true,
            observer: true,
            watchOverflow: true,
            breakpoints: {
                768: {
                    slidesPerView: 4,
                },
                993: {
                    slidesPerView: "auto",
                }
            }
        })

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
            slidesOffsetAfter: 20,
            slidesOffsetBefore: 20,
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
            slidesOffsetAfter: 20,
            slidesOffsetBefore: 20,
            spaceBetween: 10,
            breakpoints: {
                577: {
                    slidesPerView: 2,
                    slidesOffsetAfter: 0,
                    slidesOffsetBefore: 0,
                },
                768: {
                    slidesPerView: 2.35,
                    // slidesOffsetAfter: 0,
                    // slidesOffsetBefore: 0,
                },
                992: {
                    slidesPerView: 5,
                    spaceBetween: 0,
                    // slidesOffsetAfter: 0,
                    // slidesOffsetBefore: 0,
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

    document.querySelector(".form__file-input")?.addEventListener("change", e => {
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

    let citiesListEl = document.querySelector(".popup__cities")
    let cityEls = citiesPopupEl.querySelectorAll(".popup__city");

    citiesPopupEl.querySelector(".form__input").addEventListener("input", e => {
        let newArray = Array.from(cityEls).filter(cityEl => {
            let cityLabel = cityEl.querySelector("span").innerHTML
            return  cityLabel.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
        })

        citiesListEl.innerHTML = "";
        if (newArray.length) {
            newArray.forEach(item => citiesListEl.insertAdjacentElement("beforeend", item))
        } else {
            citiesListEl.innerHTML = `
                <div>По вашему запросу ничего не найдено</div>
            `
        }
    })

    citiesListEl.addEventListener("click", e => {
        if (!e.target.closest(".popup__city")) {
            return
        }
        
        let currentCity = e.target.closest(".popup__city")

        citiesListEl.querySelector(".popup__city--active").classList.remove("popup__city--active");
        currentCity.classList.add("popup__city--active");

        closePopup()

        locationEls[0].querySelector(".header__location-title").innerHTML = currentCity.querySelector("span").innerHTML
    })

    document.querySelectorAll(".popup__close").forEach(closeEl => {
        let popupEl = closeEl.closest(".popup")
        closeEl.addEventListener("click", () => closePopup(popupEl))
    })
    
    document.querySelectorAll(".popup").forEach(
        popupEl => popupEl.addEventListener("click", e => {
            if (!e.target.closest(".popup__content")) {
                closePopup(popupEl)
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