
import { current }                from './Current';
import { clients }                from './Clients';
import { sessions }               from './Sessions';
import { attributes }             from './Attributes';
import { events }                 from './TimeSeries';

const rootReducer = {
  current,
  clients,
  sessions,
  attributes,
  events,
};

export default rootReducer

