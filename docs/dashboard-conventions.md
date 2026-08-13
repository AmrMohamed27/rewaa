# Dashboard Architecture, Design Conventions & Component Reuse Guide

This document serves as the authoritative blueprint for building, extending, and maintaining module pages across the dashboard application (e.g., Courses, Lessons, Exams, Assignments, Students). It details coding conventions, reusable component abstractions, page-level design patterns (List, Details, New, Edit), state management, and localization rules.

---

## 1. Core Application Conventions

### 1.1 Tech Stack & Directory Structure

- **Framework**: Next.js (App Router with `[locale]` dynamic route prefix).
- **Styling**: Vanilla Tailwind CSS + Shadcn UI primitives + custom CSS variables.
- **Package Manager**: `pnpm` (run `pnpm exec tsc --noEmit` and `pnpm lint`).
- **Icons**: `lucide-react`.
- **Localization**: `next-intl` with JSON dictionaries in `messages/en.json` and `messages/ar.json`.

### 1.2 Layout & Directionality (RTL / LTR)

- All pages must support both English (LTR) and Arabic (RTL).
- Use logical Tailwind utilities (`ms-auto`, `pe-3`, `ps-2`, `space-x-reverse`) or standard flex gap spacing (`gap-3`) instead of hardcoded `ml-*` / `mr-*`.
- For directional icons (e.g., `<ArrowLeft />`), apply `rtl:rotate-180` so the arrow flips automatically in Arabic without conditional JS logic.

### 1.3 Strict Localization Rule

- **Zero Hardcoded Strings**: Every text label, button, badge, tooltip, placeholder, and empty state must be localized via `useTranslations()` or `getTranslations()`.
- **Safe Key Guarding**: When resolving dynamic or model-provided keys with `next-intl`, check `.has()` before calling the translation function to prevent missing message exceptions:
  ```tsx
  const formatGrade = (key?: string) => {
    if (!key) return "";
    return tGrades.has(key as Parameters<typeof tGrades.has>[0])
      ? tGrades(key as Parameters<typeof tGrades>[0])
      : key; // Safe fallback if already a display string
  };
  ```
- **ICU Pluralization**: Follow the 6 Arabic count forms (`zero`, `one`, `two`, `few`, `many`, `other`) in JSON translation files:
  ```json
  "lessonsCount": "{count, plural, =0 {لا دروس} zero {لا دروس} one {درس واحد} two {درسين} few {{count} دروس} many {{count} درساً} other {{count} درس}}"
  ```
- **Component Usage**: Always pass `{ count }` as an object argument to `t()`:
  ```tsx
  <span>{t("lessonsCount", { count: section.lessons.length })}</span>
  ```

---

## 2. Standardized Navigation & Header UI Patterns

### 2.1 Standard Back Button Navigation

All sub-pages across the app (Details, Creation, and Edit pages) MUST use the exact single standardized round icon button for navigating back to a parent page:

```tsx
<Button asChild variant="outline" size="icon" className="h-9 w-9 rounded-full shrink-0">
  <Link href={parentPath}>
    <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
  </Link>
</Button>
```

- **Placement**: Always place adjacent to the page's main `<h1>` title inside a flex container (`flex items-center gap-3`).
- **Rotation**: `rtl:rotate-180` automatically handles RTL arrow direction.

---

## 3. Reusable UI Components Catalog

| Component              | File Path                                    | Purpose & Props                                                                    | Usage Guidance                                                                     |
| :--------------------- | :------------------------------------------- | :--------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------- |
| **FormSectionCard**    | `src/components/ui/form-section-card.tsx`    | Card wrapper for form sections with an icon, title, description, and slot content. | Use on all creation & edit forms to split input fields into logical sections.      |
| **FormToggleSetting**  | `src/components/ui/form-toggle-setting.tsx`  | Switch setting row with label, subtitle description, and boolean`checked` state.   | Use for any toggle features (e.g. PDF attachment toggle, exam linking, free/paid). |
| **FormRadioGroup**     | `src/components/ui/form-radio-group.tsx`     | Card-styled radio option selector with title and subtitle.                         | Use for selecting modes (e.g., Lesson Type: Video & Text vs. Text Only).           |
| **FormMarkdownEditor** | `src/components/ui/form-markdown-editor.tsx` | Rich MDX Markdown editor with formatting toolbar and Live Preview mode.            | Use for long-form description fields.                                              |
| **MarkdownViewer**     | `src/components/ui/markdown-viewer.tsx`      | Sanitized, styled Markdown & LaTeX math viewer ($...$ and                          |

$$
...
$$

). | Use on detail overview cards to render formatted description content. |
| **DashboardCard** | `src/components/dashboard/overview/dashboard-card.tsx` | Standardized elevated container card with border and subtle shadow. | Universal container for metrics, overview, sidebars, and list cards. |
| **CoursePagination** | `src/components/dashboard/courses/course-pagination.tsx` | Reusable pagination control bar showing item ranges and page navigation buttons. | Pass`currentPage`, `totalPages`, `onPageChange`, `pageSize`, `totalItems`, and `showingText`. |
| **CourseFiltersBar** | `src/components/dashboard/courses/course-filters-bar.tsx` | Filter toolbar with search input, grade/subject/venue dropdowns, reset button, and view mode toggle. | Adapt for any entity list page needing multi-attribute filtering. |

