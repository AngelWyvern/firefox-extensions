document.addEventListener('DOMContentLoaded', () =>
{
	const params = new URLSearchParams(window.location.search);

	if (!params.has('url'))
	{
		console.error('Missing URL parameter');
		return;
	}

	const url = params.get('url');

	document.title = `Raw: ${url}`;

	fetch(url, { "headers":{ "Access-Control-Allow-Origin":"*" } }).then(res =>
	{
		if (!res.ok)
		{
			error(`Error fetching URL: (${res.status}) ${res.statusText}`);
			return;
		}

		if (res.headers.has('content-disposition'))
		{
			const match = res.headers.get('content-disposition').match(/filename="(.*?)"/);
			if (match)
				document.title = `Raw: ${match[1]}`;
		}

		const contentType = res.headers.get('content-type');
		if (contentType.startsWith('text/') || contentType.startsWith('application/'))
		{
			console.info(`Loading '${contentType} as text...`);
			loadText(res);
		}
		else if (contentType.startsWith('image/'))
		{
			console.info(`Loading '${contentType}' as image data...`);
			loadImage(res);
		}
		else if (contentType.startsWith('audio/'))
		{
			console.info(`Loading '${contentType}' as audio data...`);
			loadAudio(res);
		}
		else if (contentType.startsWith('video/'))
		{
			console.info(`Loading '${contentType}' as video data...`);
			loadVideo(res);
		}
		else
		{
			// Fallback
			console.warn(`Unknown MIME type '${contentType}', falling back to text...`);
			loadText(res);
		}

	}).catch(err =>
	{
		error(`Error fetching URL: ${err}`);
	});

	// not ideal, but the media tag isn't functional for some reason
	const icon = document.querySelector('link[rel=icon]');
	const media = window.matchMedia('(prefers-color-scheme: dark)');
	media.addEventListener('change', e => updateIcon(icon, e.matches));
	if (media.matches)
		updateIcon(icon, true);
}, { "once":true });

async function loadText(res)
{
	res.text()
		.then(text => createText(text))
		.catch(err => error(`Error accessing contents: ${err}`));
}

async function loadImage(res)
{
	blob = await blobify(res);
	if (blob)
	{
		const img = document.createElement('img');
		img.src = blob;
		setupMedia(img);
	}
}

async function loadAudio(res)
{
	blob = await blobify(res);
	if (blob)
	{
		const audio = document.createElement('audio');
		audio.src = blob;
		audio.controls = true;
		audio.autoplay = true;
		setupMedia(audio);
	}
}

async function loadVideo(res)
{
	blob = await blobify(res);
	if (blob)
	{
		const video = document.createElement('video');
		video.src = blob;
		video.controls = true;
		video.autoplay = true;
		setupMedia(video);
	}
}

async function createText(text)
{
	const pre = document.createElement('pre');
	pre.style.margin = '0';
	pre.style.padding = '8px';
	pre.innerText = text;
	document.body.appendChild(pre);
}

async function blobify(res)
{
	try
	{
		return URL.createObjectURL(await res.blob());
	}
	catch (err)
	{
		error(`Error accessing blob data: ${err}`);
	}
}

function error(v)
{
	console.error(v);
	createText(v);
}

function setupMedia(element)
{
	document.body.style.background = '#212121';
	document.body.style.display = 'flex';
	element.style.margin = 'auto';
	element.style.flex = '0 0 auto';
	document.body.appendChild(element);
}

function updateIcon(icon, dark = false)
{
	const variant = dark ? '-dark' : '';
	icon.href = `icon${variant}@16px.svg`;
	console.info('Viewer icon updated', dark ? '(dark)' : '(light)');
}

console.info('View Raw Content: Viewer script loaded');