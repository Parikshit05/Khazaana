import React, { useState, useContext } from "react";
import AuthLayout from "../../components/layouts/authLayout";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { Link } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import uploadImage from "../../utils/uploadImage";
import { UserContext } from "../../context/UserContext";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  //Handle signup form submit
  const handleSignUp = async (e) => {
    console.log("SignUp form submitted");
    e.preventDefault();
    let profileImageUrl = "";

    if (!fullName) {
      setError("Please Enter Your Name");
      return;
    }
    // Validate email
    if (!validateEmail(email)) {
      setError("Please Enter a Valid Email");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    // SignUp API call
    try {
      // Upload image if present
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
      });
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user); // Update user context with the signed-up user data
        setError(null);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };
  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black ">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below.
        </p>

        {/* <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              label="Full Name"
              placeholder="John Doe"
              value={fullName}
              onChange={setFullName} 
            />
            
            <Input
              type="email"
              label="Email"
              placeholder="john@example.com"
              value={email}
              onChange={setEmail}
            />
            <div className="col-span-2">
              <Input
                type="password"
                placeholder="Min 8 Characters"
                label="Password"
                value={password}
                onChange={setPassword}
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary">
            SIGN UP
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account?{" "}
            <Link className="font-medium text-primary underline" to="/login">
              Login
            </Link>
          </p>
        </form> */}

        <form onSubmit={handleSignUp} className="w-full max-w-2xl mx-auto">
          <div className="flex justify-center mb-6">
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Input
                type="text"
                label="Full Name"
                placeholder="John Doe"
                value={fullName}
                onChange={setFullName}
              />
            </div>
            <div>
              <Input
                type="email"
                label="Email"
                placeholder="john@example.com"
                value={email}
                onChange={setEmail}
              />
            </div>
            <div className="md:col-span-2">
              <Input
                type="password"
                placeholder="Min 8 Characters"
                label="Password"
                value={password}
                onChange={setPassword}
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium mb-4">{error}</p>
          )}

          <button type="submit" className="btn-primary w-full">
            SIGN UP
          </button>

          <p className="text-[13px] text-slate-800 mt-4 text-center">
            Already have an account?{" "}
            <Link className="font-medium text-primary underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
