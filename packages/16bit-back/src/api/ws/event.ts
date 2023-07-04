export interface YeagerEvent {
  event_type: string;
  created_at: string;
  sender_id: string;
  // ---
  description?: string;
  target_id?: string;
}
