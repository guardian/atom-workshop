export function loadToolsAuditPixel() {
    const telemetryUrl = getUserTelemetryClientUrl(window.location.hostname);
    return ((path) => {
		if (telemetryUrl) {
			loadPixel(telemetryUrl, path);
		}
    });
}

function getUserTelemetryClientUrl(hostname) {
	switch (hostname) {
		case 'atomworkshop.gutools.co.uk': return 'https://user-telemetry.gutools.co.uk';
		case 'atomworkshop.code.dev-gutools.co.uk': return 'https://user-telemetry.code.dev-gutools.co.uk';
		case 'atomworkshop.local.dev-gutools.co.uk':
		default:
			return 'https://user-telemetry.local.dev-gutools.co.uk';
	}
}

function loadPixel(telemetryUrl, path) {
	const image = new Image();
	image.src = `${telemetryUrl}/guardian-tool-accessed?app=atom-workshop&path=${path}`;
}
