import React, { useState, useEffect, useRef, useCallback } from 'react';
import './ChatWidget.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faPaperPlane, faTimes, faUser, faChevronLeft, faSyncAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const ChatWidget = ({ setIsLoginOpen, user, refreshUserInfo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newUser, setNewUser] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [showConversationList, setShowConversationList] = useState(true);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [pendingCount, setPendingCount] = useState(0);
  
  const chatMessagesRef = useRef(null);
  const messageEndRef = useRef(null);


  // Fetch new user data when user changes
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/restaurant/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.result) {
        setNewUser(response.data.result);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  // Update isAdmin when user changes
  useEffect(() => {
    setIsAdmin(user?.isAdmin || false);
    console.log('ChatWidget - isAdmin updated:', user?.isAdmin); // Debug log
  }, [user]);

  // Check auth status on component mount and when user changes
  useEffect(() => {
    if (user) {
      checkAuthStatus();
    }
    fetchUser();
  }, [user, isAdmin]);


  // Auto-refresh for admin to get new messages
  useEffect(() => {
    let interval;
    if (isAdmin && user) {
      if (isAdmin) {
        interval = setInterval(() => {
          fetchAllConversations();
          if (activeConversation) {
            fetchCustomerMessages(activeConversation.customerEmail);
          }
        }, 10000);
      }
    } else {
      interval = setInterval(() => {
        if (newUser.email) {
          const messageInput = document.querySelector('message-input');
          if (!messageInput || messageInput.activeElement !== document.activeElement) {
            fetchCustomerMessages(newUser.email);
          }
        }
      }, 10000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAdmin, isOpen, activeConversation, newUser.email, user]);

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (chatMessagesRef.current) {
      setTimeout(() => {
        chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
      }, 100);
    }
  }, []);

  // Handle scrolling when messages change
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  // Check if user is logged in and their role
  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('token');
      
      if (token && user) {
        if (isAdmin) {
          fetchAllConversations();
          fetchPendingCount();
        } else  if (newUser.email) {
          fetchCustomerMessages(newUser.email);
        }
      }
    } catch (error) {
      console.error('ChatWidget - Error checking auth status:', error);
    }
  };

  // Fetch pending messages count for admin
  const fetchPendingCount = async () => {
    try {
      const response = await axios.get('http://localhost:8000/restaurant/api/chat/messages', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) {
        setPendingCount(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching pending count:', error);
    }
  };

  // Fetch all conversations for admin (grouped by customer)
  const fetchAllConversations = async () => {
    setLoading(true);
    try {
      console.log('ChatWidget - Fetching all conversations...'); // Debug log
      
      const response = await axios.get('http://localhost:8000/restaurant/api/chat/messages', {
        // params: { page: 0, size: 100 },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.data.success) {
        const messagesData = response.data.data.content || [];
        // Group messages by customer email
        const conversationsMap = new Map();
        
        messagesData.forEach(msg => {
          const key = msg.customerEmail;
          if (!conversationsMap.has(key)) {
            conversationsMap.set(key, {
              id: msg.id,
              customerEmail: msg.customerEmail,
              customerName: msg.customerName,
              lastMessage: msg.message,
              lastMessageTime: msg.createdAt,
              status: msg.status,
              hasAdminReply: !!msg.adminReply,
              messageCount: 1
            });
          } else {
            const existing = conversationsMap.get(key);
            existing.messageCount += 1;
            // Update if this message is more recent
            if (new Date(msg.createdAt) > new Date(existing.lastMessageTime)) {
              existing.lastMessage = msg.adminReply || msg.message;
              existing.lastMessageTime = msg.repliedAt || msg.createdAt;
              existing.status = msg.status;
              existing.hasAdminReply = !!msg.adminReply;
            }
          }
        });
        
        // Convert to array and sort by most recent
        const conversationsList = Array.from(conversationsMap.values())
          .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
        
        setConversations(conversationsList);
      }
    } catch (error) {
      console.error('ChatWidget - Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for specific customer
  const fetchCustomerMessages = async (customerEmail) => {
    if (!customerEmail) return;
    
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/restaurant/api/chat/messages/customer/${encodeURIComponent(customerEmail)}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      if (response.data.success) {
        const messagesData = response.data.data || [];
        // Sort messages by creation time
        const sortedMessages = messagesData.sort((a, b) => 
          new Date(a.createdAt) - new Date(b.createdAt)
        );
        setMessages(sortedMessages);

        setTimeout(scrollToBottom, 100); // Scroll to bottom after setting messages
      }
    } catch (error) {
      console.error('Error fetching customer messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const messageText = newMessage.trim();
    setNewMessage(''); // Clear input immediately

    try {
      if (isAdmin && activeConversation) {
        // Admin replying to customer
        const replyRequest = {
          adminEmail: user.email || "quandinh.029022003@gmail.com",
          adminReply: messageText
        };

        const response = await axios.post(
          `http://localhost:8000/restaurant/api/chat/messages/${activeConversation.id}/reply`,
          replyRequest,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );

        if (response.data.success) {
          // Refresh messages and conversations
          await fetchCustomerMessages(activeConversation.customerEmail);
          fetchAllConversations();
          fetchPendingCount();
        }
      } else if (!isAdmin) {
        // Customer sending message
        const messageRequest = {
          customerName: newUser.username || `${user.firstName} ${user.lastName}`,
          customerEmail: newUser.email,
          message: messageText
        };

        const response = await axios.post(
          'http://localhost:8000/restaurant/api/chat/message',
          messageRequest,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );

        if (response.data.success) {
          // Refresh customer's messages
          await fetchCustomerMessages(newUser.email);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setNewMessage(messageText); // Restore message on error
    }
  };

  // Handle conversation click (for admin)
  const handleConversationClick = (conversation) => {
    setActiveConversation(conversation);
    setShowConversationList(false);
    fetchCustomerMessages(conversation.customerEmail);
  };

  // Handle back to conversations list
  const handleBackToConversations = () => {
    setShowConversationList(true);
    setActiveConversation(null);
    setMessages([]);
  };

  // Render admin conversations list
  const renderAdminView = () => {
    if (loading) {
      return <div className="loading">Loading conversations...</div>;
    }

    if (conversations.length === 0) {
      return (
        <div className="no-conversations">
          <FontAwesomeIcon icon={faComment} size="2x" />
          <p>No customer conversations yet</p>
        </div>
      );
    }

    return (
      <div className="conversation-list">
        {conversations.map((conversation) => (
          <div
            key={conversation.customerEmail}
            className={`conversation-item ${conversation.status === 'PENDING' ? 'pending' : ''}`}
            onClick={() => handleConversationClick(conversation)}
          >
            <div className="conversation-avatar">
              <FontAwesomeIcon icon={faUser} />
              {conversation.status === 'PENDING' && (
                <span className="notification-dot"></span>
              )}
            </div>
            <div className="conversation-details">
              <div className="conversation-header">
                <h4>{conversation.customerName}</h4>
                <span className="conversation-time">
                  {new Date(conversation.lastMessageTime).toLocaleDateString()}
                </span>
              </div>
              <p className="conversation-preview">
                {conversation.lastMessage}
              </p>
              <div className="conversation-status">
                <span className={`status-badge ${conversation.status.toLowerCase()}`}>
                  {conversation.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render chat messages
  const renderChatMessages = () => {
    if (loading) {
      return <div className="loading">Loading messages...</div>;
    }

    if (messages.length === 0) {
      return (
        <div className="no-messages">
          <FontAwesomeIcon icon={faComment} size="2x" />
          <p>{isAdmin ? 'No messages in this conversation' : 'Start a conversation with our support team!'}</p>
        </div>
      );
    }

    return (
      <div className="chat-messages" ref={chatMessagesRef}>
        {messages.map((msg) => (
          <div key={msg.id} className="message-group">
            {/* Customer Message */}
            <div className="message customer-message">
              <div className="message-content">
                <div className="message-header">
                  <span className="sender-name">{msg.customerName}</span>
                  <span className="message-time">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="message-text">{msg.message}</p>
              </div>
            </div>

            {/* Admin Reply */}
            {msg.adminReply && (
              <div className="message admin-message">
                <div className="message-content">
                  <div className="message-header">
                    <span className="sender-name">Customer Support</span>
                    <span className="message-time">
                      {msg.repliedAt && new Date(msg.repliedAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="message-text">{msg.adminReply}</p>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
    );
  };

  // Render login required view
  const renderLoginRequired = () => (
    <div className="chat-login-required">
      <FontAwesomeIcon icon={faUser} size="3x" className="login-icon" />
      <h3>Login Required</h3>
      <p>Please log in to chat with customer support</p>
      <button 
        className="login-button"
        onClick={() => setIsLoginOpen(true)}
      >
        Log In
      </button>
    </div>
  );

  // Add effect to refresh user info when needed
  useEffect(() => {
    if (user && (!user.roles || !user.email)) {
      console.log('User info incomplete, refreshing...');
      refreshUserInfo?.();
    }
  }, [user, refreshUserInfo]);

  return (
    <div className="chat-widget">
      {/* Chat Toggle Button */}
      <button 
        className="chat-toggle-button" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faComment} />
        {isAdmin && pendingCount > 0 && (
          <span className="pending-badge">{pendingCount}</span>
        )}
      </button>
      
      {/* Chat Container */}
      {isOpen && (
        <div className="chat-container">
          {/* Chat Header */}
          <div className="chat-header">
            {isAdmin && !showConversationList && (
              <button className="back-button" onClick={handleBackToConversations}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
            )}
            <h3>
              {isAdmin 
                ? (showConversationList 
                    ? `Customer Conversations ${pendingCount > 0 ? `(${pendingCount} new)` : ''}` 
                    : `Chat with ${activeConversation?.customerName}`) 
                : 'Customer Support'}
            </h3>
            
            {/* Add refresh button for admin */}
            {isAdmin && showConversationList && (
              <button 
                className="refresh-button" 
                onClick={fetchAllConversations}
                disabled={loading}
                style={{ marginRight: '10px' }}
              >
                <FontAwesomeIcon 
                  icon={loading ? faSpinner : faSyncAlt} 
                  spin={loading} 
                />
              </button>
            )}
            
            <button className="close-button" onClick={() => setIsOpen(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Chat Content */}
          <div className="chat-content">
            {!user ? (
              renderLoginRequired()
            ) : isAdmin ? (
              showConversationList ? (
                renderAdminView()
              ) : (
                <>
                  {renderChatMessages()}
                  {/* Admin Input Form */}
                  <form className="chat-input-form" onSubmit={handleSendMessage}>
                    <input 
                      type="text" 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your reply..."
                      disabled={loading}
                    />
                    <button type="submit" disabled={!newMessage.trim() || loading}>
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                  </form>
                </>
              )
            ) : (
              <>
                {renderChatMessages()}
                {/* Customer Input Form */}
                <form className="chat-input-form" onSubmit={handleSendMessage}>
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    disabled={loading}
                  />
                  <button type="submit" disabled={!newMessage.trim() || loading}>
                    <FontAwesomeIcon icon={faPaperPlane} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;