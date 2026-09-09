---
name: storagelicences-implementation-ui
description: Frontend implementation guidance for the Storage Licences project using Vue 3.
---

# Storage Licences — Frontend Implementation Skill

## Purpose

Use this file as project knowledge while implementing the Vue 3 frontend for the OpusXenta Senior Software Engineer take-home assignment.

The assignment `SKILL.md` remains the overall source of truth for the project. This file provides the frontend-specific implementation guidance and the concrete backend API contracts required by the UI.

Build only the required frontend functionality.

Prefer simple, maintainable implementation over additional features, abstractions, libraries, or visual complexity.

---

# Technology

* Vue 3
* Use the existing frontend project structure and conventions.
* Use the existing TypeScript configuration if the project uses TypeScript.
* Use the existing HTTP/API client approach where available.
* Use the existing Vue Router setup where available.
* Keep dependencies minimal.
* Do not introduce a state-management library unless the existing project already uses one or there is a demonstrated need.

All dates are calendar dates.

Use ISO date strings:

`YYYY-MM-DD`

Do not introduce timezone or time-of-day logic.

---

# Frontend Scope

Implement the following user-facing functionality:

1. Unit list
2. Server-side filtering
3. Server-side pagination
4. Unit detail
5. Licence information/history
6. Placement history
7. Unit availability
8. Schedule placement
9. Display API validation errors
10. Basic loading, success, empty, and error states

Do not implement:

* Authentication/login
* User management
* Licence transfer
* Billing
* Checkout/removal
* Audit functionality
* Reporting/admin dashboards
* Message brokers
* Caching infrastructure
* Unnecessary global state
* Unnecessary UI libraries
* Features outside the assignment

Visual design does not need to be elaborate. Prioritize clarity, correctness, and usability.

---

# Architecture

Follow the existing Vue project structure.

Keep responsibilities simple:

### Views

Handle:

* page-level composition
* route parameters
* loading states
* API calls through services
* page-level errors
* coordinating components

### Components

Handle focused UI responsibilities such as:

* unit table
* pagination
* availability display
* placement form
* placement list
* licence information
* error display

Do not put business rules into components.

### Services

Handle HTTP communication with the backend.

Keep raw HTTP/API logic out of templates and large components.

### Types

Define TypeScript interfaces/types for the actual API request and response models.

Do not invent API fields.

---

# Critical Business Rule Boundary

The backend Domain layer owns the seven scheduling rules.

The Vue application must NOT duplicate those rules.

Do not implement frontend versions of:

* licence coverage
* licence surrender
* licence holder validation
* capacity validation
* pallet spacing
* item intake validation
* scheduling window validation

The frontend should:

1. collect input
2. perform basic UI/input validation where appropriate
3. send the request to the API
4. display the API response
5. display all structured validation failures returned by the backend

The backend remains authoritative.

---

# Backend API Contracts

The following contracts describe the existing backend API.

Use these contracts when implementing the UI.

If the actual backend implementation differs, inspect the actual controller/DTO implementation and use the implemented API contract as the final source of truth.

All dates use:

`YYYY-MM-DD`

---

## GET `/api/units`

### Purpose

Retrieve a server-side filtered and paginated list of units.

### Query parameters

```text
page: int
pageSize: int
hasActiveLicence: bool?
minRemainingPalletCapacity: int?
minRemainingBoxCapacity: int?
```

Defaults:

```text
page = 1
pageSize = 50
```

Example:

```text
GET /api/units?page=1&pageSize=50&hasActiveLicence=true&minRemainingPalletCapacity=1
```

### Response

```json
{
  "items": [
    {
      "id": 1,
      "palletCapacity": 2,
      "boxCapacity": 4,
      "occupiedPalletCount": 1,
      "occupiedBoxCount": 2,
      "remainingPalletCapacity": 1,
      "remainingBoxCapacity": 2,
      "hasActiveLicence": true
    }
  ],
  "totalCount": 42,
  "page": 1,
  "pageSize": 50
}
```

### Type

```typescript
interface UnitListItemDto {
  id: number;
  palletCapacity: number;
  boxCapacity: number;
  occupiedPalletCount: number;
  occupiedBoxCount: number;
  remainingPalletCapacity: number;
  remainingBoxCapacity: number;
  hasActiveLicence: boolean;
}

interface UnitListResponse {
  items: UnitListItemDto[];
  totalCount: number;
  page: number;
  pageSize: number;
}
```

