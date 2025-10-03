import os
import asyncio
import nest_asyncio
from datetime import datetime

# Allow nested asyncio loops
nest_asyncio.apply()
from telethon import TelegramClient, events
from telethon.tl.types import (
    SendMessageTypingAction,
    SendMessageUploadVideoAction,
    SendMessageRecordVideoAction,
    SendMessageUploadAudioAction,
    SendMessageRecordAudioAction,
    SendMessageUploadPhotoAction,
    SendMessageUploadDocumentAction
)

# Configuration variables - modify these or set in .env file
# Telegram API credentials (get from https://my.telegram.org)
API_ID = 12345
API_HASH = '0123456789abcdef0123456789abcdef'

# Session file name (without .session extension)
SESSION_NAME = "telethon.session"

# Target user to track (username without @ or user ID)
TARGET_USER = 7327323182

# Chat ID where logs will be saved (can be your Saved Messages or any chat ID)
LOG_CHAT_ID = -4832264586

# Download directory for media files
DOWNLOAD_DIR = 'downloads'

class TelegramTracker:
    def __init__(self):
        self.client = TelegramClient(
            SESSION_NAME,
            API_ID,
            API_HASH
        )
        self.target_user = None
        self.target_user_id = None
        self.log_chat_id = LOG_CHAT_ID
        self.message_cache = {}  # Cache to track original messages for edit/delete detection
        
        # Create download directory if it doesn't exist
        if not os.path.exists(DOWNLOAD_DIR):
            os.makedirs(DOWNLOAD_DIR)
    
    async def start(self):
        """Start the tracker"""
        await self.client.start()
        
        print("✓ Client started successfully!")
        
        # Get target user by iterating through dialogs
        print(f"🔍 Searching for target user: {TARGET_USER}")
        print(f"   Scanning through your dialogs...")
        try:
            self.target_user = None
            dialog_count = 0
            
            # Iterate through all dialogs to find the target user
            async for dialog in self.client.iter_dialogs():
                entity = dialog.entity
                dialog_count += 1
                
                # Check if this is a user (not a group or channel)
                if hasattr(entity, 'id'):
                    # Match by ID (if TARGET_USER is numeric)
                    if isinstance(TARGET_USER, int) and entity.id == TARGET_USER:
                        self.target_user = entity
                        print(f"   ✓ Found after scanning {dialog_count} dialogs")
                        break
                    # Match by username (if TARGET_USER is a string)
                    elif isinstance(TARGET_USER, str):
                        username = getattr(entity, 'username', None)
                        if username and username.lower() == TARGET_USER.lower().replace('@', ''):
                            self.target_user = entity
                            print(f"   ✓ Found after scanning {dialog_count} dialogs")
                            break
                        # Also try matching by first name
                        first_name = getattr(entity, 'first_name', None)
                        if first_name and first_name.lower() == TARGET_USER.lower():
                            self.target_user = entity
                            print(f"   ✓ Found after scanning {dialog_count} dialogs")
                            break
            
            if not self.target_user:
                print(f"✗ Error: Could not find target user '{TARGET_USER}' in your dialogs")
                print(f"  Scanned {dialog_count} dialogs total")
                print(f"  Make sure you have a chat/conversation with this user")
                return False
            
            self.target_user_id = self.target_user.id
            print(f"✓ Target user found: {self.target_user.first_name} (@{getattr(self.target_user, 'username', 'no username')})")
            print(f"  User ID: {self.target_user_id}")
            
        except Exception as e:
            print(f"✗ Error while searching for target user: {str(e)}")
            return False
        
        # Verify log chat
        try:
            if self.log_chat_id == 'me':
                self.log_chat_id = 'me'
                print(f"✓ Log destination: Saved Messages")
            else:
                # Try to find the log chat in dialogs
                log_chat = None
                async for dialog in self.client.iter_dialogs():
                    if dialog.entity.id == self.log_chat_id:
                        log_chat = dialog.entity
                        break
                
                if log_chat:
                    print(f"✓ Log destination: {getattr(log_chat, 'title', getattr(log_chat, 'first_name', 'Unknown'))}")
                else:
                    # If not found in dialogs, try direct entity fetch as fallback
                    try:
                        log_chat = await self.client.get_entity(self.log_chat_id)
                        print(f"✓ Log destination: {getattr(log_chat, 'title', getattr(log_chat, 'first_name', 'Unknown'))}")
                    except:
                        print(f"⚠️  Warning: Could not verify log chat, but will attempt to use it")
        except Exception as e:
            print(f"⚠️  Warning: Error verifying log chat: {str(e)}")
            print(f"   Will attempt to use log chat ID: {self.log_chat_id}")
        
        # Send startup message
        await self.send_log(f"🤖 **Tracker Started**\n"
                           f"📱 Monitoring: {self.target_user.first_name} (@{self.target_user.username or 'no username'})\n"
                           f"🕐 Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        print("\n🔍 Tracker is now active! Listening to all activities...")
        print(f"   Filtering for user: {self.target_user.first_name} (@{self.target_user.username or 'no username'})")
        print(f"   📝 Tracking:")
        print(f"      • Messages (new, edit, delete)")
        print(f"      • Typing")
        print(f"      • Recording video/audio")
        print(f"      • Uploading video/audio/photo/document")
        print(f"      • All user activities")
        print("Press Ctrl+C to stop.\n")
        
        # Register event handlers
        self.register_handlers()
        
        return True
    
    def register_handlers(self):
        """Register all event handlers"""
        
        # Handle ALL new messages - filter inside the handler
        @self.client.on(events.NewMessage())
        async def handle_new_message(event):
            # Only process if message is from target user
            if event.sender_id == self.target_user_id:
                await self.process_message(event)
        
        # Handle ALL message edits - filter inside the handler
        @self.client.on(events.MessageEdited())
        async def handle_message_edit(event):
            # Only process if message is from target user
            if event.sender_id == self.target_user_id:
                await self.process_message_edit(event)
        
        # Handle message deletions
        @self.client.on(events.MessageDeleted())
        async def handle_message_delete(event):
            await self.process_message_delete(event)
        
        # Handle user status updates (online/offline) via events
        @self.client.on(events.UserUpdate())
        async def handle_user_update(event):
            try:
                # Get the user entity from the event
                user = await event.get_user()
                
                # Only process if this is our target user
                if user and user.id == self.target_user_id:
                    # Process typing actions
                    if event.typing:
                        await self.process_user_action(event)
                        
            except Exception as e:
                pass  # Silent fail
    
    async def process_user_action(self, event):
        """Process user typing, recording, and upload actions"""
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        current_time_ms = datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]
        
        # Check if typing/uploading/recording
        if event.typing:
            action_text = None
            action_emoji = None
            action_description = None
            
            if isinstance(event.action, SendMessageTypingAction):
                action_emoji = "⌨️"
                action_text = "typing"
                action_description = "typing"
                
            elif isinstance(event.action, SendMessageRecordVideoAction):
                action_emoji = "🎥"
                action_text = "recording a video message"
                action_description = "recording a video message"
                
            elif isinstance(event.action, SendMessageUploadVideoAction):
                action_emoji = "📹"
                action_text = "sending a video"
                action_description = "sending a video"
                
            elif isinstance(event.action, SendMessageRecordAudioAction):
                action_emoji = "🎤"
                action_text = "recording a voice message"
                action_description = "recording a voice message"
                
            elif isinstance(event.action, SendMessageUploadAudioAction):
                action_emoji = "🔊"
                action_text = "sending an audio file"
                action_description = "sending an audio file"
                
            elif isinstance(event.action, SendMessageUploadPhotoAction):
                action_emoji = "🖼️"
                action_text = "sending a photo"
                action_description = "sending a photo"
                
            elif isinstance(event.action, SendMessageUploadDocumentAction):
                action_emoji = "📄"
                action_text = "sending a file"
                action_description = "sending a file"
            
            else:
                # Catch any other action types we might have missed
                action_type_name = type(event.action).__name__
                action_emoji = "📱"
                action_text = action_type_name.replace('SendMessage', '').replace('Action', '')
                action_description = f"User action: {action_type_name}"
            
            if action_text:
                # Log to chat (Telegram-style format)
                log_message = f"**{self.target_user.first_name}**\n"
                log_message += f"{action_emoji} {action_text}\n"
                log_message += f"🕐 {current_time_ms}"
                
                await self.send_log(log_message)
                
                # Print to console
                print(f"\n{'='*50}")
                print(f"{self.target_user.first_name}")
                print(f"{action_emoji} {action_text}")
                print(f"   Time: {current_time_ms}")
                print(f"{'='*50}\n")
    
    async def process_message(self, event):
        """Process and log messages from target user"""
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        message = event.message
        
        # Cache the message for edit/delete tracking
        self.message_cache[message.id] = {
            'sender_id': event.sender_id,
            'text': message.text,
            'media': message.media is not None,
            'media_type': self.get_media_type(message) if message.media else None,
            'time': current_time
        }
        
        # Build log header
        log_header = f"📨 **New Message**\n🕐 {current_time}\n"
        log_header += f"👤 From: {self.target_user.first_name}\n"
        log_header += f"🆔 Message ID: {message.id}\n"
        log_header += "─" * 30 + "\n"
        
        # Handle text messages
        if message.text:
            full_log = log_header + f"💬 **Text:**\n{message.text}"
            await self.send_log(full_log)
        
        # Handle media messages
        if message.media:
            media_type = self.get_media_type(message)
            log_text = log_header + f"📎 **Media Type:** {media_type}\n"
            
            if message.text:
                log_text += f"💬 **Caption:** {message.text}\n"
            
            # Download media
            try:
                log_text += "⏳ Downloading media..."
                await self.send_log(log_text)
                
                # Create unique filename
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                filename = f"{DOWNLOAD_DIR}/{timestamp}_{self.target_user_id}"
                
                # Download the file
                downloaded_file = await message.download_media(file=filename)
                
                if downloaded_file:
                    # Send the downloaded media to log chat
                    caption = f"📎 {media_type}\n🕐 {current_time}\n👤 From: {self.target_user.first_name}"
                    if message.text:
                        caption += f"\n💬 Caption: {message.text}"
                    
                    await self.client.send_file(
                        self.log_chat_id,
                        downloaded_file,
                        caption=caption
                    )
                    
                    print(f"✓ Downloaded and sent: {media_type}")
                else:
                    await self.send_log(log_header + "❌ Failed to download media")
                    
            except Exception as e:
                await self.send_log(log_header + f"❌ Error downloading media: {str(e)}")
                print(f"Error downloading media: {e}")
    
    async def process_message_edit(self, event):
        """Process edited messages from target user"""
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        message = event.message
        message_id = message.id
        
        # Check if we have the original message cached
        original = self.message_cache.get(message_id)
        
        if original:
            # Build edit log
            log_header = f"✏️ **Message EDITED**\n🕐 {current_time}\n"
            log_header += f"👤 From: {self.target_user.first_name}\n"
            log_header += f"🆔 Message ID: {message_id}\n"
            log_header += "─" * 30 + "\n"
            
            # Show original text
            if original['text']:
                log_header += f"❌ **Original Text:**\n{original['text']}\n\n"
            else:
                log_header += f"❌ **Original:** (No text)\n\n"
            
            # Show new text
            if message.text:
                log_header += f"✅ **New Text:**\n{message.text}"
            else:
                log_header += f"✅ **New:** (No text)"
            
            await self.send_log(log_header)
            
            # Update cache with new content
            self.message_cache[message_id]['text'] = message.text
            
            print(f"✓ Detected message edit (ID: {message_id})")
        else:
            # Message not in cache, log as edited but unknown original
            log_text = f"✏️ **Message EDITED** (original not tracked)\n🕐 {current_time}\n"
            log_text += f"👤 From: {self.target_user.first_name}\n"
            log_text += f"🆔 Message ID: {message_id}\n"
            log_text += "─" * 30 + "\n"
            log_text += f"✅ **Current Text:**\n{message.text if message.text else '(No text)'}"
            
            await self.send_log(log_text)
    
    async def process_message_delete(self, event):
        """Process deleted messages"""
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # Check which cached messages were deleted
        for deleted_id in event.deleted_ids:
            if deleted_id in self.message_cache:
                original = self.message_cache[deleted_id]
                
                # Only process if message was from target user
                if original.get('sender_id') == self.target_user_id:
                    # Build deletion log
                    log_text = f"🗑️ **Message DELETED**\n🕐 {current_time}\n"
                    log_text += f"👤 From: {self.target_user.first_name}\n"
                    log_text += f"🆔 Message ID: {deleted_id}\n"
                    log_text += f"📅 Original Time: {original['time']}\n"
                    log_text += "─" * 30 + "\n"
                    
                    # Show what was deleted
                    if original['text']:
                        log_text += f"❌ **Deleted Text:**\n{original['text']}"
                    
                    if original['media']:
                        if original['text']:
                            log_text += f"\n\n📎 **Also had media:** {original['media_type']}"
                        else:
                            log_text += f"📎 **Deleted Media:** {original['media_type']}"
                    
                    await self.send_log(log_text)
                    
                    print(f"✓ Detected message deletion (ID: {deleted_id})")
                
                # Remove from cache regardless
                del self.message_cache[deleted_id]
    
    def get_media_type(self, message):
        """Determine the type of media in message"""
        if message.photo:
            return "Photo"
        elif message.video:
            return "Video"
        elif message.voice:
            return "Voice Message"
        elif message.audio:
            return "Audio"
        elif message.document:
            if message.gif:
                return "GIF"
            return "Document"
        elif message.sticker:
            return "Sticker"
        elif message.video_note:
            return "Video Note"
        else:
            return "Unknown Media"
    
    async def send_log(self, message):
        """Send log message to log chat"""
        try:
            await self.client.send_message(self.log_chat_id, message)
        except Exception as e:
            print(f"Error sending log: {e}")
    
    async def run(self):
        """Main run loop"""
        if await self.start():
            await self.client.run_until_disconnected()
        else:
            print("\n✗ Failed to start tracker. Please check your configuration.")

async def main():
    """Main entry point"""
    # Validate only essential configuration
    if not TARGET_USER:
        print("✗ Error: TARGET_USER must be set")
        return
    
    if not LOG_CHAT_ID:
        print("✗ Error: LOG_CHAT_ID must be set")
        return
    
    tracker = TelegramTracker()
    
    try:
        await tracker.run()
    except KeyboardInterrupt:
        print("\n\n⚠️  Stopping tracker...")
        await tracker.send_log(f"🛑 **Tracker Stopped**\n🕐 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        await tracker.client.disconnect()
        print("✓ Tracker stopped successfully!")
    except Exception as e:
        print(f"\n✗ Fatal error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    asyncio.run(main())

