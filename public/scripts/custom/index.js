var formElement, tooltip, name, surname, email, subject, message, isHuman, formData, s = 0, isStopped, portfolioTitle, previousVideo, formType, lang
/* ======================== */
/* ======================== */
/* LOADING SCREEN */
/* ======================== */
/* ======================== */
loadingscreen(["body", "start"], {
    css: {
        path: "/public/styles/css/",
        name: "loadingScreen"
    },
    image: {
        path: "/public/images/",
        name: "loading.gif",
        alt: "Loading Screen"
    },
    animation: {
        name: "fadeToggle",
        close: 500
    }
})

/* ======================== */
/* ======================== */
/* IMAGE POSITION */
/* ======================== */
/* ======================== */
$(window).on("scroll", function (e) {
    s = $(this).scrollTop()
    $(".image-1").css("background-position", `${s / 6}px ${s / 6}%`)
    $(".image-2 .path").css("background-position", `${s / 24}% ${s / 40}%`)
})

/* ======================== */
/* ======================== */
/* CARD HOVER */
/* ======================== */
/* ======================== */
$(".portfolio-gallery .title").on("hover", function () {
    $(".counter .line", this).addClass("lineShrink").removeClass("lineEnlarge")

}, function () {
    $(".counter .line", this).addClass("lineEnlarge").removeClass("lineShrink")
}
)

$(document).on("DOMContentLoaded", function () {
    /* ======================== */
    /* ======================== */
    /* FORM ELEMENTS */
    /* ======================== */
    /* ======================== */

    // ___DEVAM EDİLECEK___
    $("input[type='text'], input[type='email']").each(function (i, e) {
        const re = new RegExp('\W', 'g')
        $(e).keyup(function () {
            $(this).filter(function () {
                //    console.log($(this).val().match(re))
            })
        })
    })

    /* ======================== */
    /* ======================== */
    /* TOOLTIP | This is an optional second control system for the form elements. The browsers have self-validation mechanism. Some smart users can remove 'required' tag from form elements. */
    /* ======================== */
    /* ======================== */
    function initTooltip(inputName, title = "Please fill this field.") {
        formElement = $(inputName)

        tooltip = new bootstrap.Tooltip(formElement, {
            title,
            customClass: "not-valid-style",
            offset: "0,-30",
            hide: 2000
        })

        tooltip.show()

        $(inputName).addClass("not-valid")

        setTimeout(() => {
            $(inputName).removeClass("not-valid")
            tooltip.dispose()
        }, 2000)
    }

    /* ======================== */
    /* ======================== */
    /* EMAIL INFORMATIONS */
    /* ======================== */
    /* ======================== */

    $("form[name='contact']").on("submit", function (e) {
        e.preventDefault()

        name = $("#name").val()
        surname = $("#surname").val()
        email = $("#email").val()
        subject = $("#subject").val()
        message = $("#message").val()
        isHuman = $("#isHuman").prop("checked")

        if (name == "") {
            initTooltip("#name")
        } else if (surname == "") {
            initTooltip("#surname")
        } else if (email == "") {
            initTooltip("#email")
        } else if (subject == "") {
            initTooltip("#subject")
        } else if (message == "") {
            initTooltip("#message")
        } else if (isHuman == false) {
            $(".isHumanWarning").removeClass("d-none")

            setTimeout(() => {
                $(".isHumanWarning").addClass("d-none")
            }, 2000)
        }

        formData = {
            name,
            surname,
            email,
            subject,
            message,
            isHuman
        }

        if (isHuman == true) {
            $.ajax({
                url: "/",
                type: "POST",
                data: formData,
                beforeSend: function () {
                    $(".messageStatus").text("Sending 😑").removeClass("d-none")
                },
                success: function (response) {
                    $(".messageStatus").text("She got on her horse and left... 🐴").removeClass("d-none")

                    setTimeout(() => {
                        $(".messageStatus").addClass("d-none")
                    }, 3000)
                },
                error: function (err) {
                    $(".messageStatus").text("This is a f*cking error. Try again later or send me an email right now: webdvpv@gmail.com").removeClass("d-none")

                    setTimeout(() => {
                        $(".messageStatus").addClass("d-none")
                    }, 7000)
                }
            })
        }
    })
})

/* ======================== */
/* ======================== */
/* MODAL */
/* ======================== */
/* ======================== */
$('nav ul li').on("click", function (e) {
    e.preventDefault()
    e.stopPropagation()

    let target = $(this).attr("data-target")

    if (target == "me") {
        $("#me").removeClass("d-none").addClass("d-block")
    } else if (target == "references") {
        $("#references").removeClass("d-none").addClass("d-block")
    }
})

$(document).on("click", function (e) {
    $(".custom-modal").removeClass("d-block").addClass("d-none")
})

// Preventing close the modal when modal clicked
$(".custom-modal").on("click", function (e) { e.stopPropagation() })

$(".close").on("click", function () {
    $(".custom-modal").removeClass("d-block").addClass("d-none")
})

