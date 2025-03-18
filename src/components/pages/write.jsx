import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getDatabase, ref, push, serverTimestamp } from "firebase/database";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Write() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Business",
    "Arts",
    "Technology",
    "Science",
    "Geopolitics",
    "Sports",
    "Health",
    "History",
    "Geography",
    "Education",
    "Entertainment",
    "Nature",
    "Animals",
    "Religions",
    "Lifestyles",
    "Travel",
    "Finance",
    "Gaming",
    "Productivity",
    "Fashion",
    "Wellness",
    "Mindset",
    "Innovation",
  ];

  const handleUpload = (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("You must be logged in to write a blog.");
      return;
    }
    setLoading(true);
    const db = getDatabase();
    const blogRef = ref(db, "blogs");

    const newBlog = {
      title,
      content,
      category,
      author: currentUser.displayName || "Anonymous",
      date: serverTimestamp(),
      imageUrl: "../images/blogP2.jfif",
      likes: 0,
      comments: [],
      authorUID: currentUser.uid,
    };

    push(blogRef, newBlog)
      .then(() => {
        setShowModal(true);
        setTitle("");
        setContent("");
        setCategory("");
      })
      .catch((error) => {
        console.error("Error uploading blog:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/");
  };

  return (
    <div className="write-page">
      <div className="container-fluid">
        <button
          className="btn btn-sm btn-white border-2 mb-3"
          title="Close"
          onClick={() => navigate("/")}
        >
          <i className="fa-sharp fa-solid fa-square-xmark fs-4"></i>
        </button>
        <h2 className="write-title">Write a Blog</h2>
        <form onSubmit={handleUpload} className="write-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              placeholder="Enter a Title for your blog"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group editor-group">
            <label htmlFor="content" className="form-label">
              Content
            </label>
            <ReactQuill
              theme="snow"
              className="editor"
              style={{ backgroundColor: "white", fontSize: "16px" }}
              placeholder="Write your blog post here..."
              value={content}
              onChange={setContent}
            />
          </div>
          <br />
          <br />
          <br />

          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              className="form-select category-select"
              id="category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" style={{fontWeight:'600'}}>Select a category</option>
              <br />
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="submit-group">
            <button
              type="submit"
              className="btn btn-outline-primary submit-btn"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Blog"}
            </button>
          </div>
        </form>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Info</h4>
              <button className="btn-close" onClick={handleCloseModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>Blog uploaded successfully!</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* Write Page Overall Styles */
        .write-page {
          background: #f5f7fa;
          padding: 40px 20px;
          min-height: 100vh;
          color: #333;
        }
        .container-fluid {
          max-width: 1260px;
          margin: 0 auto;
          padding: 0 30px;
        }
        .write-title {
          font-size: 32px;
          font-weight: 600;
          text-align: center;
          margin-bottom: 30px;
          color: #222;
        }
        .write-form {
          width: 100%;
        }
        .form-group {
          margin-bottom: 25px;
        }
        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          font-size: 18px;
          color: #444;
        }
        .form-control,
        .form-select {
          width: 100%;
          padding: 12px 15px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .form-control:focus,
        .form-select:focus {
          border-color: #00d4ff;
          box-shadow: 0 0 8px rgba(0, 212, 255, 0.6);
          outline: none;
        }
        
        /* Editor Styling */
        .editor-group .editor {
          height: 100vh;
          border-radius: 4px;
          border: 1px solid #ccc;
        }
        
        /* Category Select Custom Styling */
        .category-select {
          margin-top: 10px;
          overflow-y: auto;
          padding: 10px 15px;
          font-size: 16px;
          border-radius: 4px;
          background: #fff;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
          border: 1px solid #ccc;
          transition: border-color 0.3s ease;
        }
        .category-select:focus {
          border-color: #00d4ff;
          box-shadow: 0 0 8px rgba(0, 212, 255, 0.6);
          outline: none;
        }
        
        /* Submit Button Styling */
        .submit-group {
          text-align: center;
          margin-top: 30px;
        }
        .submit-btn {
          width: 50%;
          padding: 12px;
          font-size: 16px;
          font-weight: bold;
          border-radius: 8px;
          border: none;
          background: linear-gradient(45deg, #00d4ff, #9147ff);
          color: #fff;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .submit-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
        }
        
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .modal-header, .modal-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .btn-close {
          background: transparent;
          border: none;
          font-size: 28px;
          cursor: pointer;
          line-height: 1;
        }
        
        @media (max-width: 576px) {
          .write-title {
            font-size: 28px;
          }
          .container-fluid {
            padding: 0 0px;
            width : 100%;
          }
        }
      `}</style>
    </div>
  );
}
