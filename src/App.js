import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [stationName, setStationName] = useState(""); // 역 이름
  const [arrivalInfo, setArrivalInfo] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (stationName.trim() === "") {
          setArrivalInfo([]); // 역 이름이 비어있으면 도착 정보 초기화
          return;
        }

        const response = await axios.get(
          `http://swopenAPI.seoul.go.kr/api/subway/4b4a496763746f6631313247546a6a53/json/realtimeStationArrival/0/5/${stationName}`
        );
        if (response.data.realtimeArrivalList) {
          setArrivalInfo(response.data.realtimeArrivalList);
        }
      } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
      }
    };

    fetchData();
  }, [stationName]);

  return (
    <div>
      <h1>지하철 도착시간 알림</h1>
      <div>
        역 이름:
        <input
          type="text"
          placeholder="역 이름을 입력해 주세요"
          value={stationName}
          onChange={(e) => setStationName(e.target.value)}
        />
      </div>
      <ul>
        {arrivalInfo.map((arrival, index) => (
          <li key={index}>
            {arrival.trainLineNm} - {arrival.arvlMsg2}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
