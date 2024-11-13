import { App, Modal, Notice, TFile } from "obsidian";

export default class SaveSnippetModal extends Modal {
    private content = '';

    constructor(app: App) {
        super(app);
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h2', { text: 'Save Snippet' });

        // Create a text area for user input
        const textarea = contentEl.createEl('textarea');
        textarea.placeholder = 'Paste your snippet here...';
        textarea.style.width = '100%';
        textarea.style.height = '200px';

        // Automatically paste the content from the clipboard
        navigator.clipboard.readText().then(text => {
            textarea.value = text;
            this.content = text;  // Store content in variable
        });

        // Save Button
        const saveButton = contentEl.createEl('button', { text: 'Save Snippet' });
        saveButton.addEventListener('click', async () => {
            if (this.content.trim()) {
                await this.saveSnippet();
                this.close();
            } else {
                new Notice('Snippet content cannot be empty.');
            }
        });

        // Focus the Save Snippet button after the modal opens
        saveButton.focus();
    }

    // Function to append snippet to file
    async saveSnippet() {
        const snippetFolder = 'Snippets';  // The folder where the snippets are saved
        const snippetFileName = 'snippets.md'; // The file to append to

        // Get the snippets folder
        let snippetFolderPath = this.app.vault.getAbstractFileByPath(snippetFolder);

        // If folder doesn't exist, create it
        if (!snippetFolderPath) {
            await this.app.vault.createFolder(snippetFolder);
            snippetFolderPath = this.app.vault.getAbstractFileByPath(snippetFolder)!;
        }

        // Get or create the snippet file
        const snippetFile = this.app.vault.getAbstractFileByPath(`${snippetFolder}/${snippetFileName}`);
        let fileToAppend: TFile;

        if (snippetFile && snippetFile instanceof TFile) {
            fileToAppend = snippetFile;
        } else {
            // Create the file if it doesn't exist
            fileToAppend = await this.app.vault.create(`${snippetFolder}/${snippetFileName}`, '');
        }

        // Append content to the file
        await this.app.vault.append(fileToAppend, `\n---\n\`\`\` ${this.content}  \n\`\`\``);

        // Notify user and close modal
        new Notice('Snippet saved!');
    }
}
