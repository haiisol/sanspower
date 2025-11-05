(function ($) {
    "use strict";

    // Function to handle smooth scrolling for anchors
    function setupSmoothScroll(selector) {
        $(selector).length > 0 && $(selector).each(function () {
            var links = $(this).find("a");
            $(this).find(links).each(function () {
                $(this).on("click", function () {
                    var target = $(this.getAttribute("href"));
                    if (target.length) {
                        event.preventDefault();
                        $("html, body").stop().animate({
                            scrollTop: target.offset().top - 10
                        }, 1000);
                    }
                });
            });
        });
    }

    // 1. Preloader
    $(window).on("load", function () {
        $(".preloader").fadeOut();
    });

    // 3. Mobile Menu Plugin (thmobilemenu)
    $.fn.thmobilemenu = function (options) {
        var settings = $.extend({
            menuToggleBtn: ".th-menu-toggle",
            bodyToggleClass: "th-body-visible",
            subMenuClass: "th-submenu",
            subMenuParent: "th-item-has-children",
            subMenuParentToggle: "th-active",
            meanExpandClass: "th-mean-expand",
            appendElement: '<span class="th-mean-expand"></span>',
            subMenuToggleClass: "th-open",
            toggleSpeed: 400
        }, options);

        return this.each(function () {
            var menu = $(this);

            function toggleMenu() {
                menu.toggleClass(settings.bodyToggleClass);
                var subMenuSelector = "." + settings.subMenuClass;
                $(subMenuSelector).each(function () {
                    if ($(this).hasClass(settings.subMenuToggleClass)) {
                        $(this).removeClass(settings.subMenuToggleClass);
                        $(this).css("display", "none");
                        $(this).parent().removeClass(settings.subMenuParentToggle);
                    }
                });
            }

            // Initialize menu items
            menu.find("li").each(function () {
                var subMenu = $(this).find("ul");
                subMenu.addClass(settings.subMenuClass);
                subMenu.css("display", "none");
                subMenu.parent().addClass(settings.subMenuParent);
                subMenu.prev("a").append(settings.appendElement);
                subMenu.next("a").append(settings.appendElement);
            });

            // Handle submenu expansion click
            var expanderSelector = "." + settings.meanExpandClass;
            $(expanderSelector).each(function () {
                $(this).on("click", function (event) {
                    var $this = $(this);
                    event.preventDefault();
                    var parentLink = $this.parent();
                    
                    if (parentLink.next("ul").length > 0) {
                        parentLink.parent().toggleClass(settings.subMenuParentToggle);
                        parentLink.next("ul").slideToggle(settings.toggleSpeed);
                        parentLink.next("ul").toggleClass(settings.subMenuToggleClass);
                    } else if (parentLink.prev("ul").length > 0) {
                        parentLink.parent().toggleClass(settings.subMenuParentToggle);
                        parentLink.prev("ul").slideToggle(settings.toggleSpeed);
                        parentLink.prev("ul").toggleClass(settings.subMenuToggleClass);
                    }
                });
            });

            // Handle menu toggle button click
            $(settings.menuToggleBtn).each(function () {
                $(this).on("click", function () {
                    toggleMenu();
                });
            });
            
            // Close menu when clicking outside
            menu.on("click", function (event) {
                event.stopPropagation();
                toggleMenu();
            });

            // Prevent closing when clicking inside the menu wrapper (divs)
            menu.find("div").on("click", function (event) {
                event.stopPropagation();
            });
        });
    };

    // Initialize mobile menu
    $(".th-menu-wrapper").thmobilemenu();

    // 4. Sticky Header
    $(window).scroll(function () {
        if ($(this).scrollTop() > 500) {
            $(".sticky-wrapper").addClass("sticky");
        } else {
            $(".sticky-wrapper").removeClass("sticky");
        }
    });

    // 5. Smooth Scroll for Onepage Nav and Scroll Down
    setupSmoothScroll(".onepage-nav");
    setupSmoothScroll(".scroll-down");

    // 6. Scroll Top Button (with SVG progress)
    if ($(".scroll-top").length) {
        var scrollTopBtn = document.querySelector(".scroll-top");
        var path = document.querySelector(".scroll-top path");
        var pathLength = path.getTotalLength();
        
        path.style.transition = path.style.WebkitTransition = "none";
        path.style.strokeDasharray = pathLength + " " + pathLength;
        path.style.strokeDashoffset = pathLength;
        path.getBoundingClientRect(); // Forces layout
        path.style.transition = path.style.WebkitTransition = "stroke-dashoffset 10ms linear";

        var updateScrollTopPath = function () {
            var scrollTop = $(window).scrollTop();
            var docHeight = $(document).height() - $(window).height();
            var offset = pathLength - scrollTop * pathLength / docHeight;
            path.style.strokeDashoffset = offset;
        };

        updateScrollTopPath();
        $(window).scroll(updateScrollTopPath);

        jQuery(window).on("scroll", function () {
            if (jQuery(this).scrollTop() > 50) {
                jQuery(scrollTopBtn).addClass("show");
            } else {
                jQuery(scrollTopBtn).removeClass("show");
            }
        });

        jQuery(scrollTopBtn).on("click", function (event) {
            event.preventDefault();
            jQuery("html, body").animate({
                scrollTop: 0
            }, 750);
            return false;
        });
    }

    // 7. Dynamic Backgrounds (data-bg-src, data-bg-color)
    $("[data-bg-src]").length > 0 && $("[data-bg-src]").each(function () {
        var src = $(this).attr("data-bg-src");
        $(this).css("background-image", "url(" + src + ")");
        $(this).removeAttr("data-bg-src").addClass("background-image");
    });

    $("[data-bg-color]").length > 0 && $("[data-bg-color]").each(function () {
        var color = $(this).attr("data-bg-color");
        $(this).css("background-color", color);
        $(this).removeAttr("data-bg-color");
    });

    // Custom CSS variable for border color
    $("[data-border]").each(function () {
        var border = $(this).data("border");
        $(this).css("--th-border-color", border);
    });

    // Custom CSS masking
    $("[data-mask-src]").length > 0 && $("[data-mask-src]").each(function () {
        var maskSrc = $(this).attr("data-mask-src");
        $(this).css({
            "mask-image": "url(" + maskSrc + ")",
            "-webkit-mask-image": "url(" + maskSrc + ")"
        });
        $(this).addClass("bg-mask");
        $(this).removeAttr("data-mask-src");
    });

    // 8. Swiper Slider Initialization
    $(".th-slider").each(function () {
        var sliderContainer = $(this);
        var sliderOptionsData = $(this).data("slider-options");
        var prevBtn = sliderContainer.find(".slider-prev");
        var nextBtn = sliderContainer.find(".slider-next");
        var pagination = sliderContainer.find(".slider-pagination");
        var autoplaySettings = sliderOptionsData.autoplay;

        var defaultOptions = {
            slidesPerView: 1,
            spaceBetween: sliderOptionsData.spaceBetween ? sliderOptionsData.spaceBetween : 24,
            loop: sliderOptionsData.loop != 0,
            speed: sliderOptionsData.speed ? sliderOptionsData.speed : 1000,
            autoplay: autoplaySettings || {
                delay: 6000,
                disableOnInteraction: false
            },
            navigation: {
                nextEl: nextBtn.get(0),
                prevEl: prevBtn.get(0)
            },
            pagination: {
                el: pagination.get(0),
                clickable: true,
                renderBullet: function (index, className) {
                    return '<span class="' + className + '" aria-label="Go to Slide ' + (index + 1) + '"></span>';
                }
            }
        };

        var mergedOptions = JSON.parse(sliderContainer.attr("data-slider-options"));
        mergedOptions = $.extend({}, defaultOptions, mergedOptions);

        new Swiper(sliderContainer.get(0), mergedOptions);

        if ($(".slider-area").length > 0) {
            $(".slider-area").closest(".container").parent().addClass("arrow-wrap");
        }
    });

    // Animation attributes (data-ani, data-ani-delay)
    $("[data-ani]").each(function () {
        var animation = $(this).data("ani");
        $(this).addClass(animation);
    });

    $("[data-ani-delay]").each(function () {
        var delay = $(this).data("ani-delay");
        $(this).css("animation-delay", delay);
    });

    // Swiper navigation (external buttons)
    $("[data-slider-prev], [data-slider-next]").on("click", function () {
        var targetSelector = $(this).data("slider-prev") || $(this).data("slider-next");
        var targetSlider = $(targetSelector);
        
        if (targetSlider.length) {
            var swiperInstance = targetSlider[0].swiper;
            if (swiperInstance) {
                if ($(this).data("slider-prev")) {
                    swiperInstance.slidePrev();
                } else {
                    swiperInstance.slideNext();
                }
            }
        }
    });

    // 9. Slider Thumbs / Tab Indicator Plugin
    $.fn.activateSliderThumbs = function (options) {
        var settings = $.extend({
            sliderTab: false,
            tabButton: ".tab-btn"
        }, options);

        return this.each(function () {
            var container = $(this);
            var buttons = container.find(settings.tabButton);
            var indicator = $('<span class="indicator"></span>').appendTo(container);
            var sliderSelector = container.data("slider-tab");
            var swiperInstance = $(sliderSelector)[0].swiper;

            function updateIndicator(activeButton) {
                var position = activeButton.position();
                var marginTop = parseInt(activeButton.css("margin-top")) || 0;
                var marginLeft = parseInt(activeButton.css("margin-left")) || 0;
                
                indicator.css("--height-set", activeButton.outerHeight() + "px");
                indicator.css("--width-set", activeButton.outerWidth() + "px");
                indicator.css("--pos-y", position.top + marginTop + "px");
                indicator.css("--pos-x", position.left + marginLeft + "px");
            }

            buttons.on("click", function (event) {
                event.preventDefault();
                var button = $(this);
                button.addClass("active").siblings().removeClass("active");
                updateIndicator(button);

                if (settings.sliderTab) {
                    var index = button.index();
                    swiperInstance.slideTo(index);
                }
            });

            if (settings.sliderTab) {
                swiperInstance.on("slideChange", function () {
                    var realIndex = swiperInstance.realIndex;
                    var activeButton = buttons.eq(realIndex);
                    activeButton.addClass("active").siblings().removeClass("active");
                    updateIndicator(activeButton);
                });

                var activeIndex = swiperInstance.activeIndex;
                var initialButton = buttons.eq(activeIndex);
                initialButton.addClass("active").siblings().removeClass("active");
                updateIndicator(initialButton);
            }
        });
    };

    // Initialize thumb sliders
    if ($(".testi-thumb").length) {
        $(".testi-thumb").activateSliderThumbs({
            sliderTab: true,
            tabButton: ".tab-btn"
        });
    }
    if ($(".feature-thumb").length) {
        $(".feature-thumb").activateSliderThumbs({
            sliderTab: true,
            tabButton: ".tab-btn"
        });
    }

    // Cube Swiper
    new Swiper(".cubeSwiper", {
        effect: "cube",
        grabCursor: true,
        pauseOnMouseEnter: true,
        speed: 2000,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false
        },
        cubeEffect: {
            shadow: false,
            slideShadows: true,
            shadowOffset: 20,
            shadowScale: .94
        },
        pagination: {
            el: ".swiper-pagination"
        }
    });

    // 10. AJAX Contact Form
    var contactFormSelector = ".ajax-contact";
    var emailInputSelector = '[name="email"]';
    var formMessages = $(".form-messages");

    function validateAndSubmitForm() {
        var formData = $(contactFormSelector).serialize();

        // Validation logic
        function isValidForm() {
            var isValid = true;
            var fieldsToValidate = '[name="name"],[name="email"],[name="subject"],[name="number"],[name="message"]';

            // Check non-empty fields
            fieldsToValidate.split(",").forEach(function (field) {
                var element = $(contactFormSelector + " " + field);
                if (element.val()) {
                    element.removeClass("is-invalid");
                    isValid = true;
                } else {
                    element.addClass("is-invalid");
                    isValid = false;
                }
            });

            // Check email format
            var emailValue = $(emailInputSelector).val();
            if (emailValue && emailValue.match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)) {
                $(emailInputSelector).removeClass("is-invalid");
                isValid = true;
            } else {
                $(emailInputSelector).addClass("is-invalid");
                isValid = false;
            }
            return isValid;
        }

        if (isValidForm()) {
            jQuery.ajax({
                url: $(contactFormSelector).attr("action"),
                data: formData,
                type: "POST"
            }).done(function (response) {
                formMessages.removeClass("error").addClass("success").text(response);
                $(contactFormSelector + ' input:not([type="submit"]),' + contactFormSelector + " textarea").val("");
            }).fail(function (error) {
                formMessages.removeClass("success").addClass("error");
                if (error.responseText !== "") {
                    formMessages.html(error.responseText);
                } else {
                    formMessages.html("Oops! An error occurred and your message could not be sent.");
                }
            });
        }
    }
    
    // Handle form submission
    $(contactFormSelector).on("submit", function (event) {
        event.preventDefault();
        validateAndSubmitForm();
    });

    // 14. Magnific Popup (Lightbox)
    $(".popup-image").magnificPopup({
        type: "image",
        mainClass: "mfp-zoom-in",
        removalDelay: 260,
        gallery: {
            enabled: true
        }
    });

    $(".popup-video").magnificPopup({
        type: "iframe",
        mainClass: "mfp-zoom-in",
        removalDelay: 260
    });

    $(".popup-content").magnificPopup({
        type: "inline",
        midClick: true
    });

    // 15. Dynamic Theme Colors (CSS Variables)
    $("[data-theme-color]").length > 0 && $("[data-theme-color]").each(function () {
        var color = $(this).attr("data-theme-color");
        $(this).get(0).style.setProperty("--theme-color", color);
        $(this).removeAttr("data-theme-color");
    });
    
    // 16. Hover Item Active State
    $(document).on("mouseover", ".hover-item", function () {
        $(".hover-item").removeClass("item-active");
        $(this).addClass("item-active");
    });

    // 17. Sticky Header Padding Fix on DOM Content Loaded
    $(document).on("DOMContentLoaded", function () {
        if ($(".sticky-wrapper").length > 0) {
            function updatePadding() {
                if ($(".sticky-wrapper").hasClass("sticky")) {
                    $("#smooth-wrapper").css("padding-top", "0");
                } else {
                    // Original code seems to calculate header height but then sets to "0px"
                    // var headerHeight = $(".th-header").outerHeight();
                    $("#smooth-wrapper").css("padding-top", "0px");
                }
            }
            updatePadding();
            $(window).on("resize", updatePadding);

            // Observe class changes on sticky-wrapper
            if (typeof MutationObserver !== 'undefined') {
                new MutationObserver(function (mutations) {
                    mutations.forEach(function (mutation) {
                        if (mutation.type === "attributes" && mutation.attributeName === "class") {
                            updatePadding();
                        }
                    });
                }).observe(document.querySelector(".sticky-wrapper"), {
                    attributes: true
                });
            }
        }
        
        // Custom Mouse Element
        $(document).on("mousemove", function (event) {
            var mouseX = event.pageX;
            var mouseY = event.pageY;
            $(".custom-element").stop().animate({
                left: mouseX,
                top: mouseY
            }, 300);
        });
    });

    // 18. GSAP Scroll Animation (th-anim)
    if ($(".th-anim").length) {
        gsap.registerPlugin(ScrollTrigger);
        document.querySelectorAll(".th-anim").forEach(function (element) {
            let image = element.querySelector("img");
            let timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: element,
                    toggleActions: "play none none none"
                }
            });
            timeline.set(element, {
                autoAlpha: 1
            });
            timeline.from(element, 1.5, {
                xPercent: -100,
                ease: Power2.out
            });
            timeline.from(image, 1.5, {
                xPercent: 100,
                scale: 1.3,
                delay: -1.5,
                ease: Power2.out
            });
        });
    }

    

    // 20. Cursor Follower (slider-area)
    if ($(".cursor-follower").length > 0) {
        var follower = $(".cursor-follower");
        var followerX = 0,
            followerY = 0,
            mouseX = 0,
            mouseY = 0;

        TweenMax.to({}, 0.016, {
            repeat: -1,
            onRepeat: function () {
                followerX += (mouseX - followerX) / 9;
                followerY += (mouseY - followerY) / 9;
                TweenMax.set(follower, {
                    css: {
                        left: followerX - 12,
                        top: followerY - 12
                    }
                });
            }
        });

        $(document).on("mousemove", function (event) {
            mouseX = event.clientX;
            mouseY = event.clientY;
        });

        $(".slider-area").on("mouseenter", function () {
            follower.addClass("d-none");
        }).on("mouseleave", function () {
            follower.removeClass("d-none");
        });
    }

    // 22. Progress Bar Counter (choose-progress-bar)
    $(document).on("DOMContentLoaded", function () {
        $(".choose-progress-bar .progress-fill .counter").each(function () {
            var value = $(this).html();
            $(this).parent().css({
                height: value
            }).animate({
                height: value
            }, 1000);
        });

        // Calculate average progress
        var totalValue = 0,
            count = 0;
        $(".choose-progress-bar .progress-fill .counter").each(function () {
            totalValue += parseInt($(this).html());
            count++;
        });
        
        if(count > 0) {
            var average = Math.round(totalValue / count) + "%";
            $("#progress-counter").html(average);
        }
    });

    // 25. Circle Progress Bars (Feature and Skill)
    function animateCircleProgress() {
        // Feature Circle
        $(".feature-circle .progressbar").each(function () {
            var pathColor = $(this).attr("data-path-color");
            var offsetTop = $(this).offset().top;
            var scrollTop = $(window).scrollTop();
            var percent = $(this).find(".circle").attr("data-percent");
            var hasAnimated = $(this).data("animate");

            if (offsetTop < scrollTop + $(window).height() - 30 && !hasAnimated) {
                $(this).data("animate", true);
                $(this).find(".circle").circleProgress({
                    startAngle: -Math.PI / 2,
                    value: percent / 100,
                    size: 100,
                    thickness: 6,
                    emptyFill: "#33425A",
                    lineCap: "round",
                    fill: {
                        color: pathColor
                    }
                }).on("circle-animation-progress", function (event, progress, stepValue) {
                    $(this).find(".circle-num").text((100 * stepValue).toFixed(0) + "%");
                }).stop();
            }
        });
        
        // Skill Circle
        $(".skill-circle .progressbar").each(function () {
            var pathColor = $(this).attr("data-path-color");
            var offsetTop = $(this).offset().top;
            var scrollTop = $(window).scrollTop();
            var percent = $(this).find(".circle").attr("data-percent");
            var hasAnimated = $(this).data("animate");

            if (offsetTop < scrollTop + $(window).height() - 30 && !hasAnimated) {
                $(this).data("animate", true);
                $(this).find(".circle").circleProgress({
                    startAngle: -Math.PI / 2,
                    value: percent / 100,
                    size: 176,
                    thickness: 8,
                    emptyFill: "#EFF1F9",
                    lineCap: "round",
                    fill: {
                        color: pathColor
                    }
                }).on("circle-animation-progress", function (event, progress, stepValue) {
                    $(this).find(".circle-num").text((100 * stepValue).toFixed(0) + "%");
                }).stop();
            }
        });
    }

    // 29. Counter Up
    $(".counter-number").counterUp({
        delay: 10,
        time: 1000
    });

    // 30. Shape Mockup Plugin
    $.fn.shapeMockup = function () {
        $(this).each(function () {
            var mockup = $(this);
            var top = mockup.data("top");
            var right = mockup.data("right");
            var bottom = mockup.data("bottom");
            var left = mockup.data("left");

            mockup.css({
                top: top,
                right: right,
                bottom: bottom,
                left: left
            })
            .removeAttr("data-top")
            .removeAttr("data-right")
            .removeAttr("data-bottom")
            .removeAttr("data-left")
            .parent().addClass("shape-mockup-wrap");
        });
    };

    if ($(".shape-mockup")) {
        $(".shape-mockup").shapeMockup();
    }

    // 31. CSS Progress Bar Animation
    $(function () {
        $(".progress-bar").each(function () {
            $(this).find(".progress-content").animate({
                width: $(this).attr("data-percentage")
            }, 2000);
            $(this).find(".progress-number-mark").animate({
                left: $(this).attr("data-percentage")
            }, {
                duration: 2000,
                step: function (now) {
                    var percent = Math.round(now);
                    $(this).find(".percent").html(percent + "%");
                }
            });
        });
    });

    // Call circle progress bar animation on scroll
    animateCircleProgress();
    $(window).scroll(animateCircleProgress);

    // 33. On-Scroll Counter/Radial Progress Animation
    var $window = $(window);

    function animateCountersOnScroll() {
        $(".countervalue").each(function () {
            // Check if the element is in view AND has the 'start' class (meaning it hasn't animated yet)
            if ($(this).hasClass("start")) {
                var elementTop = $(this).offset().top;
                var elementBottom = elementTop + $(this).outerHeight();
                var viewportTop = $window.scrollTop();
                var viewportBottom = viewportTop + $window.height();

                if (elementBottom > viewportTop && elementTop < viewportBottom) {
                    $(this).removeClass("start");
                    // Animate the counter value
                    var targetValue = $(this).text();
                    
                    if (targetValue == Math.floor(targetValue)) { // Integer
                        $(this).animate({ Counter: targetValue }, {
                            duration: 2800,
                            easing: "swing",
                            step: function (now) {
                                $(this).text(Math.ceil(now) + "%");
                            }
                        });
                    } else { // Decimal (money)
                        $(this).animate({ Counter: targetValue }, {
                            duration: 2800,
                            easing: "swing",
                            step: function (now) {
                                $(this).text(now.toFixed(2) + "$");
                            }
                        });
                    }
                    
                    // Animate radial progress (SVG stroke-dashoffset)
                    $(".radial-progress").each(function (index, element) {
                        $(this).find($("circle.bar--animated")).removeAttr("style");
                        
                        var radialTop = $(this).offset().top;
                        var radialBottom = radialTop + $(this).outerHeight();
                        
                        if (radialBottom > viewportTop && radialTop < viewportBottom) {
                            var counterValue = $(element).data("countervalue");
                            var radius = $(this).find($("circle.bar--animated")).attr("r");
                            var circumference = 2 * Math.PI * radius;
                            var offset = circumference - counterValue * circumference / 100;
                            
                            $(this).find($("circle.bar--animated")).animate({ "stroke-dashoffset": offset }, 2800);
                        }
                    });
                }
            }
        });
    }

    $window.on("scroll", animateCountersOnScroll);
    $window.on("load", animateCountersOnScroll);

    // 36. Pricing Table Switcher (Monthly/Yearly)
    var monthlyBtn = document.getElementById("filt-monthly");
    var yearlyBtn = document.getElementById("filt-yearly");
    var switcherToggle = document.getElementById("switcher");
    var monthlyContent = document.getElementById("monthly");
    var yearlyContent = document.getElementById("yearly");

    if ($(".pricing-tabs").length) {
        monthlyBtn.addEventListener("click", function () {
            switcherToggle.checked = false;
            monthlyBtn.classList.add("toggler--is-active");
            yearlyBtn.classList.remove("toggler--is-active");
            monthlyContent.classList.remove("hide");
            yearlyContent.classList.add("hide");
        });

        yearlyBtn.addEventListener("click", function () {
            switcherToggle.checked = true;
            yearlyBtn.classList.add("toggler--is-active");
            monthlyBtn.classList.remove("toggler--is-active");
            monthlyContent.classList.add("hide");
            yearlyContent.classList.remove("hide");
        });

        switcherToggle.addEventListener("click", function () {
            yearlyBtn.classList.toggle("toggler--is-active");
            monthlyBtn.classList.toggle("toggler--is-active");
            monthlyContent.classList.toggle("hide");
            yearlyContent.classList.toggle("hide");
        });
    }

    // 38. SVG Half-Circle Progress
    $(".th-progress").each(function () {
        var percentage = $(this).data("progress-value") / 100;
        var circle = $(this).find(".half-circle");
        var text = $(this).find("text");
        var circumference = 251.2; // Derived from r=40 in SVG: 2 * PI * 40 = 251.327...
        var offset = circumference - circumference * percentage;
        
        circle.css({
            transition: "stroke-dashoffset 1s ease-in-out",
            "stroke-dashoffset": offset
        });
        
        $({
            progressValue: 0
        }).animate({
            progressValue: 100 * percentage
        }, {
            duration: 1000,
            step: function (now) {
                text.text(Math.round(now) + "%");
            }
        });
    });

    // 39. Data Background Image (Simplified)
    $("[data-background]").each(function () {
        let bgSrc = $(this).attr("data-background");
        if (bgSrc) {
            $(this).css("background-image", `url(${bgSrc})`);
        }
    });

    // 40. Project Area Background Hover Effect
    $(".project-item").on("mouseenter mouseleave", function (event) {
        let bg = (event.type === "mouseenter") ? $(this).data("bg") : "";
        $(".project-area2").attr("data-background", bg).css("background-image", bg ? `url(${bg})` : "");
    });

    // 41. Disable Context Menu and Developer Tools Shortcuts
    // window.addEventListener("contextmenu", function (e) {
    //     e.preventDefault();
    // }, false);

    document.onkeydown = function (e) {
        // F12 key (123)
        if (event.keyCode == 123) {
            return false;
        }
        // Ctrl+Shift+I (Invert - Developer Tools)
        if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
            return false;
        }
        // Ctrl+Shift+C (CSS Inspector)
        if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
            return false;
        }
        // Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
            return false;
        }
        // Ctrl+U (View Source)
        if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
            return false;
        }
    };

})(jQuery);