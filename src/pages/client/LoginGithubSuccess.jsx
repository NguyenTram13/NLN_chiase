import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/reducers/authReducer";

const LoginGithubSuccess = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserGithub = async () => {
      try {
        const response = await axios({
          url: "/auth/login-github-success/" + id,
        });
        if (response.status === 200) {
          console.log(response);
          console.log(response);
          const accessToken = response.data.accessToken;
          localStorage.setItem("access_token", accessToken);
          // //decode lay thong tin payload
          var decodedPayload = jwt_decode(accessToken);
          console.log(decodedPayload);
          await dispatch(setUser(decodedPayload));
          window.location.href = "/home";
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchUserGithub();
  }, []);
  return <div></div>;
};

export default LoginGithubSuccess;
