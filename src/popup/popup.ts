import '../styles/tailwind.css';
import { marked, Marked } from 'marked';

document.addEventListener('DOMContentLoaded', async () => {
	const textInput = document.getElementById('text-input') as HTMLTextAreaElement;
	const inputModelName = document.getElementById('input-model-name') as HTMLInputElement;
	const toneSelect = document.getElementById('tone') as HTMLSelectElement;
	const textTypeSelect = document.getElementById('text-type') as HTMLSelectElement;
	const submitButton = document.getElementById('submit') as HTMLButtonElement;
	const loadingIndicator = document.getElementById('loading') as HTMLDivElement;
	const correctedTextDisplay = document.getElementById('corrected-text') as HTMLDivElement;
	const copyButton = document.getElementById('copy') as HTMLButtonElement;
	const errorDisplay = document.getElementById('error') as HTMLDivElement;

	submitButton.addEventListener('click', async () => {
		const text = textInput.value;
		const model = inputModelName.value;
		const tone = toneSelect.value;
		const textType = textTypeSelect.value;

		if (!text) {
			showError('Please enter some text to correct.');
			return;
		}
        if (!model) {
            showError('Please enter open source ollama model already pulled in your machine.');
    		return;
    	}

		try {
			loadingIndicator.classList.remove('hidden');
			errorDisplay.classList.add('hidden');
			correctedTextDisplay.innerHTML = '';
			copyButton.classList.add('hidden');

			const correctedMarkdown = await getCorrectedText(text, tone, textType, model);

			// Create a new Marked instance with synchronous parsing
			const parser = new Marked({
				async: false
			});

			correctedTextDisplay.innerHTML = parser.parse(correctedMarkdown) as string;
			correctedTextDisplay.setAttribute('data-markdown', correctedMarkdown);
			copyButton.classList.remove('hidden');
		} catch (error) {
			showError(`Error: ${(error as Error).message || 'Unknown error occurred'}`);
			console.error('Correction error:', error);
		} finally {
			loadingIndicator.classList.add('hidden');
		}
	});

	copyButton.addEventListener('click', () => {
		const correctedText = correctedTextDisplay.getAttribute('data-markdown') || '';
		if (correctedText) {
			navigator.clipboard.writeText(correctedText)
			.then(() => showMessage('Copied to clipboard!'))
			.catch(err => showError('Failed to copy: ' + err));
		}
	});
});

function showError(message: string) {
	const errorDisplay = document.getElementById('error') as HTMLDivElement;
	errorDisplay.textContent = message;
	errorDisplay.classList.remove('hidden');
}

function showMessage(message: string) {
	const messageDisplay = document.getElementById('message') as HTMLDivElement;
	messageDisplay.textContent = message;
	messageDisplay.classList.remove('hidden');
	setTimeout(() => {
		messageDisplay.classList.add('hidden');
	}, 3000);
}

async function getCorrectedText(text: string, tone: string, textType: string, model: string): Promise<string> {
	return new Promise((resolve, reject) => {
		chrome.runtime.sendMessage(
				{ action: 'correctText', text, tone, textType, model },
				(response) => {
					if (chrome.runtime.lastError) {
						reject(chrome.runtime.lastError);
					} else if (response.error) {
						reject(new Error(response.error));
					} else {
						resolve(response.correctedText);
					}
				}
		);
	});
}
