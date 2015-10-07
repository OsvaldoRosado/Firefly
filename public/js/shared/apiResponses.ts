module ApiResponses{

	export interface PresentationFromId{
		success: boolean;
		data?: {
			name: string,
			slides: string[],
			length: number
		}
	}
}