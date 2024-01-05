import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [arrivalInfo, setArrivalInfo] = useState([]); // 지하철 도착 정보
  const [searchSubwayLine, setSearchSubwayLine] = useState(""); // 노선명
  const [stationName, setStationName] = useState(""); // 역 이름
  const [uniqueSubwayIds, setUniqueSubwayIds] = useState([]); // 노선 ID

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (stationName.trim() === "") {
          setArrivalInfo([]);
          return;
        }

        const response = await axios.get(
          `http://swopenAPI.seoul.go.kr/api/subway/4b4a496763746f6631313247546a6a53/json/realtimeStationArrival/0/25/${stationName}`
        );
        if (response.data.realtimeArrivalList) {
          // 지하철 도착 정보 초기데이터
          setArrivalInfo(response.data.realtimeArrivalList);
          // 노선 ID 초기데이터
          const uniqueIds = [
            ...new Set(
              response.data.realtimeArrivalList.map((item) => item.subwayId)
            ),
          ];
          setUniqueSubwayIds(uniqueIds);
        }
      } 
    };

    fetchData();
  }, [stationName]);

  const subwayLines = {
    1001: "1호선",
    1002: "2호선",
    1003: "3호선",
    1004: "4호선",
    1005: "5호선",
    1006: "6호선",
    1007: "7호선",
    1008: "8호선",
    1009: "9호선",
    1061: "중앙선",
    1063: "경의중앙선",
    1065: "공항철도",
    1067: "경춘선",
    1075: "수의분당선",
    1077: "신분당선",
    1092: "우이신설선",
    1093: "서해선",
    1081: "경강선",
  };

  // 지하철 ID를 받아서 노선명으로 변환
  const subwayIdToLine = (subwayId) => {
    return subwayLines[subwayId] || "Unknown Line";
  };

  // 노선명을 받아서 지하철 ID로 변환
  const lineToSubwayId = (line) => {
    const subwayId = Object.keys(subwayLines).find(
      (key) => subwayLines[key] === line
    );
    return subwayId || "";
  };

  // 노선명을 선택하면 해당 노선의 지하철 도착 정보만 보여주세요.
  const filteredArrivalInfo = arrivalInfo.filter(
    (arrival) =>
      arrival.subwayId.toString() === lineToSubwayId(searchSubwayLine)
  );

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
        노선명:
        <select
          value={subwayIdToLine(searchSubwayLine)}
          onChange={(e) => setSearchSubwayLine(subwayIdToLine(e.target.value))}
          // 노선명을 선택하면 해당 노선의 지하철 도착 정보만 보여주기
        >
          <option value="">노선을 선택해 주세요</option>
          {uniqueSubwayIds.map((id, index) => (
            <option key={index} value={id}>
              {subwayIdToLine(id)}
            </option>
          ))}
        </select>
      </div>
      <ul>
        {filteredArrivalInfo.map((arrival, index) => (
          <li key={index}>
            {subwayIdToLine(arrival.subwayId)} - {arrival.arvlMsg2} [
            {arrival.updnLine}]
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

