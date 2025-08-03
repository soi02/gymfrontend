import React from 'react';
import '../styles/BuddyChat.css'; // Assuming you'll have a CSS file for styling

function BuddyChat() {
  const chatList = [
    {
      name: "Jane Gilbert",
      lastMessage: "Hey! I'm in the city today.",
      time: "12:14",
      unreadCount: 0,
      avatar: "url_to_jane_gilbert_avatar.png"
    },
    {
      name: "Bill Jonson",
      lastMessage: "Send me a letter, plz",
      time: "11:10",
      unreadCount: 0,
      avatar: "url_to_bill_jonson_avatar.png"
    },
    {
      name: "Jane Philips",
      lastMessage: "Kisses XXX",
      time: "10:45",
      unreadCount: 0,
      avatar: "url_to_jane_philips_avatar.png"
    },
    // ... add more chat data here
  ];

  return (
    <div className="chat-list-container">
      <div className="header">
        <h1 className="title">Chats</h1>
        <span className="unread-badge">3</span>
      </div>
      <div className="chat-rooms">
        {chatList.map((chat, index) => (
          <div key={index} className="chat-room-item">
            <div className="avatar">
              {/* 이미지 URL이나 아이콘을 여기에 넣으세요 */}
              <img src={chat.avatar} alt={`${chat.name} 아바타`} />
            </div>
            <div className="chat-info">
              <div className="chat-name">{chat.name}</div>
              <div className="last-message">{chat.lastMessage}</div>
            </div>
            <div className="chat-time">{chat.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BuddyChat;