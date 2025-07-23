
import { useState, useEffect } from 'react';

const SUBMISSIONS_KEY = 'petscan_submissions';
const MAX_WEEKLY_SUBMISSIONS = 2;

interface SubmissionData {
  count: number;
  weekStart: string;
}

export const useSubmissionLimit = () => {
  const [canSubmit, setCanSubmit] = useState(true);
  const [remainingSubmissions, setRemainingSubmissions] = useState(MAX_WEEKLY_SUBMISSIONS);

  const getWeekStart = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek;
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString();
  };

  const checkSubmissionLimit = () => {
    const stored = localStorage.getItem(SUBMISSIONS_KEY);
    const currentWeekStart = getWeekStart();

    if (!stored) {
      setCanSubmit(true);
      setRemainingSubmissions(MAX_WEEKLY_SUBMISSIONS);
      return;
    }

    const data: SubmissionData = JSON.parse(stored);

    // If it's a new week, reset the counter
    if (data.weekStart !== currentWeekStart) {
      setCanSubmit(true);
      setRemainingSubmissions(MAX_WEEKLY_SUBMISSIONS);
      return;
    }

    // Check if user has reached the limit
    const remaining = MAX_WEEKLY_SUBMISSIONS - data.count;
    setRemainingSubmissions(remaining);
    setCanSubmit(remaining > 0);
  };

  const recordSubmission = () => {
    const currentWeekStart = getWeekStart();
    const stored = localStorage.getItem(SUBMISSIONS_KEY);

    let data: SubmissionData;

    if (!stored) {
      data = { count: 1, weekStart: currentWeekStart };
    } else {
      const existing: SubmissionData = JSON.parse(stored);
      
      if (existing.weekStart !== currentWeekStart) {
        // New week, reset counter
        data = { count: 1, weekStart: currentWeekStart };
      } else {
        // Same week, increment counter
        data = { count: existing.count + 1, weekStart: currentWeekStart };
      }
    }

    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(data));
    checkSubmissionLimit();
  };

  useEffect(() => {
    checkSubmissionLimit();
  }, []);

  return {
    canSubmit,
    remainingSubmissions,
    recordSubmission,
    checkSubmissionLimit
  };
};
