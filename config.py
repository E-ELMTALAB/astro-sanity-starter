import os
from dotenv import load_dotenv

load_dotenv()

# Telegram API credentials (get from https://my.telegram.org)
API_ID = os.getenv('API_ID')
API_HASH = os.getenv('API_HASH')

# Session file name (without .session extension)
SESSION_NAME = os.getenv('SESSION_NAME', 'telegram_tracker')

# Target user to track (username without @ or user ID)
TARGET_USER = os.getenv('TARGET_USER')

# Chat ID where logs will be saved (can be your Saved Messages or any chat ID)
LOG_CHAT_ID = int(os.getenv('LOG_CHAT_ID')) if os.getenv('LOG_CHAT_ID') else None

# Download directory for media files
DOWNLOAD_DIR = os.getenv('DOWNLOAD_DIR', 'downloads')

