export interface PermissionAttributes {
  canApproveProgram?: boolean;
  canReviewProject: boolean;
  canViewReport: boolean;
  canEdit: boolean;
}

export interface CustomProgramPermissionVM extends PermissionAttributes {
  programName: string;
  customProgramId: number;
  startDate?: string;
  endDate?: string;
  newSubmissionCount: number;
  parentCustomProgramId?: number; // present for cohorts
}

export enum CalendarProvider {
  Google,
  Outlook,
}

export enum CurrencyCode {
  USD,
  CAD,
  AUD,
  BRL,
  CHF,
  DKK,
  EUR,
  GBP,
  INR,
  RSD,
  SEK,
  ZAR,
  CLP,
}

export enum LanguagePreference {
  EN_US,
  FR_CA,
  ES_419,
  PT_BR,
  DE_DE,
  EN_GB,
  FR_FR,
  JA_JP,
  ZH_CN,
  DA_DK,
  ES_ES,
  IT_IT,
  KO_KR,
  NL_NL,
  PL_PL,
  RU_RU,
  SV_SE,
  CS_CZ,
  HU_HU,
  ID_ID,
  PT_PT,
  RO_RO,
  TH_TH,
  TR_TR,
  VI_VN,
  ZH_TW,
  EL_GR,
}

enum FinanceType {
  Loan,
  ISA,
  Scholarship,
  Discount,
  Prepayment,
  TuitionReimbursement,
  CompletionBonus,
  Other,
  ExternalReimbursement,
  DirectBilling,
}

export interface UserDetailsVM {
  canViewAcademiesFeature: boolean;
  companyId: number;
  connectedCalendar?: CalendarProvider;
  currency: CurrencyCode;
  email: string;
  firstLogin?: string;
  firstName: string;
  hasAcceptedStripeTerms?: boolean;
  isAcademiesIntegratedExperienceDisabled: boolean;
  isAcademyApprover: boolean;
  isAdmin: boolean;
  isBeta: boolean;
  isContentMarketplaceIntegratedExperienceDisabled: boolean;
  isEligibleForPersonalLearningBudget: boolean;
  isManager: boolean;
  languagePreference: LanguagePreference;
  lastName: string;
  lxpSsoUrl: string;
  plbType?: FinanceType;
  userCompanyId: number;
}

