# YouTube Music for TikTok Live Creators

**YouTube Music TikTok** is an open-source project designed to empower TikTok Live creators and their audiences by 
enabling song requests through YouTube Music. This project leverages a Chrome browser instance to seamlessly integrate 
the song-request experience, allowing users to watch the songs being played and interact with YouTube Music as if it 
were a standard web browser.

## Commands

To request a song to be played on YouTube Music during a TikTok Live session, utilize the following commands within 
the TikTok Live chat:

- `!play <song>`: Initiates a song request to be played on YouTube Music.
- `!skip`: Enables the skipping of the current song (available exclusively for the TikTok Live creator and moderators).
- `!pause`: Allows pausing of the current song (available exclusively for the TikTok Live creator and moderators).
- `!resume`: Facilitates the resumption of the paused song (available exclusively for the TikTok Live creator and moderators).
- `@userName !b`: Blocks a user from making song requests (Note: This feature is not yet implemented).
- `@userName !ub`: Unblocks a user, permitting them to make song requests (Note: This feature is not yet implemented).

## How to Use

### Prerequisites

Before running the project, ensure that you have the following prerequisites in place:

1. Install NVM: [NVM Installation Guide](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/).
2. Install NPM: After installing NVM, execute `nvm install --lts` to install the latest version of Node.js and NPM.

### Running the Project

Follow these steps to run the project:

1. Install the required dependencies: Execute `npm install`.
2. Run the project: Execute `npm start`.
3. Upon starting the program, you will be prompted to enter the TikTok Live creator's username. This username is 
4. essential for retrieving TikTok Live chat messages.

### How to Run in Development Mode

Running the project in development mode facilitates automatic reloading when a file is modified, streamlining the 
development process.

To run the project in development mode:

1. Install the required dependencies: Execute `npm install`.
2. Run the project in development mode: Execute `npm run dev`.
3. During the initial startup, you will be prompted to enter the TikTok Live creator's username. This is required to 
4. fetch TikTok Live chat messages.

After the initial startup, a `.env` file will be generated, storing the TikTok Live creator's username. To update the 
TikTok Live creator's username, simply modify the value of the `TikTokLiveCreatorUsername` variable within the `.env` 
file.

Moreover, you can add `TEST_ENV=true` to the `.env` file to run the project in test mode. This allows you to simulate 
messages using the console, eliminating the need to be in a TikTok Live session for testing purposes.

#### Further Configurations

Within the `.env` file, you have the flexibility to customize the following variables:

- `TikTokLiveCreatorUsername`: The TikTok Live creator's username.
- `SONG_ADDED_TEXT`: The text displayed on YouTube Music when a song is successfully added.
- `DEBUG`: Set to `true` to enable additional log output.
- `TEST_ENV`: Set to `true` to run the project in test mode, bypassing the need for live chat messages to test functionality.

Feel free to reach out if you have any questions or need further assistance with this project. We're here to help you 
make the most of YouTube Music for TikTok Live!
