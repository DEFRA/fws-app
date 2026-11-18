import auth from '../routes/auth.js'
import summary from '../routes/summary.js'
import area from '../routes/area.js'
import targetArea from '../routes/target-area.js'
import targetAreaSearch from '../routes/target-area-search.js'
import updateWarning from '../routes/update-warning.js'
import publicRoutes from '../routes/public.js'
import severityView from '../routes/severity-view.js'
import status from '../routes/status.js'

const routes = [].concat(
  auth,
  summary,
  area,
  targetArea,
  targetAreaSearch,
  updateWarning,
  publicRoutes,
  severityView,
  status
)

export default {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
