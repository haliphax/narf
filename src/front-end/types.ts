export type estimate = {
  user: participant,
  value: string | null,
};

export type participant = {
  id: string,
  name: string,
  value?: string | null,
};

export type participantsState = {
  people: Record<string, participant>,
};

export type sessionProperty = {
  default(): string,
  key: string,
};

export type sessionState = {
  id: string,
  name: string,
};

export type storyState = {
  id: string,
  title: string,
  revealed: boolean,
};
