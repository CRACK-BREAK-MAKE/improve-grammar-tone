import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';

const SYSTEM_PROMPT = `You are an AI assistant specialized in improving grammar and adjusting the tone of text. Your task is to correct any grammatical errors and adjust the tone as specified. Provide only the corrected text in proper markdown format, without any explanations or additional comments.`;

const HUMAN_PROMPT = `Please correct the following {text_type} and make it sound {tone}. Return only the corrected text in markdown format:

{text}`;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'correctText') {
		handleCorrectText(request, sendResponse);
		return true;
	}
});

async function handleCorrectText(request: any, sendResponse: (response: any) => void) {
	const {text, tone, textType, model} = request;

	if (!model) {
		sendResponse({error: 'No open source ollama model provided'});
		return;
	}

	try {
		const chain = await createCorrectionChain(model);
		const result = await chain.invoke({ text_type: textType, tone: tone, text: text });

		sendResponse({ correctedText: result });
	} catch (error) {
		console.error('Error in handleCorrectText:', error);
		sendResponse({ error: (error as Error).message });
	}
}

async function createCorrectionChain(model: string) {
	const llm = new ChatOllama({ model: model, temperature: 0});

	const chatPrompt = ChatPromptTemplate.fromMessages([
		SystemMessagePromptTemplate.fromTemplate(SYSTEM_PROMPT),
		HumanMessagePromptTemplate.fromTemplate(HUMAN_PROMPT)
	]);

	return RunnableSequence.from([
		chatPrompt,
		llm,
		new StringOutputParser()
	]);
}
