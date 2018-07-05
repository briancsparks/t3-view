
import { current }                from './Current';
import { clients }                from './Clients';
import { sessions }               from './Sessions';
import { attributes }             from './Attributes';
import { events }                 from './TimeSeries';
import { logcat }                 from './Logcat';

const rootReducer = {
  current,
  clients,
  sessions,
  attributes,
  events,
  logcat,
};

export default rootReducer

