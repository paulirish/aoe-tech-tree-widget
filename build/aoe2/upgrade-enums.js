"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AgeUpgrades;
(function (AgeUpgrades) {
    AgeUpgrades["Feudal"] = "Feudal";
    AgeUpgrades["Castle"] = "Castle";
    AgeUpgrades["Imp"] = "Imperial";
})(AgeUpgrades = exports.AgeUpgrades || (exports.AgeUpgrades = {}));
var BlacksmithUpgrades;
(function (BlacksmithUpgrades) {
    //feudal
    BlacksmithUpgrades["Forging"] = "Forging";
    BlacksmithUpgrades["Scale_Mail_Armor"] = "Scale Mail Armor";
    BlacksmithUpgrades["Scale_Barding_Armor"] = "Scale Barding Armor";
    BlacksmithUpgrades["Fletching"] = "Fletching";
    BlacksmithUpgrades["Padded_Archer_Armor"] = "Padded Archer Armor";
    //castle
    BlacksmithUpgrades["Iron_Casting"] = "Iron Casting";
    BlacksmithUpgrades["Chain_Mail_Armor"] = "Chain Mail Armor";
    BlacksmithUpgrades["Chain_Barding_Armor"] = "Chain Barding Armor";
    BlacksmithUpgrades["Bodkin_Arrow"] = "Bodkin Arrow";
    BlacksmithUpgrades["Leather_Archer_Armor"] = "Leather Archer Armor";
    //imp
    BlacksmithUpgrades["Blast_Furnace"] = "Blast Furnace";
    BlacksmithUpgrades["Plate_Mail_Armor"] = "Plate Mail Armor";
    BlacksmithUpgrades["Plate_Barding_Armor"] = "Plate Barding Armor";
    BlacksmithUpgrades["Bracer"] = "Bracer";
    BlacksmithUpgrades["Ring_Archer_Armor"] = "Ring Archer Armor";
})(BlacksmithUpgrades = exports.BlacksmithUpgrades || (exports.BlacksmithUpgrades = {}));
var MonestaryUpgrades;
(function (MonestaryUpgrades) {
    MonestaryUpgrades["Redemption"] = "Redemption";
    MonestaryUpgrades["Fervor"] = "Fervor";
    MonestaryUpgrades["Sanctity"] = "Sanctity";
    MonestaryUpgrades["Atonement"] = "Atonement";
    MonestaryUpgrades["Herbal_Medicine"] = "Herbal Medicine";
    MonestaryUpgrades["Heresy"] = "Heresy";
    //imp
    MonestaryUpgrades["Block_Printing"] = "Block Printing";
    MonestaryUpgrades["Illumination"] = "Illumination";
    MonestaryUpgrades["Faith"] = "Faith";
    MonestaryUpgrades["Theocracy"] = "Theocracy";
})(MonestaryUpgrades = exports.MonestaryUpgrades || (exports.MonestaryUpgrades = {}));
var UniversityUpgrades;
(function (UniversityUpgrades) {
    UniversityUpgrades["Masonry"] = "Masonry";
    UniversityUpgrades["Fortified_Wall"] = "Fortified Wall";
    UniversityUpgrades["Ballistics"] = "Ballistics";
    UniversityUpgrades["Guard_Tower"] = "Guard Tower";
    UniversityUpgrades["Heated_Shot"] = "Heated Shot";
    UniversityUpgrades["Murder_Holes"] = "Murder Holes";
    UniversityUpgrades["Treadmill_Crane"] = "Treadmill Crane";
    //imp
    UniversityUpgrades["Architecture"] = "Architecture";
    UniversityUpgrades["Chemistry"] = "Chemistry";
    UniversityUpgrades["Bombard_Tower"] = "Bombard Tower";
    UniversityUpgrades["Siege_Engineers"] = "Siege Engineers";
    UniversityUpgrades["Keep"] = "Keep";
    UniversityUpgrades["Arrowslits"] = "Arrowslits";
})(UniversityUpgrades = exports.UniversityUpgrades || (exports.UniversityUpgrades = {}));
var MiningUpgrades;
(function (MiningUpgrades) {
    //feudal
    MiningUpgrades["Stone_Mining"] = "Stone Mining";
    //castle
    MiningUpgrades["Stone_Shaft_Mining"] = "Stone Shaft Mining";
})(MiningUpgrades = exports.MiningUpgrades || (exports.MiningUpgrades = {}));
var LumberUpgrades;
(function (LumberUpgrades) {
    //feudal
    LumberUpgrades["Double_Bit_Axe"] = "Double-Bit Axe";
    //castle
    LumberUpgrades["Bow_Saw"] = "Bow Saw";
    //imp
    LumberUpgrades["Two_Man_Saw"] = "Two-Man Saw";
})(LumberUpgrades = exports.LumberUpgrades || (exports.LumberUpgrades = {}));
var MillUpgrades;
(function (MillUpgrades) {
    //faudal
    MillUpgrades["Horse_Collar"] = "Horse Collar";
    //castle
    MillUpgrades["Heavy_Plow"] = "Heavy Plow";
    //imp
    MillUpgrades["Crop_Rotation"] = "Crop Rotation";
})(MillUpgrades = exports.MillUpgrades || (exports.MillUpgrades = {}));
var SiegeUpgrades;
(function (SiegeUpgrades) {
    SiegeUpgrades["Onager"] = "Onager";
    SiegeUpgrades["Siege_Onager"] = "Siege Onager";
    SiegeUpgrades["Capped_Ram"] = "Capped Ram";
    SiegeUpgrades["Siege_Ram"] = "Siege Ram";
    SiegeUpgrades["Heavy_Scorpion"] = "Heavy Scorpion";
    SiegeUpgrades["Bombard_Cannon"] = "Bombard Cannon";
})(SiegeUpgrades = exports.SiegeUpgrades || (exports.SiegeUpgrades = {}));
var DockUpgrades;
(function (DockUpgrades) {
    //feudal
    DockUpgrades["War_Galley_Fire_Ship_and_Demolition_Ship"] = "War Galley, Fire Ship and Demolition Ship";
    //castle
    DockUpgrades["Gillnets"] = "Gillnets";
    DockUpgrades["Careening"] = "Careening";
    //imp
    DockUpgrades["Heavy_Demolition_Ship"] = "Heavy Demolition Ship";
    DockUpgrades["Fast_Fire_Ship"] = "Fast Fire Ship";
    DockUpgrades["Galleon"] = "Galleon";
    DockUpgrades["Cannon_Galleon"] = "Cannon Galleon";
    DockUpgrades["Elite_Cannon_Galleon"] = "Elite Cannon Galleon";
    DockUpgrades["Dry_Dock"] = "Dry Dock";
    DockUpgrades["Shipwright"] = "Shipwright";
})(DockUpgrades = exports.DockUpgrades || (exports.DockUpgrades = {}));
var StableUpgrades;
(function (StableUpgrades) {
    //feudal
    StableUpgrades["Bloodlines"] = "Bloodlines";
    //castle
    StableUpgrades["Light_Cavalry"] = "Light Cavalry";
    StableUpgrades["Husbandry"] = "Husbandry";
    //imp
    StableUpgrades["Hussar"] = "Hussar";
    StableUpgrades["Cavalier"] = "Cavalier";
    StableUpgrades["Paladin"] = "Paladin";
    StableUpgrades["Heavy_Camel_Rider"] = "Heavy Camel Rider";
    StableUpgrades["Imperial_Camel_Rider"] = "Imperial Camel Rider";
    StableUpgrades["Elite_Battle_Elephant"] = "Elite Battle Elephant";
    StableUpgrades["Elite_Steppe_Lancer"] = "Elite Steppe Lancer";
})(StableUpgrades = exports.StableUpgrades || (exports.StableUpgrades = {}));
var BarrackUpgrades;
(function (BarrackUpgrades) {
    //feudal
    BarrackUpgrades["Supplies"] = "Supplies";
    BarrackUpgrades["Man_at_Arms"] = "Man-at-Arms";
    //castle
    BarrackUpgrades["Squires"] = "Squires";
    BarrackUpgrades["Arson"] = "Arson";
    BarrackUpgrades["Long_Swordsman"] = "Long Swordsman";
    BarrackUpgrades["Pikeman"] = "Pikeman";
    BarrackUpgrades["Eagle_Warrior"] = "Eagle Warrior";
    //imp
    BarrackUpgrades["Two_Handed_Swordsman"] = "Two-Handed Swordsman";
    BarrackUpgrades["Champion"] = "Champion";
    BarrackUpgrades["Halberdier"] = "Halberdier";
    BarrackUpgrades["Elite_Eagle_Warrior"] = "Elite Eagle Warrior";
})(BarrackUpgrades = exports.BarrackUpgrades || (exports.BarrackUpgrades = {}));
var ArcherUpgrades;
(function (ArcherUpgrades) {
    //castle
    ArcherUpgrades["Crossbowman"] = "Crossbowman";
    ArcherUpgrades["Elite_Skirmisher"] = "Elite Skirmisher";
    ArcherUpgrades["Thumb_Ring"] = "Thumb Ring";
    //imp
    ArcherUpgrades["Arbalester"] = "Arbalester";
    ArcherUpgrades["Imperial_Skirmisher"] = "Imperial Skirmisher";
    ArcherUpgrades["Heavy_Cavalry_Archer"] = "Heavy Cavalry Archer";
    ArcherUpgrades["Elite_Genitour"] = "Elite Genitour";
    ArcherUpgrades["Parthian_Tactics"] = "Parthian Tactics";
})(ArcherUpgrades = exports.ArcherUpgrades || (exports.ArcherUpgrades = {}));