### Frontend requirements

The UI should provide filters for:

* Active licence
* Minimum remaining pallet capacity
* Minimum remaining box capacity

The UI should provide:

* current page
* page size
* total result count
* previous/next navigation

Filtering and paging MUST be performed by the backend.

Do not:

* download all units
* filter units in Vue
* paginate the complete dataset in Vue

When filters change, reset to page 1 where appropriate.

---

# GET `/api/units/{id}`

### Purpose

Retrieve detailed information about a unit.

The response includes:

* unit information
* licence information/history as appropriate
* all placements

The frontend must inspect the actual backend response DTO and use those fields directly.

### Frontend behavior

Provide a Unit Detail page.

Display, as applicable:

### Unit

* ID
* pallet capacity
* box capacity
* current occupancy
* remaining capacity

### Licence

Display the licence information/history supplied by the API.

### Placements

Display placement history including the information supplied by the API, such as:

* item
* placement class
* scheduled date
* status

Handle:

* loading
* successful response
* unit not found
* API/network errors

---

# GET `/api/units/{id}/availability?asOf={date}`

### Purpose

Determine whether the unit can accept a pallet or box as of a selected date.

Example:

```text
GET /api/units/1/availability?asOf=2024-06-01
```

### Query parameter

```text
asOf: YYYY-MM-DD
```

Required.

### Response

```json
{
  "unitId": 1,
  "asOf": "2024-06-01",
  "pallet": {
    "canAccept": true,
    "reasons": []
  },
  "box": {
    "canAccept": false,
    "reasons": [
      "BOX_CAPACITY_EXCEEDED"
    ]
  }
}
```

### Types

```typescript
interface ClassAvailabilityDto {
  canAccept: boolean;
  reasons: string[];
}

interface UnitAvailabilityDto {
  unitId: number;
  asOf: string;
  pallet: ClassAvailabilityDto;
  box: ClassAvailabilityDto;
}
```

### Possible reason codes

Only these codes can be returned by this endpoint:

```text
LICENCE_NOT_COVERING_DATE
LICENCE_SURRENDERED
PALLET_CAPACITY_EXCEEDED
BOX_CAPACITY_EXCEEDED
PALLET_GAP_TOO_SMALL
```

The endpoint does NOT evaluate:

```text
NOT_CURRENT_HOLDER
ITEM_INTAKE_DATE_MISSING
ITEM_NOT_AVAILABLE_ON_DATE
SCHEDULING_DATE_TOO_FAR
```

because requester, item, and request-date information are unavailable.

### Frontend behavior

Provide a date selector/input.

When the user selects an `asOf` date:

1. call the availability endpoint
2. display pallet availability
3. display box availability
4. display all returned reasons

Example:

```text
Availability — 2024-06-01

Pallet
✓ Available

Box
✕ Not available

Reason:
BOX_CAPACITY_EXCEEDED
```

Do not recreate the availability logic in Vue.

The API is authoritative.

---

# POST `/api/placements`

### Purpose

Schedule a placement.

The backend applies all seven scheduling rules.

### Request

```json
{
  "unitId": 1,
  "itemId": 2,
  "placementClass": "Pallet",
  "scheduledDate": "2024-07-01",
  "assertedRequesterId": "holder-1"
}
```

### Type

```typescript
interface CreatePlacementRequest {
  unitId: number;
  itemId: number;
  placementClass: "Pallet" | "Box";
  scheduledDate: string;
  assertedRequesterId: string;
}
```

Use the actual backend DTO if its implementation differs.

### Successful response

HTTP:

`201 Created`

Response:

```json
{
  "id": 42,
  "unitId": 1,
  "itemId": 2,
  "placementClass": "Pallet",
  "scheduledDate": "2024-07-01",
  "status": "Scheduled"
}
```

### Type

```typescript
interface PlacementDto {
  id: number;
  unitId: number;
  itemId: number;
  placementClass: string;
  scheduledDate: string;
  status: string;
}
```

---

# Placement Validation Errors

A scheduling request can return multiple validation failures.

Example:

