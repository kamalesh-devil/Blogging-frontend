import React, { useState, useEffect } from "react";


const BlogApp = () => {
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem("blogPosts");
    return savedPosts ? JSON.parse(savedPosts) : [];
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState("home");
  const [user, setUser] = useState(() => localStorage.getItem("blogUser"));

  useEffect(() => {
    localStorage.setItem("blogPosts", JSON.stringify(posts));
  }, [posts]);

  const handleSignIn = () => {
    const username = prompt("Enter your username:");
    if (username) {
      setUser(username);
      localStorage.setItem("blogUser", username);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("blogUser");
    setUser(null);
  };

  const addPost = () => {
    if (!user) {
      alert("You must be signed in to create a post!");
      return;
    }
    if (title.trim() && content.trim()) {
      const newPost = { title, content, author: user };
      if (editIndex !== null) {
        const updatedPosts = [...posts];
        updatedPosts[editIndex] = newPost;
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
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
      const updatedPosts = posts.filter((_, i) => i !== index);
      setPosts(updatedPosts);
    }
  };

  return (
    <div className="app">
      <style>{`
        body {
          font-family: Arial, sans-serif;
          background: linear-gradient(-45deg, #ff9a9e, #fad0c4, #8EC5FC, #E0C3FC);
          background-size: 400% 400%;
          animation: gradient 10s ease infinite;
          margin: 0;
          color: white;
          text-align: center;
        }
        .navbar {
          background: rgba(0, 0, 0, 0.6);
          padding: 10px;
          border-radius: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 20px;
        }
        .navbar button {
          padding: 10px 15px;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          cursor: pointer;
          border-radius: 5px;
        }
        .navbar .active {
          background: #28a745;
        }
        .signin {
          background: #007bff;
        }
        .signout {
          background: #dc3545;
        }
        .post {
          background: rgba(255, 255, 255, 0.1);
          padding: 15px;
          margin-bottom: 10px;
          border-radius: 10px;
          backdrop-filter: blur(5px);
          color: #fff;
        }
        .author {
          font-size: 14px;
          color: #ddd;
          margin-left: 10px;
        }
        .no-posts {
          font-size: 18px;
          font-style: italic;
          opacity: 0.7;
        }
        .edit {
          background: #ffc107;
          color: black;
        }
        .delete {
          background: #dc3545;
        }
        .publish {
          background: #28a745;
          padding: 10px;
          border: none;
          cursor: pointer;
          border-radius: 5px;
        }
        .input, .textarea {
          width: 100%;
          padding: 10px;
          margin-bottom: 10px;
          border-radius: 5px;
          border: none;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <nav className="navbar">
        <button onClick={() => setCurrentPage("home")} className={currentPage === "home" ? "active" : ""}>Home</button>
        <button onClick={() => setCurrentPage("create")} className={currentPage === "create" ? "active" : ""}>{editIndex !== null ? "Edit Post" : "Create Post"}</button>
        {user ? (
          <>
            <span className="user">Welcome, {user}!</span>
            <button onClick={handleSignOut} className="signout">Sign Out</button>
          </>
        ) : (
          <button onClick={handleSignIn} className="signin">Sign In</button>
        )}
      </nav>
      {currentPage === "home" ? (
        <>
          <h2 className="heading">Recent Posts</h2>
          {posts.length === 0 ? <p className="no-posts">No posts yet. Start writing!</p> : null}
          {posts.map((post, index) => (
            <div key={index} className="post">
              <h3>{post.title} <span className="author">by {post.author}</span></h3>
              <p>{post.content}</p>
              {user === post.author && (
                <>
                  <button onClick={() => editPost(index)} className="edit">Edit</button>
                  <button onClick={() => deletePost(index)} className="delete">Delete</button>
                </>
              )}
            </div>
          ))}
        </>
      ) : (
        <div className="create-post">
          <h2 className="heading">{editIndex !== null ? "Edit Post" : "Create a New Post"}</h2>
          <input type="text" placeholder="Post Title" value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
          <textarea placeholder="Write your blog post..." value={content} onChange={(e) => setContent(e.target.value)} className="textarea" />
          <button onClick={addPost} className="publish">{editIndex !== null ? "Update" : "Publish"}</button>
        </div>
      )}
    </div>
  );
};

export default BlogApp;