// Standardized format for exchanging data between different interfaces and the server.

enum FFContentType {
  Text,
  Image,
  Video,
  Question,
  QuestionResponse
}

interface FFUser {
  id: number;
  name: string;
  isPresenter?: boolean;
}

interface FFGenericContent {
  type: FFContentType;
  title: string;
  submitter: FFUser;
  timestamp: number;
  upvotes: number;
  flagged: number;
}

interface FFTextContent extends FFGenericContent {
  text: string;
}

interface FFLinkContent extends FFGenericContent {
  link: string;
  text?: string; // Used here for notes
}

interface FFYoutubeContent extends FFGenericContent {
  youtubeId: string;
  title: string;
  channelTitle: string;
  thumbnail?: string;
  embed?: string;
}

interface FFQuestion extends FFTextContent {
  replies: Array<FFTextContent>;
}
