/*!
 * EFML v1.0.0
 * Copyright(c) Resornesy 2025
 * Licensed under MIT License
 */

(function() {
	const globalStore = { vars: {}, funcs: {} };
	let observer;

	function parseValue(str) {
		str = str.trim();
		if (str === 'null') return null;
		if (str === 'undefined') return undefined;
		if (str === 'true') return true;
		if (str === 'false') return false;
		if (!isNaN(parseFloat(str)) && isFinite(str)) return parseFloat(str);
		if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
			return str.slice(1, -1);
		}
		return str;
	}

	function escapeHtml(unsafe) {
		return unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	function safeEval(exp, context = {}) {
		try {
			const vars = { ...globalStore.vars, ...context };
			const func = new Function(...Object.keys(vars), `return ${exp}`);
			return func(...Object.values(vars));
		} catch (error) {
			return false;
		}
	}

	function executeStatement(statement, context = {}) {
		try {
			const vars = { ...globalStore.vars, ...context };
			const func = new Function(...Object.keys(vars), statement);
			func(...Object.values(vars));
			Object.assign(globalStore.vars, vars);
		} catch (error) {}
	}

	function debounce(func, wait) {
		let timeout;
		return function(...args) {
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, args), wait);
		};
	}

	const updateContent = debounce(() => {
		document.querySelectorAll('[data-dynamic-text]').forEach(node => {
			if (node.closest('if-jum, elif-jum, else-jum, while-loop, for-loop') && node.closest('[style*="display: none"]')) {
				return;
			}
			let text = node.textContent;
			text = text.replace(/\$\{#(\w+(?:\.\w+)?)\}/g, (_, path) => {
				let value;
				if (path.startsWith('local.')) {
					return '';
				} else {
					value = globalStore.vars[path];
				}
				if (value === null) return 'null';
				if (value === undefined) return 'undefined';
				if (typeof value === 'object') return escapeHtml(JSON.stringify(value));
				return escapeHtml(String(value));
			});
			node.textContent = text;
			//node.setAttribute('data-original-text', text);
		});

		document.querySelectorAll('exec-func').forEach(execNode => {
			const funcName = execNode.getAttribute('name');
			if (!funcName) {
			    execNode.innerHtml = '';
			    return;
			}
			const func = globalStore.funcs[funcName];
			if (!func) {
				execNode.innerHTML = `<span style="color: red;">exec-func: func "${funcName}" not defined</span>`;
				return;
			}

			const paramsStr = execNode.getAttribute('params') || '';
			const params = {};
			if (paramsStr.trim()) {
				paramsStr.split(',').forEach(pair => {
					const [key, value] = pair.split(':').map(s => s.trim());
					if (key && value) params[key] = parseValue(value);
				});
			}

			try {
				const result = func.execute(params);
				const tempDiv = document.createElement('div');
				tempDiv.innerHTML = result;
				execNode.innerHTML = '';
				while (tempDiv.firstChild) {
					execNode.appendChild(tempDiv.firstChild);
				}
			} catch (error) {
				execNode.innerHTML = `<span style="color: red;">exec-func error: ${error.message}</span>`;
			}
		});

		document.querySelectorAll('if-jum').forEach(ifNode => {
			let current = ifNode;
			let conditionMet = false;
			const nodesToProcess = [ifNode];

			while (current.nextElementSibling && ['elif-jum', 'else-jum'].includes(current.nextElementSibling.tagName.toLowerCase())) {
				nodesToProcess.push(current.nextElementSibling);
				current = current.nextElementSibling;
			}

			nodesToProcess.forEach(node => {
				const tagName = node.tagName.toLowerCase();
				let shouldRender = false;

				if (tagName === 'if-jum' || tagName === 'elif-jum') {
					if (!conditionMet) {
						const exp = node.getAttribute('exp') || 'false';
						shouldRender = safeEval(exp);
						if (shouldRender) conditionMet = true;
					}
				} else if (tagName === 'else-jum' && !conditionMet) {
					shouldRender = true;
				}

				node.style.display = shouldRender ? 'block' : 'none';
				if (shouldRender) {
					node.querySelectorAll('[data-dynamic-text]').forEach(child => {
						let text = child.getAttribute('data-original-text') || child.textContent;
						text = text.replace(/\$\{#(\w+)\}/g, (_, varName) => {
							const value = globalStore.vars[varName];
							return value === null ? 'null' :
								   value === undefined ? 'undefined' :
								   typeof value === 'object' ? escapeHtml(JSON.stringify(value)) :
								   escapeHtml(String(value));
						});
						child.textContent = text;
						child.setAttribute('data-original-text', text);
					});
				}
			});
		});

		document.querySelectorAll('while-loop').forEach(whileNode => {
			whileNode.innerHTML = '';
			const exp = whileNode.getAttribute('exp') || 'false';
			const template = whileNode.cloneNode(true);
			template.removeAttribute('exp');
			let iteration = 0;

			while (safeEval(whileNode.getAttribute('exp') || 'false') && iteration < 1000) {
				const clone = template.cloneNode(true);
				clone.style.display = 'block';
				let skip = false;
				let breakLoop = false;

				clone.querySelectorAll('[data-loop-control]').forEach(controlNode => {
					const control = controlNode.getAttribute('data-loop-control');
					if (control === '@-break') {
						breakLoop = true;
						controlNode.remove();
					} else if (control === '@-continue') {
						skip = true;
						controlNode.remove();
					}
				});

				if (breakLoop) break;

				if (!skip) {
					whileNode.parentNode.insertBefore(clone, whileNode.nextSibling);
					clone.querySelectorAll('set-var').forEach(setVarNode => {
						const varName = setVarNode.getAttribute('name');
						let varContent = setVarNode.textContent.trim();
						if (varContent.startsWith('$ {#') && varContent.endsWith('}')) {
							varContent = varContent.slice(3, -1);
							varContent = safeEval(varContent);
						} else {
							varContent = parseValue(varContent);
						}
						if (varName) {
							globalStore.vars[varName] = varContent;
						}
						setVarNode.remove();
					});
					clone.querySelectorAll('[data-dynamic-text]').forEach(child => {
						let text = child.getAttribute('data-original-text') || child.textContent;
						text = text.replace(/\$\{#(\w+)\}/g, (_, varName) => {
							const value = globalStore.vars[varName];
							return value === null ? 'null' :
								   value === undefined ? 'undefined' :
								   typeof value === 'object' ? escapeHtml(JSON.stringify(value)) :
								   escapeHtml(String(value));
						});
						child.textContent = text;
						child.setAttribute('data-original-text', text);
					});
				}
				iteration++;
			}
			whileNode.style.display = 'none';
		});

		document.querySelectorAll('for-loop').forEach(forNode => {
			forNode.innerHTML = '';
			const init = forNode.getAttribute('init') || '';
			const exp = forNode.getAttribute('exp') || 'false';
			const update = forNode.getAttribute('update') || '';
			const template = forNode.cloneNode(true);
			template.removeAttribute('init');
			template.removeAttribute('exp');
			template.removeAttribute('update');
			if (init) executeStatement(init);
			let iteration = 0;

			while (safeEval(exp) && iteration < 1000) {
				const clone = template.cloneNode(true);
				clone.style.display = 'block';
				let skip = false;
				let breakLoop = false;

				clone.querySelectorAll('[data-loop-control]').forEach(controlNode => {
					const control = controlNode.getAttribute('data-loop-control');
					if (control === '@-break') {
						breakLoop = true;
						controlNode.remove();
					} else if (control === '@-continue') {
						skip = true;
						controlNode.remove();
					}
				});

				if (breakLoop) break;

				if (!skip) {
					forNode.parentNode.insertBefore(clone, forNode.nextSibling);
					clone.querySelectorAll('set-var').forEach(setVarNode => {
						const varName = setVarNode.getAttribute('name');
						let varContent = setVarNode.textContent.trim();
						if (varContent.startsWith('$ {#') && varContent.endsWith('}')) {
							varContent = varContent.slice(3, -1);
							varContent = safeEval(varContent);
						} else {
							varContent = parseValue(varContent);
						}
						if (varName) {
							globalStore.vars[varName] = varContent;
						}
						setVarNode.remove();
					});
					clone.querySelectorAll('[data-dynamic-text]').forEach(child => {
						let text = child.getAttribute('data-original-text') || child.textContent;
						text = text.replace(/\$\{#(\w+)\}/g, (_, varName) => {
							const value = globalStore.vars[varName];
							return value === null ? 'null' :
								   value === undefined ? 'undefined' :
								   typeof value === 'object' ? escapeHtml(JSON.stringify(value)) :
								   escapeHtml(String(value));
						});
						child.textContent = text;
						child.setAttribute('data-original-text', text);
					});
				}
				if (update) executeStatement(update);
				iteration++;
			}
			forNode.style.display = 'none';
		});
	}, 50);
	
	class SetVar extends HTMLElement {
		connectedCallback() {
			const varName = this.getAttribute('name');
			let varContent = this.textContent.trim();
			if (varContent.startsWith('$ {#') && varContent.endsWith('}')) {
				varContent = varContent.slice(3, -1);
				varContent = safeEval(varContent);
			} else {
				varContent = parseValue(varContent);
			}
			if (varName) {
				globalStore.vars[varName] = varContent;
				updateContent();
			}
			this.style.display = 'none';
		}
	}
	customElements.define('set-var', SetVar);

	class GlobalVar extends HTMLElement {
		connectedCallback() {
			const varName = this.getAttribute('name');
			if (varName && this.textContent.trim()) {
				globalStore.vars[varName] = parseValue(this.textContent.trim());
				updateContent();
			}
			this.style.display = 'none';
		}
	}
	customElements.define('global-var', GlobalVar);

	class DefFunc extends HTMLElement {
		connectedCallback() {
			const funcName = this.getAttribute('name');
			const funcHtml = this.innerHTML.trim();

			if (funcName) {
				globalStore.funcs[funcName] = {
					html: funcHtml,
					execute: function(params = {}) {
						let result = this.html;
						for (const [key, value] of Object.entries(params)) {
							result = result.replace(
								new RegExp(`\\$\\{#local\\.${key}\\}`, 'g'),
								typeof value === 'object' ? escapeHtml(JSON.stringify(value)) : escapeHtml(String(value))
							);
						}
						result = result.replace(/\$\{#(\w+)\}/g, (_, varName) => {
							const value = globalStore.vars[varName];
							return typeof value === 'object' ? escapeHtml(JSON.stringify(value)) : escapeHtml(String(value));
						});
						return result;
					}
				};
				updateContent();
			}
			this.style.display = 'none';
		}
	}
	customElements.define('def-func', DefFunc);

	class ExecFunc extends HTMLElement {
		connectedCallback() {
			updateContent();
		}
	}
	customElements.define('exec-func', ExecFunc);

	class IfJum extends HTMLElement {
		connectedCallback() {
			this.style.display = 'none';
			updateContent();
		}
	}
	customElements.define('if-jum', IfJum);

	class ElifJum extends HTMLElement {
		connectedCallback() {
			this.style.display = 'none';
			updateContent();
		}
	}
	customElements.define('elif-jum', ElifJum);
	
	class ElseJum extends HTMLElement {
		connectedCallback() {
			this.style.display = 'none';
			updateContent();
		}
	}
	customElements.define('else-jum', ElseJum);

	class WhileLoop extends HTMLElement {
		connectedCallback() {
			this.style.display = 'none';
			updateContent();
		}
	}
	customElements.define('while-loop', WhileLoop);

	class ForLoop extends HTMLElement {
		connectedCallback() {
			this.style.display = 'none';
			updateContent();
		}
	}
	customElements.define('for-loop', ForLoop);

	window.setGlobalVar = function(varName, value) {
		if (varName && typeof varName === 'string') {
			globalStore.vars[varName] = value;
			updateContent();
		}
	};

	function initObserver() {
		observer = new MutationObserver(() => {
			updateContent();
		});
		observer.observe(document.body, {
			childList: true,
			subtree: true,
			characterData: true,
			attributes: true,
			attributeFilter: ['params', 'exp', 'style', 'init', 'update']
		});
	}

	const style = document.createElement('style');
	style.textContent = `
		set-var, def-func, global-var, if-jum, elif-jum, else-jum, while-loop, for-loop { display: none !important; }
		exec-func { display: block; }
		if-jum[style*="display: block"], elif-jum[style*="display: block"], else-jum[style*="display: block"],
		while-loop[style*="display: block"], for-loop[style*="display: block"] { display: block !important; }
	`;
	document.head.appendChild(style);

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => {
			initObserver();
			updateContent();
		});
	} else {
		initObserver();
		updateContent();
	}
})();