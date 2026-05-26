import { API_BASE_URL } from '@/services/api-base';

export interface FeedbackBreakdownItem {
  label: string;
  count: number;
}

export interface FeedbackAnalytics {
  totalResponses: number;
  averages: {
    overallSatisfaction: number | null;
    usability: number | null;
    navigation: number | null;
    speed: number | null;
    design: number | null;
    motivation: number | null;
  };
  breakdowns: {
    workoutLevel: FeedbackBreakdownItem[];
    helpsGoals: FeedbackBreakdownItem[];
  };
}

export interface FeedbackResponseRow {
  id: number;
  request_id: string;
  created_at: string;
  submitted_at: string | null;
  form_version: string | null;
  overall_satisfaction: number | null;
  usability_rating: number | null;
  navigation_rating: number | null;
  speed_rating: number | null;
  design_rating: number | null;
  most_used_parts: string | null;
  workout_level: string | null;
  workout_frustrations: string | null;
  workout_frustration_other: string | null;
  helps_goals: string | null;
  motivation_rating: number | null;
  missing_features: string | null;
  first_improve: string | null;
  best_thing: string | null;
  raw_form: string | null;
  received_at: string;
}

export async function fetchFeedbackAnalytics(): Promise<FeedbackAnalytics> {
  const response = await fetch(`${API_BASE_URL}/api/feedback-analytics`);

  if (!response.ok) {
    throw new Error(`Feedback analytics API failed: ${response.status}`);
  }

  return (await response.json()) as FeedbackAnalytics;
}

export async function fetchFeedbackResponses(): Promise<FeedbackResponseRow[]> {
  const response = await fetch(`${API_BASE_URL}/api/feedback-responses`);

  if (!response.ok) {
    throw new Error(`Feedback responses API failed: ${response.status}`);
  }

  return (await response.json()) as FeedbackResponseRow[];
}
