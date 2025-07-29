import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  scores: {
    goal: 0,
    relationship: 0,
    recovery: 0,
    learning: 0,
    balanced: 0
  },
  keywords: [],
  routine: { days: [], region: '' }
};

const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    addScore: (state, action) => {
      const { type, amount = 1 } = action.payload;
      state.scores[type] += amount;
      console.log('✅ updated scores:', state.scores);
    },
    setKeywordResult: (state, action) => {
      state.keywords = action.payload;
    },
    setRoutineResult: (state, action) => {
      const { days, region } = action.payload;
      state.routine = { days, region };
    },
    resetTest: () => initialState
  }
});

export const {
  addScore,
  setKeywordResult,
  setRoutineResult,
  resetTest
} = testSlice.actions;

export default testSlice.reducer;
