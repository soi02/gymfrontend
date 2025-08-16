// useRoutineService.js
import axios from "axios";
import { useCallback, useMemo } from "react";

const API_BASE_URL = "http://localhost:8080/api/routine";

export default function useRoutineService() {
  // 1) axios 인스턴스 고정
  const api = useMemo(() => {
    return axios.create({ baseURL: API_BASE_URL });
  }, []);

  // 토큰 헤더 합치기 유틸 (필요한 곳에서만 씀)
  const withAuth = useCallback((cfg = {}) => {
    const token = localStorage.getItem("token");
    return token
      ? { ...cfg, headers: { ...(cfg.headers || {}), Authorization: `Bearer ${token}` } }
      : cfg;
  }, []);

  // 2) API 함수들을 useCallback으로 고정
  const getWorkoutList = useCallback(async () => {
    const res = await api.get(`/getArticleList`);
    return res.data;
  }, [api]);

  const getWorkoutGuide = useCallback(async (id) => {
    const res = await api.get(`/getWorkoutGuide/${id}`);
    return res.data;
  }, [api]);

  const saveRoutine = useCallback(async (payload) => {
    const res = await api.post(`/saveRoutine`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  }, [api]);

  const getRoutinesByUserId = useCallback(async (userId) => {
    const res = await api.get(`/getRoutinesByUserId/${userId}`, withAuth());
    return res.data;
  }, [api, withAuth]);

  const getRoutineDetail = useCallback(async (routineId) => {
    const res = await api.get(`/list/${routineId}`);
    return res.data;
  }, [api]);

  const getFullRoutineDetail = useCallback(async (routineId) => {
    const res = await api.get(`/routineSets/${routineId}`);
    return res.data;
  }, [api]);

  const saveActualWorkout = useCallback(async (data) => {
    // auth 필요한 엔드포인트면 withAuth() 추가
    return await api.post(`/saveActualWorkout`, data, withAuth());
  }, [api, withAuth]);

  const getActualWorkout = useCallback(async (workoutId, cfg = {}) => {
    // 👇 컴포넌트 useEffect 의존성에 넣어도 이제 레퍼런스 고정됨
    return await api.get(`/result/${workoutId}`, withAuth(cfg));
  }, [api, withAuth]);

  // 3) 버그 수정: 인자로 받은 userId를 실제로 사용
  const getWorkoutByDate = useCallback(async (userId, selectedDate) => {
    return await api.get(`/getWorkoutByDate`, {
      params: { userId, date: selectedDate },
      ...withAuth(),
    });
  }, [api, withAuth]);

  const getWorkoutDatesBetween = useCallback((userId, startDate, endDate) => {
    return api.get(`/getWorkoutDatesBetween`, {
      params: { userId, startDate, endDate },
      ...withAuth(),
    });
  }, [api, withAuth]);

  const updateMemo = useCallback(async (elementId, memoContent) => {
    const payload = { elementId, memoContent };
    return await api.post(`/updateMemo`, payload, {
      headers: { "Content-Type": "application/json" },
      ...withAuth(),
    });
  }, [api, withAuth]);

  const youtubeSearch = useCallback(async (q) => {
    const res = await api.get(`/youtube/search`, { params: { q } });
    return res.data;
  }, [api]);

    // 🔥 사진+메모 업서트 (multipart)
const upsertWorkoutLogExtras = useCallback(async (workoutId, { memo, file }) => {
  const form = new FormData();
  if (memo !== undefined) form.append("memo", memo);
  if (file) form.append("file", file, file.name);
  // ❌ headers에 Content-Type 직접 지정하지 않기
  return api.post(`/workoutLog/${workoutId}/extras`, form, withAuth());
}, [api, withAuth]);


  // 🔥 workout_log 조회
  const getWorkoutLog = useCallback(async (workoutId) => {
    return await api.get(`/workoutLog/${workoutId}`, withAuth());
  }, [api, withAuth]);

  return useMemo(
    () => ({
      getWorkoutList,
      getWorkoutGuide,
      saveRoutine,
      getRoutinesByUserId,
      getRoutineDetail,
      getFullRoutineDetail,
      saveActualWorkout,
      getActualWorkout,
      getWorkoutByDate,
      getWorkoutDatesBetween,
      updateMemo,
      youtubeSearch,
      upsertWorkoutLogExtras,
      getWorkoutLog

    }),
    [
      getWorkoutList,
      getWorkoutGuide,
      saveRoutine,
      getRoutinesByUserId,
      getRoutineDetail,
      getFullRoutineDetail,
      saveActualWorkout,
      getActualWorkout,
      getWorkoutByDate,
      getWorkoutDatesBetween,
      updateMemo,
      youtubeSearch,
      upsertWorkoutLogExtras,
      getWorkoutLog,

    ]
  );




}
