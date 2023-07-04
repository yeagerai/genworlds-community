import _dayjs from 'dayjs';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import duration from 'dayjs/plugin/duration';
import advancedFormat from 'dayjs/plugin/advancedFormat';

_dayjs.extend(utc);
_dayjs.extend(timezone);
_dayjs.extend(relativeTime);
_dayjs.extend(LocalizedFormat);
_dayjs.extend(customParseFormat);
_dayjs.extend(duration);
_dayjs.extend(advancedFormat);

export type NewDayJs =
  | typeof utc
  | typeof timezone
  | typeof relativeTime
  | typeof customParseFormat
  | typeof LocalizedFormat
  | typeof advancedFormat
  | typeof duration;

export default _dayjs;
