const vscode = require('vscode')

/**
 * 当插件被激活时调用
 * @param {vscode.ExtensionContext} context
 */
function activate (context) {
	console.log('插件 "quote-wrapper" 已激活')

	// 注册命令
	let disposable = vscode.commands.registerCommand('quote-wrapper.addQuotes', function () {
		// 获取活动编辑器
		const editor = vscode.window.activeTextEditor
		if (!editor) {
			vscode.window.showInformationMessage('没有打开的编辑器')
			return
		}

		// 获取选中的文本
		const selections = editor.selections

		// 对每个选区进行处理
		editor.edit(editBuilder => {
			selections.forEach(selection => {
				if (!selection.isEmpty) {
					const text = editor.document.getText(selection)
					const lines = text.split(/\r?\n/)

					// 为每行添加单引号
					const wrappedLines = lines.map(line => {
						// 跳过空行
						if (line.trim() === '') {
							return line
						}
						return `'${line.trim()}',`
					})

					// 替换选中的文本
					const newText = wrappedLines.join('\n')
					editBuilder.replace(selection, newText)
				}
			})
		}).then(() => {
			vscode.window.showInformationMessage('已为选中文本的每行添加单引号')
		})
	})

	context.subscriptions.push(disposable)
}

/**
 * 当插件被停用时调用
 */
function deactivate () { }

module.exports = {
	activate,
	deactivate
}