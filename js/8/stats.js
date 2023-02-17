function $(q, e = document) { return e.querySelector(q); }
function $$(q, e = document) { return e.querySelectorAll(q); }

$("#slide-speed").value = 0;
$("#slide-accel").value = 0;
$("#slide-weight").value = 0;
$("#slide-handle").value = 0;
$("#slide-trxn").value = 0;

for(var img of $$("img:not([src])"))
    img.src = img.dataset.src;

const Y = {
    "WG": 0,    // Weight
    "AC": 1,    // Acceleration
    "ON": 2,    // On Road Traction
    "OF": 3,    // Off Toad Traction
    "MT": 4,    // Mini Turbo
    "SL": 5,    // Ground Speed
    "SW": 6,    // Water Speed
    "SA": 7,    // Anti Gravity Speed
    "SG": 8,    // Air Speed
    "TL": 9,    // Ground Handling
    "TW": 10,   // Water Handling
    "TA": 11,   // Anti Gravity Handling
    "TG": 12    // Air Handling
}


var cache_combo = {}
var cache_combo_floor = {}

var current_char = "Mario";
var current_body = "StandardKart";
var current_wheel = "Standard";
var current_kite = "SuperGlider";

var similar_builds_timeout = 0;

function calculate_this(char, body, wheel, kite) {
    var ls = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for(var i = 0; i < 14; i++)
        ls[i] += chars[char][i] + karts[body][i] + wheels[wheel][i] + kites[kite][i];

    var weight = S(ls[Y.WG]);
    var accel = S(ls[Y.AC]);
    var trxn = S(ls[Y.OF]);
    var speed = S(ls[Y.SL]);
    var handle = S(ls[Y.TL]);

    return [speed, accel, weight, handle, trxn];
}


function input_changed(natural = 0) {

    for(var elem of $$("#others tr"))
        elem.remove();

    if(!natural) {
        for(var sel of $$(".select"))
            sel.classList.remove("select");
    }

    var table = $("#others")

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
    while(ls.length) {
        var i = Math.floor(Math.random() * ls.length);
        var combo = ls[i];
        ls.splice(i, 1);
        [b_speed, b_accel, b_weight, b_handle, b_trxn] = cache_combo_floor[combo];
        if(
            (check_speed || b_speed == speed) &&
            (check_accel || b_accel == accel) &&
            (check_weight || b_weight == weight) &&
            (check_handle || b_handle == handle) &&
            (check_trxn || b_trxn == trxn)
        ) {
            [z_char, z_kart, z_wheel, z_kite] = combo.split(/\+/g);
            var row = $("#others").insertRow();

            // character
            var cell = row.insertCell();
            cell.innerHTML = $(`#char [data-src*='${z_char}.webp']`).outerHTML;


            // kart
            cell = row.insertCell();
            cell.innerHTML = $(`#body [data-src*='${z_kart}.webp']`).outerHTML;
            if(alts["body"].includes(z_kart))
                cell.children[0].src = `./img/karts/body/alt/${z_kart}/${z_char}.webp`;

            // wheel
            cell = row.insertCell();
            cell.innerHTML = $(`#wheel [data-src*='${z_wheel}.webp']`).outerHTML;

            // kite
            cell = row.insertCell();
            cell.innerHTML = $(`#kite [data-src*='${z_kite}.webp']`).outerHTML;
            if(alts["body"].includes(z_kite))
                cell.children[0].src = `./img/karts/kite/alt/${z_kite}/${z_char}.webp`;

        }
        if(table.rows.length >= 128 || (new Date() - time) > 4000) {
            $("#avoid-stall").style.display = "";
            break;
        }
    }
    for(var sel of $$("#others .select"))
        sel.classList.remove("select");
    for(var img of $$("#others img"))
        img.onclick = (evt) => select_match(evt.currentTarget);
    if(table.rows.length == 0) {
        table.insertRow().insertCell().innerHTML = "[no matches] [" + Math.floor(Math.random() * 65536).toString(16).padStart(4, "0") + "]";
    }

    $("#wait-for-done").style.display = "none";
    $("#just-a-sec").style.display = "none";
}

function list_timeout() {
    for(var elem of $$("#others tr"))
        elem.remove();
    window.clearTimeout(similar_builds_timeout);
    $("#wait-for-done").style.display = "";
    $("#just-a-sec").style.display = "none";
    $("#avoid-stall").style.display = "none";
    similar_builds_timeout = window.setTimeout(() => {
        similar_builds_timeout = window.setTimeout(input_changed, 100, 1);
        $("#wait-for-done").style.display = "none";
        $("#just-a-sec").style.display = "";
    }, 5000, 1);
}

