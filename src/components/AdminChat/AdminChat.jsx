import React, { useState, useEffect } from 'react';
import './AdminChat.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSync } from '@fortawesome/free-solid-svg-icons';

const AdminChat = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [conversations, setConversations] = useState([]);
  const adminEmail = localStorage.getItem('user_email') || "admin@example.com";

  useEffect(() => {
    fetchConversations();
    fetchPendingCount();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/chat/conversations');
      if (response.data.success) {
        setConversations(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  const fetchMessages = async (email) => {
    try {
      const response = await axios.get(`/api/chat/messages/customer/${email}`);
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchPendingCount = async () => {
    try {
      const response = await axios.get('/api/chat/messages/pending/count');
      if (response.data.success) {
        setPendingCount(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching pending count:', error);
    }
  };

  const handleSelectConversation = async (conversation) => {
    try {
      await fetchMessages(conversation.customerEmail);
      setSelectedMessage(conversation);
      setReply('');
    } catch (error) {
      console.error('Error fetching message details:', error);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim() || !selectedMessage) return;

    try {
      const response = await axios.post(`/api/chat/messages/${selectedMessage.id}/reply`, {
        adminEmail: adminEmail,
        adminReply: reply
      });

      if (response.data.success) {
        // Refresh the messages for this conversation
        fetchMessages(selectedMessage.customerEmail);
        setReply('');
        // Update the conversations list and pending count
        fetchConversations();
        fetchPendingCount();
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const refreshData = () => {
    fetchConversations();
    fetchPendingCount();
    if (selectedMessage) {
      fetchMessages(selectedMessage.customerEmail);
    }
  };

  return (
    <div className="admin-chat-container">
      <div className="admin-chat-sidebar">
        <div className="admin-chat-header">
          <h2>Customer Messages</h2>
          <div className="admin-chat-controls">
            <span className="pending-badge">{pendingCount} pending</span>
            <button onClick={refreshData} className="refresh-button">
              <FontAwesomeIcon icon={faSync} />
            </button>
          </div>
        </div>
        <div className="admin-chat-list">
          {loading ? (
            <p className="loading-text">Loading conversations...</p>
          ) : (
            conversations.length === 0 ? (
              <p className="no-conversations">No conversations yet</p>
            ) : (
              conversations.map(conversation => (
                <div 
                  key={conversation.id} 
                  className={`admin-chat-item ${conversation.status === 'PENDING' ? 'pending' : ''} ${selectedMessage?.customerEmail === conversation.customerEmail ? 'active' : ''}`}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <div className="conversation-avatar">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <div className="admin-chat-item-content">
                    <div className="admin-chat-item-header">
                      <span className="admin-chat-name">{conversation.customerName}</span>
                      <span className="admin-chat-time">
                        {new Date(conversation.lastMessageTime).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="admin-chat-preview">{conversation.lastMessage.substring(0, 50)}...</p>
                    {conversation.status === 'PENDING' && <span className="status-badge">New</span>}
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>

      <div className="admin-chat-main">
        {selectedMessage ? (
          <>
            <div className="admin-chat-details">
              <h3>Conversation with {selectedMessage.customerName}</h3>
              <div className="admin-chat-info">
                <p><strong>Email:</strong> {selectedMessage.customerEmail}</p>
                <p><strong>Status:</strong> {selectedMessage.status}</p>
              </div>
            </div>
            
            <div className="admin-chat-conversation">
              {messages.length === 0 ? (
                <p className="no-messages">No messages in this conversation</p>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={msg.adminReply ? 'admin-chat-message admin' : 'admin-chat-message customer'}>
                    <div className="message-content">
                      {msg.adminReply ? (
                        <>
                          <p className="message-sender">You (Admin)</p>
                          <p>{msg.adminReply}</p>
                          <span className="message-time">
                            {new Date(msg.repliedAt).toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <>
                          <p className="message-sender">{selectedMessage.customerName}</p>
                          <p>{msg.message}</p>
                          <span className="message-time">
                            {new Date(msg.createdAt).toLocaleString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="admin-chat-reply">
              <form onSubmit={handleReply}>
                <textarea 
                  placeholder="Type your reply here..." 
                  value={reply} 
                  onChange={(e) => setReply(e.target.value)} 
                />
                <button type="submit">Send Reply</button>
              </form>
            </div>
          </>
        ) : (
          <div className="admin-chat-placeholder">
            <h3>Select a conversation to view the messages</h3>
            <p>You can reply to customer inquiries from here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;