# AI Notes

Implementation details and project requirements are provided to Copilot through the project skill file:

`.agents\skills\storagelicences-implementation-ui`

## AI Intervention 1 — Unit List UI

**Prompt:**

> Design and implement the Unit List UI matching the attached specification/design, ensuring it integrates cleanly with the existing application architecture.
>
> Requirements:
>
> - Extract and componentize reusable styles/CSS classes so they are shared and accessible by other UI views/components.
> - Implement the UI functionality completely (connecting component state, API integration, filtering/pagination bindings, and event handling).
> - Follow the project's existing UI framework conventions, folder structure, and design system patterns.

## AI Intervention 2 — Unit Detail Page

**Prompt:**

> Implement the Unit Detail view component and configure its navigation route, ensuring it opens when a user clicks the "View" action on any item in the Unit List.
>
> Requirements:
>
> - Set up route handling for the unit detail page using the unit's ID parameter.
> - Fetch detailed unit data from the corresponding API endpoint defined in `#file:skill.md`.
> - Extract reusable styling patterns into shared/common CSS files or classes so other views can easily reuse them.
> - Follow the existing project folder structure, Vue component conventions, and design system patterns.

## AI Intervention 3 — Placement UI

**Prompt:**

> Implement the PlacementUI form component and API integration for creating new placements on the Unit Detail view. I have already added a button called "Schedule Placement" in `UnitDetailView`.

**API Contract**

Endpoint: `POST /api/placements`

Request Payload:

```
{
  "unitId": 0,
  "itemId": 0,
  "placementClass": "string",
  "scheduledDate": "2026-09-09",
  "assertedRequesterId": "string"
}
```

Success Response (`201 Created`):

```
{
  "id": 0,
  "unitId": 0,
  "itemId": 0,
  "placementClass": "string",
  "scheduledDate": "2026-09-09",
  "status": "string"
}
```

Error Response (`400 Bad Request`):

Matches the server response format where validation or domain errors are returned within an `errors` array containing objects with `code` and `description` properties:

```
{
  "errors": [
    {
      "code": "string",
      "description": "string"
    }
  ]
}
```

**UI & Implementation Requirements**

- Create a form UI with client-side field validations for all required request parameters.
- Bind the `unitId` automatically using the current view's unit context.
- Handle API request submission asynchronously, managing loading and disabled states during execution.
- Capture and display server-side error descriptions cleanly in the UI if the request fails with a 400 Bad Request.
- Trigger a data reload on the Unit Detail view upon successful placement creation.
