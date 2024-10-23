export interface TimeRange {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

export interface DaySchedule {
  date: Date;
  timeRange: TimeRange | null;
}

export interface Participant {
  nickname: string;
  availability: DaySchedule[];
  isCurrentUser: boolean;
}

export interface AvailabilityUpdate {
  nickname: string;
  availability: DaySchedule[];
}

export interface MeetingProposal {
  id: string;
  proposedBy: string;
  date: Date;
  timeRange: TimeRange;
  votes: {
    [participantId: string]: boolean;
  };
}

export interface OverlapSlot {
  date: Date;
  timeRange: TimeRange;
  participants: string[];
}