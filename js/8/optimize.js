function $(q, e = document) { return e.querySelector(q); }
function $$(q, e = document) { return e.querySelectorAll(q); }

for(var img of $$("img:not([src])"))
    img.src = img.dataset.src;

var group_chars = [], group_karts = [], group_wheels = [], group_kites = [], group_stats = [];
var current_char, current_body, current_wheel, current_kite;
var cache_combo = {};
var cache_combo_floor = {};
var cache_stats = {};
var cache_results = {};
var cache_similar = {};
var cache_cards = {};

var last_build = JSON.parse(localStorage.getItem(V + "_combo") || '["Mario","StandardKart","Standard","SuperGlider"]');
[current_char, current_body, current_wheel, current_kite] = last_build;

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

function D(n, large = 0) {
    var q = S(n);
    var t = Math.floor(q);
    if(q == t)
        return q + ".-";
    return t + `<span style='font-size: ${large ? 'smaller' : 'xx-small'}'>` + (q - t).toString().slice(1) + "</span>"
}

[$("#var0").value, $("#var1").value] = JSON.parse(localStorage.getItem("mkzx_optimizer_" + V + "_chosen") || '["MT", "SL"]');

const IFRAMES = Boolean($("#stat-iframe"));

function restore_cache() {
    try {
        [group_chars, group_karts, group_wheels, group_kites] = JSON.parse(localStorage.getItem("mkzx_cache_" + V + "_group"));
        group_stats = JSON.parse(localStorage.getItem("mkzx_cache_" + V + "_cache"));
    } catch(err) {
        window.alert("On the next page, please select your kart, then come back here.\nDon't worry, all changes on the Kart Builder is saved.");
        return location = "./stats.html";
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
    console.log(n, "combinations");
}

restore_cache();

var SVG_VARS = {};

function construct_svg_vars() {
    SVG_VARS = {
        "W": 512,
        "H": $("svg").getBoundingClientRect().height,
        "margin": 32,
        "BARS": 6,
        "STEPS": 4,
        "radius": 4
    }
    SVG_VARS.COUNT = SVG_VARS.BARS * SVG_VARS.STEPS;
    SVG_VARS.h = SVG_VARS.H / 2;
    SVG_VARS.w = SVG_VARS.W / 2;

    SVG_VARS.AX = {
        "bottom": SVG_VARS.H - SVG_VARS.margin,
        "left": SVG_VARS.margin,
        "width": SVG_VARS.W - SVG_VARS.margin,
    }
    SVG_VARS.AX.step_horiz = SVG_VARS.AX.bottom / SVG_VARS.COUNT;
    SVG_VARS.AX.step_vert = SVG_VARS.AX.width / SVG_VARS.COUNT;
}
construct_svg_vars();
var plotted = {};
var plot_pts = {};
var current_stats = [];
var optimal_stats = [];
var superior_stats = [];

function plot_points() {
    var graph = $("svg");

    if($("#points")) {
        var points = $("#points");
        for(var pt of $$("circle, polygon"))
            pt.remove();
    } else {
        var points = document.createElementNS("http://www.w3.org/2000/svg", "g");
        points.id = "points";
        graph.appendChild(points);
    }

    plotted = {};
    plot_pts = {};
    var var0 = $("#var0").value;
    var var1 = $("#var1").value;
    localStorage.setItem("mkzx_optimizer_" + V + "_chosen", JSON.stringify([var0, var1]));
    var R = SVG_VARS.radius;

    var plot_only_char = $("#plot-only-char").checked;
    var plot_only_kart = $("#plot-only-kart").checked;
    var plot_only_wheel = $("#plot-only-wheel").checked;
    var plot_only_kite = $("#plot-only-kite").checked;

    current_stats = [];
    optimal_stats = [];
    superior_stats = [];

    for(var char_set of group_chars) {
        var char_val0 = chars[char_set[0]][Y[var0]];
        var char_val1 = chars[char_set[0]][Y[var1]];
        var incl_char = char_set.includes(current_char);
        if(plot_only_char && !incl_char)
            continue;

        for(var kart_set of group_karts) {
            var kart_val0 = karts[kart_set[0]][Y[var0]];
            var kart_val1 = karts[kart_set[0]][Y[var1]];
            var incl_kart = kart_set.includes(current_body);
            if(plot_only_kart && !incl_kart)
                continue;

            for(var wheel_set of group_wheels) {
                var wheel_val0 = wheels[wheel_set[0]][Y[var0]];
                var wheel_val1 = wheels[wheel_set[0]][Y[var1]];
                var incl_wheel = wheel_set.includes(current_wheel);
                if(plot_only_wheel && !incl_wheel)
                    continue;

                for(var kite_set of group_kites) {
                    var kite_val0 = kites[kite_set[0]][Y[var0]];
                    var kite_val1 = kites[kite_set[0]][Y[var1]];
                    var incl_kite = kite_set.includes(current_kite);
                    if(plot_only_kite && !incl_kite)
                        continue;

                    var ttl_val0 = S(char_val0 + kart_val0 + wheel_val0 + kite_val0);
                    var ttl_val1 = S(char_val1 + kart_val1 + wheel_val1 + kite_val1);
                    var ttl_st = ttl_val0 + "+" + ttl_val1;

                    var new_point = false;

                    if(!plotted[ttl_st]) {
                        plotted[ttl_st] = [];
                        new_point = true;
                    }

                    var build_exists = false;
                    for(var pt of plotted[ttl_st]) {
                        if(pt[0][0] != char_set[0])
                            continue;
                        if(pt[1][0] != kart_set[0])
                            continue;
                        if(pt[2][0] != wheel_set[0])
                            continue;
                        if(pt[3][0] != kite_set[0])
                            continue;
                        build_exists = true;
                        break;
                    }
                    if(!build_exists)
                        plotted[ttl_st].push([char_set, kart_set, wheel_set, kite_set]);

                    var cx = SVG_VARS.AX.width * (ttl_val0 / SVG_VARS.BARS) + SVG_VARS.margin;
                    var cy = SVG_VARS.AX.bottom - (SVG_VARS.AX.bottom * (ttl_val1 / SVG_VARS.BARS));
                    if(incl_char && incl_kart && incl_wheel && incl_kite) {
                        var point = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                        if(plot_pts[ttl_st])
                            plot_pts[ttl_st].remove();

                        point.setAttribute("points", `${cx+R*2.2},${cy} ${cx},${cy+R*2.2}, ${cx-R*2.2},${cy} ${cx},${cy-R*2.2}`);
                        point.setAttribute("data-select", `${cx+R*2.2},${cy} ${cx},${cy+R*2.2}, ${cx-R*2.2},${cy} ${cx},${cy-R*2.2}`)
                        point.setAttribute("data-other", `${cx+R*1.7},${cy} ${cx},${cy+R*1.7}, ${cx-R*1.7},${cy} ${cx},${cy-R*1.7}`)

                        current_stats = [ttl_val0, ttl_val1];

                        point.classList.add("selected");
                    } else if(!plot_pts[ttl_st]) {
                        var point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                        point.setAttribute("cx", cx);
                        point.setAttribute("cy", cy);
                        point.setAttribute("r", R);
                    } else {
                        continue
                    }

                    points.appendChild(point);
                    point.setAttribute("data-pts", ttl_st);
                    point.setAttribute("data-var0", ttl_val0);
                    point.setAttribute("data-var1", ttl_val1);
                    plot_pts[ttl_st] = point;
                    point.onclick = (evt) => match_builds(evt);
                }
            }
        }
    }
    for(var pt in plot_pts) {
        var ttl_val0 = Number(pt.split("+")[0]);
        var ttl_val1 = Number(pt.split("+")[1]);
        var skip = false;
        for(var ttl_add = 0.25; ttl_add < 6; ttl_add += 0.25) {
            var tmp_val0 = ttl_val0 + ttl_add;
            var tmp_val1 = ttl_val1 + ttl_add;
            if(plot_pts[ttl_val0 + "+" + tmp_val1] || plot_pts[tmp_val0 + "+" + ttl_val1] || plot_pts[tmp_val0 + "+" + tmp_val1]) {
                skip = true;
                break;
            }
        }
        if(skip)
            continue
        plot_pts[ttl_val0 + "+" + ttl_val1].classList.add("optimal");
        optimal_stats.push(ttl_val0 + "+" + ttl_val1);
        if(ttl_val0 >= current_stats[0] && ttl_val1 >= current_stats[1])
            superior_stats.push(ttl_val0 + "+" + ttl_val1);
    }
}

function select_parts(build, block, current, plot_only) {
    for(var item of block) {
        if(plot_only && item != current || build.includes(item))
            continue
        build.push(item);
    }
    return build;
}

function push_builds(ls, block) {
    var builds = [];
    var var0 = $("#var0").value;
    var var1 = $("#var1").value;
    builds = [];

    var plot_only_char = $("#plot-only-char").checked;
    var plot_only_kart = $("#plot-only-kart").checked;
    var plot_only_wheel = $("#plot-only-wheel").checked;
    var plot_only_kite = $("#plot-only-kite").checked;

    var build_char = [];
    var build_kart = [];
    var build_wheel = [];
    var build_kite = [];
    for(var q of ls) {
        var char_set, kart_set, wheel_set, kite_set;
        for(var combo of plotted[q]) {
            [char_set, kart_set, wheel_set, kite_set] = combo;
            select_parts(build_char, char_set, current_char, plot_only_char);
            select_parts(build_kart, kart_set, current_body, plot_only_kart);
            select_parts(build_wheel, wheel_set, current_wheel, plot_only_wheel);
            select_parts(build_kite, kite_set, current_kite, plot_only_kite);
        }
    }
    for(var char of build_char) {
        for(var kart of build_kart) {
            for(var wheel of build_wheel) {
                for(var kite of build_kite) {
                    builds.push(char + "+" + kart + "+" + wheel + "+" + kite);
                }
            }
        }
    }

    var block_elem = $("#" + block);
    var l = Math.min(32, builds.length);
    for(var x = 0; x < l; x++) {
        var i = Math.floor(Math.random() * builds.length);
        var combo = builds[i];
        builds.splice(i, 1);

        block_elem.appendChild(add_build_compare(...(combo.split(/\+/g))));
    }
}

var gen_match_timeout = 0;
function generate_matches() {
    $("body").classList.add("loading");
    window.clearTimeout(gen_match_timeout);
    gen_match_timeout = window.setTimeout(() => {
        $("#compare-select").innerHTML = "";
        $("#compare-optimal").innerHTML = "";
        $("#compare-superior").innerHTML = "";

        push_builds([current_stats[0] + "+" + current_stats[1]], "compare-select");
        push_builds(superior_stats, "compare-superior");
        push_builds(optimal_stats, "compare-optimal");
        $("body").classList.remove("loading")
    }, 50);
}

function match_builds(evt) {
    if($("svg .selected"))
        $("svg .selected").classList.remove("selected");
    elem = evt.currentTarget;
    if(elem.nodeName == "polygon")
        $("polygon").setAttribute("points", $("polygon").dataset.select)
    else
        $("polygon").setAttribute("points", $("polygon").dataset.other)

    elem.classList.add("selected");

    current_stats = [Number(elem.dataset.var0), Number(elem.dataset.var1)];
    generate_matches();
}

function build_graph() {
    construct_svg_vars();

    var graph = $("svg");
    graph.innerHTML = "";

    var grid = document.createElementNS("http://www.w3.org/2000/svg", "g");
    grid.id = "grid";
    graph.appendChild(grid);

    var text0 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text0.innerHTML = $("#var0").selectedOptions[0].textContent;
    grid.appendChild(text0);
    text0.setAttribute("x", SVG_VARS.w - text0.getBoundingClientRect().width / 2);
    text0.setAttribute("y", SVG_VARS.H - text0.getBoundingClientRect().height);

    var text1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text1.innerHTML = $("#var1").selectedOptions[0].textContent;
    text1.style.transform = "rotate(-90deg)";
    grid.appendChild(text1);
    text1.setAttribute("x", -SVG_VARS.h - text1.getBoundingClientRect().height / 2);
    text1.setAttribute("y", 1.5 * text1.getBoundingClientRect().width);

    var lines = document.createElementNS("http://www.w3.org/2000/svg", "g");
    lines.id = "lines";
    grid.appendChild(lines);

    var n = 0;
    for(var line_y = SVG_VARS.AX.bottom; line_y > 0; line_y -= SVG_VARS.AX.step_horiz) {
        var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", SVG_VARS.margin);
        line.setAttribute("x2", SVG_VARS.W);
        line.setAttribute("y1", line_y);
        line.setAttribute("y2", line_y);
        if(line_y == SVG_VARS.AX.bottom)
            line.classList.add("axis");
        else if(n % SVG_VARS.STEPS == 0)
            line.classList.add("bar");
        else
            line.classList.add("qtr");
        n++;
        lines.appendChild(line);
    }

    n = 0;
    for(var line_x = SVG_VARS.AX.left; line_x < SVG_VARS.W; line_x += SVG_VARS.AX.step_vert) {
        var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("y1", 0);
        line.setAttribute("y2", SVG_VARS.H - SVG_VARS.margin);
        line.setAttribute("x1", line_x);
        line.setAttribute("x2", line_x);
        if(line_x == SVG_VARS.AX.left)
            line.classList.add("axis");
        else if(n % SVG_VARS.STEPS == 0)
            line.classList.add("bar");
        else
            line.classList.add("qtr");
        n++;
        lines.appendChild(line);
    }

    plot_points();
}

function remove_compare(evt) {
    evt.currentTarget.parentElement.parentElement.remove();
}

function add_build_compare(w_char, w_body, w_wheel, w_kite, skip = 0) {
    if($("#compared").children.length >= 32) {
        return window.alert("You can only compare 32 karts at once. Delete a few to continue.")
    }

    if(cache_cards[w_char + "+" + w_body + "+" + w_wheel + "+" + w_kite]) {
        $("#compared").innerHTML += cache_cards[w_char + "+" + w_body + "+" + w_wheel + "+" + w_kite];
        return $("#compared").children[0];
    }

    if(w_char)
        var elem_char = $(`#char img[data-src*='/${w_char}.webp']`);
    else
        var elem_char = $("#char .select");
    if(w_body)
        var elem_kart = $(`#body img[data-src*='/${w_body}.webp']`);
    else
        var elem_kart = $("#body .select");
    if(w_wheel)
        var elem_wheel = $(`#wheel img[data-src*='/${w_wheel}.webp']`);
    else
        var elem_wheel = $("#wheel .select");
    if(w_kite)
        var elem_kite = $(`#kite img[data-src*='/${w_kite}.webp']`);
    else
        var elem_kite = $("#kite .select");

    var char_name = elem_char.dataset.src.split(/\//g).slice(-1)[0].split(".webp")[0];
    var kart_name = elem_kart.dataset.src.split(/\//g).slice(-1)[0].split(".webp")[0];
    var wheel_name = elem_wheel.dataset.src.split(/\//g).slice(-1)[0].split(".webp")[0];
    var kite_name = elem_kite.dataset.src.split(/\//g).slice(-1)[0].split(".webp")[0];

    var sums = new Array(14);
    for(var i = 0; i < 14; i++)
        sums[i] = chars[char_name][i] + karts[kart_name][i] + wheels[wheel_name][i] + kites[kite_name][i];

    $("#compared").innerHTML += `
    <div style="display: flex" class="compare-contain">
        <div>
            <img class="compare" data-src="../img/rm-compare.svg" title="Remove build" src="../img/rm-compare.svg" onclick="remove_compare(event)"/>
            <img class="compare" data-src="../img/sel-compare.svg" title="Select build" src="../img/sel-compare.svg" onclick="compare_select(event)"/><br>
            <img class="char-img compare" data-src="${elem_char.dataset.src}" title="${elem_char.title}" src="${elem_char.src}"/><br>
            <img class="char-img compare" data-src="${elem_kart.dataset.src}" title="${elem_kart.title}" src="${elem_kart.src}"/><br>
            <img class="char-img compare" data-src="${elem_wheel.dataset.src}" title="${elem_wheel.title}" src="${elem_wheel.src}"/><br>
            <img class="char-img compare" data-src="${elem_kite.dataset.src}" title="${elem_kite.title}" src="${elem_kite.src}"/>
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
    </div>`;

    if(alts["kite"].includes(kite_name))
        $("#compared .compare-contain:last-child img:last-child").src = `./img/karts/kite/alt/${kite_name}/${char_name}.webp`;
    if(alts["body"].includes(kart_name))
        $("#compared .compare-contain:last-child img:nth-child(6)").src = `./img/karts/body/alt/${kart_name}/${char_name}.webp`;

    cache_cards[w_char + "+" + w_body + "+" + w_wheel + "+" + w_kite] = $("#compared").children[0].outerHTML;
    return $("#compared").children[0];
}

function begin_retrieve() {
    var card = add_build_compare(current_char, current_body, current_wheel, current_kite);
    for(var c of $("#current-build").children)
        c.remove();
    $("#current-build").append(card);

    imgs = card.querySelectorAll("img");
    $("#plot-char-text").textContent = imgs[2].title;
    $("#plot-kart-text").textContent = imgs[3].title;
    $("#plot-wheel-text").textContent = imgs[4].title;
    $("#plot-kite-text").textContent = imgs[5].title;
    localStorage.setItem(V + "_combo", JSON.stringify([current_char, current_body, current_wheel, current_kite]))
    plot_points();
    generate_matches();
}

function plot_gen() {
    plot_points();
    generate_matches();
}

function compare_select(evt) {
    imgs = evt.currentTarget.parentElement.querySelectorAll("img");
    current_char = imgs[2].dataset.src.split(/\//g).slice(-1)[0].split(".webp")[0];
    current_body = imgs[3].dataset.src.split(/\//g).slice(-1)[0].split(".webp")[0];
    current_wheel = imgs[4].dataset.src.split(/\//g).slice(-1)[0].split(".webp")[0];
    current_kite = imgs[5].dataset.src.split(/\//g).slice(-1)[0].split(".webp")[0];
    begin_retrieve();
}

$("#plot-only-char").onclick = () => plot_gen();
$("#plot-only-kart").onclick = () => plot_gen();
$("#plot-only-wheel").onclick = () => plot_gen();
$("#plot-only-kite").onclick = () => plot_gen();

for(var q of $$("input + label")) {
    q.onclick = (evt) => { evt.currentTarget.previousElementSibling.click(); }
}

begin_retrieve();
build_graph();

window.onresize = (evt) => build_graph();
if(!window.navigator.userAgent.includes("Firefox")) {
    $("#logo").outerHTML += `<div class="shill yellow">
<b>Note:</b> This tool works best in Firefox, and is largely untested in chrome. Please consider switching.
</div>`;
}
