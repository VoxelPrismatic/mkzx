const V = 'mk8u';
const cups = {
    "Mushroom": [
        "MK8_MarioKartStadium",
        "MK8_WaterPark",
        "MK8_SweetSweetCanyon",
        "MK8_ThwompRuins"
    ],
    "Flower": [
        "MK8_MarioCircuit",
        "MK8_ToadHarbor",
        "MK8_TwistedMansion",
        "MK8_ShyGuyFalls"
    ],
    "Star": [
        "MK8_SunshineAirport",
        "MK8_DolphinShoals",
        "MK8_Electrodome",
        "MK8_MountWario"
    ],
    "Special": [
        "MK8_CloudtopCruise",
        "MK8_BoneDryDunes",
        "MK8_BowsersCastle",
        "MK8_RainbowRoad"
    ],
    "Shell": [
        "Wii_MooMooMeadows",
        "GBA_MarioCircuit",
        "DS_CheepCheepBeach",
        "N64_ToadsTurnpike"
    ],
    "Banana": [
        "GCN_DryDryDesert",
        "SNES_DonutPlains3",
        "N64_RoyalRaceway",
        "3DS_DKJungle"
    ],
    "Leaf": [
        "DS_WarioStadium",
        "GCN_SherbetLand",
        "3DS_MusicPark",
        "N64_YoshiValley"
    ],
    "Lightning": [
        "DS_TickTockClock",
        "3DS_PiranhaPlantSlide",
        "Wii_GrumbleVolcano",
        "N64_RainbowRoad"
    ],
    "Egg": [
        "GCN_YoshiCircuit",
        "MK8_ExcitebikeArena",
        "MK8_DragonDriftway",
        "MK8_MuteCity"
    ],
    "Triforce": [
        "Wii_WariosGoldMine",
        "SNES_RainbowRoad",
        "MK8_IceIceOutpost",
        "MK8_HyruleCircuit"
    ],
    "Crossing": [
        "GCN_BabyPark",
        "GBA_CheeseLand",
        "MK8_WildWoods",
        "MK8_AnimalCrossing"
    ],
    "Bell": [
        "3DS_NeoBowserCity",
        "GBA_RibbonRoad",
        "MK8_SuperBellSubway",
        "MK8_BigBlue"
    ]
};

const names = {
    "Mushroom": "Mushroom Cup",
    "Flower": "Flower Cup",
    "Special": "Special Cup",
    "Shell": "Shell Cup",
    "Banana": "Banana Cup",
    "Leaf": "Leaf Cup",
    "Lightning": "Lightning Cup",
    "Egg": "Egg Cup",
    "Triforce": "Triforce Cup",
    "Crossing": "Crossing Cup",
    "Bell": "Bell Cup"
}

const labels = {
    "Mushroom": [
        "Mario Kart Stadium",
        "Water Park",
        "Sweet Sweet Canyon",
        "Thwomp Ruins"
    ],
    "Flower": [
        "Mario Circuit",
        "Toad Harbor",
        "Twisted Mansion",
        "Shy Guy Falls"
    ],
    "Star": [
        "Sunshine Airport",
        "Dolphin Shoals",
        "Electrodrome",
        "Mount Wario"
    ],
    "Special": [
        "Cloudtop Cruise",
        "Bone-Dry Dunes",
        "Bowser's Castle",
        "Rainbow Road"
    ],
    "Shell": [
        "[Wii] Moo Moo Meadows",
        "[GBA] Mario Circuit",
        "[DS] Cheep Cheep Beach",
        "[N64] Toad's Turnpike"
    ],
    "Banana": [
        "[GCN] Dry Dry Desert",
        "[SNES] Donut Plains 3",
        "[N64] Royal Raceway",
        "[3DS] DK Jungle"
    ],
    "Leaf": [
        "[DS] Wario Stadium",
        "[GCN] Sherbet Land",
        "[3DS] Music Park",
        "[N64] Yoshi Valley"
    ],
    "Lightning": [
        "[DS] Tick-Tock Clock",
        "[3DS] Piranha Plant Slide",
        "[Wii] Volcano Grumble",
        "[N64] Rainbow Road"
    ],
    "Egg": [
        "[GCN] Yoshi Circuit",
        "Excite Bike Arena",
        "Dragon Driftway",
        "Mute City"
    ],
    "Triforce": [
        "[Wii] Wario's Goldmine",
        "[SNES] Rainbow Road",
        "Ice Ice Outpost",
        "Hyrule Circuit"
    ],
    "Crossing": [
        "[GCN] Baby Park",
        "[GBA] Cheese Land",
        "Wild Woods",
        "Animal Crossing"
    ],
    "Bell": [
        "[3DS] Neo Bowser City",
        "[GBA] Ribbon Road",
        "Super Bell Subway",
        "Big Blue"
    ]
}

times = {}
