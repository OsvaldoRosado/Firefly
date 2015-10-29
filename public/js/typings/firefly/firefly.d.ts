/// <reference path="../../shared/api.ts" />
interface PresentationFromId{
	success: boolean;
	data?: FFPresentation;
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