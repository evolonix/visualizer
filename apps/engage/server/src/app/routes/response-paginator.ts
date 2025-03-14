import { Rule } from '@engage/remote-api';
import { validateRuleResponse } from '../paginators/rules';
/**
 * Override the default router 'render' method.
 * For any JSON database GET list, make sure we publish pagination information if _page or _limit are provided.
 *
 * Note that the JSON server already has returned results as a 'paginated' set (instead of the full set)
 * so we just prepare and attach pagination information
 *
 * eg  `/data?_page=2&_limit=10`
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function paginateResponse(router: any) {
  router.render = (req, res) => {
    const response = validateRuleResponse(req, res, router);

    // passthrough with 'standard' current response
    res.jsonp(response || res.locals.data);
  };
  return router;
}

/**
 * Intercept the queryParams immediately and convert
 * SPA params to JSON-Server specific params
 */
export function validateQueryParams(req, res, next) {
  const { pageSize, page, searchBy, sort, order } = req.query;

  req.query._limit = pageSize || req.query._limit;
  req.query._page = page || req.query._page;
  req.query._sort = sort || req.query._sort; // property to sort on
  req.query._order = order || req.query._order; // sort direction 'desc' | 'asc'
  req.query.q = searchBy || req.query.q; // full text search

  next();
}

/**
 * Intercept incoming requests and replace possible invalid url 'rules/<partial ID>'
 * with valid url 'rules/<full ID>'
 */
export function transformPartialIDs(router) {
  return (req, res, next) => {
    const url = new URL(req.url, 'http://localhost'); // Provide fake base url for parsing
    const dbKey = url.pathname.slice(1); // Remove leading slash

    const QUERY_RULEID = /rules\/([A-Za-z0-9-]*)/;
    const ruleId = dbKey.match(QUERY_RULEID)?.[1];

    if (ruleId) {
      const allRules = router.db.getState()['rules'];
      const rule = findRule(ruleId, allRules);

      if (rule) {
        // Always make sure we are requesting a rule using a FULL rule ID.
        const url = req.url.replace(QUERY_RULEID, `rules/${rule.id}`);
        req.url = url;
      }
    }

    next();
  };
}

/**
 * Using a partial Id, see if
 * @param partialId
 * @param allRules
 * @returns
 */
export function findRule(partialId: string, allRules: Rule[]): Rule | undefined {
  const partialMatch = ({ id }: Rule) => {
    return id.startsWith(partialId);
  };
  return allRules.find(partialMatch);
}
