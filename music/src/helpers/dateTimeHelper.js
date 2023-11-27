export const formatDurationTime = (secondsTime) => {
	let minutes = Math.floor(secondsTime / 60) || 0;
	let seconds = Math.round(secondsTime - minutes * 60) || 0;

	if (minutes < 10) minutes = `0${minutes}`;
	if (seconds < 10) seconds = `0${seconds}`;

	return `${minutes}:${seconds}`;
}

export const formatTimeAgo = (date) => {

	const formatTitle = ( interval, title ) => {
		let formattedTitle = title;

		if(interval >= 2) {
			formattedTitle = title + 's';
		}
		return ` ${formattedTitle} ago`;
	}

	let interval

  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + formatTitle(interval, 'year');
  }

  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + formatTitle(interval, 'month');
  }

  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + formatTitle(interval, 'day');
  }

  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + formatTitle(interval, 'hour');
  }

  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + formatTitle(interval, 'minute');
  }

  return Math.floor(seconds) + formatTitle(seconds, 'second');
}