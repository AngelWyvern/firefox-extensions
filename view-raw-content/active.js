browser.menus.create(
{
	"id":"view-raw-content",
	"title":"View Link as Raw",
	"contexts":[ "link" ]
});

browser.menus.onClicked.addListener((info, tab) =>
{
	if (info.menuItemId == 'view-raw-content')
	{
		const url = "viewer.html?url=" + encodeURIComponent(info.linkUrl);
		browser.tabs.query({ "active":true, "currentWindow":true })
				.then(tabs => openTab(url, tabs[0]))
				.catch(e => openTab(url));
	}
});

const media = window.matchMedia('(prefers-color-scheme: dark)');
media.addEventListener('change', e => updateScheme(e.matches));
if (media.matches)
	updateScheme(true);

function openTab(url, currentTab = null)
{
	if (!currentTab)
		browser.tabs.create({ "url":url });
	else
		browser.tabs.create({ "url":url, "index":currentTab.index + 1, "openerTabId":currentTab.id });
}

function updateScheme(dark = false)
{
	const variant = dark ? '-dark' : '';
	browser.action.setIcon({ "path":{ "16":`icon${variant}@16px.svg` } });
	console.info('Color scheme updated', dark ? '(dark)' : '(light)');
}

console.info('View Raw Content: Active script loaded');