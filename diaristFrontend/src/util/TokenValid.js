import { ACCESS_TOKEN} from '../constants/property';

//accessToken의 만료까지 남은 시간 초단위로 계산
export const expiry = (token) => {
    if (!token || token === "undefined" ) return null;
    const expiresAt = new Date(
      JSON.parse(window.atob(token.split(".")[1])).exp * 1000
    );
    const currentTime = new Date();
    //console.log((expiresAt.getTime() - currentTime.getTime()) / 1000)
    return (expiresAt.getTime() - currentTime.getTime()) / 1000; // Seconds to expiry
  }; 
  
  //accessToken의 만료까지 남은시간 [분, 초] 단위로 계산 
  export const timer = accessToken => {
    const secondsToExpiry = expiry(sessionStorage.getItem(ACCESS_TOKEN));
    const roundedMinutes = Math.max(Math.floor(secondsToExpiry / 60), 0);
    return [
      roundedMinutes,
      Math.trunc(secondsToExpiry - roundedMinutes * 60)
    ];
  };