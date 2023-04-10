function $(q, e = document) { return e.querySelector(q); }
function $$(q, e = document) { return e.querySelectorAll(q); }

function get_data() {
    try {
        data = JSON.parse(localStorage.getItem(V + "_progress"))
    } catch(err) {
        return;
    }
    var previous = {
        "G3": "G2",
        "G2": "G1",
        "G1": "G0",
        "G0": "S",
        "S": "B",
        "B": "N",
        "N": "G3"
    };
    var n = 0;
    for(var elem of $$("[id*='trophy_50cc']")) {
        elem.dataset.cup = previous[data['50cc'][n]];
        rotate_progress(elem, 0);
        n++;
    }
    n = 0;
    for(var elem of $$("[id*='trophy_100cc']")) {
        elem.dataset.cup = previous[data['100cc'][n]];
        rotate_progress(elem, 0);
        n++;
    }
    n = 0;
    for(var elem of $$("[id*='trophy_150cc']")) {
        elem.dataset.cup = previous[data['150cc'][n]];
        rotate_progress(elem, 0);
        n++;
    }
    n = 0;
    for(var elem of $$("[id*='trophy_mirror']")) {
        elem.dataset.cup = previous[data['mirror'][n]];
        rotate_progress(elem, 0);
        n++;
    }
    n = 0;
    for(var elem of $$("[id*='trophy_200cc']")) {
        elem.dataset.cup = previous[data['200cc'][n]];
        rotate_progress(elem, 0);
        n++;
    }
    n = 0;
    for(var elem of $$("[id*='tt_150cc']")) {
        elem.checked = data['tt_150cc'][n];
        n++;
    }
    n = 0;
    for(var elem of $$("[id*='tt_200cc']")) {
        elem.checked = data['tt_200cc'][n];
        n++;
    }
    update_table();
}

function store_data() {
    var data = {
        "50cc": [],
        "100cc": [],
        "150cc": [],
        "mirror": [],
        "200cc": [],
        "tt_150cc": [],
        "tt_200cc": []
    }
    for(var elem of $$("[id*='trophy_50cc']"))
        data['50cc'].push(elem.dataset.cup);
    for(var elem of $$("[id*='trophy_100cc']"))
        data['100cc'].push(elem.dataset.cup);
    for(var elem of $$("[id*='trophy_150cc']"))
        data['150cc'].push(elem.dataset.cup);
    for(var elem of $$("[id*='trophy_mirror']"))
        data['mirror'].push(elem.dataset.cup);
    for(var elem of $$("[id*='trophy_200cc']"))
        data['200cc'].push(elem.dataset.cup);
    for(var elem of $$("[id*='tt_150cc']"))
        data['tt_150cc'].push(Number(elem.checked));
    for(var elem of $$("[id*='tt_200cc']"))
        data['tt_200cc'].push(Number(elem.checked));

    localStorage.setItem(V + "_progress", JSON.stringify(data));
}

function update_table() {
    var do_150cc = $("#rng_tt_150cc").checked;
    var do_200cc = $("#rng_tt_200cc").checked;
    if(!do_150cc && !do_200cc)
        $("#rng_grand_prix").checked = true;
    var do_grand_prix = $("#rng_grand_prix").checked;

    for(var row of $$("table tr:nth-child(n+3)")) {
        row.cells[0].children[0].checked = false;
        num_trophies = 0;
        num_tt_150cc = 0;
        num_tt_200cc = 0;

        for(var cell of $$("td:nth-child(n+3):nth-child(-n+7)", row))
            num_trophies += cell.dataset.cup == "G3";
        for(var cell of $$("[id*='tt_150cc']", row))
            num_tt_150cc += Boolean(cell.checked);
        for(var cell of $$("[id*='tt_200cc']", row))
            num_tt_200cc += Boolean(cell.checked);

        row.cells[11].children[0].innerHTML = (num_tt_150cc == 4 ? '&nbsp;' : 4 - num_tt_150cc)
        row.cells[11].children[1].innerHTML = (num_tt_200cc == 4 ? '&nbsp;' : 4 - num_tt_200cc)

        if(do_150cc && num_tt_150cc != 4)
            continue;
        if(do_200cc && num_tt_200cc != 4)
            continue;
        if(do_grand_prix && num_trophies != 5)
            continue;
        row.cells[0].children[0].checked = true;
    }

    random_cup();
}

progress_indexes = ["N", "B", "S", "G0", "G1", "G2", "G3"];
inverse_progress = {
    "N": "G2",
    "B": "G3",
    "S": "N",
    "G0": "B",
    "G1": "S",
    "G2": "G0",
    "G3": "G1"
}

