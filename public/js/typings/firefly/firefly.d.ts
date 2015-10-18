interface PresentationFromId{
	success: boolean;
	data?: {
		name: string,
		slides: string[],
		length: number
	}
}

interface UserContent{
	url: string;
	caption: string;
	user: string; // might have user objects later
	score: number;
}

interface UserQuestion{
	text: string;
	user: string;
	score: number;
	replies?: UserQuestion[];
}