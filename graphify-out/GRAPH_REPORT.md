# Graph Report - src/  (2026-05-14)

## Corpus Check
- Corpus is ~16,434 words - fits in a single context window. You may not need a graph.

## Summary
- 507 nodes · 932 edges · 82 communities (28 shown, 54 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_UI Shell Components|UI Shell Components]]
- [[_COMMUNITY_Zod-based Form Fields|Zod-based Form Fields]]
- [[_COMMUNITY_Dashboard Filter & Layout|Dashboard Filter & Layout]]
- [[_COMMUNITY_Organization Logic|Organization Logic]]
- [[_COMMUNITY_Organization & Command Dialogs|Organization & Command Dialogs]]
- [[_COMMUNITY_Loading State & Tables|Loading State & Tables]]
- [[_COMMUNITY_Pagination & Next.js Components|Pagination & Next.js Components]]
- [[_COMMUNITY_User Profile & Dropdown|User Profile & Dropdown]]
- [[_COMMUNITY_Login Form & Page|Login Form & Page]]
- [[_COMMUNITY_Shadcn UI Form|Shadcn UI Form]]
- [[_COMMUNITY_Recharts Visualization|Recharts Visualization]]
- [[_COMMUNITY_Authentication Logic|Authentication Logic]]
- [[_COMMUNITY_Command & Dialog Overlays|Command & Dialog Overlays]]
- [[_COMMUNITY_App Templates & Query Provider|App Templates & Query Provider]]
- [[_COMMUNITY_Toggle Controls|Toggle Controls]]
- [[_COMMUNITY_Button & Response Types|Button & Response Types]]
- [[_COMMUNITY_Fonts & Metadata|Fonts & Metadata]]
- [[_COMMUNITY_App Structure & Headers|App Structure & Headers]]
- [[_COMMUNITY_Theme Toggles|Theme Toggles]]
- [[_COMMUNITY_Input & Filter Config|Input & Filter Config]]
- [[_COMMUNITY_Table Column Definitions|Table Column Definitions]]
- [[_COMMUNITY_Filter Badge & Refactoring|Filter Badge & Refactoring]]
- [[_COMMUNITY_Tunkin Form Schema & Hooks|Tunkin Form Schema & Hooks]]
- [[_COMMUNITY_Session Termination|Session Termination]]
- [[_COMMUNITY_Base Fetching Logic|Base Fetching Logic]]
- [[_COMMUNITY_Chart Tooltips|Chart Tooltips]]
- [[_COMMUNITY_Zod Input Components|Zod Input Components]]
- [[_COMMUNITY_Date Selection Zod|Date Selection Zod]]
- [[_COMMUNITY_Organization & Query Provider|Organization & Query Provider]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 163 edges
2. `Button()` - 13 edges
3. `getAccessToken()` - 9 edges
4. `Field()` - 9 edges
5. `Input()` - 7 edges
6. `useSidebar()` - 7 edges
7. `SidebarMenuButton()` - 7 edges
8. `TunkinFilterComponent()` - 6 edges
9. `useDebounceCallback()` - 6 edges
10. `JwtUserToken` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Login Form` --semantically_similar_to--> `TunkinFormDialog`  [INFERRED] [semantically similar]
  src/app/login/login-form.tsx → app/dashboard/form-dialog.tsx
- `FieldLegend()` --calls--> `cn()`  [EXTRACTED]
  components/ui/field.tsx → lib/utils.ts
- `FieldContent()` --calls--> `cn()`  [EXTRACTED]
  components/ui/field.tsx → lib/utils.ts
- `FieldTitle()` --calls--> `cn()`  [EXTRACTED]
  components/ui/field.tsx → lib/utils.ts
- `FieldDescription()` --calls--> `cn()`  [EXTRACTED]
  components/ui/field.tsx → lib/utils.ts

## Hyperedges (group relationships)
- **Authentication Flow** — proxy_proxy, login_action_dologin, login_form_loginform [EXTRACTED 0.95]
- **Dashboard Data Management** — dashboard_page_dashboardpage, dashboard_component_tunkincomponent, dashboard_action_fetchtunkin, hooks_usetunkinfilter_usetunkinfilter [EXTRACTED 0.90]
- **URL-driven Filter Pattern** — hooks_usetunkinfilter_usetunkinfilter, hooks_usedebouncecallback_usedebouncecallback, dashboard_filter_tunkinfiltercomponent [EXTRACTED 0.90]
- **Authentication Infrastructure** — session_getsession, auth_renewtoken, auth_logintoken, session_createsession [EXTRACTED 0.95]
- **Form UI System** — form_form, field_field, formzod_inputzodprops [EXTRACTED 0.90]
- **Tunkin Domain Logic** — tunkin_tunkin, tunkin_uploadtunkinschema, uploadhook_usetunkinformdialog [EXTRACTED 0.95]
- **Overlay Components Pattern** — dialog_dialog, drawer_drawer, sheet_sheet [INFERRED 0.90]
- **Form Input Components** — input_input, select_select, switch_switch, toggle_toggle [INFERRED 0.85]
- **Sidebar System** — sidebar_sidebar, sidebar_sidebarprovider, sidebar_usesidebar, sidebar_sidebartrigger [EXTRACTED 0.95]
- **Application Template Structure** — index_apptemplate, template_sidebar_templatesidebar, template_header_templateheader, template_nav_main_templatenavmain, template_user_templateusernav [EXTRACTED 0.90]
- **Zod-based Form Components Pattern** — bulan_zod_bulanzod, input_zod_inputzod, tahun_zod_tahunzod, file_zod_inputfilezod [INFERRED 0.85]
- **Dashboard Filter System** — active_filters_activefilters, filter_badge_filterbadge, refactoring_notes_filter_refactoring [EXTRACTED 0.95]

## Communities (82 total, 54 thin omitted)

### Community 0 - "UI Shell Components"
Cohesion: 0.05
Nodes (62): useIsMobile(), cn(), navData, NavItem, navMain, BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink() (+54 more)

### Community 1 - "Zod-based Form Fields"
Cohesion: 0.07
Nodes (35): FILTER_CONFIG, FilterFields, FilterFieldsProps, BULAN_OPTIONS, BulanItem, TAHUN_OPTIONS, TahunItem, BaseZodProps (+27 more)

### Community 2 - "Dashboard Filter & Layout"
Cohesion: 0.07
Nodes (31): ActiveFilters, ActiveFiltersProps, FILTER_ICONS, FILTER_VARIANTS, TunkinComponent, FilterBadge(), FilterBadgeProps, variantStyles (+23 more)

### Community 3 - "Organization Logic"
Cohesion: 0.11
Nodes (30): cekExistingTunkin(), doUpload(), fetchTunkin(), template(), logout(), renewToken(), createSession(), decodeToken() (+22 more)

### Community 4 - "Organization & Command Dialogs"
Cohesion: 0.09
Nodes (28): FormComponent, FormComponentProps, EmptyState, LoadingSkeleton, OrganizationList, OrganizationProps, useTunkinFormDialog(), UseTunkinFormDialogProps (+20 more)

### Community 5 - "Loading State & Tables"
Cohesion: 0.11
Nodes (22): TunkinRow, TunkinTableBody, TunkinTableBodyProps, TunkinTableHeader, TunkinTableRow, CommonFetchProps, formatRupiah(), getUrut() (+14 more)

### Community 6 - "Pagination & Next.js Components"
Cohesion: 0.11
Nodes (22): NavigationButtonProps, NextButton, PAGE_SIZES, PageList, PaginationBuilder(), PaginationButtonProps, PaginationSize, PreviousButton (+14 more)

### Community 7 - "User Profile & Dropdown"
Cohesion: 0.13
Nodes (15): TemplateUserNav(), Avatar(), AvatarFallback(), AvatarImage(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem() (+7 more)

### Community 8 - "Login Form & Page"
Cohesion: 0.23
Nodes (7): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle()

### Community 9 - "Shadcn UI Form"
Cohesion: 0.23
Nodes (10): FormControl(), FormDescription(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext, FormItemContextValue, FormLabel() (+2 more)

### Community 10 - "Recharts Visualization"
Cohesion: 0.22
Nodes (8): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), THEMES, useChart()

### Community 11 - "Authentication Logic"
Cohesion: 0.22
Nodes (10): LoginToken, renewToken, fetchOrganization, createSession, decodeToken, getAccessToken, getExpToken, getSession (+2 more)

### Community 12 - "Command & Dialog Overlays"
Cohesion: 0.22
Nodes (9): Command, CommandDialog, Dialog, Drawer, Sheet, SheetContent, Sidebar, SidebarTrigger (+1 more)

### Community 13 - "App Templates & Query Provider"
Cohesion: 0.29
Nodes (4): queryClient, Template(), queryClient, Template()

### Community 14 - "Toggle Controls"
Cohesion: 0.43
Nodes (5): ToggleGroup(), ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

### Community 15 - "Button & Response Types"
Cohesion: 0.33
Nodes (6): Button, PageResponse, PaginationBuilder, Pagination, cn, getUrut

### Community 16 - "Fonts & Metadata"
Cohesion: 0.4
Nodes (3): geistMono, geistSans, metadata

### Community 17 - "App Structure & Headers"
Cohesion: 0.4
Nodes (5): AppTemplate, TemplateHeader, TemplateNavMain, TemplateSidebar, ThemeToggle

### Community 20 - "Input & Filter Config"
Cohesion: 0.5
Nodes (4): FILTER_CONFIG, FilterFields, Input, Label

### Community 21 - "Table Column Definitions"
Cohesion: 0.67
Nodes (3): ColumnDef, LoadingTable, tunkinTableHeders

### Community 22 - "Filter Badge & Refactoring"
Cohesion: 1.0
Nodes (3): ActiveFilters, FilterBadge, Filter Component Refactoring Summary

## Knowledge Gaps
- **145 isolated node(s):** `config`, `publicRoutes`, `geistSans`, `geistMono`, `metadata` (+140 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **54 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `UI Shell Components` to `Zod-based Form Fields`, `Dashboard Filter & Layout`, `Organization & Command Dialogs`, `Loading State & Tables`, `Pagination & Next.js Components`, `User Profile & Dropdown`, `Login Form & Page`, `Shadcn UI Form`, `Recharts Visualization`, `Toggle Controls`, `Theme Toggles`?**
  _High betweenness centrality (0.317) - this node is a cross-community bridge._
- **Why does `TunkinFilterComponent()` connect `Dashboard Filter & Layout` to `UI Shell Components`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `Button()` connect `Pagination & Next.js Components` to `UI Shell Components`, `Dashboard Filter & Layout`, `Organization & Command Dialogs`, `User Profile & Dropdown`, `Login Form & Page`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `config`, `publicRoutes`, `geistSans` to the rest of the system?**
  _145 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Shell Components` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Zod-based Form Fields` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Dashboard Filter & Layout` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._