```json
{
  "errors": [
    {
      "code": "LICENCE_NOT_COVERING_DATE",
      "description": "No licence covers the requested scheduled date."
    },
    {
      "code": "PALLET_CAPACITY_EXCEEDED",
      "description": "The unit has no remaining pallet capacity."
    }
  ]
}
```

Possible domain error codes:

```text
LICENCE_NOT_COVERING_DATE
LICENCE_SURRENDERED
NOT_CURRENT_HOLDER
PALLET_CAPACITY_EXCEEDED
BOX_CAPACITY_EXCEEDED
PALLET_GAP_TOO_SMALL
ITEM_INTAKE_DATE_MISSING
ITEM_NOT_AVAILABLE_ON_DATE
SCHEDULING_DATE_TOO_FAR
```

The frontend must display ALL returned errors.

Do not display only the first error.

Prefer displaying the backend-provided `description`.

The frontend must not maintain its own copy of business-rule descriptions.

Example:

```text
Placement could not be scheduled.

• No licence covers the requested scheduled date.
• The unit has no remaining pallet capacity.
```

---

# Not Found Errors

Unit/item not-found responses may contain:

```json
{
  "errors": [
    {
      "code": "UNIT_NOT_FOUND",
      "description": "The requested unit does not exist."
    }
  ]
}
```

The frontend should display a clear user-facing message.

Do not expose technical exception details.

---

# Placement Form

Provide a simple form containing:

* Unit
* Item
* Placement class
* Scheduled date
* Asserted requester ID
* Schedule button

Example:

```text
Unit
[ 123 ]

Item
[ 456 ]

Placement class
( ) Pallet
( ) Box

Scheduled date
[ 2026-05-15 ]

Requester
[ COMPANY-ABC ]

[ Schedule Placement ]
```

Do not add authentication.

The asserted requester ID is simply the value required by the API contract.

---

# Placement Success

When scheduling succeeds:

1. show a clear success message
2. display the created placement where appropriate
3. refresh relevant unit/detail/availability data if necessary

Do not introduce notification infrastructure.

A simple inline success message is sufficient.

---

# Date Handling

Dates must remain calendar dates.

Use:

```text
YYYY-MM-DD
```

for API communication.

Be careful with JavaScript `Date`, because timezone conversion can change the calendar date.

Prefer keeping API date values as strings when possible.

Do not convert:

```text
2026-05-15
```

into a timezone-adjusted timestamp.

Do not send:

```text
2026-05-15T00:00:00Z
```

when the API expects a calendar date.

---

# API Services

Keep API communication in a small service layer.

For example:

```text
services/
├── unitService.ts
└── placementService.ts
```

Possible service responsibilities:

```typescript
getUnits(...)
getUnit(id)
getUnitAvailability(id, asOf)
createPlacement(request)
```

Use the existing HTTP client/project conventions if available.

Do not create a large generic API framework for four endpoints.

---

# Suggested Types

Use focused types corresponding to the actual API.

For example:

```typescript
interface UnitListQuery {
  page: number;
  pageSize: number;
  hasActiveLicence?: boolean;
  minRemainingPalletCapacity?: number;
  minRemainingBoxCapacity?: number;
}
```

```typescript
interface ApiError {
  code: string;
  description: string;
}

interface ApiErrorResponse {
  errors: ApiError[];
}
```

Adjust these types if the existing backend response differs.

---

# Suggested UI Structure

A simple structure is sufficient:

```text
src/
├── components/
│   ├── UnitTable
│   ├── Pagination
│   ├── AvailabilityPanel
│   ├── PlacementForm
│   ├── PlacementList
│   └── ApiErrorList
│
├── views/
│   ├── UnitListView
│   └── UnitDetailView
│
├── services/
│   ├── unitService
│   └── placementService
│
├── types/
│   ├── unit
│   └── placement
│
└── router/
```

Adapt this to the existing project rather than restructuring the project unnecessarily.

---

# Unit List UI

Provide:

### Filters

```text
Active licence
[ All ▼ ]

Minimum remaining pallets
[ 0 ]

Minimum remaining boxes
[ 0 ]

[ Apply Filters ]
```

### Table

Display:

| Unit | Pallets | Remaining Pallets | Boxes | Remaining Boxes | Active Licence |
| ---- | ------: | ----------------: | ----: | --------------: | -------------- |
| 1    |   1 / 2 |                 1 | 2 / 4 |               2 | Yes            |