function calculate() {
    var speed, accel, weight, handle, trxn;

    try {
        [speed, accel, weight, handle, trxn] = cache_combo[`${current_char}+${current_body}+${current_wheel}+${current_kite}`];
    } catch(err) {
        current_char = $("#char .select").dataset.src.split(/\//g).slice(-1)[0].split(".webp")[0];
        current_body = $("#body .select").dataset.src.split(/\//g).slice(-1)[0].split(".webp")[0];
        current_wheel = $("#wheel .select").dataset.src.split(/\//g).slice(-1)[0].split(".webp")[0];
        current_kite = $("#kite .select").dataset.src.split(/\//g).slice(-1)[0].split(".webp")[0];
        [speed, accel, weight, handle, trxn] = cache_combo[`${current_char}+${current_body}+${current_wheel}+${current_kite}`];
    }


    localStorage.setItem("mk8dx_combo", JSON.stringify([current_char, current_body, current_wheel, current_kite]));
    $("#slide-speed").value = speed;
    $("#slide-accel").value = accel;
    $("#slide-weight").value = weight;
    $("#slide-handle").value = handle;
    $("#slide-trxn").value = trxn;

    var sums = new Array(13);
    for(var i = 0; i < 13; i++)
        sums[i] = chars[current_char][i] + karts[current_body][i] + wheels[current_wheel][i] + kites[current_kite][i];
    $("#stat-weight").value = S(sums[Y.WG]) / 6;
    $("#stat-accel").value = S(sums[Y.AC]) / 6;
    $("#stat-trxn-on-road").value = S(sums[Y.ON]) / 6;
    $("#stat-trxn-off-road").value = S(sums[Y.OF]) / 6;
    $("#stat-mini-turbo").value = S(sums[Y.MT]) / 6;
    $("#stat-speed-ground").value = S(sums[Y.SL]) / 6;
    $("#stat-speed-water").value = S(sums[Y.SW]) / 6;
    $("#stat-speed-anti-gravity").value = S(sums[Y.SA]) / 6;
    $("#stat-speed-air").value = S(sums[Y.SG]) / 6;
    $("#stat-handle-ground").value = S(sums[Y.TL]) / 6;
    $("#stat-handle-water").value = S(sums[Y.TW]) / 6;
    $("#stat-handle-anti-gravity").value = S(sums[Y.TA]) / 6;
    $("#stat-handle-air").value = S(sums[Y.TG]) / 6;

    list_timeout();
}

function select_item(elem) {
    var parent = elem;
    while(parent.nodeName != "DIV")
        parent = parent.parentElement;
    for(var e of $$(".select", parent))
        e.classList.remove("select");
    elem.classList.add("select");


    if(parent.id == "char") {
        current_char = elem.dataset.src.split(/\//g).slice(-1)[0].split(".webp")[0];
        for(var alt of alts["body"])
            $(`[data-src*='${alt}.webp']`).src = `./img/karts/body/alt/${alt}/${current_char}.webp`
        for(var alt of alts["kite"])
            $(`[data-src*='${alt}.webp']`).src = `./img/karts/kite/alt/${alt}/${current_char}.webp`
        $("#char-name span").innerHTML = elem.title;
        return calculate();
    }

    if(parent.children[0].className.includes("select"))
        parent.prepend(parent.lastElementChild)
    else if(parent.children[2].className.includes("select"))
        parent.append(parent.firstElementChild)
    if(parent.id == "body") {
        current_body = elem.dataset.src.split(/\//g).slice(-1)[0].split(".webp")[0];
        $("#body-name span").innerHTML = elem.title;
    }
    else if(parent.id == "wheel") {
        current_wheel = elem.dataset.src.split(/\//g).slice(-1)[0].split(".webp")[0];
        $("#wheel-name span").innerHTML = elem.title;
    }
    else if(parent.id == "kite") {
        current_body = elem.dataset.src.split(/\//g).slice(-1)[0].split(".webp")[0];
        $("#kite-name span").innerHTML = elem.title;
    }
    return calculate();
}

function select_match(elem = 0) {
    for(var sel of $$(".select"))
        sel.classList.remove("select");

    if(elem) {
        var row = elem.parentElement.parentElement;
        current_char = row.children[0].children[0].dataset.src.split(/\//g).slice(-1)[0].split(".webp")[0];
        current_body = row.children[1].children[0].dataset.src.split(/\//g).slice(-1)[0].split(".webp")[0];
        current_wheel = row.children[2].children[0].dataset.src.split(/\//g).slice(-1)[0].split(".webp")[0];
        current_kite = row.children[3].children[0].dataset.src.split(/\//g).slice(-1)[0].split(".webp")[0];
    }
    for(var elem of $$("#others tr"))
        elem.remove();

    $(`[data-src*='${current_char}.webp']`).classList.add("select");
    $("#char-name span").innerHTML = $(`[data-src*='${current_char}.webp']`).title;

    var column = $("#body");
    while(!column.children[1].dataset.src.includes(current_body + ".webp"))
        column.prepend(column.lastElementChild);
    column.children[1].classList.add("select");
    $("#body-name span").innerHTML = column.children[1].title;

    var column = $("#wheel");
    while(!column.children[1].dataset.src.includes(current_wheel + ".webp"))
        column.prepend(column.lastElementChild);
    column.children[1].classList.add("select");
    $("#wheel-name span").innerHTML = column.children[1].title;

    var column = $("#kite");
    while(!column.children[1].dataset.src.includes(current_kite + ".webp"))
        column.prepend(column.lastElementChild);
    column.children[1].classList.add("select");
    $("#kite-name span").innerHTML = column.children[1].title;

    select_item($(`[data-src*='${current_char}.webp']`));
    calculate();
}

[current_char, current_body, current_wheel, current_kite] = JSON.parse(localStorage.getItem("mk8dx_combo") || '["Mario","StandardKart","Standard","SuperGlider"]')

console.time("Calculating")
for(var char in chars) {
    for(var kart in karts) {
        for(var wheel in wheels) {
            for(var kite in kites) {
                var ls = calculate_this(char, kart, wheel, kite);
                cache_combo[`${char}+${kart}+${wheel}+${kite}`] = ls;
                cache_combo_floor[`${char}+${kart}+${wheel}+${kite}`] = [Math.floor(ls[0]), Math.floor(ls[1]), Math.floor(ls[2]), Math.floor(ls[3]), Math.floor(ls[4]), Math.floor(ls[5])];
            }
        }
    }
}
console.timeEnd("Calculating")

select_match();
