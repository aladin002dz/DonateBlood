# Project Rules

These rules apply to all code generated for this project.

## 1. Git Commit Messages
Strictly follow the **Gitmoji** convention: `<Emoji> <type>: <subject>`

- ✨ `feat`: New features
- 🐛 `fix`: Bug fixes
- ♻️ `refactor`: Code restructuring
- 📝 `docs`: Documentation changes
- 🎨 `style`: Formatting/Style changes
- ✅ `test`: Adding/updating tests
- 📦 `build`: Dependencies/Package changes
- 🔧 `chore`: Configuration/Tooling changes

**Example:** `✨ feat: add user profile component`

## 2. Code Quality
- **No `console.log`**: Remove all debug logging before finishing a task.
- **Strict TypeScript**: Do not use `any`. Define proper interfaces for all props and data structures.
- **Comments**: Add comments only for complex logic. Avoid stating the obvious.

## 3. Naming Conventions
- **Components**: Use `PascalCase` (e.g., `UserProfile.tsx`).
- **Functions/Variables**: Use `camelCase` (e.g., `fetchUserData`).
- **Constants**: Use `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_COUNT`).

## 4. UI/UX
- **Tailwind**: Use utility classes over inline styles.
- **Responsiveness**: Always consider mobile views. Use `md:` and `lg:` modifiers.
