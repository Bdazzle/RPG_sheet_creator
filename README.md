# **RPG Sheet Creator**
![React](https://camo.githubusercontent.com/67a01fa7cf337616274f39c070a11638f2e65720e414ef55b8dd3f9c2a803b2a/68747470733a2f2f696d672e736869656c64732e696f2f7374617469632f76313f7374796c653d666f722d7468652d6261646765266d6573736167653d526561637426636f6c6f723d323232323232266c6f676f3d5265616374266c6f676f436f6c6f723d363144414642266c6162656c3d)
![Hasura](https://camo.githubusercontent.com/f0962e80927e9ab6d06f29fd45002d361374201ca98cf3898f3b8a926c35b79b/68747470733a2f2f696d672e736869656c64732e696f2f7374617469632f76313f7374796c653d666f722d7468652d6261646765266d6573736167653d48617375726126636f6c6f723d323232323232266c6f676f3d486173757261266c6f676f436f6c6f723d314542344434266c6162656c3d)
![GraphQL](https://camo.githubusercontent.com/2e1f2dc091af830685d2057c2d4c797b639c7d1601a8d6019629272c210b707b/68747470733a2f2f696d672e736869656c64732e696f2f7374617469632f76313f7374796c653d666f722d7468652d6261646765266d6573736167653d4772617068514c26636f6c6f723d453130303938266c6f676f3d4772617068514c266c6f676f436f6c6f723d464646464646266c6162656c3d)
![Auth0](https://camo.githubusercontent.com/1aee41a972c4b835919e8bb65b46c8fdad0223753bb006c42d11b0e3c9b3f37f/68747470733a2f2f696d672e736869656c64732e696f2f7374617469632f76313f7374796c653d666f722d7468652d6261646765266d6573736167653d417574683026636f6c6f723d454235343234266c6f676f3d4175746830266c6f676f436f6c6f723d464646464646266c6162656c3d)
![Firebase](https://camo.githubusercontent.com/029c025c6da46b2fa8f15a3fa00261b9045d7b2a87a9692d437ee27b511c6f63/68747470733a2f2f696d672e736869656c64732e696f2f7374617469632f76313f7374796c653d666f722d7468652d6261646765266d6573736167653d466972656261736526636f6c6f723d323232323232266c6f676f3d4669726562617365266c6f676f436f6c6f723d464643413238266c6162656c3d)

Custom Role Playing Game sheet creator.

Creates custom or templated character sheets for players, or users can create their own character sheets for their own games from existing images, which can then be shared privately to other users.

Sign in and user creation is handled with ![Auth0](https://camo.githubusercontent.com/1aee41a972c4b835919e8bb65b46c8fdad0223753bb006c42d11b0e3c9b3f37f/68747470733a2f2f696d672e736869656c64732e696f2f7374617469632f76313f7374796c653d666f722d7468652d6261646765266d6573736167653d417574683026636f6c6f723d454235343234266c6f676f3d4175746830266c6f676f436f6c6f723d464646464646266c6162656c3d).
Backend is hosted with ![Hasura](https://camo.githubusercontent.com/f0962e80927e9ab6d06f29fd45002d361374201ca98cf3898f3b8a926c35b79b/68747470733a2f2f696d672e736869656c64732e696f2f7374617469632f76313f7374796c653d666f722d7468652d6261646765266d6573736167653d48617375726126636f6c6f723d323232323232266c6f676f3d486173757261266c6f676f436f6c6f723d314542344434266c6162656c3d)

- ### **Creator page**
Shows options to create a new character from a preexisting game template (currently only 2 options), a character from and custom game template that has been shared with the user, or to create your own custom RPG character sheet.

- ### **Sheet page**
Interactive display to alter a user's character sheet. Preexisting templates have an overlay, custom sheets have a set of inputs that change what is displayed on the canvas.

- ### **Editor page**
Tools for creating a custom character sheet from an uploaded image. Basic selection tools (circle, rectangle, line) like an image editor that create a set of inputsfor customizing the selections. Custom character sheets are only saveable by the original creator's account.

## Tech Stuff (How?)
 - Login is managed using ![Auth0](https://camo.githubusercontent.com/1aee41a972c4b835919e8bb65b46c8fdad0223753bb006c42d11b0e3c9b3f37f/68747470733a2f2f696d672e736869656c64732e696f2f7374617469632f76313f7374796c653d666f722d7468652d6261646765266d6573736167653d417574683026636f6c6f723d454235343234266c6f676f3d4175746830266c6f676f436f6c6f723d464646464646266c6162656c3d) JWTs.
 - Character Sheet images are saved using ![Firebase](https://camo.githubusercontent.com/029c025c6da46b2fa8f15a3fa00261b9045d7b2a87a9692d437ee27b511c6f63/68747470733a2f2f696d672e736869656c64732e696f2f7374617469632f76313f7374796c653d666f722d7468652d6261646765266d6573736167653d466972656261736526636f6c6f723d323232323232266c6f676f3d4669726562617365266c6f676f436f6c6f723d464643413238266c6162656c3d) Firestore.
 - Character sheet template information is stored in public and private tables with ![Hasura](https://camo.githubusercontent.com/f0962e80927e9ab6d06f29fd45002d361374201ca98cf3898f3b8a926c35b79b/68747470733a2f2f696d672e736869656c64732e696f2f7374617469632f76313f7374796c653d666f722d7468652d6261646765266d6573736167653d48617375726126636f6c6f723d323232323232266c6f676f3d486173757261266c6f676f436f6c6f723d314542344434266c6162656c3d). Public sheet are from existing games, custom sheets created by users are private.
 - Users can share custom sheets they've created by inputting emails of who they want to share with. Shares are stored in a table that is accessed when a user logs in. Only the original creator of a custom sheet can share it with other users.
 - When a user logs in, a list of characters and custom sheets are queried and displayed. When an option from one of these lists is selected, data for a specific character or sheet is queried from ![Hasura](https://camo.githubusercontent.com/f0962e80927e9ab6d06f29fd45002d361374201ca98cf3898f3b8a926c35b79b/68747470733a2f2f696d672e736869656c64732e696f2f7374617469632f76313f7374796c653d666f722d7468652d6261646765266d6573736167653d48617375726126636f6c6f723d323232323232266c6f676f3d486173757261266c6f676f436f6c6f723d314542344434266c6162656c3d).
 - Custom character sheets are created by loading an image into a canvas element. The selection tools store starting X and Y coordinates and draw a shape on the canvas to an end X/Y point. Square and circles selection have only start and end coordinates, while line selections are arrays of coordinates. After a selection is made, a column of stylizing options is displayed. The canvas is redrawn when these inputs are changed. These input options are nested in a selection object along with an array of X/Y coordinates, which are nested in another object and stored as JSON, like this:
    ```javascript
    sheet : {
        section:{
            ...input selections,
            mode: "square" | "circle" | "line"
            coordinates:[...coordinates] as [number, number][];
        }
    }
    ```
 - Characters are downloadable as PDF or JPG files.