export enum FeatureFlagExperiments {
  PeerVisibility = 'feature__peer_visibility',
  PeerVisibilityForCustomPrograms = 'feature__peer_visibility_for_custom_programs',
  TeamInsights = 'feature__team_insights',
  PrepaymentTab = 'feature__prepayment-tab',
  PrepaymentLinkNewBankAccount = 'feature__link-new-bank-account-to-stripe',
  DisableProgressUpdates = 'feature__disable-progress-updates',
  CustomPrograms = 'feature__custom-programs',
  OnlyCustomProgramsUser = 'feature__only-show-custom-programs-to-user',
  TimeIncentives = 'feature__time-incentives',
  Academies = 'feature__academies',
  ConnectCalendar = 'feature__connect-calendar',
  GoogleCalendar = 'feature__google-calendar',
  Licenses = 'feature__licenses',
  ExternalReimbursements = 'feature__external-reimbursements',
  PseudoLocale = 'feature__locale-testing',
  CostCenter = 'feature__cost-center',
  DisableVirtualCards = 'feature__disable-virtual-cards',
  Incentives = 'feature__incentives',
  SlackControls = 'temp__slack-controls',
  AcademyPeople = 'feature__academy-people',
  LearnInReimbursements = 'feature__learn-in-reimbursements',
  CredsparkDemo = 'temp__credspark_demo',
  ReportStatusTag = 'feature__report_status_tag',
  UnspentFunds = 'feature__unspent_funds',
  Subscriptions = 'temp__subscriptions',
  TranslatePlbFields = 'temp__translate_plb_fields',
  HideMarketplace = 'feature__custom_program_hide_marketplace',
  ProjectFeedback = 'temp__show_project_feedback',
  ProductSwitcher = 'temp_product_switcher',
  RenameApprovalFields = 'temp_rename_approval_fields',
  RequestWithCurrency = 'temp__request_with_currency',
  Swedish = 'feature__language_swedish',
  Russian = 'feature__language_russian',
  Polish = 'feature__language_polish',
  Dutch = 'feature__language_dutch',
  Korean = 'feature__language_korean',
  Italian = 'feature__language_italian',
  SpainSpanish = 'feature__language_spain_spanish',
  Danish = 'feature__language_danish',
  HideHeaderOnResubmit = 'temp__hide_header_resubmit',
  HideSubtextForResubmissions = 'temp__hide_subtext_for_resubmissions',
  NewTags = 'temp__status-tags-ui',
  CustomProgramDiscussionSteps = 'temp__cp_discussion_steps',
  WhatsNext = 'feature__whats_next',
  InstructionText = 'feature__instruction_text',
  Prorating = 'temp__prorate_budgets',
  HelperText = 'feature__help_text',
  SetLanguageFromBrowser = 'temp__set_language_from_browser',
  SkipAcademyStep = 'feature__skip_academy_step',
  AcademyLoadingRefresh = 'feature__academy_loading_refresh',
  ReimbursementAttachmentsMigration = 'temp__reimbursements_attachments_migration',
  DirectBilling = 'temp__direct_billing',
  YourPlanNameChange = 'temp_rename_your_plan_to_home',
  VoucherCodes = 'temp__voucher_codes',
  NudgeEmails = 'temp__nudge_emails',
  ViewMembersInCustomProgram = 'temp__view_members_in_custom_program',
  ProgramDetailsRedesign = 'temp__program_detail_redesign_p1',
  RemoveOtherIncentives = 'temp__remove_other_incentives',
  AcademyProgramApprovers = 'temp__academy_program_approver',
  WelcomeBackHeader = 'temp__your_plan_welcome_back_header',
  LxpToCmFlow = 'temp__cm_lxp_flow',
  IntegratedUser = 'temp__integrated_user',
  UpdatedLxpToCmFlow = 'temp__updated_cm_lxp_flow',
  SettingsRedesign = 'temp__settings_redesign',
  Nominations = 'feature__nomination',
  HideMarketplaceFromLXP = 'feature__hide_marketplace',
  HidePrimaryNav = 'temp__hide_primary_nav',
  ShowEmployeeEmail = 'temp__show_employee_email',
  LicenseModalUpdate = 'temp__access_program_voucher',
  ShowCustomProgramClickToJoin = 'temp__allow_custom_program_join',
  ShowAcademyClickToJoin = 'temp__allow_academy_join',
  ShowProductSwitcherLxpOption = 'temp__show_product_switcher_lxp_option',
  UnlockStepOnProgramApproval = 'feature__unlock-step-on-program-approval',
  ProgramDetailsRedesignPt2 = 'temp_program_details_redesign_pt2',
  BulkNudgeAllParticipants = 'temp__bulk_nudge_all_participants',
  HideAdminSettings = 'temp__hide_admin_settings',
  AcademyAndCpLxpFlow = 'temp__acad-and-cp-lxp_flow',
  IdleTimeLogout = 'idle_time_logout',
  SunsetMonthlyRenewal = 'temp__sunset_monthly_renewal',
  TeamInsightsHideColumns = 'temp__team_insights_hide_columns',
  HideChatWidget = 'feature__hide_help_widget',
  EditProjectSubmissions = 'feature__edit_project_submissions',
  SunsetInitiatives = 'temp__sunsetinitiatives',
  SunsetReviews = 'temp__sunsetreviews',
  HideEveryYearDirectBilling = 'temp__hide_every-year-direct-billing',
  HideEveryYearReimbursement = 'temp__hide_every-year-reimbursement',
  HideRenewalDate = 'temp__hide_renewaldate',
  HideRollOver = 'feature__hide_rollover',
  CatalogContentAcademies = 'feature__catalog_content_academies',
  AcademiesCleanUp = 'temp__academies_clean_up',
  IsLxpAdmin = 'feature__is_lxp_admin',
  HideProductSwitcher = 'temp__hide_product_switcher',
  Czech_Czech_Republic = 'feature__language_czech',
  Hungarian = 'feature__language_hungarian',
  Indonesian = 'feature__language_indonesian',
  Portuguese_Portugal = 'feature__language_portuguese_portugal',
  Romanian_Romania = 'feature__language_romanian_romania',
  Thai = 'feature__language_thai',
  Turkish = 'feature__language_turkish',
  Vietnamese = 'feature__language_vietnamese',
  Chinese_Taiwan = 'feature__language_chinese_taiwan',
  Greek_Greece = 'feature__language_greek_greece',
  ACMLayout = 'temp__acm_layout',
  LXPAdminLayout = 'temp__lxp_admin_layout',
}

export type TIsFeatureFlagOn = Record<keyof typeof FeatureFlagExperiments, boolean>;

export interface IncentivesCountVM {
  timeIncentivesAvailableToUsersCount: number;
  financeIncentivesAvailableToUsersCount: number;
  timeIncentivesAvailableToUsersWithManagerApprovalCount: number;
  financeIncentivesAvailableToUsersWithManagerApprovalCount: number;
  programIncentivesAvailableToUsersWithManagerApprovalCount: number;
  resourcesAvailableToUsersWithManagerApprovalCount: number;
  hasPersonalLearningBudget: boolean;
  academiesWithCurrentUserAsAssignedApprover: number;
}

export interface UseCanShowProgramsVM {
  customPrograms: boolean;
  marketplace: boolean;
  any: boolean;
  all: boolean;
}

export interface AcademiesCountVM {
  publishedAcademiesAvailableToUserCount: number;
}

export interface AcademyPermissionVM extends PermissionAttributes {
  academyId: number;
  academyName: string;
  newSubmissionCount: number;
}
