import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE,
  headers: {
    Authorization: `Bearer ${window.sessionStorage.getItem('accessToken')}` 
  }
});

const checkAPI = async (onSuccess, onFailure) => {
  const sessionStart = window.sessionStorage.getItem('sessionStart'); 
  const refreshToken = window.sessionStorage.getItem('refreshToken');

  const refreshAPI = async () => {
    await axios(`/refreshToken`, {
      method: "post",
      baseURL: process.env.REACT_APP_API_BASE,
      data: { token: refreshToken }
    })
      .then(res => {
        console.log("token refresh");
        window.sessionStorage.setItem("sessionStart", Date.now());
        window.sessionStorage.setItem("accessToken", res.data.accessToken);
        window.sessionStorage.setItem("refreshToken", res.data.refreshToken);
        onSuccess();
      })
      .catch(err => {
        // console.log(err);
        console.log("refresh token expired")
        onFailure();
      })
  }

  const diff = Date.now() - parseInt(sessionStart);
  console.log(`${diff / 60000} minutes passed since session start/refresh`);

  // 12.5 minutes - 2.5 min leeway for slow internet connection
  if (diff >= 750000) refreshAPI();
  else onSuccess();
}

export { API, checkAPI };