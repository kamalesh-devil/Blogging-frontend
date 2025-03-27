import React, { useState, useEffect } from "react";

const BlogApp = () => {
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem("blogPosts");
    return savedPosts ? JSON.parse(savedPosts) : [];
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("user");
    return savedUser ? "home" : "login";
  });
  const [user, setUser] = useState(() => localStorage.getItem("user"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const API_URL = 'http://localhost:5000/api/auth';

  // Check for existing user session on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (savedUser && token) {
      setUser(savedUser);
      setCurrentPage("home");
    }
  }, []);

  // Save posts to localStorage when they change
  useEffect(() => {
    localStorage.setItem("blogPosts", JSON.stringify(posts));
  }, [posts]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSignup = async () => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Save token and username
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', data.username);
      
      setUser(data.username);
      setCurrentPage('welcome');
      setUsername('');
      setPassword('');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Save token and username
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', data.username);
      
      setUser(data.username);
      setCurrentPage('welcome');
      setUsername('');
      setPassword('');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('login');
  };

  const addPost = () => {
    if (!user) {
      alert("You must be signed in to create a post!");
      return;
    }
    if (title.trim() && content.trim()) {
      const newPost = { 
        title, 
        content, 
        author: user,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      if (editIndex !== null) {
        const updatedPosts = [...posts];
        updatedPosts[editIndex] = {
          ...updatedPosts[editIndex],
          title,
          content,
          updatedAt: new Date().toISOString()
        };
        setPosts(updatedPosts);
        setEditIndex(null);
      } else {
        setPosts([newPost, ...posts]);
      }
      setTitle("");
      setContent("");
      setCurrentPage("home");
    } else {
      alert("Please enter both title and content!");
    }
  };

  const editPost = (index) => {
    setTitle(posts[index].title);
    setContent(posts[index].content);
    setEditIndex(index);
    setCurrentPage("create");
  };

  const deletePost = (index) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      const updatedPosts = posts.filter((_, i) => i !== index);
      setPosts(updatedPosts);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="app">
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f5f7fa;
          color: #333;
          line-height: 1.6;
        }
        
        /* Header Styles */
        .app-header {
          background: #2c3e50;
          color: white;
          padding: 1rem;
          text-align: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          position: fixed;
          width: 100%;
          top: 0;
          z-index: 1000;
        }
        
        .app-header h1 {
          margin: 0;
          font-size: 1.8rem;
        }
        
        .app-header p {
          margin: 0.5rem 0 0;
          font-size: 1rem;
          opacity: 0.8;
        }
        
        /* Main Layout */
        .app {
          display: flex;
          min-height: 100vh;
          position: relative;
          padding-top: 80px;
        }
        
        /* Sidebar Styles */
        .sidebar {
          width: 280px;
          background: #2c3e50;
          color: white;
          padding: 2rem 1.5rem;
          height: calc(100vh - 80px);
          overflow-y: auto;
          transition: all 0.3s ease;
          position: fixed;
          left: ${sidebarOpen ? '0' : '-280px'};
          top: 80px;
          box-shadow: ${sidebarOpen ? '2px 0 10px rgba(0,0,0,0.2)' : 'none'};
          z-index: 999;
        }
        
        .sidebar-toggle {
          position: fixed;
          left: ${sidebarOpen ? '280px' : '0'};
          top: 100px;
          background: #2c3e50;
          color: white;
          border: none;
          border-radius: 0 4px 4px 0;
          padding: 10px;
          cursor: pointer;
          z-index: 1001;
          transition: all 0.3s ease;
        }
        
        .sidebar-toggle:hover {
          background: #34495e;
        }
        
        .sidebar-header {
          margin-bottom: 2rem;
          text-align: center;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .sidebar-menu {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .sidebar-menu button {
          background: transparent;
          color: #ecf0f1;
          border: none;
          padding: 0.8rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          text-align: left;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
          font-size: 1rem;
        }
        
        .sidebar-menu button:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(5px);
        }
        
        .sidebar-menu button.active {
          background: #3498db;
          font-weight: 500;
        }
        
        /* Content Area */
        .content {
          flex: 1;
          padding: 2rem;
          transition: all 0.3s ease;
          margin-left: ${sidebarOpen ? '280px' : '0'};
        }
        
        /* Auth Pages */
        .auth-container {
          max-width: 400px;
          margin: 2rem auto;
          padding: 2rem;
          background: white;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .input {
          width: 100%;
          padding: 0.8rem;
          margin-bottom: 1rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
        }
        
        .btn {
          width: 100%;
          padding: 0.8rem;
          background: #3498db;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
        }
        
        /* Welcome Page */
        .welcome {
          text-align: center;
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .welcome h1 {
          color: #2c3e50;
          margin-bottom: 1rem;
        }
        
        .welcome p {
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }
        
        .welcome-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }
        
        /* Post Styles */
        .post {
          background: white;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .post-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .post-title {
          margin: 0;
          font-size: 1.25rem;
          color: #2c3e50;
        }
        
        .post-meta {
          color: #7f8c8d;
          font-size: 0.9rem;
        }
        
        .post-content {
          margin-bottom: 1rem;
          line-height: 1.6;
        }
        
        .post-timestamp {
          font-size: 0.8rem;
          color: #95a5a6;
          margin-top: 0.5rem;
          font-style: italic;
        }
        
        .post-actions {
          display: flex;
          gap: 0.8rem;
          margin-top: 1rem;
        }
        
        .btn-edit {
          background: #3498db;
          color: white;
        }
        
        .btn-delete {
          background: #e74c3c;
          color: white;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .sidebar {
            width: 250px;
            left: ${sidebarOpen ? '0' : '-250px'};
          }
          
          .sidebar-toggle {
            left: ${sidebarOpen ? '250px' : '0'};
          }
          
          .welcome-buttons {
            flex-direction: column;
          }
          
          .post-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      {/* Header */}
      <header className="app-header">
        <h1>BlogVerse</h1>
        <p>Your Ultimate Blogging Platform</p>
      </header>

      {/* Sidebar Toggle */}
      {user && (
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {sidebarOpen ? '◀' : '▶'}
        </button>
      )}

      {/* Sidebar */}
      {user && (
        <div className="sidebar">
          <div className="sidebar-header">
            <h2>Menu</h2>
            <p>Welcome, {user}!</p>
          </div>
          <div className="sidebar-menu">
            <button 
              onClick={() => {
                setCurrentPage("welcome");
                if (window.innerWidth < 768) setSidebarOpen(false);
              }}
              className={currentPage === "welcome" ? "active" : ""}
            >
              🏠 Welcome
            </button>
            <button 
              onClick={() => {
                setCurrentPage("home");
                if (window.innerWidth < 768) setSidebarOpen(false);
              }}
              className={currentPage === "home" ? "active" : ""}
            >
              📰 All Posts
            </button>
            <button 
              onClick={() => {
                setCurrentPage("myPosts");
                if (window.innerWidth < 768) setSidebarOpen(false);
              }}
              className={currentPage === "myPosts" ? "active" : ""}
            >
              📝 My Posts
            </button>
            <button 
              onClick={() => {
                setCurrentPage("create");
                if (window.innerWidth < 768) setSidebarOpen(false);
              }}
              className={currentPage === "create" ? "active" : ""}
            >
              ✏️ Create Post
            </button>
            <button onClick={handleSignOut}>
              🚪 Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="content">
        {currentPage === "login" ? (
          <div className="auth-container">
            <h2>Login</h2>
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="input" 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="input" 
            />
            <button onClick={handleLogin} className="btn">Login</button>
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
              Don't have an account?{' '}
              <span 
                style={{ color: '#3498db', cursor: 'pointer' }}
                onClick={() => setCurrentPage("signup")}
              >
                Sign up
              </span>
            </p>
          </div>
        ) : currentPage === "signup" ? (
          <div className="auth-container">
            <h2>Sign Up</h2>
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="input" 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="input" 
            />
            <button onClick={handleSignup} className="btn">Sign Up</button>
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
              Already have an account?{' '}
              <span 
                style={{ color: '#3498db', cursor: 'pointer' }}
                onClick={() => setCurrentPage("login")}
              >
                Login
              </span>
            </p>
          </div>
        ) : currentPage === "welcome" ? (
          <div className="welcome">
            <h1>Welcome to BlogVerse, {user}!</h1>
            <p>Start sharing your thoughts with our community of bloggers.</p>
            
            <div className="welcome-buttons">
              <button 
                className="btn" 
                onClick={() => setCurrentPage("create")}
              >
                ✏️ Create Your First Post
              </button>
              <button 
                className="btn" 
                onClick={() => setCurrentPage("home")}
                style={{ background: '#2c3e50' }}
              >
                📚 Browse Posts
              </button>
            </div>
          </div>
        ) : currentPage === "create" ? (
          <div>
            <h2>{editIndex !== null ? "Edit Post" : "Create New Post"}</h2>
            <input 
              type="text" 
              placeholder="Title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="input" 
            />
            <textarea 
              placeholder="Write your content here..." 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              className="input" 
              rows="10"
            ></textarea>
            <button onClick={addPost} className="btn">
              {editIndex !== null ? "Update Post" : "Publish Post"}
            </button>
          </div>
        ) : currentPage === "home" ? (
          <div>
            <h2>Recent Posts</h2>
            {posts.length === 0 ? (
              <p>No posts available yet. Be the first to create one!</p>
            ) : (
              posts.map((post, index) => (
                <div key={index} className="post">
                  <div className="post-header">
                    <h3 className="post-title">{post.title}</h3>
                    <div className="post-meta">By {post.author}</div>
                  </div>
                  <div className="post-content">{post.content}</div>
                  <div className="post-timestamp">
                    Posted: {formatDate(post.createdAt)}
                    {post.updatedAt !== post.createdAt && (
                      <span> • Updated: {formatDate(post.updatedAt)}</span>
                    )}
                  </div>
                  {user === post.author && (
                    <div className="post-actions">
                      <button 
                        onClick={() => editPost(index)} 
                        className="btn btn-edit"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deletePost(index)} 
                        className="btn btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : currentPage === "myPosts" && (
          <div>
            <h2>My Posts</h2>
            {posts.filter(post => post.author === user).length === 0 ? (
              <p>You haven't created any posts yet.</p>
            ) : (
              posts.filter(post => post.author === user).map((post, index) => {
                const originalIndex = posts.findIndex(p => p === post);
                return (
                  <div key={index} className="post">
                    <div className="post-header">
                      <h3 className="post-title">{post.title}</h3>
                      <div className="post-meta">By {post.author}</div>
                    </div>
                    <div className="post-content">{post.content}</div>
                    <div className="post-timestamp">
                      Posted: {formatDate(post.createdAt)}
                      {post.updatedAt !== post.createdAt && (
                        <span> • Updated: {formatDate(post.updatedAt)}</span>
                      )}
                    </div>
                    <div className="post-actions">
                      <button 
                        onClick={() => editPost(originalIndex)} 
                        className="btn btn-edit"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deletePost(originalIndex)} 
                        className="btn btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogApp;
