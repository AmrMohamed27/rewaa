import { ExamComplaint } from "@/types/complaint";

export const mockExamComplaintsData: Record<"ar" | "en", ExamComplaint[]> = {
  ar: [
    {
      id: "comp-001",
      examId: "exam-001",
      studentId: "std-1",
      studentName: "أحمد محمد علي",
      phoneNumber: "+201012345678",
      studentImage:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      complaintTitle: "خطأ في تصحيح السؤال الثالث (قانون أوم)",
      complaintDescription:
        "قمت باختيار الإجابة الصحيحة (2 أمبير) ولكن ظهر لي في النتيجة النهائية أنها إجابة خاطئة وتم خصم 10 درجات، أرجو مراجعة الإجابة النموذجية المسجلة بالسؤال.",
      dateOfComplaint: "2026-08-18T14:30:00Z",
    },
    {
      id: "comp-002",
      examId: "exam-001",
      studentId: "std-2",
      studentName: "سارة محمود إبراهيم",
      phoneNumber: "+201123456789",
      studentImage:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      complaintTitle: "انقطاع الاتصال المفاجئ واحتساب المحاولة",
      complaintDescription:
        "أثناء حل الامتحان حدث انقطاع مفاجئ بالخادم ولم أستطع استكمال باقي الأسئلة وتم إنهاء الامتحان تلقائياً واحتساب محاولتي الوحيدة، أرجو إعادة فتح محاولة إضافية.",
      dateOfComplaint: "2026-08-19T09:15:00Z",
    },
    {
      id: "comp-003",
      examId: "exam-001",
      studentId: "std-3",
      studentName: "عمر خالد يوسف",
      phoneNumber: "+201234567890",
      studentImage:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      complaintTitle: "صورة الدائرة الكهربية لم تكن واضحة",
      complaintDescription:
        "في السؤال الخامس كانت الرسمة المرفقة للدائرة التفرعية ذات دقة منخفضة جداً وأرقام المقاومات غير مقروءة مما تسبب في إجابتي بالخطأ.",
      dateOfComplaint: "2026-08-19T17:45:00Z",
    },
    {
      id: "comp-004",
      examId: "exam-001",
      studentId: "std-4",
      studentName: "نور الدين طارق",
      phoneNumber: "+201099887766",
      studentImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      complaintTitle: "الوقت المخصص للامتحان غير كافٍ للمسائل الحسابية",
      complaintDescription:
        "الامتحان يحتوي على 15 مسألة تتطلب خطوات وقوانين متعددة ووقت الـ 45 دقيقة كان ضيقاً للغاية، نرجو زيادة الوقت في الامتحانات القادمة.",
      dateOfComplaint: "2026-08-20T11:00:00Z",
    },
    {
      id: "comp-005",
      examId: "exam-002",
      studentId: "std-5",
      studentName: "مريم حسن عبد الله",
      phoneNumber: "+201555443322",
      studentImage:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
      complaintTitle: "غموض في صيغة تسمية مركب الألكاين",
      complaintDescription:
        "السؤال الثاني في الجزء المقالي لم يوضح نظام التسمية المطلوب (شائع أم أيوباك IUPAC)، يرجى توضيح صيغة السؤال.",
      dateOfComplaint: "2026-08-17T16:20:00Z",
    },
  ],
  en: [
    {
      id: "comp-001",
      examId: "exam-001",
      studentId: "std-1",
      studentName: "Ahmed Mohamed Ali",
      phoneNumber: "+201012345678",
      studentImage:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      complaintTitle: "Grading Error in Question 3 (Ohm's Law)",
      complaintDescription:
        "I selected the correct option (2 Amperes) but the final report marked it as incorrect and deducted 10 marks. Please review the recorded model answer.",
      dateOfComplaint: "2026-08-18T14:30:00Z",
    },
    {
      id: "comp-002",
      examId: "exam-001",
      studentId: "std-2",
      studentName: "Sara Mahmoud Ibrahim",
      phoneNumber: "+201123456789",
      studentImage:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      complaintTitle: "Connection drop and attempt consumed",
      complaintDescription:
        "During the exam, the connection was interrupted and the test auto-submitted with my single attempt consumed. Please allow an additional retake attempt.",
      dateOfComplaint: "2026-08-19T09:15:00Z",
    },
    {
      id: "comp-003",
      examId: "exam-001",
      studentId: "std-3",
      studentName: "Omar Khaled Youssef",
      phoneNumber: "+201234567890",
      studentImage:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      complaintTitle: "Circuit diagram image was blurry",
      complaintDescription:
        "In question 5, the attached electrical circuit diagram was very low resolution and resistor values were unreadable, causing me to answer incorrectly.",
      dateOfComplaint: "2026-08-19T17:45:00Z",
    },
    {
      id: "comp-004",
      examId: "exam-001",
      studentId: "std-4",
      studentName: "Nour Eldin Tarek",
      phoneNumber: "+201099887766",
      studentImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      complaintTitle: "Allocated time was insufficient for complex calculations",
      complaintDescription:
        "The exam contained 15 multi-step problems and 45 minutes was too tight. Please consider increasing the duration in upcoming tests.",
      dateOfComplaint: "2026-08-20T11:00:00Z",
    },
    {
      id: "comp-005",
      examId: "exam-002",
      studentId: "std-5",
      studentName: "Mariam Hassan Abdullah",
      phoneNumber: "+201555443322",
      studentImage:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
      complaintTitle: "Ambiguity in Alkyne nomenclature prompt",
      complaintDescription:
        "Question 2 did not clarify whether common naming or IUPAC naming was expected. Please update the prompt clarity.",
      dateOfComplaint: "2026-08-17T16:20:00Z",
    },
  ],
};

export function getInitialComplaintsForExam(examId: string, locale: "ar" | "en"): ExamComplaint[] {
  const allLocaleComplaints = mockExamComplaintsData[locale] || mockExamComplaintsData.ar;
  const examComplaints = allLocaleComplaints.filter((c) => c.examId === examId);

  // If specific exam has pre-seeded complaints, return them
  if (examComplaints.length > 0) {
    return examComplaints;
  }

  // Fallback: Generate 3 realistic mock complaints for any newly created or existing exam
  const isAr = locale === "ar";
  return [
    {
      id: `comp-${examId}-1`,
      examId,
      studentId: "std-1",
      studentName: isAr ? "أحمد محمد علي" : "Ahmed Mohamed Ali",
      phoneNumber: "+201012345678",
      studentImage:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      complaintTitle: isAr
        ? "استفسار بخصوص درجة السؤال الأخير"
        : "Inquiry regarding the last question grade",
      complaintDescription: isAr
        ? "أعتقد أن هناك خطأ في حساب النسبة المئوية للسؤال الأخير، أرجو إعادة المراجعة."
        : "I believe there is an issue with the calculated percentage on the last question, please review.",
      dateOfComplaint: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: `comp-${examId}-2`,
      examId,
      studentId: "std-2",
      studentName: isAr ? "سارة محمود إبراهيم" : "Sara Mahmoud Ibrahim",
      phoneNumber: "+201123456789",
      studentImage:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      complaintTitle: isAr ? "بطء في تحميل صور الأسئلة" : "Slow loading time for question images",
      complaintDescription: isAr
        ? "استغرق تحميل الصور وقتاً طويلاً أثناء الامتحان مما أثر على الوقت المتبقي للإجابة."
        : "Images took excessive time to render during the exam which impacted the remaining time.",
      dateOfComplaint: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
  ];
}
