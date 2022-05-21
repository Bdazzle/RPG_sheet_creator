// import { WoDGames, WoDstatSection, StatSubSection, PowerPointsSect } from "./types/RPGtypes"

// export const WoD5Egames = {
//     "Vampire 5th Edition": {
//         stats: {
//             "Character Info": ["Name", "Chronicle", "Sire", "Concept", "Ambition", "Desire", "Predator", "Clan", "Generation"],
//             "Stat Categories": ["Physical", "Social", "Mental"],
//             "attributes": ["Strength", "Dexterity", "Stamina", "Charisma", "Manipulation", "Composure", "Intelligence", "Wits", "Resolve"],
//             "skills": ["Athletics", "Brawl", "Craft", "Drive", "Firearms", "Melee", "Larceny", "Stealth", "Survival",
//                 "Animal Ken", "Etiquette", "Insight", "Intimidation", "Leadership", "Performance", "Persuasion", "Streetwise", "Subterfuge",
//                 "Academics", "Awareness", "Finance", "Investigation", "Medicine", "Occult", "Politics", "Science", "Technology"],
//             "Other Stats": ["Hunger", "Humanity"],
//             "disciplines": []
//         },
//         previewSheet: "Vampire 5th Edition_blank.jpg",
//         pips: true,
//     },
//     "Custom": {
//         stats: {
//             "Character Info": ["Name", "Chronicle", "Sire", "Concept", "Ambition", "Desire", "Predator", "Clan", "Generation"] as string[],
//             "Stat Categories": ["Physical", "Social", "Mental"],
//             "attributes": ["Strength", "Dexterity", "Stamina", "Charisma", "Manipulation", "Composure", "Intelligence", "Wits", "Resolve"] as string[],
//             "skills": ["Athletics", "Brawl", "Craft", "Drive", "Firearms", "Melee", "Larceny", "Stealth", "Survival",
//                 "Animal Ken", "Etiquette", "Insight", "Intimidation", "Leadership", "Performance", "Persuasion", "Streetwise", "Subterfuge",
//                 "Academics", "Awareness", "Finance", "Investigation", "Medicine", "Occult", "Politics", "Science", "Technology"] as string[],
//             "Other Stats": ["Hunger, Humanity"],
//             "powers": []
//         },
//         previewSheet: "World of Darkness 5th Edition_blank.jpg",
//         pips: true,
//     }
// }

// export const WoDgames : WoDGames = {
//     "Werewolf The Apocalypse": {
//         stats: {
//             "Character Info": ["Name","Player","Chronicle","Breed", "Auspice", "Tribe", "Pack Name", "Pack Totem", "Concept"] as string[],
//             "Attributes": {
//                 "Physical": ["Strength","Dexterity", "Stamina"],
//                 "Social": ["Charisma", "Manipulation", "Appearance"],
//                 "Mental": ["Perception", "Intelligence", "Wits"]
//             },
//             "Abilities": {
//                 "Talents": ["Alertness", "Athletics", "Brawl", "Empathy", "Expression", "Leadership", "Initimidation", "Primal-Urge", "Streetwise", "Subterfuge"],
//                 "Skills": ["Animal Ken", "Crafts", "Drive", "Etiquette", "Firearms", "Larceny", "Melee", "Performance", "Stealth", "Survival"],
//                 "Knowledges": ["Academics", "Computer", "Enigmas", "Investigation", "Law", "Medicine", "Occult", "Rituals", "Science", "Technology"]
//             },
//             "Advantages": {
//                 "Backgrounds": [],
//                 "Gifts": [],
//             },
//             "Renown": {
//                 "Glory":{perm:0,temp:0}, 
//                 "Honor":{perm:0,temp:0}, 
//                 "Wisdom":{perm:0,temp:0},
//             },
//             "Powerpoints": {
//                 "Rage":{perm:0,temp:0}, 
//                 "Gnosis":{perm:0,temp:0}, 
//                 "Willpower":{perm:0,temp:0}, 
//             },
//             "Other Stats" :[ "Rank", "Health", "Experience"]
//         },
//         previewSheet: "Werewolf_sheet_blank.jpg",
//         pips: false,
//     } ,
// }
// console.log(JSON.stringify(WoD5Egames["Custom"].stats))