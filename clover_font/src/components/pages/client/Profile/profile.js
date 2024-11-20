import React, { useState, useEffect } from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Lưu ý cú pháp import
// Thư viện giải mã token
import "./ProfilePage.css";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatedData, setUpdatedData] = useState({
    fullname: "",
    bio: "",
  });
  const [avatar, setAvatar] = useState(null);

  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null; // Giải mã token
  const username = decodedToken?.sub; // Lấy `username` từ payload (thường là `sub`)

  // Lấy thông tin tài khoản
  useEffect(() => {
    if (!username) {
      setError("Không tìm thấy thông tin người dùng trong token.");
      setIsLoading(false);
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/account/getByUsername",
          {
            params: { username },
            headers: {
              Authorization: `Bearer ${token || ""}`,
            },
          }
        );

        if (response.data) {
          setProfileData(response.data);
          setUpdatedData({
            fullname: response.data.fullname || "",
            email: response.data.email || "",
            phone: response.data.phone || "",
          });
        } else {
          throw new Error("Không tìm thấy dữ liệu tài khoản.");
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Không thể tải dữ liệu hồ sơ. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [token, username]);
  //
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Redirecting to login...");
      return;
    }

    try {
      const url = new URL("http://localhost:8080/api/post/getByUsername");
      url.searchParams.append("username", username);
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };




  //
  // Cập nhật dữ liệu đã chỉnh sửa
  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("fullname", updatedData.fullname);
    formData.append("email", updatedData.email);
    formData.append("phone", updatedData.phone);
    if (avatar) formData.append("avatar", avatar); // Only append if avatar is provided
  
    // Logging formData contents
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
  
    try {
      const response = await axios.put(
        "http://localhost:8080/api/account/updateInfor",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token || ""}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      if (response.data) {
        setProfileData(response.data); // Update profile data in state
        setIsEditing(false); // Toggle edit mode
        alert("Thông tin đã được cập nhật thành công!");
      }
    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err.message);
      alert("Có lỗi xảy ra khi cập nhật thông tin.");
    }
  };
  

  // Xử lý thay đổi dữ liệu trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Xử lý thay đổi ảnh đại diện
  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h4>{error}</h4>
        <p>Vui lòng thử lại sau.</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Cover Section */}
      <div className="cover-section">
        <div className="avatar">
          <img
            src={
              profileData.avatar
                ? `http://localhost:8080/uploads/avatars/${profileData.avatar}`
                : "https://via.placeholder.com/150"
            }
            alt="User Avatar"
            className="avatar-img"
          />
          {isEditing && (
            <input type="file" onChange={handleFileChange} className="file-input" />
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="profile-info">
        {isEditing ? (
          <>
            <div className="container mt-5">
              <h2 className="text-center mb-4">Thông Tin Người Dùng</h2>
              <form>
                <div className="row g-3">
                  {/* Fullname */}
                  <div className="col-md-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        name="fullname"
                        value={updatedData.fullname}
                        onChange={handleInputChange}
                        className="form-control"
                        id="fullname"
                        placeholder="Tên người dùng"
                      />
                      <label htmlFor="fullname">Tên người dùng</label>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="email"
                        name="email"
                        value={updatedData.email}
                        onChange={handleInputChange}
                        className="form-control"
                        id="email"
                        placeholder="Email"
                      />
                      <label htmlFor="email">Email</label>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        name="phone"
                        value={updatedData.phone}
                        onChange={handleInputChange}
                        className="form-control"
                        id="phone"
                        placeholder="Số điện thoại"
                      />
                      <label htmlFor="phone">Số điện thoại</label>
                    </div>
                  </div>
                </div>
                {/* Submit Button */}
              </form>
            </div>





          </>
        ) : (
          <>
            <h2 className="profile-name">
              {profileData.fullname || "Tên người dùng"}
            </h2>
            {/* <p className="profile-bio">
              {profileData.email || "Chưa có thông tin email."}
            </p>
            <p className="profile-bio">
              {profileData.phone || "Chưa có thông tin số điện thoại."}
            </p> */}
          </>

        )}
      </div>
      {/* Profile Actions */}
      <div className="profile-actions">
        {isEditing ? (
          <>
            <button className="btn btn-primary px-4 save-btn" onClick={handleUpdate}>
              Lưu thay đổi
            </button>
            <button className="btn btn-danger px-4 cancel-btn" onClick={() => setIsEditing(false)}>
              Hủy
            </button>
          </>
        ) : (
          <button className="btn edit-btn" onClick={() => setIsEditing(true)}>
            Chỉnh sửa trang cá nhân
          </button>
        )}
      </div>
      <Tabs
        defaultActiveKey="profile"
        id="uncontrolled-tab-example"
        className="mb-3 text-center"
      >
        <Tab eventKey="home" title="Bài đăng" className="text-center">
          {loading ? (
            <p>Đang tải bài đăng...</p>
          ) : posts.length === 0 ? (
            <p>Không có bài đăng nào để hiển thị.</p>
          ) : (
            <div className="post-list">
              {posts.map((post) => (
                <div className="post-card" key={post.id}>
                  {/* Header */}
                  <div className="post-header">
                    <img
                      className="post-avatar"
                      src={
                        post.account?.avatar
                          ? `http://localhost:8080/uploads/avatars/${post.account.avatar}`
                          : "https://via.placeholder.com/50"
                      }
                      alt="Avatar"
                    />
                    <div className="post-info">
                      <h4>{post.account?.fullname || "Người dùng"}</h4>
                      <p>{new Date(post.postDay).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Content */}
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

                  {/* Footer */}
                  <div className="post-footer">
                    <button className="like-button">Số lượt thích:{post.numberLikes}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Tab>


        <Tab eventKey="profile" title="Cửa hàng" className="text-center">
          Cửa hàng
        </Tab>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
