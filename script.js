'use strict'
const maxsettings = {
    "sizeX": 50,
    "sizeY": 50,
    "countstep": 30,
    "default": 30
};

class Game {

    constructor() {

        document.getElementById('submit').onclick = this.submit.bind(this);
        document.getElementById("sizeX").onkeyup = this.form.bind(this);
        document.getElementById("sizeY").onkeyup = this.form.bind(this);
        document.getElementById("countstep").onkeyup = this.form.bind(this);
        document.getElementById("default").onchange = this.set_ini.bind(this);

        this.default = new Map([
            ["sizeX", "20"],
            ["sizeY", "5"],
            ["countstep", "20"],
            ["default", "20"]
        ]);
        this.ini = new Map(this.default);
        this.count_games = 0;
        this.win = 0;

    }
    submit() {
        document.getElementById("setings").style.display = "none";
        this.init();
        this.start();
    }
    form() {
        this.validator();
    }
    resizeObserver = new ResizeObserver(entries => {
        console.log("resize win");
        let elem = document.getElementById("area_game");
        // debugger;

        this.search_siZe();
        this.set_pos_aside(document.getElementById("desc"))
    });
    set_ini() {
        console.log(this.ini);
        let value = event.target.value;
        this.ini.set("sizeX", value);
        this.ini.set("sizeY", value);
        this.ini.set("countstep", value);

    }
    set_stat() {
        console.log("set stat");
        document.getElementById("spiels").getElementsByTagName("span")[0].innerHTML = this.count_games;
        document.getElementById("win").getElementsByTagName("span")[0].innerHTML = this.win;
    }
    validator() {
        let id = event.target.id;
        let val = event.target.value;
        let valMax = maxsettings[id];
        if (id === "default") this.ini = this.default;
        if (!val.match(/\d/)) {
            alert('должно стоять числовое значение(только цифры)!');
        } else if (!(parseInt(val) <= valMax)) {
            alert("слишком большое значение");
            return false;
        } else {
            this.ini.set(id, val);
        }
    }
    init() {
        this.ini = new Map(this.ini, this.default);
        this.sizeX = parseInt(this.ini.get('sizeX'));
        this.sizeY = parseInt(this.ini.get('sizeY'));
        this.countstep = parseInt(this.ini.get('countstep'));

        this.border = 4;
        let elem = document.getElementById("area_game");
        elem.innerHTML = " <section id='game'> </section>  <section id = 'control'> <button id='restart'>с начала</button> <button id='new'>new game</button></section > ";
        this.search_siZe();
        this.restart_game()

    }
    restart_game() {
        this.count_games += 1;
        this.set_stat();
        this.real_step = 0;
        this.key = false;
        this.next_step = true;
        this.finish = {
            posX: 0,
            posY: 0
        }
    }
    search_siZe() {
        function getInt(params) {
            return Math.floor(parseInt(params.replace(/[^0-9]/g, "")) / (this.sizeX + 2));
        }
        // debugger;
        let width = window.getComputedStyle(document.getElementById("game"), null).width;
        width = Number.isNaN(width) ? getInt(width) : document.documentElement.clientWidth;
        let height = window.getComputedStyle(document.getElementById("game"), null).height;
        height = Number.isNaN(height) ? getInt(height) : document.documentElement.clientHeight;

        let coun_cs_lines = (this.countstep / this.sizeX);
        let delta_for_controlX = (coun_cs_lines + this.sizeY) * (this.border * 2.5 + coun_cs_lines);
        let delta_for_controlY = (this.sizeX) * (this.border * 2.5);
        height = Math.floor((height - delta_for_controlX) / (this.sizeY + 2 + coun_cs_lines + 1));
        width = Math.floor((width - delta_for_controlY) / (this.sizeX + 1))
        this.baseSize = Math.min(width, height);
        console.log(this.baseSize);
        var html = document.getElementsByTagName('html')[0];
        html.style.setProperty("--main-size", this.baseSize + "px");
        html.style.setProperty("--border", this.border + "px");
    }

    randomInteger(min, max) {
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }

    creatorHTML() {
        let out = "";
        const posX = (this.randomInteger(1, this.sizeX));
        const posY = (this.randomInteger(1, this.sizeY));
        this.finish.posY = posY;
        this.finish.posX = posX;
        out += "<div id='header'><ul>"
        for (let i = 0; i < this.sizeX; i += 1) {
            out += "<li>" + String.fromCharCode(i + 65) + "</li>"
        }
        out += "</ul></div>"
        out += "<div id='desc'>"
        for (let i = 1; i < this.sizeY + 1; i += 1) {
            out += "<ul>"
            for (let j = 1; j < this.sizeX + 1; j += 1) {
                let posstart = "";
                if ((j === posX) && (i === posY)) {
                    posstart = "class='start' ";
                }
                out += "<li " + posstart + "></li>"
            }
            out += "</ul>"
        }
        out += "</div><div id='aside'><ul>"
        for (let i = 0; i < this.sizeY; i += 1) {
            out += "<li>" + (i + 1) + "</li>"
        }
        out += "</ul></div>"
        out += "<div id='over_step'>";
        out += "<ul id='step'>"
        for (let j = 1; j < this.countstep + 1; j += 1) {
            out += "<li></li>"
        }
        out += "</ul>"
        out += "</div>";

        let elem = document.getElementById("game");
        elem.innerHTML = out;
        this.observer();
        this.set_elem();
    }

