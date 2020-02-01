"use strict";
const civBreakdown = JSON.parse(`{
    "Aztecs": {
      "disableHorses": true,
      "enabled": {
        "units": [
          "Eagle Scout",
          "Eagle Warrior",
          "Elite Eagle Warrior"
        ],
        "unique": [
          "Jaguar Warrior",
          "Elite Jaguar Warrior",
          "Atlatl",
          "Garland Wars"
        ]
      },
      "disabled": {
        "buildings": [
          "Keep",
          "Bombard Tower"
        ],
        "units": [
          "Hand Cannoneer",
          "Halberdier",
          "Cannon Galleon",
          "Elite Cannon Galleon",
          "Heavy Demo Ship",
          "Galleon",
          "Heavy Scorpion",
          "Bombard Cannon"
        ],
        "techs": [
          "Thumb Ring",
          "Parthian Tactics",
          "Hoardings",
          "Ring Archer Armor",
          "Masonry",
          "Architecture",
          "Bombard Tower",
          "Keep",
          "Two-Man Saw",
          "Guilds"
        ]
      },
      "monkPrefix": "meso_"
    },
    "Berbers": {
      "enabled": {
        "units": [
          "Genitour",
          "Elite Genitour"
        ],
        "unique": [
          "Camel Archer",
          "Elite Camel Archer",
          "Kasbah",
          "Maghrabi Camels"
        ]
      },
      "disabled": {
        "buildings": [
          "Bombard Tower",
          "Keep"
        ],
        "units": [
          "Arbalester",
          "Halberdier",
          "Paladin",
          "Siege Ram",
          "Siege Onager"
        ],
        "techs": [
          "Parthian Tactics",
          "Shipwright",
          "Sanctity",
          "Block Printing",
          "Sappers",
          "Architecture",
          "Bombard Tower",
          "Keep",
          "Two-Man Saw"
        ]
      },
      "monkPrefix": "african_"
    },
    "Britons": {
      "disabled": {
        "buildings": [
          "Bombard Tower"
        ],
        "units": [
          "Hand Cannoneer",
          "Hussar",
          "Paladin",
          "Camel Rider",
          "Heavy Camel Rider",
          "Elite Cannon Galleon",
          "Siege Ram",
          "Siege Onager",
          "Bombard Cannon"
        ],
        "techs": [
          "Thumb Ring",
          "Parthian Tactics",
          "Bloodlines",
          "Redemption",
          "Atonement",
          "Heresy",
          "Bombard Tower",
          "Treadmill Crane",
          "Stone Shaft Mining",
          "Crop Rotation"
        ]
      },
      "enabled": {
        "unique": [
          "Longbowman",
          "Elite Longbowman",
          "Yeomen",
          "Warwolf"
        ]
      }
    },
    "Bulgarians": {
      "enabled": {
        "buildings": [
          "Krepost"
        ],
        "unique": [
          "Konnik",
          "Elite Konnik",
          "Stirrups",
          "Bagains"
        ]
      },
      "disabled": {
        "buildings": [
          "Fortified Wall",
          "Bombard Tower"
        ],
        "units": [
          "Crossbowman",
          "Arbalester",
          "Hand Cannoneer",
          "Champion",
          "Camel Rider",
          "Heavy Camel Rider",
          "Bombard Cannon",
          "Fast Fire Ship",
          "Heavy Demo Ship",
          "Elite Cannon Galleon"
        ],
        "techs": [
          "Ring Archer Armor",
          "Dry Dock",
          "Shipwright",
          "Fortified Wall",
          "Treadmill Crane",
          "Arrowslits",
          "Bombard Tower",
          "Hoardings",
          "Sappers",
          "Atonement",
          "Sanctity",
          "Faith",
          "Block Printing",
          "Two-Man Saw",
          "Guilds"
        ]
      }
    },
    "Burmese": {
      "enabled": {
        "units": [
          "Battle Elephant",
          "Elite Battle Elephant"
        ],
        "unique": [
          "Arambai",
          "Elite Arambai",
          "Howdah",
          "Manipur Cavalry"
        ]
      },
      "disabled": {
        "buildings": [
          "Bombard Tower"
        ],
        "units": [
          "Arbalester",
          "Hand Cannoneer",
          "Camel Rider",
          "Heavy Camel Rider",
          "Paladin",
          "Fast Fire Ship",
          "Heavy Demo Ship",
          "Siege Ram",
          "Siege Onager"
        ],
        "techs": [
          "Thumb Ring",
          "Shipwright",
          "Heresy",
          "Hoardings",
          "Sappers",
          "Leather Archer Armor",
          "Ring Archer Armor",
          "Bombard Tower",
          "Arrowslits",
          "Stone Shaft Mining"
        ]
      },
      "monkPrefix": "asian_"
    },
    "Byzantines": {
      "disabled": {
        "units": [
          "Heavy Scorpion",
          "Siege Onager"
        ],
        "techs": [
          "Parthian Tactics",
          "Bloodlines",
          "Herbal Medicine",
          "Sappers",
          "Blast Furnace",
          "Masonry",
          "Architecture",
          "Siege Engineers",
          "Heated Shot",
          "Treadmill Crane"
        ]
      },
      "enabled": {
        "unique": [
          "Cataphract",
          "Elite Cataphract",
          "Greek Fire",
          "Logistica"
        ]
      }
    },
    "Celts": {
      "disabled": {
        "buildings": [
          "Bombard Tower"
        ],
        "units": [
          "Arbalester",
          "Hand Cannoneer",
          "Camel Rider",
          "Heavy Camel Rider",
          "Fast Fire Ship",
          "Elite Cannon Galleon",
          "Bombard Cannon"
        ],
        "techs": [
          "Thumb Ring",
          "Parthian Tactics",
          "Squires",
          "Bloodlines",
          "Redemption",
          "Illumination",
          "Atonement",
          "Block Printing",
          "Theocracy",
          "Ring Archer Armor",
          "Bracer",
          "Plate Barding Armor",
          "Architecture",
          "Bombard Tower",
          "Two-Man Saw",
          "Crop Rotation"
        ]
      },
      "enabled": {
        "unique": [
          "Woad Raider",
          "Elite Woad Raider",
          "Stronghold",
          "Furor Celtica"
        ]
      }
    },
    "Chinese": {
      "disabled": {
        "units": [
          "Hand Cannoneer",
          "Hussar",
          "Paladin",
          "Fast Fire Ship",
          "Elite Cannon Galleon",
          "Siege Onager",
          "Bombard Cannon"
        ],
        "techs": [
          "Parthian Tactics",
          "Heresy",
          "Hoardings",
          "Siege Engineers",
          "Treadmill Crane",
          "Guilds",
          "Crop Rotation"
        ]
      },
      "enabled": {
        "unique": [
          "Chu Ko Nu",
          "Elite Chu Ko Nu",
          "Great Wall",
          "Rocketry"
        ]
      },
      "monkPrefix": "asian_"
    },
    "Cumans": {
      "enabled": {
        "units": [
          "Steppe Lancer",
          "Elite Steppe Lancer"
        ],
        "unique": [
          "Kipchak",
          "Elite Kipchak",
          "Steppe Husbandry",
          "Cuman Mercenaries"
        ]
      },
      "disabled": {
        "buildings": [
          "Gate",
          "Stone Wall",
          "Fortified Wall",
          "Guard Tower",
          "Keep",
          "Bombard Tower"
        ],
        "units": [
          "Arbalester",
          "Hand Cannoneer",
          "Heavy Camel Rider",
          "Heavy Scorpion",
          "Bombard Cannon",
          "Cannon Galleon",
          "Elite Cannon Galleon",
          "Heavy Demo Ship"
        ],
        "techs": [
          "Bracer",
          "Dry Dock",
          "Shipwright",
          "Fortified Wall",
          "Guard Tower",
          "Treadmill Crane",
          "Architecture",
          "Siege Engineers",
          "Keep",
          "Arrowslits",
          "Bombard Tower",
          "Illumination",
          "Block Printing",
          "Theocracy",
          "Stone Shaft Mining",
          "Husbandry"
        ]
      },
      "monkPrefix": "asian_"
    },
    "Ethiopians": {
      "disabled": {
        "buildings": [
          "Bombard Tower"
        ],
        "units": [
          "Hand Cannoneer",
          "Champion",
          "Paladin",
          "Fast Fire Ship",
          "Elite Cannon Galleon",
          "Heavy Demo Ship"
        ],
        "techs": [
          "Parthian Tactics",
          "Bloodlines",
          "Redemption",
          "Block Printing",
          "Hoardings",
          "Plate Barding Armor",
          "Treadmill Crane",
          "Arrowslits",
          "Bombard Tower",
          "Crop Rotation"
        ]
      },
      "enabled": {
        "unique": [
          "Shotel Warrior",
          "Elite Shotel Warrior",
          "Royal Heirs",
          "Torsion Engines"
        ]
      },
      "monkPrefix": "african_"
    },
    "Franks": {
      "disabled": {
        "buildings": [
          "Keep",
          "Bombard Tower"
        ],
        "units": [
          "Arbalester",
          "Camel Rider",
          "Heavy Camel Rider",
          "Hussar",
          "Elite Cannon Galleon",
          "Siege Ram",
          "Siege Onager"
        ],
        "techs": [
          "Thumb Ring",
          "Parthian Tactics",
          "Bloodlines",
          "Shipwright",
          "Redemption",
          "Atonement",
          "Sappers",
          "Ring Archer Armor",
          "Bracer",
          "Heated Shot",
          "Keep",
          "Bombard Tower",
          "Stone Shaft Mining",
          "Two-Man Saw",
          "Guilds"
        ]
      },
      "enabled": {
        "unique": [
          "Throwing Axeman",
          "Elite Throwing Axeman",
          "Chivalry",
          "Bearded Axe"
        ]
      }
    },
    "Goths": {
      "disabled": {
        "buildings": [
          "Guard Tower",
          "Keep",
          "Bombard Tower",
          "Gate",
          "Stone Wall",
          "Fortified Wall"
        ],
        "units": [
          "Arbalester",
          "Camel Rider",
          "Heavy Camel Rider",
          "Paladin",
          "Elite Cannon Galleon",
          "Siege Ram",
          "Siege Onager"
        ],
        "techs": [
          "Thumb Ring",
          "Parthian Tactics",
          "Dry Dock",
          "Guard Tower",
          "Keep",
          "Bombard Tower",
          "Fortified Wall",
          "Redemption",
          "Atonement",
          "Block Printing",
          "Heresy",
          "Hoardings",
          "Plate Barding Armor",
          "Plate Mail Armor",
          "Siege Engineers",
          "Treadmill Crane",
          "Arrowslits",
          "Gold Shaft Mining",
          "Supplies"
        ]
      },
      "enabled": {
        "unique": [
          "Huskarl",
          "Elite Huskarl",
          "Anarchy",
          "Perfusion"
        ]
      }
    },
    "Huns": {
      "disabled": {
        "buildings": [
          "Guard Tower",
          "Keep",
          "Bombard Tower",
          "Fortified Wall"
        ],
        "units": [
          "Arbalester",
          "Hand Cannoneer",
          "Champion",
          "Camel Rider",
          "Heavy Camel Rider",
          "Fast Fire Ship",
          "Cannon Galleon",
          "Elite Cannon Galleon",
          "Onager",
          "Siege Onager",
          "Heavy Scorpion",
          "Bombard Cannon"
        ],
        "techs": [
          "Shipwright",
          "Guard Tower",
          "Keep",
          "Bombard Tower",
          "Redemption",
          "Herbal Medicine",
          "Block Printing",
          "Theocracy",
          "Hoardings",
          "Ring Archer Armor",
          "Plate Mail Armor",
          "Fortified Wall",
          "Heated Shot",
          "Treadmill Crane",
          "Architecture",
          "Siege Engineers",
          "Arrowslits",
          "Stone Shaft Mining",
          "Crop Rotation"
        ]
      },
      "enabled": {
        "unique": [
          "Tarkan",
          "Elite Tarkan",
          "Marauders",
          "Atheism"
        ]
      }
    },
    "Incas": {
      "disableHorses": true,
      "enabled": {
        "units": [
          "Slinger"
        ],
        "unique": [
          "Kamayuk",
          "Elite Kamayuk",
          "Andean Sling",
          "Couriers"
        ]
      },
      "disabled": {
        "buildings": [
          "Bombard Tower"
        ],
        "units": [
          "Hand Cannoneer",
          "Cannon Galleon",
          "Elite Cannon Galleon",
          "Heavy Demo Ship",
          "Siege Onager",
          "Bombard Cannon"
        ],
        "techs": [
          "Bombard Tower",
          "Atonement",
          "Fervor",
          "Architecture",
          "Two-Man Saw"
        ]
      },
      "monkPrefix": "meso_"
    },
    "Indians": {
      "enabled": {
        "units": [
          "Imperial Camel Rider"
        ],
        "unique": [
          "Elephant Archer",
          "Elite Elephant Archer",
          "Sultans",
          "Shatagni"
        ]
      },
      "disabled": {
        "buildings": [
          "Keep",
          "Bombard Tower"
        ],
        "units": [
          "Arbalester",
          "Knight",
          "Cavalier",
          "Paladin",
          "Fast Fire Ship",
          "Heavy Scorpion",
          "Siege Ram",
          "Siege Onager"
        ],
        "techs": [
          "Shipwright",
          "Keep",
          "Bombard Tower",
          "Atonement",
          "Heresy",
          "Sappers",
          "Plate Mail Armor",
          "Architecture",
          "Arrowslits",
          "Treadmill Crane",
          "Crop Rotation"
        ]
      },
      "monkPrefix": "african_"
    },
    "Italians": {
      "enabled": {
        "units": [
          "Condottiero"
        ],
        "unique": [
          "Genoese Crossbowman",
          "Elite Genoese Crossbowman",
          "Pavise",
          "Silk Road"
        ]
      },
      "disabled": {
        "units": [
          "Heavy Cav Archer",
          "Halberdier",
          "Camel Rider",
          "Heavy Camel Rider",
          "Paladin",
          "Heavy Demo Ship",
          "Heavy Scorpion",
          "Siege Ram",
          "Siege Onager"
        ],
        "techs": [
          "Parthian Tactics",
          "Heresy",
          "Sappers",
          "Siege Engineers",
          "Gold Shaft Mining"
        ]
      }
    },
    "Japanese": {
      "disabled": {
        "buildings": [
          "Bombard Tower"
        ],
        "units": [
          "Hussar",
          "Camel Rider",
          "Heavy Camel Rider",
          "Paladin",
          "Heavy Demo Ship",
          "Siege Ram",
          "Siege Onager",
          "Bombard Cannon"
        ],
        "techs": [
          "Bombard Tower",
          "Heresy",
          "Hoardings",
          "Sappers",
          "Plate Barding Armor",
          "Architecture",
          "Heated Shot",
          "Stone Shaft Mining",
          "Guilds",
          "Crop Rotation"
        ]
      },
      "enabled": {
        "unique": [
          "Samurai",
          "Elite Samurai",
          "Yasama",
          "Kataparuto"
        ]
      },
      "monkPrefix": "asian_"
    },
    "Khmer": {
      "enabled": {
        "units": [
          "Battle Elephant",
          "Elite Battle Elephant"
        ],
        "unique": [
          "Ballista Elephant",
          "Elite Ballista Elephant",
          "Tusk Swords",
          "Double Crossbow"
        ]
      },
      "disabled": {
        "buildings": [
          "Bombard Tower"
        ],
        "units": [
          "Champion",
          "Camel Rider",
          "Heavy Camel Rider",
          "Paladin",
          "Heavy Demo Ship",
          "Siege Onager"
        ],
        "techs": [
          "Thumb Ring",
          "Squires",
          "Bombard Tower",
          "Atonement",
          "Heresy",
          "Block Printing",
          "Shipwright",
          "Plate Mail Armor",
          "Arrowslits",
          "Two-Man Saw",
          "Guilds"
        ]
      },
      "monkPrefix": "asian_"
    },
    "Koreans": {
      "enabled": {
        "units": [
          "Turtle Ship",
          "Elite Turtle Ship"
        ],
        "unique": [
          "War Wagon",
          "Elite War Wagon",
          "Panokseon",
          "Shinkichon"
        ]
      },
      "disabled": {
        "units": [
          "Camel Rider",
          "Heavy Camel Rider",
          "Paladin",
          "Elite Cannon Galleon",
          "Demolition Raft",
          "Demolition Ship",
          "Heavy Demo Ship",
          "Siege Ram",
          "Heavy Scorpion"
        ],
        "techs": [
          "Parthian Tactics",
          "Bloodlines",
          "Redemption",
          "Atonement",
          "Heresy",
          "Illumination",
          "Hoardings",
          "Sappers",
          "Blast Furnace",
          "Plate Barding Armor",
          "Crop Rotation"
        ]
      },
      "monkPrefix": "asian_"
    },
    "Lithuanians": {
      "disabled": {
        "units": [
          "Arbalester",
          "Camel Rider",
          "Heavy Camel Rider",
          "Siege Ram",
          "Siege Onager",
          "Heavy Scorpion",
          "Heavy Demo Ship"
        ],
        "techs": [
          "Parthian Tactics",
          "Plate Mail Armor",
          "Shipwright",
          "Siege Engineers",
          "Arrowslits",
          "Sappers",
          "Gold Shaft Mining"
        ]
      },
      "enabled": {
        "unique": [
          "Leitis",
          "Elite Leitis",
          "Hill Forts",
          "Tower Shields"
        ]
      }
    },
    "Magyars": {
      "disabled": {
        "buildings": [
          "Keep",
          "Bombard Tower",
          "Fortified Wall"
        ],
        "units": [
          "Hand Cannoneer",
          "Camel Rider",
          "Heavy Camel Rider",
          "Elite Cannon Galleon",
          "Heavy Demo Ship",
          "Siege Ram",
          "Siege Onager",
          "Bombard Cannon"
        ],
        "techs": [
          "Squires",
          "Keep",
          "Bombard Tower",
          "Fortified Wall",
          "Redemption",
          "Atonement",
          "Faith",
          "Plate Mail Armor",
          "Architecture",
          "Arrowslits",
          "Stone Shaft Mining",
          "Guilds"
        ]
      },
      "enabled": {
        "unique": [
          "Magyar Huszar",
          "Elite Magyar Huszar",
          "Corvinian Army",
          "Recurve Bow"
        ]
      }
    },
    "Malay": {
      "enabled": {
        "units": [
          "Battle Elephant",
          "Elite Battle Elephant"
        ],
        "unique": [
          "Karambit Warrior",
          "Elite Karambit Warrior",
          "Thalassocracy",
          "Forced Levy"
        ]
      },
      "disabled": {
        "buildings": [
          "Fortified Wall"
        ],
        "units": [
          "Hand Cannoneer",
          "Heavy Cav Archer",
          "Champion",
          "Hussar",
          "Camel Rider",
          "Heavy Camel Rider",
          "Paladin",
          "Heavy Demo Ship",
          "Siege Ram",
          "Siege Onager"
        ],
        "techs": [
          "Parthian Tactics",
          "Bloodlines",
          "Fortified Wall",
          "Fervor",
          "Theocracy",
          "Hoardings",
          "Chain Barding Armor",
          "Plate Barding Armor",
          "Architecture",
          "Arrowslits",
          "Treadmill Crane",
          "Two-Man Saw"
        ]
      },
      "monkPrefix": "asian_"
    },
    "Malians": {
      "disabled": {
        "buildings": [
          "Bombard Tower"
        ],
        "units": [
          "Halberdier",
          "Hussar",
          "Paladin",
          "Galleon",
          "Elite Cannon Galleon",
          "Siege Ram",
          "Heavy Scorpion"
        ],
        "techs": [
          "Parthian Tactics",
          "Shipwright",
          "Bombard Tower",
          "Bracer",
          "Illumination",
          "Blast Furnace",
          "Siege Engineers",
          "Arrowslits",
          "Two-Man Saw"
        ]
      },
      "enabled": {
        "unique": [
          "Gbeto",
          "Elite Gbeto",
          "Tigui",
          "Farimba"
        ]
      },
      "monkPrefix": "african_"
    },
    "Mayans": {
      "disableHorses": true,
      "enabled": {
        "units": [
          "Eagle Scout",
          "Eagle Warrior",
          "Elite Eagle Warrior"
        ],
        "unique": [
          "Plumed Archer",
          "Elite Plumed Archer",
          "Obsidian Arrows",
          "El Dorado"
        ]
      },
      "disabled": {
        "buildings": [
          "Bombard Tower"
        ],
        "units": [
          "Hand Cannoneer",
          "Champion",
          "Cannon Galleon",
          "Elite Cannon Galleon",
          "Siege Onager",
          "Bombard Cannon"
        ],
        "techs": [
          "Bombard Tower",
          "Redemption",
          "Illumination",
          "Siege Engineers",
          "Arrowslits",
          "Gold Shaft Mining"
        ]
      },
      "monkPrefix": "meso_"
    },
    "Mongols": {
      "disabled": {
        "buildings": [
          "Keep",
          "Bombard Tower"
        ],
        "units": [
          "Hand Cannoneer",
          "Halberdier",
          "Paladin",
          "Elite Cannon Galleon",
          "Bombard Cannon"
        ],
        "techs": [
          "Dry Dock",
          "Keep",
          "Bombard Tower",
          "Redemption",
          "Illumination",
          "Sanctity",
          "Block Printing",
          "Theocracy",
          "Ring Archer Armor",
          "Plate Barding Armor",
          "Architecture",
          "Heated Shot",
          "Treadmill Crane",
          "Arrowslits",
          "Two-Man Saw",
          "Guilds",
          "Crop Rotation"
        ]
      },
      "enabled": {
        "unique": [
          "Mangudai",
          "Elite Mangudai",
          "Nomads",
          "Drill"
        ]
      },
      "monkPrefix": "asian_"
    },
    "Persians": {
      "disabled": {
        "buildings": [
          "Fortified Wall",
          "Keep",
          "Bombard Tower"
        ],
        "units": [
          "Arbalester",
          "Two-Handed Swordsman",
          "Champion",
          "Siege Onager"
        ],
        "techs": [
          "Shipwright",
          "Fortified Wall",
          "Keep",
          "Bombard Tower",
          "Redemption",
          "Illumination",
          "Atonement",
          "Heresy",
          "Sanctity",
          "Bracer",
          "Siege Engineers",
          "Arrowslits",
          "Treadmill Crane"
        ]
      },
      "enabled": {
        "unique": [
          "War Elephant",
          "Elite War Elephant",
          "Kamandaran",
          "Mahouts"
        ]
      },
      "monkPrefix": "african_"
    },
    "Portuguese": {
      "enabled": {
        "buildings": [
          "Feitoria"
        ],
        "units": [
          "Caravel",
          "Elite Caravel"
        ],
        "unique": [
          "Organ Gun",
          "Elite Organ Gun",
          "Carrack",
          "Arquebus"
        ]
      },
      "disabled": {
        "units": [
          "Heavy Cav Archer",
          "Hussar",
          "Camel Rider",
          "Heavy Camel Rider",
          "Paladin",
          "Fast Fire Ship",
          "Siege Ram",
          "Siege Onager",
          "Heavy Scorpion"
        ],
        "techs": [
          "Parthian Tactics",
          "Squires",
          "Shipwright",
          "Illumination",
          "Hoardings",
          "Arrowslits",
          "Gold Shaft Mining"
        ]
      }
    },
    "Saracens": {
      "disabled": {
        "buildings": [
          "Bombard Tower"
        ],
        "units": [
          "Halberdier",
          "Cavalier",
          "Paladin",
          "Fast Fire Ship",
          "Heavy Scorpion"
        ],
        "techs": [
          "Shipwright",
          "Bombard Tower",
          "Sappers",
          "Architecture",
          "Heated Shot",
          "Stone Shaft Mining",
          "Guilds",
          "Crop Rotation"
        ]
      },
      "enabled": {
        "unique": [
          "Mameluke",
          "Elite Mameluke",
          "Madrasah",
          "Zealotry"
        ]
      },
      "monkPrefix": "african_"
    },
    "Slavs": {
      "disabled": {
        "buildings": [
          "Keep",
          "Bombard Tower"
        ],
        "units": [
          "Arbalester",
          "Hand Cannoneer",
          "Camel Rider",
          "Heavy Camel Rider",
          "Paladin",
          "Elite Cannon Galleon",
          "Heavy Demo Ship",
          "Bombard Cannon"
        ],
        "techs": [
          "Thumb Ring",
          "Parthian Tactics",
          "Shipwright",
          "Keep",
          "Bombard Tower",
          "Heresy",
          "Bracer",
          "Architecture",
          "Arrowslits",
          "Heated Shot",
          "Stone Shaft Mining",
          "Guilds"
        ]
      },
      "enabled": {
        "unique": [
          "Boyar",
          "Elite Boyar",
          "Orthodoxy",
          "Druzhina"
        ]
      }
    },
    "Spanish": {
      "enabled": {
        "units": [
          "Missionary"
        ],
        "unique": [
          "Conquistador",
          "Elite Conquistador",
          "Inquisition",
          "Supremacy"
        ]
      },
      "disabled": {
        "units": [
          "Crossbowman",
          "Arbalester",
          "Camel Rider",
          "Heavy Camel Rider",
          "Siege Onager",
          "Heavy Scorpion"
        ],
        "techs": [
          "Parthian Tactics",
          "Siege Engineers",
          "Heated Shot",
          "Treadmill Crane",
          "Gold Shaft Mining",
          "Crop Rotation"
        ]
      }
    },
    "Tatars": {
      "enabled": {
        "units": [
          "Steppe Lancer",
          "Elite Steppe Lancer"
        ],
        "unique": [
          "Keshik",
          "Elite Keshik",
          "Silk Armor",
          "Timurid Siegecraft"
        ]
      },
      "disabled": {
        "buildings": [
          "Keep"
        ],
        "units": [
          "Arbalester",
          "Champion",
          "Halberdier",
          "Paladin",
          "Siege Onager",
          "Bombard Cannon",
          "Heavy Demo Ship"
        ],
        "techs": [
          "Chain Mail Armor",
          "Plate Mail Armor",
          "Shipwright",
          "Architecture",
          "Keep",
          "Arrowslits",
          "Hoardings",
          "Redemption",
          "Heresy",
          "Sanctity",
          "Faith",
          "Theocracy",
          "Stone Shaft Mining",
          "Two-Man Saw"
        ]
      }
    },
    "Teutons": {
      "disabled": {
        "units": [
          "Arbalester",
          "Heavy Cav Archer",
          "Light Cavalry",
          "Hussar",
          "Camel Rider",
          "Heavy Camel Rider",
          "Elite Cannon Galleon",
          "Siege Ram"
        ],
        "techs": [
          "Thumb Ring",
          "Parthian Tactics",
          "Husbandry",
          "Dry Dock",
          "Shipwright",
          "Bracer",
          "Architecture",
          "Gold Shaft Mining"
        ]
      },
      "enabled": {
        "unique": [
          "Teutonic Knight",
          "Elite Teutonic Knight",
          "Ironclad",
          "Crenellations"
        ]
      }
    },
    "Turks": {
      "disabled": {
        "units": [
          "Arbalester",
          "Elite Skirmisher",
          "Pikeman",
          "Halberdier",
          "Paladin",
          "Fast Fire Ship",
          "Onager",
          "Siege Onager"
        ],
        "techs": [
          "Herbal Medicine",
          "Illumination",
          "Block Printing",
          "Stone Shaft Mining",
          "Crop Rotation",
          "Siege Engineers"
        ]
      },
      "enabled": {
        "unique": [
          "Janissary",
          "Elite Janissary",
          "Sipahi",
          "Artillery"
        ]
      },
      "monkPrefix": "african_"
    },
    "Vietnamese": {
      "enabled": {
        "units": [
          "Battle Elephant",
          "Elite Battle Elephant",
          "Imperial Skirmisher"
        ],
        "unique": [
          "Rattan Archer",
          "Elite Rattan Archer",
          "Chatras",
          "Paper Money"
        ]
      },
      "disabled": {
        "units": [
          "Hand Cannoneer",
          "Hussar",
          "Paladin",
          "Camel Rider",
          "Heavy Camel Rider",
          "Fast Fire Ship",
          "Siege Ram",
          "Siege Onager",
          "Heavy Scorpion"
        ],
        "techs": [
          "Parthian Tactics",
          "Shipwright",
          "Redemption",
          "Heresy",
          "Fervor",
          "Blast Furnace",
          "Masonry",
          "Architecture",
          "Gold Shaft Mining"
        ]
      },
      "monkPrefix": "asian_"
    },
    "Vikings": {
      "enabled": {
        "units": [
          "Longboat",
          "Elite Longboat"
        ],
        "unique": [
          "Berserk",
          "Elite Berserk",
          "Chieftains",
          "Berserkergang"
        ]
      },
      "disabled": {
        "buildings": [
          "Keep",
          "Bombard Tower"
        ],
        "units": [
          "Hand Cannoneer",
          "Heavy Cav Archer",
          "Halberdier",
          "Hussar",
          "Camel Rider",
          "Heavy Camel Rider",
          "Paladin",
          "Fire Galley",
          "Fire Ship",
          "Fast Fire Ship",
          "Siege Onager",
          "Bombard Cannon"
        ],
        "techs": [
          "Parthian Tactics",
          "Bloodlines",
          "Husbandry",
          "Shipwright",
          "Keep",
          "Bombard Tower",
          "Redemption",
          "Herbal Medicine",
          "Sanctity",
          "Illumination",
          "Theocracy",
          "Plate Barding Armor",
          "Stone Shaft Mining",
          "Guilds"
        ]
      }
    }
  }`);
