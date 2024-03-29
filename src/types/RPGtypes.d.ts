
export type StatValues = {
    current: string;
    max?: string
}

// export type Sections = {
//     [key in string | number]: {
//         coordinates: [number, number][];
//         mode: string;
//         value: StatValues;
//         style: string;
//         fillcolor: string;
//         showLabel?: boolean;
//         fontSize?: number;
//     };
// };
export type Sections = {
    [key in string | number]: NestedSections
};


export type NestedSections = {
    coordinates: [number, number][];
    mode: string;
    value: StatValues;
    style: string;
    fillcolor: string;
    showLabel?: boolean;
    fontSize?: number;
}

/* Change SheetData to interface. Extend SheetData for CustomSheetData? */
export type SheetData = {
    system: string
    stat_block: object
    sheet_url: File | string
    pips?:boolean
    style?: string
    template: string
}

export type CustomSheetData = {
    creatorID: string
    system: string
    system_name: string
    sections: Sections
    image: string | File
    sheet_uuid?: uuid
}

export type SheetTypes = {} | SheetData | CustomSheetData;

export type CharacterData<T, K> = {
    templateData: T
    characterInfo: { [key: string]: K }
    character_uuid?: uuid | undefined
    creatorID?: string
    sharedWith?: string[]
    character_name?: string
}


export interface CreatorProps {
    saveCharacter: (data: object, characterSection: string) => void
    setPath: (path: string) => void
    savedTemplate: SheetData
    replaceStat: (newVal: string, position: number, statType: keyof SheetStats) => void
    systemChange: React.Dispatch<SetStateAction<SheetData>>
}

/* World of Darkness 5e template types*/
export type WoD5eGames = {
    [key: string]: {
        stats: { [key: string]: Array<string> }
        sheet_url: string
        pips: boolean
    }
}
export type WoD5eTemplateSections = {
    stats: SheetStats
    sheet_url: string
    pips: boolean
}

export interface WoD5eStatCategory {
    // substat: string
    rows: number;
    fields: { [key: string]: number }
    max: number;
    category: string;
    categoryHeads?: string[];
    addToCharacter: AddToCharacter
}

export type SheetStats = {
    [key: string]: string[]
}

/* World of Darkness template types */

export interface WoDGames {
    [key: string]: WoDTemplateSections<WoDstatSection>
   
}
export type WoDstatSection = {
    [key: string]: string[] | {[key: string]: string[]} | {[key: string]: {perm: number,temp: number}}
}

export type StatSubSection = {
    [key: string]: string[]
}

export type PowerPointsSect = {
    [key: string]: {
        perm: number,
        temp: number
    }
}
export type WoDTemplateSections<T> = {
    stats: T
    sheet_url: string
    pips: boolean
}

export type CharacterSheet<T> = {
    [key: string]: T
}
export interface Editor {
    setPath: (path: string) => void
}

export type AddToCharacter<T> = ( val: T, bottomlayer: string, layer1?: string, layer2?: string) => void
export type RemoveFromCharacter<T> = (val: T, bottomLayer: string, layer1?: string, layer2?: string) => void

export interface CharacterTextFields {
    substat: string
    columns: number;
    fields: { [key: string]: string }
    addToCharacter: AddToCharacter
    font?: string;
}

export interface AttributeFields {
    savedValue: number
    name: string;
    max: number[];
    addToCharacter: AddToCharacter
    category: string;
    substat?: string
}

export type WoDStatCategory = {
    rows: number;
    fields: { [key: string]: number }
    max: number;
    category: string;
    categoryTitles?: string[];
    addToCharacter: AddToCharacter
    substat?: string
}

export type HealthSection = {
    savedValue: number,
    max: number,
    addToCharacter: AddToCharacter
}
export interface BlankFieldsContainer {
    rows: number;
    fields: { [key: string]: number }
    max: number;
    category: string;
    addToCharacter: AddToCharacter
    removeFromCharacter: RemoveFromCharacter
    substat?: string
}

export interface BlankField {
    childkey: string
    substat: string | undefined,
    attr: string,
    max: number;
    removeFromCharacter: RemoveFromCharacter
    addToCharacter: AddToCharacter;
    inheritedStat?: [string, number]
}
export interface DualRows {
    addToCharacter: AddToCharacter,
    category: [string, DualStat],
    max: number
    parentStat?: string
}
export type DualStat = {
    perm: number
    temp: number
}

export interface OverlayProps {
    game: keyof WoDGames | WoD5egames;
    // saveCharacter: (data: object, characterSection: string) => void
    // savedCharacter: CharacterSheet<any>
}

export type WoDStats = {
    [key: string]: string[]
}