Use the actual DTO fields.

### Pagination

Example:

```text
Showing page 1 of 5

[ Previous ] [ Next ]
```

Calculate display information from `totalCount`, `page`, and `pageSize`.

Do not load all records.

---

# Unit Detail UI

Provide a clear unit detail page.

Suggested structure:

```text
Unit #123

Capacity
Pallets: 1 / 2
Boxes:   2 / 4

Licence
...

Placements
--------------------------------------------------
Item    Class      Scheduled Date    Status
--------------------------------------------------
...     Pallet     2026-05-01       Scheduled
...     Box        2026-04-01       Completed

[ Check Availability ]
[ Schedule Placement ]
```

Use actual API response fields.

---

# Availability UI

Provide an `asOf` date input.

Display each placement class separately:

```text
Pallet
✓ Available

Box
✕ Not Available

Reasons:
- BOX_CAPACITY_EXCEEDED
```

If multiple reasons exist, display all of them.

If there are no reasons and `canAccept` is true, display a simple available state.

---

# Loading and Empty States

Provide simple states for API-driven screens.

Examples:

```text
Loading units...
```

```text
Loading unit details...
```

```text
No units match the selected filters.
```

```text
No placements found.
```

Avoid unnecessary loading libraries.

---

# Error Handling

Handle:

* HTTP 400 validation failures
* HTTP 404 not found
* unexpected API failures
* network failures

For structured API errors, display the backend-provided descriptions.

For unexpected failures, use a simple user-friendly message.

Do not show:

* stack traces
* raw exception objects
* internal server details

---

# Testing

If the existing Vue project has a frontend test setup, add a small high-value suite.

Test frontend behavior rather than duplicating Domain tests.

Focus on:

* unit list renders returned units
* filter values are sent to the API
* pagination requests the correct page
* unit detail renders correctly
* availability renders pallet/box states
* availability renders multiple reasons
* placement form sends the expected request
* successful placement displays success state
* multiple placement validation errors are displayed
* loading states
* not-found/error states

Do not recreate the seven backend scheduling rules in frontend tests.

---

# Performance

Keep the frontend simple.

The backend is responsible for the main query-performance requirement.

The frontend should:

* request only the current page
* avoid loading thousands of units
* avoid unnecessary API calls
* avoid unnecessary watchers
* avoid unnecessary global state

Do not introduce a caching layer.

---

# Accessibility

Use basic accessible HTML:

* labels for form fields
* meaningful button text
* table headers
* readable error messages
* clear loading states
* sufficient visual distinction between available/unavailable states

Do not spend excessive effort on visual polish because visual design is not a major assessment area.

---

# Implementation Order

Implement in this order:

1. Inspect the existing Vue project.
2. Inspect the actual backend controllers/DTOs.
3. Set up API types.
4. Implement API services.
5. Implement Unit List.
6. Add server-side filtering.
7. Add server-side pagination.
8. Implement Unit Detail.
9. Implement Availability.
10. Implement Placement Form.
11. Implement API error handling.
12. Add frontend tests.
13. Run the full application and verify frontend/backend integration.
14. Remove unnecessary complexity.

---

# Final Verification

Before considering the frontend complete, verify:

* Unit list loads.
* Filtering works through API query parameters.
* Pagination works server-side.
* Unit detail loads.
* Licence information is displayed.
* Placement history is displayed.
* Availability accepts an `asOf` date.
* Availability displays all relevant reasons.
* Placement form sends the correct API request.
* Successful placement is displayed.
* Multiple validation failures are displayed.
* 404 responses are handled.
* Unexpected API failures are handled.
* Dates remain `YYYY-MM-DD`.
* No timezone conversion is introduced.
* No backend business rules are duplicated in Vue.
* No authentication was added.
* No transfer functionality was added.
* No unnecessary state-management or framework abstractions were added.

# Guiding Principle

Build the smallest complete frontend that demonstrates:

* correct API integration
* clear presentation of backend data
* server-side filtering and pagination
* correct handling of availability
* correct scheduling workflow
* clear handling of structured validation errors
* simple maintainable Vue code

The backend owns the business rules.

The frontend owns presentation, user input, API communication, and displaying results.

More features, more libraries, and more abstraction are not better.
