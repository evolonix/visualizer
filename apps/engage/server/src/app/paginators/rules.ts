/* eslint-disable no-case-declarations */
import { EmailTemplate, LoadRulesApiResponse, Outcome, PaginatedRestResponse, Rule, SaveRuleApiResponse } from '@engage/remote-api';
import { Authenticator, User, UserService } from '../auth';

type PageResults<T> = {
  items: T[];
  pagination: {
    first: number;
    last: number;
    current: number;
    next: number;
    prev: number;
  };
};

type PaginationOptions = {
  currentPage: number | undefined;
  pageSize: number | undefined;
  totalResults: number;
};

type RuleAction = 'loadRules' | 'saveRule' | 'createRule' | 'loadRuleById' | 'deleteRule';

const RULES = 'rules';
const EMAIL_TEMPLATES = 'email-templates';
const usersService = new UserService();
const authenticator = new Authenticator(usersService);

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
export function validateRuleResponse(req, res, router: any): unknown | null {
  const response = res.locals.data; // passthrough with 'standard' current response
  const [method, dbKey, query] = parseRequest(req);

  if (dbKey === RULES || dbKey.indexOf(`${RULES}/`) === 0) {
    const allRules = router.db.getState()[RULES];
    const [authorized, user] = authenticator.isAuthorized(req);
    const { userName } = (authorized ? user : { userName: '' }) as User;
    const action = request2Action(method, query);
    return paginateRulesResponses(router, action, query, response, allRules, userName);
  }

  return null;
}

/**
 * Convert REST Http request verb to RuleAction
 * @param http
 * @param query
 * @returns
 */
function request2Action(http: string, query: Record<string, string>): RuleAction {
  switch (http) {
    case 'PUT':
      return 'createRule';
    case 'POST':
      return 'saveRule';
    case 'DELETE':
      return 'deleteRule';
    case 'GET':
      return query.ruleId ? 'loadRuleById' : 'loadRules';
  }
}

/**
 * Based on the Rule action, return raw data response or paginated data response
 *
 * - loadRules() returns LoadRulesApiResponse
 * - saveRule() returns SaveRuleApiResponse
 */
function paginateRulesResponses(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  router: any,
  action: RuleAction,
  queryParams: Record<string, string>,
  found: Rule | Rule[],
  allRules: Rule[],
  userName: string
) {
  const options = parsePaginationOptions(queryParams, allRules);
  const forceEmpty = userName === 'nodata@degreed.com';
  const rule: Rule = found as Rule;

  switch (action) {
    case 'createRule':
      if (forceEmpty) options.totalResults = 1;
      return addStatus(onRuleSave(router, rule, forceEmpty ? [rule] : allRules, options));

    case 'saveRule':
      if (forceEmpty) options.totalResults = 1;
      return addStatus(onRuleSave(router, rule, forceEmpty ? [rule] : allRules, options));

    case 'loadRuleById':
      if (queryParams.ruleId) {
        const page = findPage(rule, allRules, options.pageSize);
        options.currentPage = page;
      }
      return addStatus(onRuleLoaded(rule, forceEmpty ? [rule] : allRules, options));

    case 'loadRules':
      const emptyResponse = buildEmptyResponse(allRules, options);
      const fullResponse = addStatus(onRulesLoaded(found as Rule[], allRules, options));

      return forceEmpty ? emptyResponse : fullResponse;
  }

  // passthrough with 'standard' current response
  return found;
}

/**
 * The request may contain optional pagination critieria; which will trigger responses to include
 * paginatedResponse information.
 *
 * @param queryParams
 * @param allRules
 * @returns
 */
function parsePaginationOptions(query: Record<string, string>, allRules: Rule[]): PaginationOptions {
  const totalResults = allRules.length;

  const pageSize = parseInt(query?.pageSize || '12'); // Default to page size 10 (the default for _limit in JSON Server)
  const currentPage = parseInt(query?.page || '1'); // Default to page 1

  return { currentPage, pageSize, totalResults };
}

/**
 * Save the email templates from the rule's outcomes to the database
 * and then clear that information from the rule instance.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractOutcomeTemplates(router: any, rule: Rule) {
  const extractTemplates = (outcomes: Outcome[]) => {
    const templates = router.db.get(EMAIL_TEMPLATES);

    outcomes?.forEach((outcome) => {
      const { emailTemplate: template } = outcome;
      if (!template) {
        console.error();
        return;
      }

      // Add or update the template in the database
      const resource: EmailTemplate = template.id
        ? templates.updateById(template.id, { ...template }).value()
        : templates.insert({ ...template }).value();

      // Only include the template id in the rule's outcome
      outcome.emailTemplate = { id: resource.id };
    });
  };

  // Save each outcome template and update [both the rule and template] database
  extractTemplates(rule.outcomes);
  router.db.write();
}

/**
 * Save updated Rule
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onRuleSave(router: any, rule: Rule, allRules: Rule[], options: PaginationOptions): Partial<SaveRuleApiResponse> {
  extractOutcomeTemplates(router, rule);

  return onRuleLoaded(rule, allRules, options);
}

/**
 * onRuleLoaded
 * Paginate rule information before responding to client
 */
