import axios from 'axios';

const MAX_SESSION = 1200000; // 20min
const SESSION_REFRESH = 900000; // 15min

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE,
  headers: {
    Authorization: `Bearer ${window.sessionStorage.getItem('accessToken')}` 
  }
});

const checkAPI = async (uid, onSuccess, onFailure) => {
  const sessionStart = window.sessionStorage.getItem('sessionStart'); 
  const refreshToken = window.sessionStorage.getItem('refreshToken');

  const refreshAPI = async () => {
    await axios(`/refreshToken`, {
      method: "post",
      baseURL: process.env.REACT_APP_API_BASE,
      data: { token: refreshToken, uid: uid }
    })
      .then(res => {
        console.log("token refresh");
        window.sessionStorage.setItem("sessionStart", Date.now());
        window.sessionStorage.setItem("accessToken", res.data.accessToken);
        window.sessionStorage.setItem("refreshToken", res.data.refreshToken);
        onSuccess();
      })
      .catch(err => {
        console.log("refresh token expired")
        onFailure();
      })
  }

  const diff = Date.now() - parseInt(sessionStart);
  console.log(`${diff / 60000} minutes passed since session start/refresh`);

  if (diff >= SESSION_REFRESH) {
    if (diff < MAX_SESSION) refreshAPI();
    else {
      console.log("refresh token expired")
      onFailure();
    }
  }
  else onSuccess();
}

export { API, checkAPI };