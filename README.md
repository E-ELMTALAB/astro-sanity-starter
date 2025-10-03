# Telegram User Activity Tracker

A Telegram userbot built with Telethon that monitors and logs a specific user's activity.

## Features

✅ **Real-time Activity Tracking:**
- Online/Offline status monitoring
- Typing indicators
- Recording/uploading video status
- Recording/uploading voice status
- All message types (text, media, voice, video, documents, etc.)

✅ **Message Handling:**
- Text messages are copied and logged
- Media files are downloaded and sent **directly** to your log chat
- Timestamps for all activities
- No forwarding (direct copying)

✅ **Edit & Delete Tracking:**
- **Message Edits**: Shows original text vs. edited text with side-by-side comparison
- **Message Deletions**: Logs deleted content with original timestamp
- Full history of changes tracked

✅ **Privacy & Security:**
- Uses your own Telegram session
- All data saved to your specified chat
- No third-party servers

## Installation

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Get Telegram API Credentials

1. Go to https://my.telegram.org
2. Log in with your phone number
3. Go to "API Development Tools"
4. Create an app to get your `API_ID` and `API_HASH`

### 3. Configure the Bot

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` and fill in your details:
   ```
   API_ID=your_api_id
   API_HASH=your_api_hash
   SESSION_NAME=telegram_tracker
   TARGET_USER=username_or_id
   LOG_CHAT_ID=me
   ```

   **Configuration Details:**
   - `API_ID` and `API_HASH`: From my.telegram.org
   - `SESSION_NAME`: Name of your session file (without .session extension)
   - `TARGET_USER`: Username (without @) or numeric user ID of person to track
   - `LOG_CHAT_ID`: 
     - Use `me` for Saved Messages
     - Or use numeric chat ID (get from @userinfobot or @getidsbot)

### 4. Session File Setup

You mentioned you have a session file. There are two options:

#### Option A: Use Existing TData Session
If you have TData folder, you'll need to convert it to a Telethon session:
1. Use a tool like `opentele` to convert TData to Telethon session
2. Or simply run the tracker and it will create a new session

#### Option B: Create New Session
When you run the tracker for the first time, it will ask you to login:
```bash
python tracker.py
```
Then enter your phone number and verification code.

**Note:** If you already have a `.session` file, place it in the project root directory and set `SESSION_NAME` in `.env` to match the filename (without extension).

## Usage

### Start the Tracker

```bash
python tracker.py
```

The tracker will:
1. Connect to Telegram using your session
2. Verify target user and log chat
3. Start monitoring activity
4. Log all activity to your specified chat

### What Gets Tracked

📊 **Status Updates:**
- 🟢 User comes online
- 🔴 User goes offline (with last seen time)

⌨️ **Actions:**
- Typing messages
- Recording video
- Recording voice
- Uploading media

📨 **Messages:**
- Text messages (copied with timestamp)
- Photos (downloaded and sent **directly** to log chat)
- Videos (downloaded and sent **directly** to log chat)
- Voice messages (downloaded and sent **directly** to log chat)
- Documents (downloaded and sent **directly** to log chat)
- Stickers, GIFs, etc.

✏️ **Edits:**
- Message edit detection with before/after comparison
- Shows original text and edited text
- Includes timestamp of edit

🗑️ **Deletions:**
- Deleted message detection
- Shows deleted content (text and media type)
- Includes original message timestamp

### Stop the Tracker

Press `Ctrl+C` to stop the tracker gracefully.

## Example Log Output

```
🤖 Tracker Started
📱 Monitoring: John Doe (@johndoe)
🕐 Started at: 2025-10-03 14:30:00

🟢 User came ONLINE
🕐 2025-10-03 14:30:15

⌨️ Typing...
🕐 2025-10-03 14:30:20

📨 New Message
🕐 2025-10-03 14:30:25
👤 From: John Doe
🆔 Message ID: 12345
──────────────────────────────
💬 Text:
Hello, how are you?

✏️ Message EDITED
🕐 2025-10-03 14:30:35
👤 From: John Doe
🆔 Message ID: 12345
──────────────────────────────
❌ Original Text:
Hello, how are you?

✅ New Text:
Hello, how are you doing?

🗑️ Message DELETED
🕐 2025-10-03 14:31:00
👤 From: John Doe
🆔 Message ID: 12345
📅 Original Time: 2025-10-03 14:30:25
──────────────────────────────
❌ Deleted Text:
Hello, how are you doing?

📎 Media Type: Photo
🕐 2025-10-03 14:32:00
👤 From: John Doe
💬 Caption: Check this out!
[Photo is sent directly to your log chat]

🔴 User went OFFLINE
🕐 2025-10-03 14:35:00
📝 Last seen: 2025-10-03 14:34:58
```

## File Structure

```
tel-tracker/
├── tracker.py           # Main tracker script
├── config.py           # Configuration loader
├── requirements.txt    # Python dependencies
├── .env               # Your configuration (create from .env.example)
├── .env.example       # Example configuration
├── README.md          # This file
├── downloads/         # Downloaded media files (auto-created)
└── *.session         # Telegram session file (auto-created)
```

## Troubleshooting

### "Could not find target user"
- Make sure the username is correct (without @)
- Or use the numeric user ID instead
- Make sure you have access to view this user

### "Could not access log chat"
- Use `me` for Saved Messages
- For other chats, make sure you have access
- Get the correct chat ID from @userinfobot

### "API_ID and API_HASH must be set"
- Create `.env` file from `.env.example`
- Get credentials from https://my.telegram.org
- Make sure there are no quotes around the values in .env

### Session Issues
- If login fails, delete the `.session` file and try again
- Make sure you're using the correct phone number
- Check that 2FA password is correct if enabled

## Important Notes

⚠️ **Legal & Ethical Considerations:**
- Only track users you have permission to monitor
- Respect privacy and applicable laws
- This tool is for personal/educational use
- Don't use for harassment or stalking

⚠️ **Technical Notes:**
- The bot runs on your account, not as a separate bot
- Rate limits apply (Telegram's flood wait)
- Media files are stored locally in `downloads/` folder
- Online status updates check every 10 seconds

## Support

If you encounter any issues:
1. Check the troubleshooting section
2. Verify your .env configuration
3. Make sure all dependencies are installed
4. Check that your session is valid

## License

This project is for educational purposes only. Use responsibly and ethically.

