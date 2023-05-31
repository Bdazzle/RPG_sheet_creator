import { gql } from "@apollo/client";

export const insertUser = gql`
 mutation InsertUser($email: String, $username: String) {
    insert_users(objects: {email: $email, username: $username}) {
       returning {
         username
       }
     }
   }
`

// export const insertCharacter = gql`
// mutation InsertCharacter($character_id: String, $stats: jsonb, $system: String, $user_id: String, $template: String, $sheet_uuid: uuid!) {
//   insert_characters(objects: [{character_id: $character_id, stats: $stats, system: $system, user_id:$user_id, template: $template, sheet_uuid: $sheet_uuid}], 
//   on_conflict: {constraint: characters_character_uuid_key, update_columns: [stats, character_id]}) {
//     returning {
//       character_uuid
//       character_id
//       user_id
//       sheet_uuid
//     }
//   }
// }
// `
export const insertCharacter = gql`
mutation InsertCharacter($character_id: String, $stats: jsonb, $system: String, $user_id: String, $template: String, $sheet_uuid: uuid!) {
  insert_characters(objects: [{character_id: $character_id, stats: $stats, system: $system, user_id:$user_id, template: $template, sheet_uuid: $sheet_uuid}]) {
    returning {
      character_uuid
      character_id
      user_id
      sheet_uuid
    }
  }
}
`

export const updateCharacter = gql`
mutation UpdateCharacter($character_uuid: uuid, $character_id: String, $stats: jsonb) {
  update_characters(where: {character_uuid: {_eq: $character_uuid}}, _set: {character_id: $character_id, stats: $stats}) {
    returning {
      character_id
      character_uuid
      stats
    }
  }
}
`

export const insertCustomsheet = gql`
mutation InsertCustomsheet($creator: String, $firebase_img_uri: String, $sections: jsonb, $system_id: String) {
  insert_custom_sheets(objects: {creator: $creator, firebase_img_uri: $firebase_img_uri, sections: $sections, system_id: $system_id}) {
    returning {
      sheet_uuid
    }
  }
}
`

export const updateCustomsheet = gql`
mutation UpdateCustomsheet($firebase_img_uri: String, $sections: jsonb, $sheet_uuid: uuid) {
  update_custom_sheets(where: {sheet_uuid: {_eq: $sheet_uuid}}, _set: {firebase_img_uri: $firebase_img_uri, sections: $sections}) {
    returning {
      firebase_img_uri
      sections
      system_id
    }
  }
}`


export const insertShares = gql`
mutation InsertShares($creator_id: String, $sheet_id: uuid, $system_id: String, $user_id: String) {
  insert_shared_custom_sheets(objects: {creator_id: $creator_id, sheet_id: $sheet_id, system_id: $system_id, user_id: $user_id}) {
    affected_rows
  }
}
`

export const deleteCharacter = gql`
mutation DeleteCharacter($character_uuid: uuid) {
  delete_characters(where: {character_uuid: {_eq: $character_uuid}}) {
    affected_rows
  }
}
`

/*
sheet_uuid field on custom_sheets rows is foreign key on shared_custom_sheets sheet_id field,
therefore rows on shared_custom_sheets need to be deleted first to prevent foreign key constraint violation errors
*/
export const deleteCustomSheet = gql`
mutation DeleteCustomSheet($sheet_uuid: uuid) {
  delete_shared_custom_sheets(where: {sheet_id: {_eq: $sheet_uuid}}) {
    affected_rows
  }
  delete_custom_sheets(where: {sheet_uuid: {_eq: $sheet_uuid}}) {
    affected_rows
  }
}
`