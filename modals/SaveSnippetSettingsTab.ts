import MyPlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";

interface SaveSnippetPluginSettings {
  autoPaste: boolean;
  focusOn: 'button' | 'textarea';
  defaultSnippetFile: string;
}

const DEFAULT_SETTINGS: SaveSnippetPluginSettings = {
  autoPaste: true,
  focusOn: 'button',  // default to focusing on the save button
  defaultSnippetFile: 'snippets.md',  // default snippet file
};

export class SaveSnippetSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
			super(app, plugin);
			this.plugin = plugin;
	}

	display() {
			const { containerEl } = this;
			containerEl.empty();

			containerEl.createEl('h2', { text: 'Save Snippet Plugin Settings' });

			// Auto Paste Setting
			new Setting(containerEl)
					.setName('Automatically Paste Clipboard Content')
					.setDesc('When the modal opens, automatically paste clipboard content into the textarea.')
					.addToggle(toggle => 
							toggle
									.setValue(this.plugin.settings.autoPaste)
									.onChange(async (value) => {
											this.plugin.settings.autoPaste = value;
											await this.plugin.saveSettings();
									})
					);

			// Focus On Setting
			new Setting(containerEl)
					.setName('Focus on')
					.setDesc('Choose where to focus when the modal opens.')
					.addDropdown(dropdown =>
							dropdown
									.addOption('button', 'Save Button')
									.addOption('textarea', 'Textarea')
									.setValue(this.plugin.settings.focusOn)
									.onChange(async (value) => {
											this.plugin.settings.focusOn = value as 'button' | 'textarea';
											await this.plugin.saveSettings();
									})
					);

			// Default Snippet File Setting
			new Setting(containerEl)
					.setName('Default Snippet File')
					.setDesc('The default file to save snippets to.')
					.addText(text =>
							text
									.setValue(this.plugin.settings.defaultSnippetFile)
									.onChange(async (value) => {
											this.plugin.settings.defaultSnippetFile = value;
											await this.plugin.saveSettings();
									})
					);
	}
}