function onRuleLoaded(rule: Rule, allRules: Rule[], options: PaginationOptions): Partial<SaveRuleApiResponse> {
  const pageNum = findPage(rule, allRules, options.pageSize);
  if (pageNum < 0) throw new Error(`Rule not found (id = ${rule.id})`);

  const {
    items,
    pagination: { current: currentPage },
  } = buildPage(allRules, pageNum, options.pageSize);

  // Return a page set that contains the newly added rule
  // Note: page 'membership' may change based on rule changes or addition.
  const { pagination } = onRulesLoaded(items, allRules, { ...options, currentPage });

  return { pagination, payload: rule };
}

/**
 * When client requests 'loadRules()', 'onRulesLoaded()' is called AFTER the JSON-Server loads the full or partial rule set,
 * If the pagination settings are specified, return paginated information OR return the full Rule[] list
 *
 * @returns RemoteRuleResponse data response
 */
function onRulesLoaded(list: Rule[], allRules: Rule[], options: PaginationOptions): Partial<LoadRulesApiResponse> {
  let response: Partial<LoadRulesApiResponse>;
  const { pageSize, currentPage, totalResults } = options;
  const numPages = Math.ceil(totalResults / pageSize) || 0;

  if (currentPage <= numPages) {
    const pagination = { page: currentPage, pageSize, numPages, totalResults };
    response = { pagination, payload: list }; // include pagination in response
  } else {
    // The page requested is NOT available for the specified pageSize
    // so let's rebuild a valid page set.

    const { items, pagination: p } = buildPage(allRules, numPages, options.pageSize);
    const pagination = { page: p.current, pageSize, numPages, totalResults: allRules.length };

    response = { pagination, payload: items };
  }

  return response;
}

// ******************************************************************************
// Pagination() utils
// ******************************************************************************

/**
 * Based on pageSize, calculate the page 'set' that contains the specified rule
 * Return a 1-based value that indicate the associated page.
 */
function findPage(rule: Rule, allRules: Rule[], pageSize: number): number {
  const index = allRules.findIndex((it) => it.id === rule.id);
  return index > -1 ? Math.ceil((index + 1) / (pageSize || 12)) : index;
}

/**
 * From the full 'datasource' build a page set based on the requested page and pageSize
 * @returns PageResults<Rule>
 */
function buildPage<T>(datasource: T[], page: number, perPage: number): PageResults<T> {
  const start = (page - 1) * perPage;
  const end = page * perPage;
  const last = Math.ceil(datasource.length / perPage);
  const items = datasource.slice(start, end);
  const isFull = items.length === datasource.length;

  return {
    items,
    pagination: {
      current: page,
      first: 1,
      last,
      prev: isFull ? 0 : page > 1 ? page - 1 : 0,
      next: isFull ? 1 : end < datasource.length ? page + 1 : last,
    },
  };
}

function buildEmptyResponse(allRules: Rule[], options: PaginationOptions) {
  const emptyOptions: PaginationOptions = { currentPage: 0, totalResults: 0, pageSize: options.pageSize };
  return onRulesLoaded([], allRules, emptyOptions);
}

function parseRequest(req): [string, string, Record<string, string>] {
  const url = new URL(req.url, 'http://localhost'); // Provide fake base url for parsing
  const dbKey = url.pathname.slice(1); // Remove leading slash

  const QUERY_RULEID = /^rules\/([A-Za-z0-9-]*)/;
  const QUERY_PAGE = /page=([0-9]+)*/;
  const QUERY_LIMIT = /pageSize=([0-9]+)*/;

  // We need to rebuild the query params; JSON server clears those after processing
  // and the router.render() phase no longer has original access. So we rebuild...
  const ruleId = dbKey.match(QUERY_RULEID)?.[1];
  const page = url.search.match(QUERY_PAGE)?.[1];
  const pageSize = url.search.match(QUERY_LIMIT)?.[1];

  return [req.method, dbKey, { pageSize, page, ruleId }];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addStatus<T extends PaginatedRestResponse<Rule>>(target: any): T {
  return {
    ...target,
    status: {
      code: 200,
    },
  };
}
