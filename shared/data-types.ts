// Standardized format for exchanging data between different interfaces and the server.

enum FFContentType {
  FFTextContent,
  FFImageContent,
  FFVideoContent,
  FFQuestion,
  FFQuestionResponse
}

interface FFUser {
  id: number;
  name: string;
  isPresenter?: boolean;
}

interface FFGenericContent {
  type: FFContentType;
  submitter: FFUser;
  timestamp: number;
  upvotes: number;
  flagged: number;
}

interface FFTextContent extends FFGenericContent {
  htmlText: string;
}

interface FFLinkContent extends FFGenericContent {
  link: string;
}

interface FFQuestion extends FFTextContent {
  replies: Array<FFTextContent>;
}
