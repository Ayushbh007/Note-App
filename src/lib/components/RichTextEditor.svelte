<script lang="ts">
	interface Props {
		value: string;
		onInput: (value: string) => void;
		placeholder?: string;
		disabled?: boolean;
		maxLength?: number;
	}

	let { value, onInput, placeholder = '', disabled = false, maxLength = 2000 }: Props = $props();

	let editorRef: HTMLDivElement;

	function execCommand(command: string, value: string | null = null) {
		document.execCommand(command, false, value);
		editorRef?.focus();
		updateValue();
	}

	function updateValue() {
		if (editorRef) {
			const html = editorRef.innerHTML;
			// Convert to plain text for storage, preserving line breaks
			const text = html
				.replace(/<br\s*\/?>/gi, '\n')
				.replace(/<\/p>/gi, '\n')
				.replace(/<\/div>/gi, '\n')
				.replace(/<[^>]+>/g, '')
				.replace(/&nbsp;/g, ' ')
				.replace(/&amp;/g, '&')
				.replace(/&lt;/g, '<')
				.replace(/&gt;/g, '>')
				.trim();
			
			if (text.length <= maxLength) {
				onInput(text);
			}
		}
	}

	function handlePaste(e: ClipboardEvent) {
		e.preventDefault();
		const text = e.clipboardData?.getData('text/plain') || '';
		document.execCommand('insertText', false, text);
		updateValue();
	}

	// Sync external value changes to editor
	$effect(() => {
		if (editorRef && editorRef.innerText !== value) {
			editorRef.innerText = value;
		}
	});
</script>

<div class="rich-text-editor rounded-xl border border-gray-300 dark:border-gray-600 overflow-hidden {disabled ? 'opacity-50' : ''}">
	<!-- Toolbar -->
	<div class="flex flex-wrap gap-1 p-2 bg-slate-100 dark:bg-slate-700/50 border-b border-gray-300 dark:border-gray-600">
		<button
			type="button"
			onclick={() => execCommand('bold')}
			disabled={disabled}
			class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition"
			title="Bold (Ctrl+B)"
		>
			<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
				<path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>
			</svg>
		</button>
		<button
			type="button"
			onclick={() => execCommand('italic')}
			disabled={disabled}
			class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition"
			title="Italic (Ctrl+I)"
		>
			<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
				<path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/>
			</svg>
		</button>
		<button
			type="button"
			onclick={() => execCommand('underline')}
			disabled={disabled}
			class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition"
			title="Underline (Ctrl+U)"
		>
			<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
				<path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/>
			</svg>
		</button>
		<div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center"></div>
		<button
			type="button"
			onclick={() => execCommand('insertUnorderedList')}
			disabled={disabled}
			class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition"
			title="Bullet List"
		>
			<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
				<path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/>
			</svg>
		</button>
		<button
			type="button"
			onclick={() => execCommand('insertOrderedList')}
			disabled={disabled}
			class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition"
			title="Numbered List"
		>
			<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
				<path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/>
			</svg>
		</button>
		<div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center"></div>
		<button
			type="button"
			onclick={() => execCommand('removeFormat')}
			disabled={disabled}
			class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition"
			title="Clear Formatting"
		>
			<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
				<path d="M3.27 5L2 6.27l6.97 6.97L6.5 19h3l1.57-3.66L16.73 21 18 19.73 3.27 5zM6 5v.18L8.82 8h2.4l-.72 1.68 2.1 2.1L14.21 8H20V5H6z"/>
			</svg>
		</button>
	</div>

	<!-- Editor -->
	<div
		bind:this={editorRef}
		contenteditable={!disabled}
		oninput={updateValue}
		onpaste={handlePaste}
		class="min-h-[150px] max-h-[300px] overflow-y-auto p-3 bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:outline-none"
		data-placeholder={placeholder}
		role="textbox"
		aria-multiline="true"
	></div>
</div>

<style>
	[contenteditable]:empty:before {
		content: attr(data-placeholder);
		color: #9ca3af;
		pointer-events: none;
	}

	[contenteditable]:focus:empty:before {
		content: attr(data-placeholder);
	}
</style>

