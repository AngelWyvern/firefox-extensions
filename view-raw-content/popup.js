document.addEventListener('DOMContentLoaded', () =>
{
	const a = document.querySelector('a');
	const urlInput = document.querySelector('input[type=url]');

	urlInput.addEventListener('input', () =>
	{
		a.href = 'viewer.html?url=' + encodeURIComponent(urlInput.value);
	});

	a.addEventListener('click', e =>
	{
		if (e.button == 0)
		{
			e.preventDefault();
			browser.tabs.query({ "active":true, "currentWindow":true })
				.then(tabs => openTab(a.href, tabs[0]))
				.catch(e => openTab(a.href));
		}
	});
}, { "once":true });

function openTab(url, currentTab = null)
{
	if (!currentTab)
		browser.tabs.create({ "url":url });
	else
		browser.tabs.create({ "url":url, "index":currentTab.index + 1, "openerTabId":currentTab.id });
	close();
}

console.info('View Raw Content: Popup script loaded');