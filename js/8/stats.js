function $(q, e = document) { return e.querySelector(q); }
function $$(q, e = document) { return e.querySelectorAll(q); }

$("#slide-speed").value = 0;
$("#slide-accel").value = 0;
$("#slide-weight").value = 0;
$("#slide-handle").value = 0;
$("#slide-trxn").value = 0;

$("#body").innerHTML += $("#body").innerHTML;
$("#wheel").innerHTML += $("#wheel").innerHTML;
$("#kite").innerHTML += $("#kite").innerHTML;

for(var img of $$("img:not([src])"))
    img.src = img.dataset.src;

function D(n, large = 0) {
    var q = S(n);
    var t = Math.floor(q);
    if(q == t)
        return q + ".-";
    return t + `<span style='font-size: ${large ? 'smaller' : 'xx-small'}'>` + (q - t).toString().slice(1) + "</span>"
}

const Y = {
    "WG": 0,    // Weight
    "AC": 1,    // Acceleration
    "ON": 2,    // On Road Traction
    "OF": 3,    // Off Toad Traction
    "MT": 4,    // Mini Turbo
    "SL": 5,    // Ground Speed
    "SW": 6,    // Water Speed
    "SG": 7,    // Air Speed
    "SA": 8,    // Anti Gravity Speed
    "TL": 9,    // Ground Handling
    "TW": 10,   // Water Handling
    "TG": 11,   // Air Handling
    "TA": 12,   // Anti Gravity Handling
    "IF": 13,   // Invincibility
}


var cache_combo = {};
var cache_combo_floor = {};
var cache_stats = {};
var cache_results = {};

var current_char, current_body, current_wheel, current_kite;
var last_build = JSON.parse(localStorage.getItem(V + "_combo") || '["Mario","StandardKart","Standard","SuperGlider"]');
[current_char, current_body, current_wheel, current_kite] = last_build;

var similar_builds_timeout = 0;
const IFRAMES = Boolean($("#stat-iframe"))

function calculate_this(char, body, wheel, kite) {
    var ls = Array(14);
    for(var i = 0; i < 13 + IFRAMES; i++)
        ls[i] = chars[char][i] + karts[body][i] + wheels[wheel][i] + kites[kite][i];
    if(!IFRAMES)
        ls.push(0);

    var weight = S(ls[Y.WG]);
    var accel = S(ls[Y.AC]);
    var trxn = S(ls[Y.OF]);
    var speed = S(ls[Y.SL]);
    var handle = S(ls[Y.TL]);

    return [speed, accel, weight, handle, trxn];
}

