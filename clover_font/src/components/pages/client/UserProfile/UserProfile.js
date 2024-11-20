import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const { userName } = useParams(); // Lấy username từ URL params
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (!storedToken) {
      setError("Authorization token is missing.");
    }
  }, []);

  // Lấy thông tin hồ sơ người dùng
  useEffect(() => {
    if (!token) return;

    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/account/getByUsername?username=${userName}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        setError(`Error fetching user profile: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [userName, token]);

  // Lấy bài đăng của người dùng
  useEffect(() => {
    if (!token) return;

    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/post/getByUsername?username=${userName}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Error fetching posts: ${response.status}`);
        }
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(`Error fetching posts: ${error.message}`);
      }
    };

    fetchPosts();
  }, [userName, token]);

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Cover Section */}
      <div className="cover-section">
        <div className="avatar">
          <img
            className="avatar-img"
            src={
              profileData.avatar
                ? `http://localhost:8080/uploads/avatars/${profileData.avatar}`
                : "https://via.placeholder.com/100"
            }
            alt="Avatar"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="profile-info">
        <h2 className="profile-name">{profileData.fullname || "User"}</h2>
        <p className="profile-email">Email: {profileData.email || "N/A"}</p>
      </div>

      {/* About Section */}
      <div className="about-section">
        <h3 className="about-title">About</h3>
        <p className="about-text">{profileData.about || "This user has no bio yet."}</p>
      </div>

      {/* Post List Section */}
      <div className="post-list">
        <h3>Bài đăng</h3>
        {posts.length === 0 ? (
          <p>Người dùng này chưa có bài đăng nào.</p>
        ) : (
          posts.map((post) => (
            <div className="post-card" key={post.id}>
              <div className="post-header">
                <img
                  className="post-avatar"
                  src={
                    post.account?.avatar
                      ? `http://localhost:8080/uploads/avatars/${post.account.avatar}`
                      : "https://via.placeholder.com/50"
                  }
                  alt="User Avatar"
                />
                <div className="post-info">
                  <h4>{post.account?.fullname || "Người dùng"}</h4>
                  <p>{new Date(post.postDay).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="post-content">
                <p>{post.content}</p>
                {post.postImages?.length > 0 && (
                  <div className="post-images">
                    {post.postImages.map((image) => (
                      <img
                        key={image.id}
                        src={`http://localhost:8080/uploads/posts/${image.nameImage}`}
                        alt="Post"
                        className="post-image"
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="post-footer">
                <button className="like-button">Số lượt thích: {post.numberLikes}</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserProfile;
