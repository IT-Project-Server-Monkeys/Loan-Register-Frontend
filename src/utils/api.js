import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE,
  headers: {
    Authorization: `Bearer ${window.sessionStorage.getItem('accessToken')}` 
  }
});

const checkAPI = async (onSuccess, onFailure) => {
  const accessToken = window.sessionStorage.getItem('accessToken');
  const refreshToken = window.sessionStorage.getItem('refreshToken');

  // console.log("accessToken", accessToken);
  // console.log("refreshToken", refreshToken);

  const refreshAPI = async () => {
    await axios(`/refreshToken`, {
      method: "post",
      baseURL: process.env.REACT_APP_API_BASE,
      data: { token: refreshToken }
    })
      .then(res => {
        console.log("token refresh");
        window.sessionStorage.setItem("accessToken", res.data.accessToken);
        window.sessionStorage.setItem("refreshToken", res.data.refreshToken);
        onSuccess();
      })
      .catch(err => {
        // console.log(err);
        window.sessionStorage.removeItem("accessToken");
        window.sessionStorage.removeItem("refreshToken");
        onFailure();
      })
  }

  await axios(`/posts`, {
    method: "get",
    baseURL: process.env.REACT_APP_API_BASE,
    headers: {
      Authorization: `Bearer ${accessToken}` 
    }
  })
    .then(res => {
      // console.log(res.data);
      onSuccess();
    })
    .catch(async err => {
      // console.log(err);
      if (err.response.status === 400 || err.response.status === 403)
        await refreshAPI();
      else {
        window.sessionStorage.removeItem("accessToken");
        window.sessionStorage.removeItem("refreshToken");
        onFailure();
      }
    });
}

export { API, checkAPI };