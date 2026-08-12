<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Arabic Pluralization Guidelines (جمع القلة وجمع الكثرة والتمييز)

In Arabic localization, object count pluralization follows specific grammatical rules for count forms (`zero`, `one`, `two`, `few`, `many`, `other`):

1. **Dual (`two`) / 2**:
   - Use the dual form without explicit digits (e.g. `طالبين` or `دروس` / `درسين`).
2. **Few (`few`) / 3 to 10**:
   - Plural form + number placeholder `{count}` (e.g. `{count} طلاب`, `{count} دروس`).
   - Grammatical rule: Numbers from 3 to 10 take a plural noun in genitive case (جمع مجرور).
3. **Many (`many`) / 11 to 99**:
   - Accusative singular noun + number placeholder `{count}` (e.g. `{count} طالباً`, `{count} درساً`).
   - Grammatical rule: Numbers from 11 to 99 take a singular accusative noun (مفرد منصوب على التمييز).
4. **Other (`other`) / 100, 1000, etc.**:
   - Genitive singular noun + number placeholder `{count}` (e.g. `{count} طالب`, `{count} درس`).
   - Grammatical rule: Hundreds and thousands take a singular genitive noun (مفرد مجرور).
5. **Zero / One (`zero`, `one`)**:
   - `zero`: `طالب` / `درس` (or specific zero phrase).
   - `one`: `طالب` / `درس` (singular noun without explicit 1 digit in concise UI contexts).

### Standard ICU Format Example in JSON messages:

```json
{
  "students": "{count, plural, =0 {طالب} zero {طالب} one {طالب} two {طالبين} few {{count} طلاب} many {{count} طالباً} other {{count} طالب}}",
  "lessons": "{count, plural, =0 {درس} zero {درس} one {درس} two {درسين} few {{count} دروس} many {{count} درساً} other {{count} درس}}"
}
```

### React / next-intl Component Usage:

Always pass `{ count }` to `t()` instead of string concatenation:

```tsx
// ❌ Incorrect concatenation
<span>{course.numberOfLessons} {t("card.lessonsShort")}</span>

// ✅ Correct ICU plural rendering
<span>{t("card.lessonsShort", { count: course.numberOfLessons })}</span>
```
