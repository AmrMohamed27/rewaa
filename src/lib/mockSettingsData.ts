import { Teacher, GradeItem, SubjectItem, AssistantItem } from "@/types/settings";

export const initialTeachers: Teacher[] = [
  {
    id: "tch-1",
    name: "أ. محمد عبد المعبود",
    phone: "+20 100 123 4567",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    grades: ["grade_10", "grade_11", "grade_12"],
    subjects: ["physics"],
  },
  {
    id: "tch-2",
    name: "د. إيهاب عبد العزيز",
    phone: "+20 111 987 6543",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    grades: ["grade_11", "grade_12"],
    subjects: ["chemistry"],
  },
  {
    id: "tch-3",
    name: "أ. أحمد سرور",
    phone: "+20 122 345 6789",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    grades: ["grade_10", "grade_11"],
    subjects: ["mathematics"],
  },
  {
    id: "tch-4",
    name: "أ. حسن محرم",
    phone: "+20 115 555 4321",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    grades: ["grade_11", "grade_12"],
    subjects: ["biology"],
  },
  {
    id: "tch-5",
    name: "أ. وليد محسن",
    phone: "+20 102 444 8899",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
    grades: ["grade_10", "grade_11", "grade_12"],
    subjects: ["arabic"],
  },
];

export const initialGrades: GradeItem[] = [
  {
    id: "grade_1",
    name: "الصف الأول الابتدائي",
    year: 1,
    studentsCount: 120,
    coursesCount: 4,
    teachersCount: 3,
  },
  {
    id: "grade_2",
    name: "الصف الثاني الابتدائي",
    year: 2,
    studentsCount: 115,
    coursesCount: 4,
    teachersCount: 3,
  },
  {
    id: "grade_3",
    name: "الصف الثالث الابتدائي",
    year: 3,
    studentsCount: 130,
    coursesCount: 5,
    teachersCount: 4,
  },
  {
    id: "grade_4",
    name: "الصف الرابع الابتدائي",
    year: 4,
    studentsCount: 155,
    coursesCount: 6,
    teachersCount: 4,
  },
  {
    id: "grade_5",
    name: "الصف الخامس الابتدائي",
    year: 5,
    studentsCount: 170,
    coursesCount: 6,
    teachersCount: 5,
  },
  {
    id: "grade_6",
    name: "الصف السادس الابتدائي",
    year: 6,
    studentsCount: 185,
    coursesCount: 6,
    teachersCount: 5,
  },
  {
    id: "grade_7",
    name: "الصف الأول الإعدادي",
    year: 7,
    studentsCount: 210,
    coursesCount: 8,
    teachersCount: 6,
  },
  {
    id: "grade_8",
    name: "الصف الثاني الإعدادي",
    year: 8,
    studentsCount: 235,
    coursesCount: 8,
    teachersCount: 6,
  },
  {
    id: "grade_9",
    name: "الصف الثالث الإعدادي",
    year: 9,
    studentsCount: 290,
    coursesCount: 9,
    teachersCount: 7,
  },
  {
    id: "grade_10",
    name: "الصف الأول الثانوي",
    year: 10,
    studentsCount: 340,
    coursesCount: 12,
    teachersCount: 8,
  },
  {
    id: "grade_11",
    name: "الصف الثاني الثانوي",
    year: 11,
    studentsCount: 280,
    coursesCount: 10,
    teachersCount: 6,
  },
  {
    id: "grade_12",
    name: "الصف الثالث الثانوي",
    year: 12,
    studentsCount: 410,
    coursesCount: 15,
    teachersCount: 10,
  },
];

export const initialSubjects: SubjectItem[] = [
  {
    id: "sbj-1",
    name: "الفيزياء",
    coursesCount: 18,
    teachersCount: 5,
  },
  {
    id: "sbj-2",
    name: "الكيمياء",
    coursesCount: 14,
    teachersCount: 4,
  },
  {
    id: "sbj-3",
    name: "الأحياء",
    coursesCount: 12,
    teachersCount: 4,
  },
  {
    id: "sbj-4",
    name: "الرياضيات",
    coursesCount: 22,
    teachersCount: 7,
  },
  {
    id: "sbj-5",
    name: "اللغة العربية",
    coursesCount: 25,
    teachersCount: 8,
  },
  {
    id: "sbj-6",
    name: "اللغة الإنجليزية",
    coursesCount: 20,
    teachersCount: 6,
  },
  {
    id: "sbj-7",
    name: "اللغة الفرنسية",
    coursesCount: 10,
    teachersCount: 3,
  },
  {
    id: "sbj-8",
    name: "التاريخ",
    coursesCount: 8,
    teachersCount: 3,
  },
  {
    id: "sbj-9",
    name: "الجغرافيا",
    coursesCount: 8,
    teachersCount: 3,
  },
  {
    id: "sbj-10",
    name: "الفلسفة والمنطق",
    coursesCount: 6,
    teachersCount: 2,
  },
];

