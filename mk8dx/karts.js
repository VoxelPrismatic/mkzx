const V = 'mk8dx';
const chars = {
    "Mario":            [6, 2, 4, 2, 3, 7, 7, 7, 7, 4, 4, 4, 4],
    "Luigi":            [6, 2, 5, 1, 3, 7, 7, 7, 7, 5, 5, 5, 5],
    "Peach":            [4, 3, 3, 3, 4, 6, 6, 6, 6, 5, 5, 5, 5],
    "Daisy":            [4, 3, 3, 3, 4, 6, 6, 6, 6, 5, 5, 5, 5],
    "Yoshi":            [4, 3, 3, 3, 4, 6, 6, 6, 6, 5, 5, 5, 5],
    "Toad":             [3, 4, 3, 4, 4, 4, 4, 4, 4, 7, 7, 7, 7],
    "Toadette":         [2, 5, 4, 2, 4, 3, 3, 3, 3, 7, 7, 7, 7],
    "Koopa":            [2, 4, 1, 5, 4, 3, 3, 3, 3, 8, 8, 8, 8],
    "Bowser":           [10, 0, 6, 0, 0, 10, 10, 10, 10, 0, 0, 0, 0],
    "DonkeyKong":       [8, 1, 10, 0, 1, 9, 9, 9, 9, 2, 2, 2, 2],
    "Wario":            [9, 0, 5, 1, 0, 10, 10, 10, 10, 1, 1, 1, 1],
    "Waluigi":          [8, 1, 10, 0, 1, 9, 9, 9, 9, 2, 2, 2, 2],
    "Rosalina":         [7, 1, 9, 3, 2, 8, 8, 8, 8, 3, 3, 3, 3],
    "MetalMario":       [10, 1, 8, 1, 1, 8, 8, 8, 8, 3, 3, 3, 3],
    "PinkGoldPeach":    [10, 1, 8, 1, 1, 8, 8, 8, 8, 3, 3, 3, 3],
    "Lakitu":           [2, 4, 1, 5, 4, 3, 3, 3, 3, 8, 8, 8, 8],
    "ShyGuy":           [3, 4, 3, 4, 4, 4, 4, 4, 4, 7, 7, 7, 7],
    "BabyMario":        [1, 5, 2, 4, 5, 2, 2, 2, 2, 8, 8, 8, 8],
    "BabyLuigi":        [1, 5, 2, 4, 5, 2, 2, 2, 2, 8, 8, 8, 8],
    "BabyPeach":        [0, 4, 3, 5, 5, 1, 1, 1, 1, 10, 10, 10, 10],
    "BabyDaisy":        [0, 4, 3, 5, 5, 1, 1, 1, 1, 10, 10, 10, 10],
    "BabyRosalina":     [0, 5, 4, 3, 5, 1, 1, 1, 1, 9, 9, 9, 9],
    "Larry":            [3, 4, 3, 4, 4, 4, 4, 4, 4, 7, 7, 7, 7],
    "Lemmy":            [0, 5, 4, 3, 5, 1, 1, 1, 1, 9, 9, 9, 9],
    "Wendy":            [2, 5, 4, 2, 4, 3, 3, 3, 3, 7, 7, 7, 7],
    "Ludwig":           [6, 2, 4, 2, 3, 7, 7, 7, 7, 4, 4, 4, 4],
    "Iggy":             [6, 2, 5, 1, 3, 7, 7, 7, 7, 5, 5, 5, 5],
    "Roy":              [8, 1, 10, 0, 1, 9, 9, 9, 9, 2, 2, 2, 2],
    "Morton":           [10, 0, 6, 0, 0, 10, 10, 10, 10, 0, 0, 0, 0],
    "Mii":              [6, 2, 4, 2, 3, 7, 7, 7, 7, 4, 4, 4, 4],
    "TanookiMario":     [5, 3, 7, 1, 3, 6, 6, 6, 6, 5, 5, 5, 5],
    "Link":             [7, 1, 9, 3, 2, 8, 8, 8, 8, 3, 3, 3, 3],
    "MaleVillager":     [5, 3, 7, 1, 3, 6, 6, 6, 6, 5, 5, 5, 5],
    "Isabelle":         [2, 5, 4, 2, 4, 3, 3, 3, 3, 7, 7, 7, 7],
    "CatPeach":         [3, 4, 2, 3, 3, 5, 5, 5, 5, 6, 6, 6, 6],
    "DryBowser":        [9, 0, 5, 1, 0, 10, 10, 10, 10, 1, 1, 1, 1],
    "FemaleVillager":   [3, 4, 2, 3, 3, 5, 5, 5, 5, 6, 6, 6, 6],
    "GoldMario":        [10, 1, 8, 1, 1, 8, 8, 8, 8, 3, 3, 3, 3],
    "DryBones":         [1, 5, 2, 4, 5, 2, 2, 2, 2, 8, 8, 8, 8],
    "BowserJr":         [2, 4, 1, 5, 4, 3, 3, 3, 3, 8, 8, 8, 8],
    "KingBoo":          [7, 1, 9, 3, 2, 8, 8, 8, 8, 3, 3, 3, 3],
    "InklingGirl":      [3, 4, 2, 3, 3, 5, 5, 5, 5, 6, 6, 6, 6],
    "InklingBoy":       [5, 3, 7, 1, 3, 6, 6, 6, 6, 5, 5, 5, 5],
    "LinkBotW":         [7, 1, 9, 3, 2, 8, 8, 8, 8, 3, 3, 3, 3],
    "Birdo":            [4, 3, 3, 3, 4, 6, 6, 6, 6, 5, 5, 5, 5]
}
const karts = {
    "StandardKart":     [2, 4, 3, 3, 5, 3, 3, 3, 3, 3, 2, 3, 3],
    "PipeFrame":        [1, 6, 3, 4, 6, 1, 3, 1, 1, 5, 4, 4, 2],
    "Mach8":            [3, 3, 2, 4, 5, 3, 3, 5, 4, 2, 2, 4, 2],
    "SteelDriver":      [4, 1, 1, 3, 3, 4, 5, 2, 0, 1, 5, 1, 1],
    "CatCruiser":       [2, 5, 4, 3, 6, 2, 2, 3, 4, 4, 2, 3, 4],
    "CircuitSpecial":   [3, 1, 3, 1, 2, 5, 1, 4, 2, 1, 1, 2, 0],
    "TriSpeeder":       [4, 1, 1, 3, 3, 4, 5, 2, 0, 1, 5, 1, 1],
    "Badwagon":         [4, 0, 2, 5, 1, 5, 2, 3, 1, 0, 1, 1, 0],
    "Prancer":          [1, 2, 1, 2, 4, 4, 3, 3, 3, 3, 3, 2, 3],
    "Biddybuggy":       [0, 7, 1, 4, 7, 0, 1, 2, 1, 5, 4, 5, 4],
    "Landship":         [0, 6, 0, 6, 6, 1, 5, 0, 2, 4, 5, 2, 3],
    "Sneeker":          [2, 2, 1, 0, 4, 4, 2, 3, 3, 3, 2, 3, 2],
    "SportsCoupe":      [3, 3, 2, 4, 5, 3, 3, 5, 4, 2, 2, 4, 2],
    "GoldStandard":     [2, 2, 1, 0, 4, 4, 2, 3, 3, 3, 2, 3, 2],
    "StandardBike":     [1, 5, 3, 5, 5, 2, 2, 4, 3, 4, 3, 4, 3],
    "Comet":            [2, 5, 4, 3, 6, 2, 2, 3, 4, 4, 2, 3, 4],
    "SportBike":        [1, 2, 1, 2, 4, 4, 3, 3, 3, 3, 3, 2, 3],
    "TheDuke":          [2, 4, 3, 3, 5, 3, 3, 3, 3, 3, 2, 3, 3],
    "FlameRider":       [1, 5, 3, 5, 5, 2, 2, 4, 3, 4, 3, 4, 3],
    "Varmint":          [1, 6, 3, 4, 6, 1, 3, 1, 1, 5, 4, 4, 2],
    "MrScooty":         [0, 7, 1, 4, 7, 0, 1, 2, 1, 5, 4, 5, 4],
    "JetBike":          [1, 2, 1, 2, 4, 4, 3, 3, 3, 3, 3, 2, 3],
    "YoshiBike":        [2, 5, 4, 3, 6, 2, 2, 3, 4, 4, 2, 3, 4],
    "StandardATV":      [4, 0, 2, 5, 1, 5, 2, 3, 1, 0, 1, 1, 0],
    "WildWiggler":      [1, 5, 3, 5, 5, 2, 2, 4, 3, 4, 3, 4, 3],
    "TeddyBuggy":       [2, 5, 4, 3, 6, 2, 2, 3, 4, 4, 2, 3, 4],
    "Benz-GLA":         [4, 0, 2, 5, 1, 5, 2, 3, 1, 0, 1, 1, 0],
    "Benz-SilverArrow": [1, 5, 3, 5, 5, 2, 2, 4, 3, 4, 3, 4, 3],
    "Benz-Roadster":    [2, 4, 3, 3, 5, 3, 3, 3, 3, 3, 2, 3, 3],
    "BlueFalcon":       [0, 3, 1, 3, 4, 4, 2, 4, 3, 2, 3, 5, 1],
    "Tanooki":          [3, 2, 4, 7, 4, 2, 4, 3, 3, 4, 4, 3, 3],
    "BDasher":          [3, 1, 3, 1, 2, 5, 1, 4, 2, 1, 1, 2, 0],
    "MasterCycle":      [2, 2, 1, 0, 4, 4, 2, 3, 3, 3, 2, 3, 2],
    "Streetle":         [0, 6, 0, 6, 6, 1, 5, 0, 2, 4, 5, 2, 3],
    "PWing":            [3, 1, 3, 1, 2, 5, 1, 4, 2, 1, 1, 2, 0],
    "CityTripper":      [1, 6, 3, 4, 6, 1, 3, 1, 1, 5, 4, 4, 2],
    "BoneRattler":      [4, 1, 1, 3, 3, 4, 5, 2, 0, 1, 5, 1, 1],
    "KoopaClown":       [3, 2, 4, 7, 4, 2, 4, 3, 3, 4, 4, 3, 3],
    "SplatBuggy":       [0, 3, 1, 3, 4, 4, 2, 4, 3, 2, 3, 5, 1],
    "InkStriker":       [3, 3, 2, 4, 5, 3, 3, 5, 4, 2, 2, 4, 2],
    "MasterCycleZero":  [3, 2, 4, 7, 4, 2, 4, 3, 3, 4, 4, 3, 3]
}
const wheels = {
    "Standard":         [2, 4, 2, 5, 4, 2, 3, 2, 3, 3, 3, 3, 3],
    "Monster":          [4, 2, 3, 7, 3, 2, 2, 2, 1, 0, 1, 0, 1],
    "Roller":           [0, 6, 0, 4, 6, 0, 3, 0, 3, 4, 4, 4, 4],
    "Slim":             [2, 2, 4, 1, 3, 3, 2, 4, 2, 4, 4, 3, 4],
    "Slick":            [3, 1, 4, 0, 1, 4, 0, 4, 0, 2, 0, 2, 1],
    "Metal":            [4, 0, 1, 2, 1, 4, 3, 1, 2, 2, 2, 1, 0],
    "Button":           [0, 5, 1, 3, 5, 1, 2, 2, 2, 3, 3, 4, 2],
    "OffRoad":          [3, 3, 3, 6, 2, 3, 4, 2, 1, 1, 1, 2, 2],
    "Sponge":           [1, 4, 2, 6, 5, 1, 1, 1, 4, 2, 1, 2, 3],
    "Wood":             [2, 2, 4, 1, 3, 3, 2, 4, 2, 4, 4, 3, 4],
    "Cushion":          [1, 4, 2, 6, 5, 1, 1, 1, 4, 2, 1, 2, 3],
    "BlueStandard":     [2, 4, 2, 5, 4, 2, 3, 2, 3, 3, 3, 3, 3],
    "HotMonster":       [4, 2, 3, 7, 3, 2, 2, 2, 1, 0, 1, 0, 1],
    "AzureRoller":      [0, 6, 0, 4, 6, 0, 3, 0, 3, 4, 4, 4, 4],
    "CrimsonSlim":      [2, 2, 4, 1, 3, 3, 2, 4, 2, 4, 4, 3, 4],
    "CyberSlick":       [3, 1, 4, 0, 1, 4, 0, 4, 0, 2, 0, 2, 1],
    "RetroOffRoad":     [3, 3, 3, 6, 2, 3, 4, 2, 1, 1, 1, 2, 2],
    "Gold":             [4, 0, 1, 2, 1, 4, 3, 1, 2, 2, 2, 1, 0],
    "Benz-GLA":         [2, 4, 2, 5, 4, 2, 3, 2, 3, 3, 3, 3, 3],
    "Triforce":         [3, 3, 3, 6, 2, 3, 4, 2, 1, 1, 1, 2, 2],
    "Leaf":             [0, 5, 1, 3, 5, 1, 2, 2, 2, 3, 3, 4, 2],
    "Ancient":          [4, 2, 3, 7, 2, 2, 2, 2, 1, 0, 1, 0, 1]
}
const kites = {
    "SuperGlider":      [1, 1, 1, 1, 1, 1, 1, 0, 2, 1, 0, 1, 1],
    "CloudGlider":      [0, 2, 1, 1, 2, 0, 1, 1, 1, 1, 0, 1, 2],
    "WarioWing":        [2, 1, 2, 0, 1, 1, 0, 1, 2, 1, 1, 0, 1],
    "WaddleWing":       [1, 1, 1, 1, 1, 1, 1, 0, 2, 1, 0, 1, 1],
    "PeachParasol":     [1, 2, 2, 0, 2, 0, 0, 1, 1, 1, 1, 0, 2],
    "Parachute":        [0, 2, 1, 1, 2, 0, 1, 1, 1, 1, 0, 1, 2],
    "Parafoil":         [1, 2, 2, 0, 2, 0, 0, 1, 1, 1, 1, 0, 2],
    "FlowerGlider":     [0, 2, 1, 1, 2, 0, 1, 1, 1, 1, 0, 1, 2],
    "BowserKite":       [1, 2, 2, 0, 2, 0, 0, 1, 1, 1, 1, 0, 2],
    "PlaneGlider":      [2, 1, 2, 0, 1, 1, 0, 1, 2, 1, 1, 0, 1],
    "MKTVParafoil":     [1, 2, 2, 0, 2, 0, 0, 1, 1, 1, 1, 0, 2],
    "GoldGlider":       [2, 1, 2, 0, 1, 1, 0, 1, 2, 1, 1, 0, 1],
    "HylianKite":       [1, 1, 1, 1, 1, 1, 1, 0, 2, 1, 0, 1, 1],
    "PaperGlider":      [0, 2, 1, 1, 2, 0, 1, 1, 1, 1, 0, 1, 2],
    "Paraglider":       [2, 1, 2, 0, 1, 1, 0, 1, 2, 1, 1, 0, 1]
}

const alts = {
    "body": [
        "StandardKart",
        "PipeFrame",
        "CircuitSpecial",
        "Biddybuggy",
        "Sneeker",
        "StandardBike",
        "SportBike",
        "StandardATV",
        "Benz-GLA",
        "CityTripper"
    ],
    "kite": [
        "SuperGlider"
    ]
}

function S(num) {
    return (num + 3) / 4
}
