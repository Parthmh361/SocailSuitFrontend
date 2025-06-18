import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/pagesSlice";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [jwtToken, setJwtToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showAppCreds, setShowAppCreds] = useState(false);

  // Signup state
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // App credentials state (for signup)
  const [facebookAppId, setFacebookAppId] = useState("");
  const [facebookAppSecret, setFacebookAppSecret] = useState("");
  const [instagramAppId, setInstagramAppId] = useState("");
  const [instagramAppSecret, setInstagramAppSecret] = useState("");
  const [youtubeAppId, setYoutubeAppId] = useState("");
  const [youtubeAppSecret, setYoutubeAppSecret] = useState("");

  const dispatch = useDispatch();
  const selector = useSelector((state) => state.pages.user);

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://socialsuit-backend-h9md.onrender.com/userauth/login", {
        username,
        password,
      });
      if (res.data.token) {
        setJwtToken(res.data.token);
        setIsLoggedIn(true);
        dispatch(setUser(res.data.user));
        localStorage.setItem("user", JSON.stringify(res.data.user));
        window.location.href = "https://hbg-vercel-yhjj.vercel.app/Home";
      }
    } catch (err) {
      alert("Invalid login");
    }
  };

  // Signup handler (show app creds after signup)
  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupPassword !== signupConfirm) {
      alert("Passwords do not match");
      return;
    }
    setSignupLoading(true);
    try {
      const res = await axios.post("https://socialsuit-backend-h9md.onrender.com/userauth/register", {
        username: signupUsername,
        password: signupPassword,
      });
      setSignupSuccess(true);
      setSignupLoading(false);
      setTimeout(() => {
        setShowAppCreds(true);
        setSignupSuccess(false);
      }, 1000);
      // Store user for app creds submission
      localStorage.setItem("user", JSON.stringify(res.data.user || { username: signupUsername }));
    } catch (err) {
      alert("Username already exists");
      setSignupLoading(false);
    }
  };

  // Handler for submitting app credentials after signup
  const handleSubmitAppCreds = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) {
      alert("User not found. Please login again.");
      return;
    }
    try {
      await axios.post("https://socialsuit-backend-h9md.onrender.com/userauth/update-app-credentials", {
        user_id: user._id,
        facebookAppId,
        facebookAppSecret,
        instagramAppId,
        instagramAppSecret,
        youtubeAppId,
        youtubeAppSecret,
      });
      localStorage.setItem("appCredsEntered", "true");
      window.location.href = "https://hbg-vercel-yhjj.vercel.app/Home";
    } catch (err) {
      alert("Failed to save credentials");
    }
  };

  const inputBoxStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    border: "1px solid #333",
    borderRadius: "6px",
    fontSize: "14px",
    backgroundColor: "#333",
    color: "#fff"
  };

  // Show app credentials form after signup
  if (showAppCreds) {
    return (
      <div style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        fontFamily: "sans-serif"
      }}>
        <form
          onSubmit={handleSubmitAppCreds}
          style={{
            display: "flex",
            gap: "28px",
            justifyContent: "center",
            alignItems: "flex-start",
            background: "#fff",
            padding: "32px 24px",
            borderRadius: "24px",
            boxShadow: "0 6px 32px rgba(0,0,0,0.18)"
          }}
        >
          {/* Facebook */}
          <div style={{
            background: "linear-gradient(135deg, #1877f2 60%, #4267b2 100%)",
            color: "#fff",
            borderRadius: "18px",
            width: "240px",
            minHeight: "260px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "18px 16px",
            boxShadow: "0 4px 24px rgba(24,119,242,0.10)",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "10px" }}>📘</div>
            <div style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "10px" }}>Facebook</div>
            <input
              style={inputBoxStyle}
              type="text"
              placeholder="Facebook App ID"
              value={facebookAppId}
              onChange={e => setFacebookAppId(e.target.value)}
            />
            <input
              style={inputBoxStyle}
              type="text"
              placeholder="Facebook App Secret"
              value={facebookAppSecret}
              onChange={e => setFacebookAppSecret(e.target.value)}
            />
          </div>
          {/* Instagram */}
          <div style={{
            background: "linear-gradient(135deg, #fdc468 0%, #df4996 100%)",
            color: "#fff",
            borderRadius: "18px",
            width: "240px",
            minHeight: "260px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "18px 16px",
            boxShadow: "0 4px 24px rgba(223,73,150,0.10)",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "10px" }}>📸</div>
            <div style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "10px" }}>Instagram</div>
            <input
              style={inputBoxStyle}
              type="text"
              placeholder="Instagram App ID"
              value={instagramAppId}
              onChange={e => setInstagramAppId(e.target.value)}
            />
            <input
              style={inputBoxStyle}
              type="text"
              placeholder="Instagram App Secret"
              value={instagramAppSecret}
              onChange={e => setInstagramAppSecret(e.target.value)}
            />
          </div>
          {/* YouTube */}
          <div style={{
            background: "linear-gradient(135deg, #ff5858 0%, #f09819 100%)",
            color: "#fff",
            borderRadius: "18px",
            width: "240px",
            minHeight: "260px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "18px 16px",
            boxShadow: "0 4px 24px rgba(255,88,88,0.10)",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "10px" }}>▶️</div>
            <div style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "10px" }}>YouTube</div>
            <input
              style={inputBoxStyle}
              type="text"
              placeholder="YouTube App ID"
              value={youtubeAppId}
              onChange={e => setYoutubeAppId(e.target.value)}
            />
            <input
              style={inputBoxStyle}
              type="text"
              placeholder="YouTube App Secret"
              value={youtubeAppSecret}
              onChange={e => setYoutubeAppSecret(e.target.value)}
            />
          </div>
          <button
            type="submit"
            style={{
              height: "40px",
              alignSelf: "flex-end",
              marginLeft: "12px",
              background: "linear-gradient(90deg, #7d2ae8 0%, #4267b2 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              padding: "0 28px",
              cursor: "pointer",
              fontSize: "1rem",
              boxShadow: "0 2px 8px rgba(125,42,232,0.10)"
            }}
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  // Signup page
  if (showSignup) {
    return (
      <div style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000"
      }}>
        <form onSubmit={handleSignup} style={{
          background: "#ffffffcc",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <div style={{
            width: "80px",
            height: "80px",
            backgroundColor: "#e0e0e0",
            borderRadius: "50%",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "40px",
            color: "#7d2ae8"
          }}>📝</div>
          <h2 style={{ marginBottom: "18px", color: "#7d2ae8" }}>Sign Up</h2>
          <input
            type="text"
            placeholder="Username"
            value={signupUsername}
            onChange={e => setSignupUsername(e.target.value)}
            required
            style={inputBoxStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={signupPassword}
            onChange={e => setSignupPassword(e.target.value)}
            required
            style={inputBoxStyle}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={signupConfirm}
            onChange={e => setSignupConfirm(e.target.value)}
            required
            style={inputBoxStyle}
          />
          <button
            type="submit"
            disabled={signupLoading}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "15px",
              backgroundColor: "#7d2ae8",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {signupLoading ? "Signing Up..." : "Sign Up"}
          </button>
          {signupSuccess && (
            <div style={{ color: "green", marginTop: "18px" }}>
              Signup successful! <span style={{ color: "#7d2ae8", textDecoration: "underline", cursor: "pointer" }} onClick={() => setShowAppCreds(true)}>Enter App Credentials</span>
            </div>
          )}
          <div style={{ marginTop: "20px", fontSize: "14px" }}>
            Already have an account?
            <span
              onClick={() => setShowSignup(false)}
              style={{
                padding: "5px 12px",
                border: "1px solid #7d2ae8",
                borderRadius: "12px",
                textDecoration: "none",
                color: "#7d2ae8",
                marginLeft: "5px",
                cursor: "pointer"
              }}>Sign In</span>
          </div>
        </form>
      </div>
    );
  }

  // Login page
  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#000"
    }}>
      <form onSubmit={handleLogin} style={{
        background: "#ffffffcc",
        padding: "40px",
        borderRadius: "20px",
        boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
        width: "100%",
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <div style={{
          width: "80px",
          height: "80px",
          backgroundColor: "#e0e0e0",
          borderRadius: "50%",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "40px",
          color: "#7d2ae8"
        }}>👤</div>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={inputBoxStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputBoxStyle}
        />

        <button type="submit" style={{
          width: "100%",
          padding: "12px",
          marginTop: "15px",
          backgroundColor: "#9b59b6",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer"
        }}>Sign In</button>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "10px",
          fontSize: "12px",
          width: "100%"
        }}>
          <label>
            <input type="checkbox" style={{ marginRight: "5px" }} /> Remember me
          </label>
          <a href="#" style={{ textDecoration: "underline", color: "#7d2ae8" }}>
            Forgot password?
          </a>
        </div>

        <div style={{ marginTop: "20px", fontSize: "14px" }}>
          Not a member?
          <span
            onClick={() => setShowSignup(true)}
            style={{
              padding: "5px 12px",
              border: "1px solid #7d2ae8",
              borderRadius: "12px",
              textDecoration: "none",
              color: "#7d2ae8",
              marginLeft: "5px",
              cursor: "pointer"
            }}>Create account</span>
        </div>
      </form>
    </div>
  );
}