    set_elem() {
        this.elem = document.getElementById('step').childNodes;
    }
    get_elem() {
        return this.elem;
    }
    step_by_step() {
        let stepOk = false;
        this.next_step = false;
        let posX = this.finish.posX;
        let posY = this.finish.posY;
        while (!stepOk) {
            let steps = this.randomInteger(1, 4);
            switch (steps) {
                case 1: {
                    if ((posX - 1) < 1) {
                        stepOk = false;
                    } else {
                        stepOk = "left";
                        posX = posX - 1;
                    }
                } break;
                case 2: {
                    if ((posX + 1) > this.sizeX) {
                        stepOk = false;
                    } else {
                        stepOk = "right";
                        posX = posX + 1;
                    }
                } break;
                case 3: {
                    if ((posY - 1) < 1) {
                        stepOk = false;
                    } else {
                        stepOk = "up";
                        posY = posY - 1;
                    }
                } break;
                case 4: {
                    if ((posY + 1) > this.sizeY) {
                        stepOk = false;
                    } else {
                        stepOk = "down";
                        posY = posY + 1;
                    }
                } break;
            }
        }
        this.finish.posX = posX;
        this.finish.posY = posY;
        this.get_elem()[this.real_step].setAttribute("class", stepOk);
        this.real_step = this.real_step + 1;
    }

    control_true_key(direction) {
        switch (event.type) {
            case "keydown":
                if (!this.key) {
                    this.key = event.keyCode;
                    if (this.get_elem()[this.real_step - 1].getAttribute("class") === direction) {
                        this.get_elem()[this.real_step - 1].setAttribute("style", "background-color: green");
                    } else {
                        this.get_elem()[this.real_step - 1].setAttribute("style", "background-color: red");
                    }
                } break;
            case "keyup": {
                if (this.key) {
                    let tt = this.get_elem()[this.real_step - 1].style.backgroundColor;
                    if (tt === 'green') this.next_step = true;
                    this.key = false;
                    this.get_elem()[this.real_step - 1].removeAttribute("style");
                }
            } break;
            default: break;
        }
    }
    control_event() {
        switch (event.keyCode) {
            case 37: {
                this.control_true_key("left")
            } break;
            case 38:
                this.control_true_key("up")
                break;
            case 39:
                this.control_true_key("right")
                break;
            case 40:
                this.control_true_key("down")
                break;
        }
    }
    next_step() {
        if (this.real_step <= this.countstep) {
            this.step_by_step();
            return true;
        }
        return false;
    }
    step_next() {
        this.control_event();
        if (this.real_step < this.countstep) {
            if (this.next_step) this.step_by_step();
        }
    }
    start() {
        console.log(this.count_games + " -- " + this.win);

        this.creatorHTML();
        this.step_by_step();
        document.onkeydown = this.control_event.bind(this);
        document.onkeyup = this.step_next.bind(this);

        this.gameAreaVisible();
        var elem = document.getElementById("desc");
        this.set_pos_aside(elem);

        elem.onclick = step.bind(this);

            function step (e) {
            function hasClass(el, className) {
                if (el.classList)
                    return el.classList.contains(className);
                return false;
            }

            function addClass(el, className) {
                if (el.classList)
                    el.classList.add(className)
                else if (!hasClass(el, className))
                    el.className += " " + className;
            }

            function removeClass(el, className) {
                if (el.classList)
                    el.classList.remove(className)
                else if (hasClass(el, className)) {
                    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                    el.className = el.className.replace(reg, ' ');
                }
            }

            function toggleclass(el, className) {
                if (hasClass(el, className)) {
                    removeClass(el, className)
                    return;
                } else {
                    addClass(el, className);
                }
            }

            var li = event.srcElement || e.target;
            while (li.tagName != "LI" && li) {
                li = li.parentNode;
            }

            var win = document.getElementById("desc").children[game.finish.posY - 1].children[game.finish.posX - 1];
            if (li === win) {
                this.win += 1;
                this.set_stat();
                let counter = 0;
                const intervalId = setInterval(() => {
                    toggleclass(li, "win")
                    counter += 1;
                    if (counter === 6) {
                        clearInterval(intervalId);
                    }
                }, 500);

            } else {
                let counter = 0;
                const intervalId = setInterval(() => {
                    toggleclass(li, "loss")
                    counter += 1;
                    if (counter === 5) {
                        clearInterval(intervalId);
                    }
                }, 500);
                setTimeout(() => {
                    var win = document.getElementById("desc").children[game.finish.posY - 1].children[game.finish.posX - 1];

                    let counter = 0;
                    const intervalId = setInterval(() => {
                        toggleclass(win, "win")
                        counter += 1;
                        if (counter === 5) {
                            clearInterval(intervalId);
                        }
                    }, 500);} , 3000);
              
                // Привет, Джон
            };
        };
    }
    set_pos_aside(elem) {
        // 
        var style = window.getComputedStyle(elem, null);
        if (this.countstep > this.sizeX) {
            let width_desc = style.width;
            document.getElementById("step").style.width = width_desc;
        }
        var coord_desc = elem.getBoundingClientRect();
        // debugger;
        document.getElementById("aside").style.left = "" + (-this.baseSize + this.border) + "px";
        document.getElementById("aside").style.top = "" + (coord_desc.y + this.border / 4) + "px";
        document.getElementById("aside").style.height = coord_desc.height - this.border / 2 + "px";
        // console.log(coord_desc);
    }

    clear() {
        document.getElementById("area_game").innerHTML = "";
    }
    gameAreaVisible() {
        document.getElementById("area_game").style.display = "block";
    }
    gameAreaHidden() {
        document.getElementById("area_game").style.display = "none";
    }
    observer() {
        function new_game() {
            this.clear();
            document.getElementById("setings").style.display = "block";
        }
        function restart() {
            this.restart_game();
            this.start();
        }
        document.getElementById('new').onclick = new_game.bind(this);
        document.getElementById('restart').onclick = restart.bind(this);
        this.resizeObserver.observe(window.document.getElementById('root'));
    }

}



const game = new Game();