---

## 4. Page Archetypes Blueprint

### 4.1 Archetype 1: Entity List Page (`/dashboard/[entity]`)

#### Layout & Visual Design

- **Top Header**: Page `<h1>` title, descriptive subtitle, and primary CTA button (e.g., `+ Create New Lesson`).
- **Filters & Search Toolbar**: Integrated search input + filter selects (Grade, Subject, Venue, Status) + Reset Filters button.
- **Card Grid / List View**: Responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`).
- **Entity Card Anatomy**:
  - Image banner / thumbnail with category badge.
  - Title and venue badge (`Online`, `Center`, `All`).
  - Key attributes grid (Instructor, Grade, Subject, Item Counts).
  - Action dropdown menu (`Edit`, `View Details`, `Copy Link`, `Delete`).
  - Primary button (`View Details`).
- **Empty State**: Centered icon, title, description, and "Reset Filters" / "Create Entity" CTA when filtered results are empty.
- **Pagination Footer**: `CoursePagination` component anchored at the bottom.

#### State & Storage Pattern

```tsx
// Load entity data from LocalStorage with fallback to initial mock dataset
const [items, setItems] = useState<Entity[]>([]);

useEffect(() => {
  setItems(getStoredItems(locale));

  // Listen for custom cross-component update events
  const handleUpdate = () => setItems(getStoredItems(locale));
  window.addEventListener("rewaa_items_updated", handleUpdate);
  return () => window.removeEventListener("rewaa_items_updated", handleUpdate);
}, [locale]);
```

---

### 4.2 Archetype 2: Entity Details Page (`/dashboard/[entity]/[id]`)

#### Layout & Visual Design

- **Header Row**:
  - Standardized round Back Button (`<Button size="icon" className="rounded-full">`).
  - Title `<h1>` and Status Badge (`Published`, `Draft`, `Scheduled`).
  - Action Button (`Edit Entity`).
- **Main 2-Column Grid (`lg:grid-cols-12 gap-6`)**:
  - **Left Column (8 Cols)**:
    1. **Hero / Media Player Card**:
       - If a video link is present, render a responsive aspect-video iframe using `getEmbedUrl(url)` with YouTube/Vimeo embed support and an external link fallback.
       - If cover image only, render an aspect-video image banner with price/category overlays.
    2. **Overview Card (`DashboardCard`)**:
       - Section heading + `MarkdownViewer` rendering formatted markdown content.
    3. **Content Accordion Card (`DashboardCard`)**:
       - Collapsible accordion items for sections, chapters, or lessons.
       - Each lesson item features metadata badges (e.g. `Reading Material`, `PDF (2)`, `Exam`) and an explicit localized `<Link href="...">` to `"View Details"`.
  - **Right Column (4 Cols - Sidebar)**:
    1. **Key Statistics Grid (`DashboardCard`)**: 2x2 grid displaying enrolled students, total lessons, completion rates, and estimated revenue.
    2. **Metadata Card (`DashboardCard`)**: Structured list of metadata attributes (Instructor, Grade, Subject, Venue, Category, Linked Parent Entity, Access Validity).

---

### 4.3 Archetype 3: Creation & Edit Pages (`/dashboard/[entity]/new` & `/dashboard/[entity]/[id]/edit`)

#### Layout & Visual Design

- **Header Row**:
  - Standardized round Back Button (`<Button size="icon" className="rounded-full">`).
  - Page `<h1>` title (e.g., `Create New Lesson` vs `Edit Lesson`) + subtitle description.
- **Single-Column Form Container (`max-w-4xl mx-auto space-y-6`)**:
- **Form Section Cards (`FormSectionCard`)**:
  1. **Type / Category Selection**: `FormRadioGroup` cards to choose item type.
  2. **Main Information**: Title input, `FormMarkdownEditor` for description.
  3. **Media & Cover Image Upload**:
     - **Interactive Upload & Replace Dropzone**:

       ```tsx
       <div className="relative border-2 border-dashed border-input hover:border-primary/50 transition-colors rounded-xl p-4 flex flex-col items-center justify-center gap-2 bg-muted/20 text-center">
         {coverImage ? (
           <div className="flex flex-col items-center gap-2 w-full">
             <div className="relative w-full max-w-xs h-36 rounded-lg overflow-hidden border shadow-xs">
               <Image src={coverImage} alt="Cover preview" fill className="object-cover" unoptimized />
             </div>
             <span className="text-xs font-semibold text-primary flex items-center gap-1">
               <Upload className="size-3.5" />
               <span>{tCourses("new.fields.coverImageDrag")}</span>
             </span>
           </div>
         ) : (
           /* Dropzone prompt */
         )}
         {/* Transparent file input overlay covering the entire dropzone */}
         <input
           type="file"
           accept="image/*"
           onChange={handleCoverImageChange}
           className="absolute inset-0 size-full opacity-0 cursor-pointer"
         />
       </div>
       ```

       - Allows users to click anywhere on the container or drop a file to instantly change/replace the image.
       - A text `Input` below allows pasting/editing a direct image URL.

  4. **Category & Linking Constraints**:
     - If created inside a parent context (e.g., creating a lesson inside a course), auto-fill and lock category options (`course-dependent`) and show a locked badge.
  5. **Academic & Organization Info**: Dropdowns for Grade, Subject, Venue, Teacher, and Publish Status (`Published`, `Draft`, `Scheduled` with datetime-local picker).
  6. **Attachments & Exams**: `FormToggleSetting` switches for PDF upload (with minimum 1 PDF validation), explanatory image uploads, and linked backend exams.

- **Sticky / Bottom Action Bar**: `Cancel` button (outline link back to list) + `Submit` button (`Create Entity` / `Save Changes`).

---

## 5. Relational Data Model & Foreign Keys

### 5.1 Relational Linkage Architecture

Child entities (e.g., Lessons) are linked to parent entities (e.g., Courses and Sections) via foreign key fields:

```ts
export interface Lesson {
  id: string;
  title: string;
  lessonCategory?: "independent" | "course-dependent";
  courseId?: string; // Foreign key referencing Course.id
  courseTitle?: string; // Denormalized course title for fast display
  sectionId?: string; // Foreign key referencing CourseSection.id
  // ...other fields
}
```

### 5.2 Dynamic Query Populators

In mock data modules (`mockCoursesData.ts`), course sections pull child entities dynamically using foreign key filters rather than static duplicate objects:

```ts
const getSectionLessons = (locale: "ar" | "en", courseId: string, sectionId: string): Lesson[] => {
  return mockLessonsData[locale].filter(
    (lesson) => lesson.courseId === courseId && lesson.sectionId === sectionId,
  );
};
```

This guarantees 100% data parity between course detail views and standalone detail pages. Updating a lesson in localStorage immediately reflects across both views.

---

## 6. Quick Checklist for Adding New Modules

- [ ] Defined model TypeScript interfaces in `@/types/[entity].ts`.
- [ ] Created mock dataset in `@/lib/mock[Entity]Data.ts` with `ar` and `en` records.
- [ ] Created localStorage state manager in `@/lib/[entity]-storage.ts` with custom event dispatching (`rewaa_[entity]_updated`).
- [ ] Built Card component (`[entity]-card.tsx`) using `DashboardCard`, badges, and localized string formatters.
- [ ] Built List Page (`/dashboard/[entity]/page.tsx`) with search, filter toolbar, card grid, empty state, and `CoursePagination`.
- [ ] Built Details Page (`/dashboard/[entity]/[id]/page.tsx`) with standardized round Back Button, Video Iframe / Banner, `MarkdownViewer`, statistics grid, and metadata sidebar.
- [ ] Built Creation / Edit Page (`/dashboard/[entity]/new` & `/dashboard/[entity]/[id]/edit`) using `FormSectionCard`, interactive cover image dropzone, toggle settings, and validated submit action bar.
- [ ] Localized all text in `messages/en.json` and `messages/ar.json` (0 hardcoded strings).
- [ ] Added standard round Back Button on all sub-pages with `rtl:rotate-180`.
- [ ] Verified build and linter: `pnpm exec tsc --noEmit` and `pnpm lint`.
