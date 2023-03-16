const V = 'mk8dx';
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
    ],
    "GoldenDash": [
        "Tour_ParisPromenade",
        "3DS_ToadCircuit",
        "N64_ChocoMountain",
        "Wii_CoconutMall"
    ],
    "LuckyCat": [
        "Tour_TokyoBlur",
        "DS_ShroomRidge",
        "GBA_SkyGarden",
        "MK8_NinjaHideaway"
    ],
    "Turnip": [
        "Tour_NewYorkMinute",
        "SNES_MarioCircuit3",
        "N64_KalimariDesert",
        "DS_WaluigiPinball"
    ],
    "Propeller": [
        "Tour_SydneySprint",
        "GBA_SnowLand",
        "Wii_MushroomGorge",
        "MK8_SkyHighSundae"
    ],
    "Rock": [
        "Tour_LondonLoop",
        "GBA_BooLake",
        "3DS_RockRockMountain",
        "Wii_MapleTreeway"
    ],
    "Moon": [
        "Tour_BerlinByways",
        "DS_PeachGardens",
        "MK8_MerryMountain",
        "3DS_RainbowRoad"
    ],
    "Fruit": [
        "Tour_AmsterdamDrift",
        "GBA_RiversidePark",
        "Wii_DKSummit",
        "YoshisIsland"
    ],
    "Boomerang": [
        "Tour_BangkokRush",
        "DS_MarioCircuit",
        "GCN_WaluigiStadium",
        "Tour_SingaporeSpeedway"
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
    "Bell": "Bell Cup",
    "GoldenDash": "Golden Dash Cup",
    "LuckyCat": "Lucky Cat Cup",
    "Turnip": "Turnip Cup",
    "Propeller": "Propeller Cup",
    "Rock": "Rock Cup",
    "Moon": "Moon Cup",
    "Fruit": "Fruit Cup",
    "Boomerang": "Boomerang Cup"
};

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
    ],
    "GoldenDash": [
        "[Tour] Paris Promenade",
        "[3DS] Toad Circuit",
        "[N64] Choco Mountain",
        "[Wii] Coconut Mall"
    ],
    "LuckyCat": [
        "[Tour] Tokyo Blur",
        "[DS] Shroom Ridge",
        "[GBA] Sky Garden",
        "Ninja Hideaway"
    ],
    "Turnip": [
        "[Tour] New York Minute",
        "[SNES] Mario Circuit 3",
        "[N64] Kalamri Desert",
        "[DS] Waluigi Pinball"
    ],
    "Propeller": [
        "[Tour] Sydney Sprint",
        "[GBA] Snow Land",
        "[Wii] Mushroom Ridge",
        "Sky-High Sundae"
    ],
    "Rock": [
        "[Tour] London Loop",
        "[GBA] Boo Lake",
        "[3DS] Rock Rock Mountain",
        "[Wii] Maple Treeway"
    ],
    "Moon": [
        "[Tour] Berlin Byways",
        "[DS] Peach Gardens",
        "Merry Mountain",
        "[3DS] Rainbow Road"
    ],
    "Fruit": [
        "[Tour] Amsterdam Drift",
        "[GBA] Riverside Park",
        "[Wii] DK Summit",
        "Yoshi's Island"
    ],
    "Boomerang": [
        "[Tour] Bangkok Rush",
        "[DS] Mario Circuit",
        "[GCN] Waluigi Stadium",
        "[Tour] Singapore Speedway"
    ]
}

times = {
    "Mushroom": [
        ["1:53.191", "1:21.984"],
        ["2:02.186", "1:22.799"],
        ["2:07.205", "1:40.972"],
        ["2:12.125", "1:31.436"]
    ],
    "Flower": [
        ["2:08.501", "1:23.243"],
        ["2:29.282", "1:43.003"],
        ["2:14.615", "1:38.244"],
        ["2:21.804", "1:40.698"]
    ]
}
