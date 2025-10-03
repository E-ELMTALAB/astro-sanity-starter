import os
import asyncio
from datetime import datetime
from telethon import TelegramClient, events
from telethon.tl.types import (
    User, 
    UserStatusOnline, 
    UserStatusOffline, 
    UserStatusRecently,
    SendMessageTypingAction,
    SendMessageUploadVideoAction,
    SendMessageRecordVideoAction,
    SendMessageUploadAudioAction,
    SendMessageRecordAudioAction,
    SendMessageUploadPhotoAction,
    SendMessageUploadDocumentAction
)
from telethon.tl.functions.users import GetFullUserRequest
import config

class TelegramTracker:
    def __init__(self):
        self.client = TelegramClient(
            config.SESSION_NAME,
            config.API_ID,
            config.API_HASH
        )
        self.target_user = None
        self.target_user_id = None
        self.log_chat_id = config.LOG_CHAT_ID
        self.last_status = {}
        self.message_cache = {}  # Cache to track original messages for edit/delete detection
        
        # Create download directory if it doesn't exist
        if not os.path.exists(config.DOWNLOAD_DIR):
            os.makedirs(config.DOWNLOAD_DIR)
    
    async def start(self):
        """Start the tracker"""
        await self.client.start()
        
        print("✓ Client started successfully!")
        
        # Get target user
        try:
            self.target_user = await self.client.get_entity(config.TARGET_USER)
            self.target_user_id = self.target_user.id
            print(f"✓ Target user found: {self.target_user.first_name} (@{self.target_user.username or 'no username'})")
            print(f"  User ID: {self.target_user_id}")
        except Exception as e:
            print(f"✗ Error: Could not find target user '{config.TARGET_USER}'")
            print(f"  {str(e)}")
            return False
        
        # Verify log chat
        try:
            if self.log_chat_id == 'me':
                self.log_chat_id = 'me'
                print(f"✓ Log destination: Saved Messages")
            else:
                log_chat = await self.client.get_entity(self.log_chat_id)
                print(f"✓ Log destination: {getattr(log_chat, 'title', getattr(log_chat, 'first_name', 'Unknown'))}")
        except Exception as e:
            print(f"✗ Error: Could not access log chat ID '{self.log_chat_id}'")
            print(f"  {str(e)}")
            return False
        
        # Send startup message
        await self.send_log(f"🤖 **Tracker Started**\n"
                           f"📱 Monitoring: {self.target_user.first_name} (@{self.target_user.username or 'no username'})\n"
                           f"🕐 Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        print("\n🔍 Tracker is now active! Monitoring user activity...")
        print("Press Ctrl+C to stop.\n")
        
        # Register event handlers
        self.register_handlers()
        
        # Start monitoring user status
        asyncio.create_task(self.monitor_user_status())
        
        return True
    
    def register_handlers(self):
        """Register all event handlers"""
        
        # Handle new messages from target user
        @self.client.on(events.NewMessage(from_users=self.target_user_id))
        async def handle_new_message(event):
            await self.process_message(event)
        
        # Handle message edits from target user
        @self.client.on(events.MessageEdited(from_users=self.target_user_id))
        async def handle_message_edit(event):
            await self.process_message_edit(event)
        
        # Handle message deletions
        @self.client.on(events.MessageDeleted())
        async def handle_message_delete(event):
            await self.process_message_delete(event)
        
        # Handle user typing and other actions
        @self.client.on(events.UserUpdate(users=self.target_user_id))
        async def handle_user_action(event):
            await self.process_user_action(event)
    
    async def monitor_user_status(self):
        """Monitor user online/offline status"""
        while True:
            try:
                user = await self.client.get_entity(self.target_user_id)
                current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                
                if isinstance(user.status, UserStatusOnline):
                    if self.last_status.get('type') != 'online':
                        await self.send_log(f"🟢 **User came ONLINE**\n🕐 {current_time}")
                        self.last_status = {'type': 'online', 'time': current_time}
                        
                elif isinstance(user.status, UserStatusOffline):
                    if self.last_status.get('type') != 'offline':
                        was_online = user.status.was_online.strftime('%Y-%m-%d %H:%M:%S')
                        await self.send_log(f"🔴 **User went OFFLINE**\n🕐 {current_time}\n📝 Last seen: {was_online}")
                        self.last_status = {'type': 'offline', 'time': current_time}
                
            except Exception as e:
                print(f"Error monitoring status: {e}")
            
            await asyncio.sleep(10)  # Check every 10 seconds
    
    async def process_user_action(self, event):
        """Process user typing and action events"""
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # Typing
        if event.typing:
            action_text = None
            
            if isinstance(event.action, SendMessageTypingAction):
                action_text = "⌨️ **Typing...**"
            elif isinstance(event.action, SendMessageRecordVideoAction):
                action_text = "🎥 **Recording video...**"
            elif isinstance(event.action, SendMessageUploadVideoAction):
                action_text = "📹 **Uploading video...**"
            elif isinstance(event.action, SendMessageRecordAudioAction):
                action_text = "🎤 **Recording voice...**"
            elif isinstance(event.action, SendMessageUploadAudioAction):
                action_text = "🔊 **Uploading voice...**"
            elif isinstance(event.action, SendMessageUploadPhotoAction):
                action_text = "🖼️ **Uploading photo...**"
            elif isinstance(event.action, SendMessageUploadDocumentAction):
                action_text = "📄 **Uploading document...**"
            
            if action_text:
                await self.send_log(f"{action_text}\n🕐 {current_time}")
    
    async def process_message(self, event):
        """Process and log messages from target user"""
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        message = event.message
        
        # Cache the message for edit/delete tracking
        self.message_cache[message.id] = {
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
                filename = f"{config.DOWNLOAD_DIR}/{timestamp}_{self.target_user_id}"
                
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
                
                # Remove from cache
                del self.message_cache[deleted_id]
                
                print(f"✓ Detected message deletion (ID: {deleted_id})")
    
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
    # Validate configuration
    if not config.API_ID or not config.API_HASH:
        print("✗ Error: API_ID and API_HASH must be set in .env file")
        print("  Get them from https://my.telegram.org")
        return
    
    if not config.TARGET_USER:
        print("✗ Error: TARGET_USER must be set in .env file")
        return
    
    if not config.LOG_CHAT_ID:
        print("✗ Error: LOG_CHAT_ID must be set in .env file")
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

