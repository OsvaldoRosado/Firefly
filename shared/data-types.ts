// Standardized format for exchanging data between different interfaces and the server.

enum FFContentType {
  Text,
  Image,
  Video,
  Question,
  QuestionResponse
}

interface FFPresentation {
  id: string;
  name: string;
  submitter: FFUser;
  timestamp: number;
  slideCount: number;
  slideUrls: string[];
}

interface FFUser {
  id: number;
  name: string;
  isPresenter?: boolean;
}

interface FFGenericContent {
  id: number;
  type: FFContentType;
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
  filename: string;
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
