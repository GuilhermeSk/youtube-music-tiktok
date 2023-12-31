# youtube-music-tiktok

This project is intended to let the users ask for a TikTok Live creator to play a song on YouTube Music.

## Commands

- `!play <song>`: Ask for a song to be played on YouTube Music.
- `!skip`: Skip the current song.
- '!pause': Pause the current song.
- '!resume': Resume the current song.
- '@userName !b': Block a user from requesting songs.
- '@userName !ub': Unblock a user from requesting songs.

## How to use

1. Install the dependencies: `npm install`
2. Create a `.env` file with the following variables:
    - `YOUTUBE_MUSIC_EMAIL`: The email of the YouTube Music account.
    - `YOUTUBE_MUSIC_PASSWORD`: The password of the YouTube Music account.
    - `TOKTOK_USERNAME`: The username of the TikTok account.
    - `TOKTOK_PASSWORD`: The password of the TikTok account.
    - `TOKTOK_LIVE_USER`: The username of the TikTok Live creator.
3. Run the project: `npm start`

## How to run on development

Running on development will auto reload the project when a file is changed.

1. Install the dependencies: `npm install`
2. Create a `.env` file with the following variables:
    - `YOUTUBE_MUSIC_EMAIL`: The email of the YouTube Music account.
    - `YOUTUBE_MUSIC_PASSWORD`: The password of the YouTube Music account.
    - `TOKTOK_USERNAME`: The username of the TikTok account.
    - `TOKTOK_PASSWORD`: The password of the TikTok account.
    - `TOKTOK_LIVE_USER`: The username of the TikTok Live creator.
3. Run the project: `npm run dev`