export const initialAssistants: AssistantItem[] = [
  {
    id: "ast-1",
    name: "عمر خالد",
    nationalId: "29801011234567",
    phone: "+20 109 876 5432",
    permissions: ["manage-courses", "manage-exams-and-questions"],
  },
  {
    id: "ast-2",
    name: "نوران إيهاب",
    nationalId: "30105159876543",
    phone: "+20 115 432 1098",
    permissions: ["manage-students", "manage-billing"],
  },
];

export const initialPlatformInfo: import("@/types/settings").PlatformInfo = {
  communication: {
    supportPhone: "+20 100 123 4567",
    whatsappPhone: "+20 100 987 6543",
    facebookUrl: "https://facebook.com/rewaa.edu",
    instagramUrl: "https://instagram.com/rewaa.edu",
    tiktokUrl: "https://tiktok.com/@rewaa.edu",
    customLinks: [
      {
        id: "link-1",
        label: "قناة التليجرام الرسمية",
        url: "https://t.me/rewaa_official",
      },
    ],
  },
  whoWeAre: {
    content: `# عن منصة رواء التعليمية

منصة **رواء** هي المنصة التعليمية الرائدة في تقديم المحتوى الدراسي والدروس التفاعلية لجميع المراحل التعليمية.

### رؤيتنا
تسعى المنصة لتقديم أفضل تجربة تعلم رقمية تجمع بين المعلمين المتميزين والتقنيات الحديثة لتيسير الفهم وتطوير المهارات.

- **دروس تفاعلية وصوتية:** شرح وافٍ وبجودة عالية.
- **بنك أسئلة واختبارات:** نظام تقييم مستمر يضمن تفوق الطالب.
- **متابعة دورية:** تقارير أداء ومتابعة مع المساعدين وأولياء الأمور.
`,
  },
  terms: {
    content: `# الشروط والأحكام لاستخدام منصة رواء

أهلاً بكم في منصة **رواء**. يُرجى قراءة الشروط والأحكام التالية بعناية قبل استخدام خدماتنا:

### 1. الحساب والأمان
- يتحمل المستخدم مسؤولية الحفاظ على سرية بيانات حسابه وكلمة المرور.
- لا يجوز مشاركة الحساب الشخصي مع أي شخص آخر، ويُحظر فتح الحساب من أجهزة متعددة بشكل غير مصرح به.

### 2. حقوق الملكية الفكرية
- جميع الفيديوهات، الملخصات، والاختبارات المتاحة على المنصة هي ملك حصري لمنصة رواء والمعلمين المسجلين بها.
- يمنع منعاً باتاً تسجيل الشاشة أو إعادة توزيع وتصوير أي جزء من المحتوى التعليمي.

### 3. سياسة الاسترجاع والشراء
- يتم شراء الكورسات عبر وسائل الدفع المعتمدة على المنصة (فوري، كروت الائتمان، الأكواد).
- لا يمكن استرداد قيمة الكود أو الكورس بعد التفعيل إلا في الحالات الاستثنائية المعالجة من فريق الدعم.
`,
  },
};

export const initialAnnouncements: import("@/types/settings").AnnouncementItem[] = [
  {
    id: "anc-1",
    title: "انطلاق دورات المراجعة النهائية للصف الثالث الثانوي",
    description:
      "انضمت مجموعة جديدة من دورات المراجعة النهائية المكثفة لشهر مايو في مادة الفيزياء والكيمياء مع أحدث الاختبارات الشاملة.",
    coverImage:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    url: "https://rewaa.edu/courses/revision-2026",
    active: true,
    createdAt: "2026-08-15T10:00:00Z",
  },
  {
    id: "anc-2",
    title: "تحديث بنك الأسئلة والاختبارات التفاعلية",
    description:
      "تم إضافة أكثر من 5000 سؤال جديد مجاب عنه بالتفصيل مع إتاحة خاصية الشرح بالفيديو لكل نموذج إجابة.",
    coverImage:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    url: "",
    active: true,
    createdAt: "2026-08-10T14:30:00Z",
  },
  {
    id: "anc-3",
    title: "خصم خاص على باقات الاشتراك السنوي بمناسبة الترم الجديد",
    description: "استمتع بخصم يصل إلى 30% عند الاشتراك في أكثر من مادتين دراسيتين لفترة محدودة.",
    coverImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    url: "https://rewaa.edu/offers/term-2",
    active: false,
    createdAt: "2026-08-01T09:00:00Z",
  },
];
