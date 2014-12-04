(function() {
    var ElemeSlider = function(op) {
        var self = this;
        var tick;
        var tickInterval = 30;

        self.element = op.element;
        self.op = {
            autoplay: true,
            loop: false,
            delay: 0,
            speed: 500,
            duration: 3000,
            pauseOnHover: false,
            direction: "top"
        };

        ElemeSlider.util.extend(self.op, op);

        self.init = function() {
            self.slideContainer = self.element.getElementsByTagName("ul")[0];
            self.slides = self.slideContainer.getElementsByTagName("li");

            var op = self.op,
                slides = self.slides,
                len = slides.length;

            self.currentIndex = 0;
            self.element.style.height = op.height + "px";
            self.element.style.width = op.width + "px";

            switch(op.direction) {
                case "top":
                case "bottom":
                    self.direction_unit = op.height;
                    break;
                case "left":
                case "right":
                    self.direction_unit = op.width;
                    break;
            }

            self.navContainer = document.createElement("ol");
            self.element.appendChild(self.navContainer);

            var navs;
            for (var i = 0, navs = ""; i < len; i++) {
                navs += '<li>'+ (i + 1) +'</li>';
            }
            self.navContainer.innerHTML = navs;
            self.navs = self.navContainer.getElementsByTagName("li");
            ElemeSlider.util.addClass(self.navs[self.currentIndex], "active");

            for (var i = 0; i < len; i++) {
                ElemeSlider.util.addEvent(self.navs[i], "click", function(e) {
                    var target = e.target || e.srcElement;
                    var index = ElemeSlider.util.indexOf(target, self.navs);
                    if (ElemeSlider.util.hasClass(self.navs[index], "active")) return;
                    self.stop().slideTo(index);
                });

                slides[i].style.height = op.height + "px";
                slides[i].style.width = op.width + "px";
                if (i == 0) continue;
                if (op.direction == "bottom") {
                    slides[i].style[op.direction] = "0px";
                } else {
                    slides[i].style[op.direction] = self.direction_unit + "px";
                }
            }

            op.autoplay && setTimeout(function() {
                if (op.duration | 0) {
                    self.play();
                    if (op.pauseOnHover) {
                        ElemeSlider.util.addEvent(self.element, "mouseover", function(e) {
                            self.stop();
                        });
                        ElemeSlider.util.addEvent(self.element, "mouseout", function(e) {
                            self.stop();
                            self.play();
                        });
                    }
                }
            }, op.delay | 0);
        };

        self.slideTo = function(index, callback) {
            if (self.intervalId) {
                self.stop();
                self.play();
            }

            var len = self.slides.length;
            if ((index >= len || index < 0) && !self.op.loop) return;
            if (index >= len) index = 0;
            if (index < 0) index = len - 1;

            // animate it!
            ElemeSlider.util.removeClass(self.navs[self.currentIndex], "active");
            ElemeSlider.util.addClass(self.navs[index], "active");
            tick = 0;
            self.move(index);
        };

        self.move = function(index) {
            var op = self.op,
                slides = self.slides,
                current = self.currentIndex;
            var pos = tick / op.speed;

            if (op.direction == "bottom") {
                slides[index].style[op.direction] = -1 * pos * self.direction_unit + "px";
                slides[current].style[op.direction] = -1 * (1 + pos) * self.direction_unit + "px";
            } else {
                slides[index].style[op.direction] = (1- pos) * self.direction_unit + "px";
                slides[current].style[op.direction] = -1 * pos * self.direction_unit + "px";
            }

            if (tick >= op.speed) {
                if (op.direction == "bottom")
                    slides[current].style[op.direction] = "0px";
                else
                    slides[current].style[op.direction] = self.direction_unit + "px";

                self.currentIndex = index;
            } else {
                tick += tickInterval;
                if (tick > op.speed) tick = op.speed;
                setTimeout(function() { self.move(index) }, tickInterval);
            }
        };

        self.play = function() {
            self.intervalId = setInterval(function() {
                self.slideTo(self.currentIndex + 1);
            }, self.op.duration);
        };

        self.stop = function() {
            self.intervalId = clearInterval(self.intervalId);
            return self;
        };

        self.next = function() {
            return self.stop().slideTo(self.currentIndex + 1);
        };

        self.prev = function() {
            return self.stop().slideTo(self.currentIndex - 1);
        };

        self.init();
    };

    ElemeSlider.util = {};
    ElemeSlider.util.extend = function(target, source) {
        for (var property in source) {
            if (source[property] && source[property].constructor && source[property].constructor === Object) {
                target[property] = target[property] || {};
                ElemeSlider.util.extend(target[property], source[property]);
            } else {
                target[property] = source[property];
            }
        }
        return target;
    };

    ElemeSlider.util.addClass = function(element, cls) {
        if (!ElemeSlider.util.hasClass(element,cls)) element.className += " "+cls;
    };

    ElemeSlider.util.hasClass = function(element, cls) {
        return element.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
    };

    ElemeSlider.util.removeClass = function(element, cls) {
        if (ElemeSlider.util.hasClass(element, cls)) {
            var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
            element.className = element.className.replace(reg, " ");
        }
    };

    ElemeSlider.util.addEvent = function(element, eventType, func) {
        if (element.attachEvent)
            return element.attachEvent('on' + eventType, func);
        else
            return element.addEventListener(eventType, func, false);
    };

    ElemeSlider.util.indexOf = function(element, list) {
        var len = list.length >>> 0;
        for (var i = 0; i < len; i++) {
            if (list[i] === element)
                return i;
        }
        return -1;
    };

    window.ElemeSlider = ElemeSlider;
})();
