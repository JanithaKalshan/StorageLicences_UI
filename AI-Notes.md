# AI Notes

Implementation details and project requirements are provided to Copilot through the project skill file:

`.agents\skills\storagelicences-implementation-ui`

## AI Intervention 1 — Unit List UI

**Prompt:**

> Design and implement the Unit List UI matching the attached specification/design, ensuring it integrates cleanly with the existing application architecture. 
>Requirements:
>Extract and componentize reusable styles/CSS classes so they are shared and accessible by other UI views/components.
>Implement the UI functionality completely (connecting component state, API integration, filtering/pagination bindings, and event handling).
>Follow the project's existing UI framework conventions, folder structure, and design system patterns.

## AI Intervention 2 — Unit Detail page

**Prompt:**

>Update the `GET /api/units/{id}` endpoint to also return the following calculated values:
>`occupiedPallets`
>`occupiedBoxes`
>`remainingPallets`
>`remainingBoxes`
>The calculation and business rules for occupancy are already defined in `SKILL.md`. Follow those rules exactly.
>Calculate these values from the unit's placement data, using the existing Domain/Application/Infrastructure structure and conventions.
>The API response should include these values so the frontend does not need to calculate them.
>Do not duplicate the business rules in the controller or frontend. Reuse the existing domain/application logic where appropriate.
>Keep the implementation simple and avoid introducing unnecessary abstractions.
>After the change:
>update the relevant DTO/query if required
>update/add tests for the calculated values
>build the solution
>run the relevant tests
>verify the `GET /api/units/{id}` response.





