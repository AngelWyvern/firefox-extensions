const regex = new RegExp("^(https?://(?:[^./]+\\.)?youtube\\.com)/(?:shorts/)([\\w-]+)");
const tab = browser.tabs.getCurrent();

function parse(url)
{
	const match = url.match(regex);
	if (match)
		return `${match[1]}/watch?v=${match[2]}`;
	return null;
}

browser.webRequest.onBeforeRequest.addListener(e =>
{
	const url = parse(e.url);
	if (url)
	{
		console.info(`Big Shorts Player: Redirecting to "${url}"...`, e);
		return { "redirectUrl":url };
	}
}, { "urls":[ "*://*.youtube.com/shorts/*" ] }, [ "blocking" ]);

browser.webNavigation.onHistoryStateUpdated.addListener(e =>
{
	const url = parse(e.url);
	if (url)
	{
		console.info(`Big Shorts Player: Forcing navigation...`, e);
		browser.tabs.update(e.tabId, { "url":url, "loadReplace":true });
	}
}, { "url":[ { "pathPrefix":"/shorts/" } ] });

console.info('Big Shorts Player: Active script loaded');