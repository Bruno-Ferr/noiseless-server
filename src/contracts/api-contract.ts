export type ContextTag = 'work' | 'personal' | 'study' | 'project';

export type ThoughtStatus = 'unorganized' | 'note' | 'library' | 'archived';

export interface WorkScheduleContract {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface InterestContract {
  id: string;
  title: string;
  category: string;
  isMaintenance: boolean;
  colorCode?: string | null;
  savedObjective?: string | null;
  createdAt: string;
}

export interface ActiveFocusContract {
  id: string;
  interestId: string;
  weeklyObjective: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'canceled';
}

export interface ThoughtContract {
  id: string;
  content: string;
  status: ThoughtStatus;
  context?: ContextTag;
  interestId?: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TodoContract {
  id: string;
  taskText: string;
  isCompleted: boolean;
  context?: ContextTag;
  tags: string[];
  interestId?: string | null;
  dueDate?: string | null;
  noteId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileContract {
  workSchedules: WorkScheduleContract[];
  interests: InterestContract[];
  activeFoci: ActiveFocusContract[];
}

export interface OrganizeThoughtDto {
  destination: 'todo' | 'note' | 'delete';
  context?: ContextTag;
  interestId?: string;
  tags?: string[];
}

export interface DeleteResponseContract {
  deleted: boolean;
}

export interface CleanTodosResponseContract {
  deletedCount: number;
}