/* ======================== */
/* ======================== */
/* PORTFOLIO GALLERY  */
/* ======================== */
/* ======================== */
$(".portfolio-gallery .goIn").on("click touchstart", function (e) {
    e.preventDefault()
    $(this).parent(".title").addClass("title--active")
})

// ___DEVAM EDİLECEK___ - ÇIKIŞ KISMINDA DOKUNMA SİMÜLASYONUNU İNCELE
$(".portfolio-gallery .title").on({
    click: function (e) {
        e.stopPropagation()
    },

    mouseleave: function () {
        $(this).removeClass("title--active")
    }
})

/* ======================== */
/* ======================== */
/* PORTFOLIO GALLERY / VIDEO */
/* ======================== */
/* ======================== */
isStopped = false
portfolioTitle = []
const video = `<video muted preload="auto"><source src="/public/files/video-portal.mp4" type="video/mp4"></video>`

$(".portfolio-gallery .title").on({
    mouseenter: function () {

        portfolioTitle.push($(this))

        if (portfolioTitle.length > 1) {
            previousVideo = $(portfolioTitle[0]).find("video")
            portfolioTitle.shift()
            $(portfolioTitle[0]).prepend(previousVideo)
        }

        if ($(this).has("video").length == 0) $(this).prepend(video)

        setTimeout(() => {
            if (isStopped == true) {
                $("video", this).fadeOut(100)
                $("video", this)[0].pause()
                $("video", this)[0].currentTime = 0
                return
            }
            else {
                $("video", this).css({ "opacity": 1, "display": "block" })
                try {
                    $("video", this)[0].play()
                } catch {
                    if (typeof $("video", this)[0] == undefined) return
                }

                setTimeout(() => {
                    $("video", this).fadeOut(500)
                }, 5000)
            }
        }, 500)
    },
    mouseleave: function (e) {
        isStopped = true

        $("video", this).fadeOut(100)
        $("video", this)[0].pause()
        $("video", this)[0].currentTime = 0

        setTimeout(() => {
            isStopped = false
        }, 100)
    }
})

toastr.options.closeButton = true

/* ======================== */
/* ======================== */
/* LOGIN & REGISTER  */
/* ======================== */
/* ======================== */
function formChanger(formName, self) {
    if (formName == "register") {
        $(self).parents('[class^="col"]').removeClass("d-flex").addClass("d-none")
        $('form[name="register"]').parents('[class^="col"]').addClass("d-flex").removeClass("d-none")
    } else if (formName == "login") {
        $(self).parents('[class^="col"]').removeClass("d-flex").addClass("d-none")
        $('form[name="login"]').parents('[class^="col"]').addClass("d-flex").removeClass("d-none")
    }
}

$(".go-to-register").on("click", function (e) {
    e.preventDefault()
    formChanger("register", this)
})

$(".go-to-login").on({
    click: function (e) {
        e.preventDefault()
        formChanger("login", this)
    }
})

$("form[name='login']").on({
    submit: function (e) {
        e.preventDefault()

        formType = "login"

        var username = $("#login_username").val()
        var password = $("#login_password").val()

        var formData = {
            username,
            password,
            formType
        }

        $.ajax({
            url: "/signin",
            type: "POST",
            data: formData,
            success: function (response) {

            },
            error: function (err) {
                console.log("Error: " + err.statusText)
            }
        })
    }
})

$("form[name='register']").on({
    submit: function (e) {
        e.preventDefault()

        formType = "register"

        var username = $("#register_username").val()
        var password = $("#register_password").val()
        var email = $("#register_email").val()

        var formData = {
            username,
            password,
            email,
            formType
        }

        $.ajax({
            url: "/signin",
            type: "POST",
            data: formData,
            success: function (response) {
                if (response) {
                    toastr.success("You have just registered as a STAR! You will be guided onto the red carpet!")
                    setTimeout(() => {
                        window.location = "/adminpanel"
                        toastr.clear()
                    }, 3000)
                }
                else toastr.error("This user f*cking exists! Choose a more unique nick 😑")
            },
            error: function (err) {
                console.log("Error: " + err.statusText)
            }
        })

        /* Form Change Sentences */
        // $(this).parents('[class^="col"]').removeClass("d-flex").addClass("d-none")
        // $('form[name="login"]').parents('[class^="col"]').addClass("d-flex").removeClass("d-none")
    }
})

/* ======================== */
/* ======================== */
/* LANGUAGE */
/* ======================== */
/* ======================== */
$("#language").on('change', function () {
    lang = $(this).val()
    console.log(lang);

    if (lang == "en") {
        $.ajax({
            url: "/",
            type: "POST",
            data: { language: lang },
            success: function () {
                window.location = "/"
            },
            error: function (err) {
                toastr.error("There is a f*king problem 😑")
            }
        })
    }
    if (lang == "tr") {
        $.ajax({
            url: "/",
            type: "POST",
            data: { language: lang },
            success: function () {
                window.location = "/tr"
            },
            error: function (err) {
                toastr.error("Bir hata var seni yönlendiremiyorum 😑")
            }
        })
    }
})