function rotate_progress(elem, store = 1, s = '') {
    var new_val, new_html;
    switch(s || elem.dataset.cup) {
        case "N":
            new_val = "B";
            new_html = `<img src="../img/trophy/Bronze.svg" class="trophy"></img>`
            break;
        case "B":
            new_val = "S";
            new_html = `<img src="../img/trophy/Silver.svg" class="trophy"></img>`
            break;
        case "S":
            new_val = "G0";
            new_html = `<img src="../img/trophy/Gold.svg" class="trophy"></img>`
            break;
        case "G0":
            new_val = "G1";
            new_html = `<img src="../img/trophy/Gold.svg" class="mini"></img><br>` + `<img src="../img/trophy/Star.svg"></img>`.repeat(1);
            break;
        case "G1":
            new_val = "G2";
            new_html = `<img src="../img/trophy/Gold.svg" class="mini"></img><br>` + `<img src="../img/trophy/Star.svg"></img>`.repeat(2);
            break;
        case "G2":
            new_val = "G3";
            new_html = `<img src="../img/trophy/Gold.svg" class="mini"></img><br>` + `<img src="../img/trophy/Star.svg"></img>`.repeat(3);
            break;
        default:
            new_val = "N";
            new_html = "-";
    }
    elem.innerHTML = new_html;
    elem.dataset.cup = new_val;
    if(elem.cellIndex == 4 || elem.cellIndex == 3) {
        if(progress_indexes.indexOf(elem.dataset.cup) > progress_indexes.indexOf(elem.previousElementSibling.dataset.cup))
            return rotate_progress(elem.previousElementSibling, 1, progress_indexes[progress_indexes.indexOf(elem.dataset.cup) - 1]);
    }
    if(store) {
        store_data();
        update_table();
    }
}

function random_cup() {
    var n = Math.floor(Math.random() * $$("img.cup_img").length);
    var c = 0;
    while($("table").rows[n + 2].cells[0].children[0].checked && c < 128) {
        n = Math.floor(Math.random() * $$("img.cup_img").length);
        c++
    }
    if(c >= 128) {
        return
    }
    console.log(n)
    $("#rng_img").src = $("table").rows[n + 2].cells[1].children[0].src;
}
const tt_empty = Array(8).fill(Array(2).fill("[tbd]"));

var progress_table = $("table");
for(var cup in cups) {
    var row = progress_table.insertRow();
    var cell = row.insertCell();

    cell.innerHTML = `<input type="checkbox" onclick="update_table()" id="${cup}_complete"></input>`;
    cell = row.insertCell();
    cell.innerHTML = `<img class="cup_img" src="./img/cups/${cup}.webp" alt="${names[cup]}" title="${names[cup]}">`;
    for(var x of ["50cc", "100cc", "150cc", "mirror", "200cc"]) {
        cell = row.insertCell();
        cell.id = `${cup}_trophy_${x}`;
        cell.onclick = (evt) => rotate_progress(evt.currentTarget);
        cell.oncontextmenu = (evt) => {
            evt.preventDefault();
            rotate_progress(evt.currentTarget, 1, inverse_progress[evt.currentTarget.dataset.cup]);
        }
        cell.dataset.cup = "N";
        cell.classList.add("trophy");
        cell.innerHTML = `-`;
    }
    for(var x = 0; x < 4; x++) {
        cell = row.insertCell();
        cell.innerHTML = `
<div style="display: flex; width: 98%;">
<div><img class="track_img" src="./img/tracks/${cups[cup][x]}.webp" alt="${labels[cup][x]}" title="${labels[cup][x]}"></div>
<span style="margin:auto;height:min-content">
<input type="checkbox" onchange="store_data();update_table();" id="${cup}_${x}_tt_150cc" title="150cc - ${(times[cup] || tt_empty)[x][0]}"/><br><br>
<input type="checkbox" onchange="store_data();update_table();" id="${cup}_${x}_tt_200cc" title="200cc - ${(times[cup] || tt_empty)[x][1]}"/>
</span>
</div>`;
    }
    row.insertCell().innerHTML = `<div id="${cup}_tt_150cc_complete">4</div><br><div id="${cup}_tt_200cc_complete">4</div>`;
}


get_data();

for(var q of $$("input + label")) {
    q.onclick = (evt) => { evt.currentTarget.previousElementSibling.click(); }
}

if(!window.navigator.userAgent.includes("Firefox")) {
    $("#logo").outerHTML += `<div class="shill yellow">
<b>Note:</b> This tool works best in Firefox, and is largely untested in chrome. Please consider switching.
</div>`;
}
