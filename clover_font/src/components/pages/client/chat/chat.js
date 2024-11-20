import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Client as TwilioConversationsClient } from '@twilio/conversations';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  //gte token event channel get mess all , moi lan nguoi dung nhan tin load ->g gui hien thi
  const [messageInput, setMessageInput] = useState('');
  const [channel, setChannel] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [username, setUsername] = useState('testAdmin'); // Giả sử đây là người dùng đầu tiên

  useEffect(() => {
    if (username) {
      // Fetch token from backend with username in headers
      const token = localStorage.getItem('token');
      axios
        .get('http://localhost:8080/api/chat/get-chat-token', {
          headers: {
            token: `Bearer ${token}`,  // replace with your actual token if needed
            'Custom-Username': username,  // Send username in a custom header
          },
        })
        .then((response) => {
          setUserToken(response);
          console.log(response.data);
        })
        .catch((error) => console.error('Error fetching token:', error));
    }
  }, [username]);
  
  useEffect(() => {
    if (userToken) {
      // Khởi tạo client Twilio Conversations
      TwilioConversationsClient.create(userToken).then((client) => {
        console.log('Twilio Conversations Client Initialized', client);
        //.then((client) set vao state
        // Lấy danh sách các kênh đã đăng ký của người dùng
        client.getSubscribedChannels().then((paginator) => {
          const existingChannel = paginator.items.find(
            (ch) => ch.uniqueName === 'chat-with-users'
          );

          if (existingChannel) {
            setChannel(existingChannel);
            loadMessages(existingChannel);
          } else {
            console.log('Channel not found. Creating a new one.');
            // Tạo kênh mới nếu không tìm thấy kênh với uniqueName là 'chat-with-users'
            client.createChannel({
              uniqueName: 'chat-with-users',
              friendlyName: 'Chat with users',
            }).then((newChannel) => {
              setChannel(newChannel);
              loadMessages(newChannel);
            }).catch((error) => {
              console.error('Error creating channel:', error);
            });
          }
        }).catch((error) => {
          console.error('Error fetching channels:', error);
        });
      }).catch((error) => {
        console.error('Error initializing Twilio Conversations Client:', error);
      });
    }
  }, [userToken]);
  const loadMessages = (channel) => {
    channel.getMessages().then((messagesPage) => {
      setMessages(messagesPage.items);
    });
    //load hien thi du lieu tin nhan

    channel.on('messageAdded', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    // su kien lang nghe khi dc gui vao channel va cap nhat
  };

  const sendMessage = () => {
    if (channel && messageInput.trim()) {
      channel.sendMessage(messageInput).then(() => {
        setMessageInput(''); // Clear input after sending
      }).catch((error) => {
        console.error('Error sending message', error);
      });
    }
  };
  //gui tin nhan (messageInput)

  const createChanel = () => {
    // Fetch token from localStorage
    const token = localStorage.getItem('token');
    
    axios
      .get('http://localhost:8080/api/chat/createOrGetChannel', {
        headers: {
          'Authorization': `Bearer ${token}` // Chắc chắn rằng header tên là 'Authorization'
        },
        params: {
          friendName: "username",
          user2: "mike_jones"
        }
      })
      .then((response) => {
        console.log(response); // Xử lý dữ liệu trả về
      })
      .catch((error) => {
        console.error('Error fetching token:', error);
      });
 }
      

 
  return (
    <div className="chat-app">
      <div className="chat-container">
        <h2>Chat Room</h2>
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              <strong>{msg.author}:</strong> {msg.body}
            </div>
          ))}
        </div>
        <textarea
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message"
        />
        
        <button onClick={createChanel}>Send</button>
      </div>
    </div>
  );
};

export default ChatApp;
