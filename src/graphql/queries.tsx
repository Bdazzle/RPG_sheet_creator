
export const getSystemsList =/* GraphQL */`
query GetSystemsList {
  templates_games {
    system
  }
}
`

// export const getSystemsList=gql`
//   query GetSystemsList {
//     templates_games {
//       system
//     }
//   }
// `

// export const getSheetImage=/* GraphQL */`
// query GetSheetImage($template: String) {
//   templates_games(where: {game_name: {_eq: $template}}) {
//     sheet_url
//   }
// }
// `

export const getExistingUser =/* GraphQL */`
query GetExistingUser($email: String) {
  users(where: {email: {_eq: $email}}) {
    email
  }
}
`
export const getUserCharacters =/* GraphQL */`
query GetUserCharacters($email: String) {
  characters(where: {user_id: {_eq: $email}}) {
    character_id
  }
}
`

export const getSpecificCharacter =/* GraphQL */`
query GetSpecificCharacter($character_id: String, $user_id: String) {
  characters(where: {character_id: {_eq: $character_id}, _and: {user_id: {_eq: $user_id}}}) {
    characterTocustomsheet {
      firebase_img_uri
    }
    characterTosheet {
      sheet_url
    }
    character_id
    character_uuid
    sheet_uuid
    stats
    system
    template
  }
}
`

export const getUserCustomsheets = /* GraphQL */`
query GetUserCustomsheets($user_id: String) {
  shared_custom_sheets(where: {user_id: {_eq: $user_id}}) {
    sheet_id
    system_id
  }
  custom_sheets(where: {creator: {_eq: $user_id}}) {
    firebase_img_uri
    sections
    sheet_uuid
    system_id
  }
}
`
export const getCustomSheet = /* GraphQL */`
 query GetCustomSheet($system_id: String) {
  custom_sheets(where: {system_id: {_eq: $system_id}}) {
    firebase_img_uri
    sections
    sheet_uuid
    system_id
    creator
  }
}
 `

export const getGamesList = /* GraphQL */`
query GetGamesList($system: String) {
  templates_games(where: {system: {_eq: $system}}) {
    game_name
  }
}
`

export const getGameSheet = /* GraphQL */`
query GetGameSheet($game_name: String) {
  templates_game_sheets(where: {game_name: {_eq: $game_name}}) {
    sheet_url
    stat_block
    style
    sheet_uuid
  }
}
`

// query MyQuery($character_id: String) {
//   characters(where: {character_id: {_eq: $character_id}, characterTocustomsheet: {}}) {
//     character_id
//     character_uuid
//     stats
//     system
//     template
//     characterTosheet {
//       sheet_url
//     }
//     characterTocustomsheet {
//       firebase_img_uri
//     }
//   }
// }