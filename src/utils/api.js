import axios from 'axios';

const MAX_SESSION = 1200000; // 20min
const SESSION_REFRESH = 750000; // 12.5min, 2.5min leeway from refresh time to account for slow internet

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE,
  headers: {
    Authorization: `Bearer ${window.sessionStorage.getItem('accessToken')}` 
  }
});

// To be run before API calls on all pages that requires login. Checks whether
// accessToken's lifetime has passed. If not, approve onSuccess().
// If yes, attempt to refresh accessToken. If refreshing fails, perform onFailure().
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
        // console.log("token refresh");
        window.sessionStorage.setItem("sessionStart", Date.now());
        window.sessionStorage.setItem("accessToken", res.data.accessToken);
        window.sessionStorage.setItem("refreshToken", res.data.refreshToken);
        onSuccess();
      })
      .catch(err => {
        console.log("Refresh token expired.")
        onFailure();
      })
  }

  const diff = Date.now() - parseInt(sessionStart);
  // console.log(`${diff / 60000} minutes passed since session start/refresh`);

  if (diff >= SESSION_REFRESH) {
    if (diff < MAX_SESSION) refreshAPI();
    else {
      console.log("Refresh token expired.")
      onFailure();
    }
  }
  else onSuccess();
}

export { API, checkAPI };