function get_name(img) {
    return img.dataset.src.split(/\//g).slice(-1)[0].split(".webp")[0];
}

function input_changed(natural = 0) {
    window.clearTimeout(similar_builds_timeout);
    $("#others").innerHTML = "";

    if(!natural) {
        for(var sel of $$(".select"))
            sel.classList.remove("select");
    }

    var block = $("#others")

    var speed, accel, weight, handle, trxn;
    var b_speed, b_accel, b_weight, b_handle, b_trxn;
    var z_char, z_kart, z_wheel, z_kite;

    var speed = Math.floor($("#slide-speed").value);
    var accel = Math.floor($("#slide-accel").value);
    var weight = Math.floor($("#slide-weight").value);
    var handle = Math.floor($("#slide-handle").value);
    var trxn = Math.floor($("#slide-trxn").value);

    var match_char = $("#match-char").checked;
    var match_kart = $("#match-kart").checked;
    var match_kite = $("#match-kite").checked;
    var match_wheel = $("#match-wheel").checked;

    var check_speed = !$("#check-speed").checked;
    var check_accel = !$("#check-accel").checked;
    var check_weight = !$("#check-weight").checked;
    var check_handle = !$("#check-handle").checked;
    var check_trxn = !$("#check-trxn").checked;

    var valid_chars = match_char ? [current_char] : Object.keys(chars);
    var valid_karts = match_kart ? [current_body] : Object.keys(karts);
    var valid_wheels = match_wheel ? [current_wheel] : Object.keys(wheels);
    var valid_kites = match_kite ? [current_kite] : Object.keys(kites);

    var cache_st = (match_char ? current_char : "_") + "+" +
                   (match_kart ? current_body : "_") + "+" +
                   (match_wheel ? current_wheel : "_") + "+" +
                   (match_kite ? current_kite : "_") + "+" +
                   (check_speed ? "_" : speed) + "+" +
                   (check_accel ? "_" : accel) + "+" +
                   (check_weight ? "_" : weight) + "+" +
                   (check_handle ? "_" : handle) + "+" +
                   (check_trxn ? "_" : trxn);

    var valid_combos = []
    if(!cache_results[cache_st] || $(".nuzlocke")) {
        if(match_char || match_kart || match_kite || match_wheel) {
            var ls = [];
            var ls_char = match_char ? [current_char] : Object.keys(chars);
            var ls_kart = match_kart ? [current_body] : Object.keys(karts);
            var ls_kite = match_kite ? [current_kite] : Object.keys(kites);
            var ls_wheel = match_wheel ? [current_wheel] : Object.keys(wheels);


            for(var char of ls_char) {
                for(var kart of ls_kart) {
                    for(var wheel of ls_wheel) {
                        for(var kite of ls_kite) {
                            ls.push(`${char}+${kart}+${wheel}+${kite}`);
                        }
                    }
                }
            }
        } else {
            var ls = Object.keys(cache_combo);
        }
        var time = new Date();
        $("#avoid-stall").style.display = "none";

        // Remove nuzlocke'd karts
        for(var c of $$("#char .nuzlocke"))
            if(valid_chars.includes(get_name(c)))
                valid_chars.splice(valid_chars.indexOf(get_name(c)), 1);
        for(var c of $$("#body .nuzlocke"))
            if(valid_karts.includes(get_name(c)))
                valid_karts.splice(valid_karts.indexOf(get_name(c)), 1);
        for(var c of $$("#wheel .nuzlocke"))
            if(valid_wheels.includes(get_name(c)))
                valid_wheels.splice(valid_wheels.indexOf(get_name(c)), 1);
        for(var c of $$("#kite .nuzlocke"))
            if(valid_kites.includes(get_name(c)))
                valid_kites.splice(valid_kites.indexOf(get_name(c)), 1);

        for(var stats in cache_stats) {
            [b_speed, b_accel, b_weight, b_handle, b_trxn] = stats.split(/\+/g);
            /*console.log(b_speed, "=", speed, ";", check_speed);
            console.log(b_accel, "=", accel, ";", check_accel);
            console.log(b_weight, "=", weight, ";", check_weight);
            console.log(b_handle, "=", handle, ";", check_handle);
            console.log(b_trxn, "=", trxn, ";", check_trxn);*/
            // console.log(stats);
            if(
                (check_speed || b_speed == speed) &&
                (check_accel || b_accel == accel) &&
                (check_weight || b_weight == weight) &&
                (check_handle || b_handle == handle) &&
                (check_trxn || b_trxn == trxn)
            ) {
                // console.warn("pass");
                for(var combo of cache_stats[stats]) {
                    [z_char, z_kart, z_wheel, z_kite] = combo.split(/\+/g);
                    if(!valid_chars.includes(z_char))
                        continue;
                    if(!valid_karts.includes(z_kart))
                        continue;
                    if(!valid_wheels.includes(z_wheel))
                        continue;
                    if(!valid_kites.includes(z_kite))
                        continue;
                    valid_combos.push(combo);
                }
            } else {
                // console.log("fail");
            }
        }
        cache_results[cache_st] = valid_combos;
    } else {
        valid_combos = cache_results[cache_st];
    }
    ls = valid_combos.slice(0);
    var completed_combos = []
    while(ls.length) {
        var i = Math.floor(Math.random() * ls.length);
        var combo = ls[i];
        ls.splice(i, 1);
        if(completed_combos.includes(combo))
            continue;
        completed_combos.push(combo);

        block.appendChild(add_build_compare(...combo.split(/\+/g), 1));

        if(block.children.length >= 64) {
            $("#avoid-stall").style.display = "";
            break;
        }
    }

    for(var sel of $$("#others .select"))
        sel.classList.remove("select");
    if(block.children.length == 0) {
        block.innerHTML = "<div>There were no matches with that set of criteria.<br>" +
                          "If you think your browser is stalled, this code shouldn't change between cycles: " +
                          Math.floor(Math.random() * 65536).toString(16).padStart(4, "0") +
                          ($(".nuzlocke") ? "<br><b>Perhaps a part of your build is killed by Nuzlocke.</b>" : "") +
                          "</div>";
    }

    $("#wait-for-done").style.display = "none";
    $("#just-a-sec").style.display = "none";
    $("body").classList.remove("loading");
}

function list_timeout() {
    $("body").classList.add("loading");
    $("#others").innerHTML = "";
    window.clearTimeout(similar_builds_timeout);
    similar_builds_timeout = window.setTimeout(input_changed, 500, 1);
    $("#wait-for-done").style.display = "";
    $("#avoid-stall").style.display = "none";
    $("#just-a-sec").style.display = "none";
}

function stat_value(q, v) {
    var e = $("#stat-" + q);
    e.value = Math.round(S(v) / 6 * 100) / 100;
    e.nextElementSibling.innerHTML = " " + D(v, 1);
}

function calculate() {
    var speed, accel, weight, handle, trxn;

    try {
        [speed, accel, weight, handle, trxn] = cache_combo[`${current_char}+${current_body}+${current_wheel}+${current_kite}`];
    } catch(err) {
        current_char = get_name($("#char .select"));
        current_body = get_name($("#body .select"));
        current_wheel = get_name($("#wheel .select"));
        current_kite = get_name($("#kite .select"));
        try {
            [speed, accel, weight, handle, trxn] = cache_combo[`${current_char}+${current_body}+${current_wheel}+${current_kite}`];
        } catch(err) {
            [speed, accel, weight, handle, trxn] = calculate_this(current_char, current_body, current_wheel, current_kite);
        }
    }


    localStorage.setItem(V + "_combo", JSON.stringify([current_char, current_body, current_wheel, current_kite]));
    $("#slide-speed").value = speed;
    $("#slide-accel").value = accel;
    $("#slide-weight").value = weight;
    $("#slide-handle").value = handle;
    $("#slide-trxn").value = trxn;


    var sums = new Array(14);
    for(var i = 0; i < 14; i++)
        sums[i] = chars[current_char][i] + karts[current_body][i] + wheels[current_wheel][i] + kites[current_kite][i];
    stat_value("weight", sums[Y.WG]);
    stat_value("accel", sums[Y.AC]);
    stat_value("trxn-on-road", sums[Y.ON]);
    stat_value("trxn-off-road", sums[Y.OF]);
    stat_value("mini-turbo", sums[Y.MT]);
    stat_value("speed-ground", sums[Y.SL]);
    stat_value("speed-water", sums[Y.SW]);
    stat_value("speed-anti-gravity", sums[Y.SA]);
    stat_value("speed-air", sums[Y.SG]);
    stat_value("handle-ground", sums[Y.TL]);
    stat_value("handle-water", sums[Y.TW]);
    stat_value("handle-anti-gravity", sums[Y.TA]);
    stat_value("handle-air", sums[Y.TG]);
    if(IFRAMES)
        stat_value("iframe", sums[Y.IF]);

    list_timeout();
}

function select_item(elem) {
    var parent = elem;
    while(parent.nodeName != "DIV")
        parent = parent.parentElement;
    for(var e of $$(".select", parent))
        e.classList.remove("select");
    elem.classList.add("select");


    try {
        elem_name = elem.className.includes("nuzlocke") ? "<s><i>&nbsp;" + elem.title + " </i></s>" : elem.title;
    } catch(err) {
        elem_name = "";
    }
    if(parent.id == "char") {
        current_char = get_name(elem);
        for(var alt of alts["body"])
            for(var q of $$(`#body [data-src*='/${alt}.webp']`))
                q.src = `./img/karts/body/alt/${alt}/${current_char}.webp`
        for(var alt of alts["kite"])
            for(var q of $$(`#kite [data-src*='/${alt}.webp']`))
                q.src = `./img/karts/kite/alt/${alt}/${current_char}.webp`
        $("#char-name span").innerHTML = elem_name;
        return calculate();
    }

    if(parent.id == "body") {
        current_body = get_name(elem);
        $("#body-name span").innerHTML = elem_name;
        for(var type in kart_classes) {
            if(kart_classes[type].includes(current_body))
                $("#kart-class").textContent = type;
        }
        scroll_column("body", current_body);
    }
    else if(parent.id == "wheel") {
        current_wheel = get_name(elem);
        $("#wheel-name span").innerHTML = elem_name;
        scroll_column("wheel", current_wheel);
    }
    else if(parent.id == "kite") {
        current_kite = get_name(elem);
        $("#kite-name span").innerHTML = elem_name;
        scroll_column("kite", current_kite);
    }

    return calculate();
}

function scroll_column(column_name, item) {
    var column = $("#" + column_name);
    var n = column.children.length / 2;
    while(!column.children[n].dataset.src.includes("/" + item + ".webp"))
        column.prepend(column.lastElementChild);
    column.children[n].classList.add("select");
    $("#" + column_name + "-name span").innerHTML = column.children[n].title;
    column.scrollTop = (n - 1) * 128;

    if(column_name == "body") {
        for(var type in kart_classes) {
            if(kart_classes[type].includes(current_body))
                $("#kart-class").textContent = type;
        }
    }
}

function reset_selection() {
    for(var e of $$(".select"))
        e.classList.remove("select");

    scroll_column("body", current_body);
    scroll_column("wheel", current_wheel);
    scroll_column("kite", current_kite);

    $(`[data-src*='/${current_char}.webp']`).classList.add("select");
    $("#char-name span").innerHTML = $(`[data-src*='/${current_char}.webp']`).title;

    for(var alt of alts["body"])
        for(var q of $$(`#body [data-src*='/${alt}.webp']`))
            q.src = `./img/karts/body/alt/${alt}/${current_char}.webp`
    for(var alt of alts["kite"])
        for(var q of $$(`#kite [data-src*='/${alt}.webp']`))
            q.src = `./img/karts/kite/alt/${alt}/${current_char}.webp`
}

function select_match(elem = 0) {
    for(var sel of $$(".select"))
        sel.classList.remove("select");

    if(elem) {
        var row = elem.parentElement.parentElement;
        current_char = get_name(row.children[0].children[0]);
        current_body = get_name(row.children[1].children[0]);
        current_wheel = get_name(row.children[2].children[0]);
        current_kite = get_name(row.children[3].children[0]);
    } else {
        // [current_char, current_body, current_wheel, current_kite] = last_build;
    }

    for(var elem of $$("#others tr"))
        elem.remove();

    window.setTimeout(reset_selection, 50);
    calculate();
}


function similar_groups(blocks) {
    var used = [];
    var group = [];
    var ls_blocks = Object.keys(blocks);
    var st_blocks = {}
    for(var block in blocks) {
        st_blocks[block] = JSON.stringify(blocks[block]);
    }
    console.log(blocks);
    for(var block of ls_blocks) {
        if(used.includes(block))
            continue;
        console.group(block);
        var ls = [block];
        var st = st_blocks[block];
        for(var block2 of ls_blocks.slice(ls_blocks.indexOf(block) + 1)) {
            if(st == st_blocks[block2]) {
                ls.push(block2);
                used.push(block2);
                console.log(block2);
            }
        }
        console.groupEnd(block);
        group.push(ls);
    }

    return group;
}

var group_chars = [], group_karts = [], group_wheels = [], group_kites = [];
var g_char_n = 0, g_kart_n = 0, g_wheel_n = 0, g_kite_n = 0;
var group_stats = []

function group_cache_fill(char_set, kart_set, wheel_set, kite_set) {
    var ls = calculate_this(char_set[0], kart_set[0], wheel_set[0], kite_set[0]);
    var ls2 = [Math.floor(ls[0]), Math.floor(ls[1]), Math.floor(ls[2]), Math.floor(ls[3]), Math.floor(ls[4])];
    var st = ls2.join("+");
    group_stats.push([g_char_n, g_kart_n, g_wheel_n, g_kite_n, ls]);
    if(!cache_stats[st])
        cache_stats[st] = [];

    for(var char of char_set) {
        for(var kart of kart_set) {
            for(var wheel of wheel_set) {
                for(var kite of kite_set) {
                    var combo = `${char}+${kart}+${wheel}+${kite}`;
                    cache_combo[combo] = ls;
                    cache_combo_floor[combo] = ls2;
                    cache_stats[st].push(combo);
                }
            }
        }
    }
}

function generate_cache() {
    console.time("Grouping");
    group_chars = similar_groups(chars);
    group_karts = similar_groups(karts);
    group_wheels = similar_groups(wheels);
    group_kites = similar_groups(kites);
    console.timeEnd("Grouping");
    console.time("Calculating");
    g_char_n = 0;
    for(var char_set of group_chars) {
        g_kart_n = 0;
        for(var kart_set of group_karts) {
            g_wheel_n = 0;
            for(var wheel_set of group_wheels) {
                g_kite_n = 0;
                for(var kite_set of group_kites) {
                    group_cache_fill(char_set, kart_set, wheel_set, kite_set)
                    g_kite_n++;
                }
                g_wheel_n++;
            }
            g_kart_n++;
        }
        g_char_n++;
    }
    console.timeEnd("Calculating");
    select_match();
    store_cache();
    console.warn(Object.keys(cache_combo).length, "combinations")
    $("#init").style.display = "none";

}

function begin_retrieve() {
    V_cache = localStorage.getItem("mkzx_cache_" + V + "_time") || 0
    if(Number(new Date()) - V_cache >= 3600000 || !localStorage.getItem("mkzx_cache_" + V + "_group")) // 1hr
        return generate_cache();
    console.time("Retrieving cache");
    restore_cache();
    if(Object.keys(cache_combo).length == 0)
        return generate_cache();
    select_match();
}

var LAST_ELEM = null;
window.onkeyup = (evt) => {
    if(evt.key == 'Enter')
        input_changed(1);
}
window.onkeydown = (evt) => {
    if(!LAST_ELEM)
        return

    if(["body", "wheel", "kite"].includes(LAST_ELEM.id)) {
        if(evt.key == 'ArrowUp') {
            evt.preventDefault();
            LAST_ELEM.classList.add("x-hover");
            return $("#" + LAST_ELEM.id + " img:has(+ img.select)").click();
        }

        if(evt.key == 'ArrowDown') {
            evt.preventDefault();
            LAST_ELEM.classList.add("x-hover");
            return $("#" + LAST_ELEM.id + " img.select + img").click();
        }

        if(evt.key == 'ArrowLeft' || (evt.key == 'Tab' && evt.shiftKey)) {
            switch(LAST_ELEM.id) {
                case "char":
                    evt.preventDefault();
                    return $("#kite").click();
                case "body":
                    evt.preventDefault();
                    return $("#char").click();
                case "wheel":
                    evt.preventDefault();
                    return $("#body").click();
                case "kite":
                    evt.preventDefault();
                    return $("#wheel").click();
            }
        }

        if(evt.key == 'ArrowRight' || (evt.key == 'Tab' && !evt.shiftKey)) {
            switch(LAST_ELEM.id) {
                case "char":
                    evt.preventDefault();
                    return $("#body").click();
                case "body":
                    evt.preventDefault();
                    return $("#wheel").click();
                case "wheel":
                    evt.preventDefault();
                    return $("#kite").click();
                case "kite":
                    evt.preventDefault();
                    return $("#char").click();
            }
        }
    }

    if(LAST_ELEM.id == "char") {
        var sel = $("#char .select");

        if(evt.key == 'ArrowLeft') {
            if(sel.previousElementSibling) {
                evt.preventDefault();
                return sel.previousElementSibling.click();
            }
            if(sel.parentElement.previousElementSibling) {
                evt.preventDefault();
                return sel.parentElement.previousElementSibling.querySelector("img:last-child").click();
            }
        }

        if(evt.key == 'ArrowRight') {
            if(sel.nextElementSibling) {
                evt.preventDefault();
                return sel.nextElementSibling.click();
            }
            if(sel.parentElement.nextElementSibling) {
                evt.preventDefault();
                return sel.parentElement.nextElementSibling.querySelector("img:first-child").click();
            }
        }

        if(evt.key == 'ArrowDown') {
            if(sel.nextElementSibling) {
                evt.preventDefault();
                return sel.nextElementSibling.click();
            }
            if(sel.parentElement.parentElement.nextElementSibling) {
                evt.preventDefault();
                return sel.parentElement.parentElement.nextElementSibling.cells[sel.parentElement.cellIndex].querySelector("img:first-child").click();
            }
        }

        if(evt.key == 'ArrowUp') {
            if(sel.previousElementSibling) {
                evt.preventDefault();
                return sel.previousElementSibling.click();
            }
            if(sel.parentElement.parentElement.previousElementSibling) {
                evt.preventDefault();
                return sel.parentElement.parentElement.previousElementSibling.cells[sel.parentElement.cellIndex].querySelector("img:last-child").click();
            }
        }

        if(evt.key == 'Tab' && evt.shiftKey) {
            evt.preventDefault();
            return $("#kite").click();
        }

        if(evt.key == 'Tab' && !evt.shiftKey) {
            evt.preventDefault();
            return $("#body").click();
        }
    }
}
window.onclick = (evt) => {
    if($(".x-hover"))
        $(".x-hover").classList.remove("x-hover")
    var parent = evt.originalTarget;
    while(parent != null) {
        if(["char", "body", "wheel", "kite"].includes(parent.id)) {
            parent.classList.add("x-hover");
            return LAST_ELEM = parent;
        }
        parent = parent.parentElement;
    }
    LAST_ELEM = null;
}

var scrolled_elem = {
    "body": null,
    "wheel": null,
    "kite": null
};
var scroll_timeout = {
    "body": 0,
    "wheel": 0,
    "kite": 0
}
function select_scroll(evt) {
    var column = evt.currentTarget;
    column_rect = column.getBoundingClientRect();
    for(var elem of column.children) {
        var elem_rect = elem.getBoundingClientRect();
        var diff = column_rect.top - elem_rect.top;
        if(Math.abs(diff) <= elem_rect.height * 1.5 && diff < 0)
            scrolled_elem[column.id] = elem;
    }
    window.clearTimeout(scroll_timeout[column.id]);
    scroll_timeout[column.id] = window.setTimeout(select_item, 50, scrolled_elem[column.id]);
}

function restore_cache() {
    try {
        [group_chars, group_karts, group_wheels, group_kites] = JSON.parse(localStorage.getItem("mkzx_cache_" + V + "_group"));
        group_stats = JSON.parse(localStorage.getItem("mkzx_cache_" + V + "_cache"));
    } catch(err) {
        console.log("Failed");
        console.timeEnd("Retrieving cache");
        return generate_cache();
    }
    var st = "", ls = [], ls2 = [];;
    var n = 0;
    for(var stat of group_stats) {
        [g_char_n, g_kart_n, g_wheel_n, g_kite_n, ls] = stat;
        ls2 = [Math.floor(ls[0]), Math.floor(ls[1]), Math.floor(ls[2]), Math.floor(ls[3]), Math.floor(ls[4])];
        st = ls2.join("+");
        if(!cache_stats[st])
            cache_stats[st] = [];

        for(var char of group_chars[g_char_n]) {
            for(var kart of group_karts[g_kart_n]) {
                for(var wheel of group_wheels[g_wheel_n]) {
                    for(var kite of group_kites[g_kite_n]) {
                        combo = `${char}+${kart}+${wheel}+${kite}`;
                        cache_combo[combo] = ls;
                        cache_combo_floor[combo] = ls2;
                        cache_stats[st].push(combo);
                        n++;
                    }
                }
            }
        }

    }
    console.log("Success");
    console.timeEnd("Retrieving cache");
    console.log(n, "combinations")
    $("#init").style.display = "none";
}
function store_cache() {
    localStorage.setItem("mkzx_cache_" + V + "_time", Number(new Date()));
    localStorage.setItem("mkzx_cache_" + V + "_group", JSON.stringify([
        group_chars,
        group_karts,
        group_wheels,
        group_kites
    ]));
    localStorage.setItem("mkzx_cache_" + V + "_cache", JSON.stringify(group_stats))
}

function save_nuzlocke() {
    nz_store = {
        "char": [],
        "body": [],
        "wheel": [],
        "kite": []
    }
    for(var nuz of $$("#char .nuzlocke"))
        if(!nz_store["char"].includes(nuz.title))
            nz_store["char"].push(nuz.title);

    for(var nuz of $$("#body .nuzlocke"))
        if(!nz_store["body"].includes(nuz.title))
            nz_store["body"].push(nuz.title);

    for(var nuz of $$("#wheel .nuzlocke"))
        if(!nz_store["wheel"].includes(nuz.title))
            nz_store["wheel"].push(nuz.title);

    for(var nuz of $$("#kite .nuzlocke"))
        if(!nz_store["kite"].includes(nuz.title))
            nz_store["kite"].push(nuz.title);

    localStorage.setItem("mkzx_" + V + "_nuzlocke", JSON.stringify(nz_store))
}

function nuzlocke(option, mode) {
    if(mode == -1) { // Reset
        for(var killed of $$(".nuzlocke"))
            killed.classList.remove("nuzlocke");
        return save_nuzlocke();
    }
    if(option == "all") {
        nuzlocke("char", mode);
        nuzlocke("body", mode);
        nuzlocke("wheel", mode);
        nuzlocke("kite", mode);
        return;
    }

    if(mode == 0) { // Kill
        $("#nuzlocke-kill").value = "-";
        var item = $(`#${option} .select`);
        for(var nuz of $$(`#${option} img[title="${item.title}"]`))
            nuz.classList.add("nuzlocke");
        nuzlocke(option, 2);
        return save_nuzlocke();
    }
    if(mode == 1) { // Resurrect
        $("#nuzlocke-resurrect").value = "-";
        var item = $(`#${option} .select`);
        for(var nuz of $$(`#${option} img[title="${item.title}"]`))
            nuz.classList.remove("nuzlocke");
        return save_nuzlocke();
    }

    $("#nuzlocke-rng").value = "-";
    group = $$(`#${option} img:not(.nuzlocke)`)
    try {
        group[Math.floor(Math.random() * group.length)].click();
    } catch(err) {
        if(confirm("And that's it! Want to reset the nuzlocke challenge?"))
            return nuzlocke(0, -1);
    }

}

function random_kart() {
    var columns = [
        $("#body"),
        $("#wheel"),
        $("#kite")
    ]
    for(var column of columns) {
        var y = Math.floor(Math.random() * column.children.length);
        for(var x = 0; x < y; x++)
            column.prepend(column.lastElementChild);
        column.children[1].click();
    }

    var ls = $$("#char img");
    ls[Math.floor(Math.random() * ls.length)].click();
}

function similar_or_compare() {
    if($("#build-compare").checked == false) {
        $("#build-similar").checked = true;
        $("#compare-builds").style.display = "none";
        $("#similar-builds").style.display = "";
        return;
    }
    $("#build-compare").checked = true;
    $("#compare-builds").style.display = "";
    $("#similar-builds").style.display = "none";
}

current_compare = JSON.parse(localStorage.getItem("mkzx_compare_" + V) || "[]");

function store_compare() {
    current_compare = [];
    for(var compared of $("#compared").children) {
        imgs = compared.querySelectorAll("img");
        var char_name = get_name(imgs[2]);
        var kart_name = get_name(imgs[3]);
        var wheel_name = get_name(imgs[4]);
        var kite_name = get_name(imgs[5]);
        current_compare.push([char_name, kart_name, wheel_name, kite_name]);
    }
    localStorage.setItem("mkzx_compare_" + V, JSON.stringify(current_compare));
}

function remove_compare(evt) {
    evt.currentTarget.parentElement.parentElement.remove()
    store_compare();
}

var img_elems = {
    "char": {},
    "body": {},
    "wheel": {},
    "kite": {}
}
function generate_image_dict() {
    for(var p in chars) {
        var elem = $(`#char img[data-src*='/${p}.webp']`);
        var name = get_name(elem);
        var html = `<img class="char-img compare" data-src="${elem.dataset.src}" title="${elem.title}" src="${elem.src}"/><br>`;
        img_elems["char"][p] = [elem, name, html];
    }
    for(var p in karts) {
        var elem = $(`#body img[data-src*='/${p}.webp']`);
        var name = get_name(elem);
        var html = `<img class="char-img compare" data-src="${elem.dataset.src}" title="${elem.title}" src="${elem.src}"/><br>`;
        img_elems["body"][p] = [elem, name, html];
    }
    for(var p in wheels) {
        var elem = $(`#wheel img[data-src*='/${p}.webp']`);
        var name = get_name(elem);
        var html = `<img class="char-img compare" data-src="${elem.dataset.src}" title="${elem.title}" src="${elem.src}"/><br>`;
        img_elems["wheel"][p] = [elem, name, html];
    }
    for(var p in kites) {
        var elem = $(`#kite img[data-src*='/${p}.webp']`);
        var name = get_name(elem);
        var html = `<img class="char-img compare" data-src="${elem.dataset.src}" title="${elem.title}" src="${elem.src}"/>`;
        img_elems["kite"][p] = [elem, name, html];
    }
}

generate_image_dict();
var card_parser = new DOMParser();

function add_build_compare(w_char, w_body, w_wheel, w_kite, skip = 0) {
    if($("#compared").children.length >= 32) {
        return window.alert("You can only compare 32 karts at once. Delete a few to continue.")
    }
    if(!w_char)
        w_char = get_name($("#char .select"));
    if(!w_body)
        w_body = get_name($("#body .select"));
    if(!w_wheel)
        w_wheel = get_name($("#wheel .select"));
    if(!w_kite)
        w_kite = get_name($("#kite .select"));

    var elem_char, elem_kart, elem_wheel, elem_kite;
    var char_name, kart_name, wheel_name, kite_name;
    var char_html, kart_html, wheel_html, kite_html;

    [elem_char, char_name, char_html] = img_elems["char"][w_char];
    [elem_kart, kart_name, kart_html] = img_elems["body"][w_body];
    [elem_wheel, wheel_name, wheel_html] = img_elems["wheel"][w_wheel];
    [elem_kite, kite_name, kite_html] = img_elems["kite"][w_kite];

    var sums = new Array(14);
    for(var i = 0; i < 14; i++)
        sums[i] = chars[char_name][i] + karts[kart_name][i] + wheels[wheel_name][i] + kites[kite_name][i];

    var card_elem = card_parser.parseFromString(`\
<div style="display: flex" class="compare-contain">
    <div>
        <img class="compare" data-src="../img/rm-compare.svg" title="Remove build" src="../img/rm-compare.svg" onclick="remove_compare(event)"/>
        <img class="compare" data-src="../img/sel-compare.svg" title="Select build" src="../img/sel-compare.svg" onclick="compare_select(event)"/><br>
        ${char_html} ${kart_html} ${wheel_html} ${kite_html}
    </div>
    <div>
        <table>
            <tr>
                <td><b>Speed:</b> Ground</td>
                <td><progress value="${S(sums[Y.SL]) / 6}" q="SL"></progress></td>
                <td> ${D(sums[Y.SL])}</td>
            </tr>
            <tr>
                <td><b>Speed:</b> Water</td>
                <td><progress value="${S(sums[Y.SW]) / 6}" q="SW"></progress></td>
                <td>${D(sums[Y.SW])}</td>
            </tr>
            <tr>
                <td><b>Speed:</b> Air</td>
                <td><progress value="${S(sums[Y.SG]) / 6}" q="SG"></progress></td>
                <td>${D(sums[Y.SG])}</td>
            </tr>
            <tr>
                <td><b>Speed:</b> Anti-Grav</td>
                <td><progress value="${S(sums[Y.SA]) / 6}" q="SA"></progress></td>
                <td>${D(sums[Y.SA])}</td>
            </tr>
            <tr>
                <td class="hr" colspan="3">&nbsp;</td>
            </tr>
            <tr>
                <td><b>Acceleration</b></td>
                <td><progress value="${S(sums[Y.AC]) / 6}" q="AC"></progress></td>
                <td>${D(sums[Y.AC])}</td>
            </tr>
            <tr>
                <td class="hr" colspan="3">&nbsp;</td>
            </tr>
            <tr>
                <td><b>Weight</b></td>
                <td><progress value="${S(sums[Y.WG]) / 6}" q="WG"></progress></td>
                <td>${D(sums[Y.WG])}</td>
            </tr>
            <tr>
                <td class="hr" colspan="3">&nbsp;</td>
            </tr>
            <tr>
                <td><b>Handle:</b> Ground</td>
                <td><progress value="${S(sums[Y.TL]) / 6}" q="TL"></progress></td>
                <td> ${D(sums[Y.TL])}</td>
            </tr>
            <tr>
                <td><b>Handle:</b> Water</td>
                <td><progress value="${S(sums[Y.TW]) / 6}" q="TW"></progress></td>
                <td>${D(sums[Y.TW])}</td>
            </tr>
            <tr>
                <td><b>Handle:</b> Air</td>
                <td><progress value="${S(sums[Y.TG]) / 6}" q="TG"></progress></td>
                <td>${D(sums[Y.TG])}</td>
            </tr>
            <tr>
                <td><b>Handle:</b> Anti-Grav</td>
                <td><progress value="${S(sums[Y.TA]) / 6}" q="TA"></progress></td>
                <td>${D(sums[Y.TA])}</td>
            </tr>
            <tr>
                <td class="hr" colspan="3">&nbsp;</td>
            </tr>
            <tr>
                <td><b>Traction:</b> On Road</td>
                <td><progress value="${S(sums[Y.ON]) / 6}" q="ON"></progress></td>
                <td>${D(sums[Y.ON])}</td>
            </tr>
            <tr>
                <td><b>Traction:</b> Off Road</td>
                <td><progress value="${S(sums[Y.OF]) / 6}" q="OF"></progress></td>
                <td>${D(sums[Y.OF])}</td>
            </tr>
            <tr>
                <td class="hr" colspan="3">&nbsp;</td>
            </tr>
            <tr>
                <td><b>Mini Turbo</b></td>
                <td><progress value="${S(sums[Y.MT]) / 6}" q="MT"></progress></td>
                <td>${D(sums[Y.MT])}</td>
            </tr>
            <tr ${IFRAMES ? '' : "style='display: none'"}>
                <td class="hr" colspan="3">&nbsp;</td>
            </tr>
            <tr ${IFRAMES ? '' : "style='display: none'"}>
                <td><b>Invincibility</b></td>
                <td><progress value="${S(sums[Y.IF]) / 6}" q="IF"></progress></td>
                <td>${D(sums[Y.IF])}</td>
            </tr>
        </table>
    </div>
</div>`, "text/html");

    var card = $(".compare-contain", card_elem);
    // console.log(card_elem);
    if(alts["kite"].includes(kite_name))
        $("img:last-child", card).src = `./img/karts/kite/alt/${kite_name}/${char_name}.webp`;
    if(alts["body"].includes(kart_name))
        $("img:nth-child(6)", card).src = `./img/karts/body/alt/${kart_name}/${char_name}.webp`;

    if(skip == 1)
        return card;
    $("#compared").appendChild(card);
    if(skip == 2)
        return

    store_compare();
    localStorage.setItem("mkzx_compare_" + V, JSON.stringify(current_compare));
}

function compare_select(evt) {
    imgs = evt.currentTarget.parentElement.querySelectorAll("img");
    current_char = get_name(imgs[2]);
    current_body = get_name(imgs[3]);
    current_wheel = get_name(imgs[4]);
    current_kite = get_name(imgs[5]);
    select_match();
}

function delete_compared_builds() {
    if(!window.confirm("Are you sure? You cannot undo this action."))
        return
    for(var compared of $$(".compare-contain"))
        compared.remove();
    store_compare();
}

similar_or_compare();

for(var compare of current_compare) {
    if(compare.length != 4)
        continue
    if(!chars[compare[0]] || !karts[compare[1]] || !wheels[compare[2]] || !kites[compare[3]])
        continue
    add_build_compare(...compare, 2);
}

for(var q of $$("input + label")) {
    q.onclick = (evt) => { evt.currentTarget.previousElementSibling.click(); }
}

var nz_store = JSON.parse(localStorage.getItem("mkzx_" + V + "_nuzlocke") || `{"char":[],"body":[],"wheel":[],"kite":[]}`);
for(var group in nz_store) {
    for(var title of nz_store[group]) {
        for(var item of $$(`#${group} img[title="${title}"]`))
            item.classList.add("nuzlocke");
    }
}

function prepare_scroll() {
    $("#body").onscroll = (evt) => select_scroll(evt);
    $("#wheel").onscroll = (evt) => select_scroll(evt);
    $("#kite").onscroll = (evt) => select_scroll(evt);
}

begin_retrieve();

window.setTimeout(prepare_scroll, 100);

$("#nuzlocke-rng").value = "-";
$("#nuzlocke-kill").value = "-";
$("#nuzlocke-resurrect").value = "-";

if(!window.navigator.userAgent.includes("Firefox")) {
    $("#logo").outerHTML += `<div class="shill yellow">
<b>Note:</b> This tool works best in Firefox, and is largely untested in chrome. Please consider switching.
</div>`;
}
