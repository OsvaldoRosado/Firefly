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
  type: FFContentType;
  submitter: FFUser;
  timestamp: number;
  upvotes: number;
  flagged: number;
  presentationId: string;
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
