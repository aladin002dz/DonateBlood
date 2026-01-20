---
name: Create Component
description: Instructions for creating new React UI components with consistent styling and typing.
---

# Create Component Skill

When the user asks you to create a new React component or UI element, follow these standards:

1.  **File Location**:
    *   Place reusable UI components in `components/ui/`.
    *   Place feature-specific components in `components/<feature>/`.

2.  **Naming Convention**:
    *   Use **PascalCase** for filenames and component names (e.g., `MyButton.tsx`).

3.  **Imports**:
    *   Always import `cn` for class merging: `import { cn } from "@/lib/utils";`
    *   Import React hooks as needed (e.g., `import { useState } from "react";`).

4.  **Structure**:
    *   Define a TypeScript interface for props named `<ComponentName>Props`.
    *   Allow a `className` prop and spread it onto the root element using `cn()`.
    *   Export the component as the default export.

5.  **Template**:
    ```tsx
    import { cn } from "@/lib/utils";
    import React from "react";

    interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
      // Add custom props here
      customProp?: string;
    }

    export default function MyComponent({ className, customProp, ...props }: MyComponentProps) {
      return (
        <div className={cn("base-styles here", className)} {...props}>
          {/* Component logic */}
        </div>
      );
    }
    ```

6.  **Accessibility**:
    *   Ensure all interactive elements have proper `aria` attributes if needed.
