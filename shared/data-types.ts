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

interface FFPresentationInstance {
  id: string;
  presentationId: string;
  currentSlide: number;
  currentContentId: string;
}

interface FFUser {
  id: string;
  name: string;
  isPresenter?: boolean;
}

interface FFGenericContent {
  id: string;
  type: FFContentType;
  submitter: FFUser;
  timestamp: number;
  upvotes: number;
  flagged: number;
  presentationId: string;
  text?: string; // Used here for notes
}

interface FFTextContent extends FFGenericContent {
  text: string;
}

interface FFLinkContent extends FFGenericContent {
  link: string;
  filename: string;
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
