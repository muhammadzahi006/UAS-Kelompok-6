-- Link application profiles to Supabase Auth while preserving existing profile IDs.
ALTER TABLE public."User" ADD COLUMN IF NOT EXISTS "authUserId" text;
CREATE UNIQUE INDEX IF NOT EXISTS "User_authUserId_key" ON public."User"("authUserId");
ALTER TABLE public."User" ALTER COLUMN "password" DROP NOT NULL;

ALTER TABLE public."Question" ADD COLUMN IF NOT EXISTS "weight" integer NOT NULL DEFAULT 1;
CREATE UNIQUE INDEX IF NOT EXISTS "QuizAnswer_attemptId_questionId_key"
  ON public."QuizAnswer"("attemptId", "questionId");

DO $$ BEGIN
  ALTER TABLE public."Course" ADD CONSTRAINT "Course_price_nonnegative" CHECK ("price" >= 0);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public."Enrollment" ADD CONSTRAINT "Enrollment_progress_range" CHECK ("progress" >= 0 AND "progress" <= 100);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public."Lesson" ADD CONSTRAINT "Lesson_duration_nonnegative" CHECK ("duration" >= 0);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public."Review" ADD CONSTRAINT "Review_rating_range" CHECK ("rating" >= 1 AND "rating" <= 5);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public."Quiz" ADD CONSTRAINT "Quiz_passingScore_range" CHECK ("passingScore" >= 0 AND "passingScore" <= 100);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public."Question" ADD CONSTRAINT "Question_weight_positive" CHECK ("weight" BETWEEN 1 AND 100);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public."QuizAttempt" ADD CONSTRAINT "QuizAttempt_score_range" CHECK ("score" >= 0 AND "score" <= 100);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated;

CREATE OR REPLACE FUNCTION private.current_app_user_id()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT u.id FROM public."User" AS u WHERE u."authUserId" = auth.uid()::text LIMIT 1
$$;
CREATE OR REPLACE FUNCTION private.current_app_role()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT u.role::text FROM public."User" AS u WHERE u."authUserId" = auth.uid()::text LIMIT 1
$$;
REVOKE ALL ON FUNCTION private.current_app_user_id() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.current_app_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.current_app_user_id() TO authenticated;
GRANT EXECUTE ON FUNCTION private.current_app_role() TO authenticated;

ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Course" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Section" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Lesson" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Enrollment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."LessonProgress" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Certificate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Quiz" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Question" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Option" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."QuizAttempt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."QuizAnswer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."PushSubscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."NotificationQueue" ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_profile_read ON public."User" FOR SELECT TO authenticated
USING (public."User".id = private.current_app_user_id() OR private.current_app_role() = 'ADMIN'
  OR EXISTS (SELECT 1 FROM public."Enrollment" e JOIN public."Course" c ON c.id=e."courseId"
    WHERE e."userId"=public."User".id AND c."instructorId"=private.current_app_user_id()));
CREATE POLICY user_profile_update ON public."User" FOR UPDATE TO authenticated
USING (public."User".id = private.current_app_user_id()) WITH CHECK (public."User".id = private.current_app_user_id());
REVOKE ALL ON public."User" FROM anon, authenticated;
GRANT SELECT (id,name,email,role,avatar,bio,headline,"createdAt","updatedAt") ON public."User" TO authenticated;
GRANT UPDATE (name,avatar,bio,headline) ON public."User" TO authenticated;

CREATE POLICY category_public_read ON public."Category" FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY category_admin_manage ON public."Category" FOR ALL TO authenticated
USING (private.current_app_role()='ADMIN') WITH CHECK (private.current_app_role()='ADMIN');
GRANT SELECT ON public."Category" TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public."Category" TO authenticated;

CREATE POLICY course_read ON public."Course" FOR SELECT TO anon, authenticated
USING ("isPublished" OR "instructorId"=private.current_app_user_id() OR private.current_app_role()='ADMIN');
CREATE POLICY course_insert ON public."Course" FOR INSERT TO authenticated
WITH CHECK ("instructorId"=private.current_app_user_id() AND private.current_app_role() IN ('PENGAJAR','ADMIN'));
CREATE POLICY course_update ON public."Course" FOR UPDATE TO authenticated
USING ("instructorId"=private.current_app_user_id() OR private.current_app_role()='ADMIN')
WITH CHECK ("instructorId"=private.current_app_user_id() OR private.current_app_role()='ADMIN');
CREATE POLICY course_delete ON public."Course" FOR DELETE TO authenticated
USING ("instructorId"=private.current_app_user_id() OR private.current_app_role()='ADMIN');
GRANT SELECT ON public."Course" TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public."Course" TO authenticated;

CREATE POLICY section_read ON public."Section" FOR SELECT TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public."Course" c WHERE c.id="courseId"
  AND (c."isPublished" OR c."instructorId"=private.current_app_user_id() OR private.current_app_role()='ADMIN')));
CREATE POLICY section_instructor_manage ON public."Section" FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public."Course" c WHERE c.id="courseId"
  AND (c."instructorId"=private.current_app_user_id() OR private.current_app_role()='ADMIN')))
WITH CHECK (EXISTS (SELECT 1 FROM public."Course" c WHERE c.id="courseId"
  AND (c."instructorId"=private.current_app_user_id() OR private.current_app_role()='ADMIN')));
GRANT SELECT ON public."Section" TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public."Section" TO authenticated;

CREATE POLICY lesson_read ON public."Lesson" FOR SELECT TO anon, authenticated
USING ("isPreview" AND EXISTS (SELECT 1 FROM public."Section" s JOIN public."Course" c ON c.id=s."courseId"
  WHERE s.id="sectionId" AND c."isPublished")
 OR EXISTS (SELECT 1 FROM public."Section" s JOIN public."Course" c ON c.id=s."courseId"
  WHERE s.id="sectionId" AND (c."instructorId"=private.current_app_user_id() OR private.current_app_role()='ADMIN'
   OR EXISTS (SELECT 1 FROM public."Enrollment" e WHERE e."courseId"=c.id AND e."userId"=private.current_app_user_id()))));
CREATE POLICY lesson_instructor_manage ON public."Lesson" FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public."Section" s JOIN public."Course" c ON c.id=s."courseId"
  WHERE s.id="sectionId" AND (c."instructorId"=private.current_app_user_id() OR private.current_app_role()='ADMIN')))
WITH CHECK (EXISTS (SELECT 1 FROM public."Section" s JOIN public."Course" c ON c.id=s."courseId"
  WHERE s.id="sectionId" AND (c."instructorId"=private.current_app_user_id() OR private.current_app_role()='ADMIN')));
GRANT SELECT ON public."Lesson" TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public."Lesson" TO authenticated;

CREATE POLICY enrollment_read ON public."Enrollment" FOR SELECT TO authenticated
USING ("userId"=private.current_app_user_id() OR private.current_app_role()='ADMIN'
 OR EXISTS (SELECT 1 FROM public."Course" c WHERE c.id="courseId" AND c."instructorId"=private.current_app_user_id()));
CREATE POLICY enrollment_create ON public."Enrollment" FOR INSERT TO authenticated
WITH CHECK ("userId"=private.current_app_user_id() AND EXISTS (SELECT 1 FROM public."Course" c WHERE c.id="courseId" AND c."isPublished"));
CREATE POLICY enrollment_update ON public."Enrollment" FOR UPDATE TO authenticated
USING ("userId"=private.current_app_user_id()) WITH CHECK ("userId"=private.current_app_user_id());
GRANT SELECT, INSERT, UPDATE ON public."Enrollment" TO authenticated;

CREATE POLICY progress_read ON public."LessonProgress" FOR SELECT TO authenticated
USING ("userId"=private.current_app_user_id() OR private.current_app_role()='ADMIN'
 OR EXISTS (SELECT 1 FROM public."Lesson" l JOIN public."Section" s ON s.id=l."sectionId"
 JOIN public."Course" c ON c.id=s."courseId" WHERE l.id="lessonId" AND c."instructorId"=private.current_app_user_id()));
CREATE POLICY progress_create ON public."LessonProgress" FOR INSERT TO authenticated
WITH CHECK ("userId"=private.current_app_user_id() AND EXISTS (SELECT 1 FROM public."Lesson" l JOIN public."Section" s ON s.id=l."sectionId"
 JOIN public."Enrollment" e ON e."courseId"=s."courseId" WHERE l.id="lessonId" AND e."userId"=private.current_app_user_id()));
CREATE POLICY progress_update ON public."LessonProgress" FOR UPDATE TO authenticated
USING ("userId"=private.current_app_user_id()) WITH CHECK ("userId"=private.current_app_user_id());
GRANT SELECT, INSERT, UPDATE ON public."LessonProgress" TO authenticated;

CREATE POLICY review_read ON public."Review" FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY review_write ON public."Review" FOR INSERT TO authenticated
WITH CHECK ("userId"=private.current_app_user_id() AND EXISTS (SELECT 1 FROM public."Enrollment" e WHERE e."courseId"="Review"."courseId" AND e."userId"=private.current_app_user_id()));
CREATE POLICY review_update ON public."Review" FOR UPDATE TO authenticated
USING ("userId"=private.current_app_user_id()) WITH CHECK ("userId"=private.current_app_user_id());
CREATE POLICY review_delete ON public."Review" FOR DELETE TO authenticated
USING ("userId"=private.current_app_user_id() OR private.current_app_role()='ADMIN');
GRANT SELECT ON public."Review" TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public."Review" TO authenticated;

CREATE POLICY certificate_read ON public."Certificate" FOR SELECT TO authenticated
USING ("userId"=private.current_app_user_id() OR private.current_app_role()='ADMIN'
 OR EXISTS (SELECT 1 FROM public."Course" c WHERE c.id="courseId" AND c."instructorId"=private.current_app_user_id()));
GRANT SELECT ON public."Certificate" TO authenticated;

CREATE POLICY quiz_read ON public."Quiz" FOR SELECT TO authenticated
USING (private.current_app_role()='ADMIN' OR EXISTS (SELECT 1 FROM public."Course" c WHERE c.id="courseId"
 AND (c."instructorId"=private.current_app_user_id() OR EXISTS (SELECT 1 FROM public."Enrollment" e WHERE e."courseId"=c.id AND e."userId"=private.current_app_user_id()))));
CREATE POLICY quiz_manage ON public."Quiz" FOR ALL TO authenticated
USING (private.current_app_role()='ADMIN' OR EXISTS (SELECT 1 FROM public."Course" c WHERE c.id="courseId" AND c."instructorId"=private.current_app_user_id()))
WITH CHECK (private.current_app_role()='ADMIN' OR EXISTS (SELECT 1 FROM public."Course" c WHERE c.id="courseId" AND c."instructorId"=private.current_app_user_id()));
GRANT SELECT, INSERT, UPDATE, DELETE ON public."Quiz" TO authenticated;

CREATE POLICY question_read ON public."Question" FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public."Quiz" q JOIN public."Course" c ON c.id=q."courseId" WHERE q.id="quizId"
 AND (private.current_app_role()='ADMIN' OR c."instructorId"=private.current_app_user_id()
 OR EXISTS (SELECT 1 FROM public."Enrollment" e WHERE e."courseId"=c.id AND e."userId"=private.current_app_user_id()))));
CREATE POLICY question_manage ON public."Question" FOR ALL TO authenticated
USING (private.current_app_role()='ADMIN' OR EXISTS (SELECT 1 FROM public."Quiz" q JOIN public."Course" c ON c.id=q."courseId" WHERE q.id="quizId" AND c."instructorId"=private.current_app_user_id()))
WITH CHECK (private.current_app_role()='ADMIN' OR EXISTS (SELECT 1 FROM public."Quiz" q JOIN public."Course" c ON c.id=q."courseId" WHERE q.id="quizId" AND c."instructorId"=private.current_app_user_id()));
GRANT SELECT, INSERT, UPDATE, DELETE ON public."Question" TO authenticated;

CREATE POLICY option_read ON public."Option" FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public."Question" qu JOIN public."Quiz" q ON q.id=qu."quizId" JOIN public."Course" c ON c.id=q."courseId" WHERE qu.id="questionId"
 AND (private.current_app_role()='ADMIN' OR c."instructorId"=private.current_app_user_id()
 OR EXISTS (SELECT 1 FROM public."Enrollment" e WHERE e."courseId"=c.id AND e."userId"=private.current_app_user_id()))));
CREATE POLICY option_manage ON public."Option" FOR ALL TO authenticated
USING (private.current_app_role()='ADMIN' OR EXISTS (SELECT 1 FROM public."Question" qu JOIN public."Quiz" q ON q.id=qu."quizId" JOIN public."Course" c ON c.id=q."courseId" WHERE qu.id="questionId" AND c."instructorId"=private.current_app_user_id()))
WITH CHECK (private.current_app_role()='ADMIN' OR EXISTS (SELECT 1 FROM public."Question" qu JOIN public."Quiz" q ON q.id=qu."quizId" JOIN public."Course" c ON c.id=q."courseId" WHERE qu.id="questionId" AND c."instructorId"=private.current_app_user_id()));
REVOKE ALL ON public."Option" FROM anon, authenticated;
GRANT SELECT (id,"questionId",text) ON public."Option" TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public."Option" TO authenticated;

CREATE POLICY attempt_read ON public."QuizAttempt" FOR SELECT TO authenticated
USING ("userId"=private.current_app_user_id() OR private.current_app_role()='ADMIN'
 OR EXISTS (SELECT 1 FROM public."Quiz" q JOIN public."Course" c ON c.id=q."courseId" WHERE q.id="quizId" AND c."instructorId"=private.current_app_user_id()));
CREATE POLICY attempt_create ON public."QuizAttempt" FOR INSERT TO authenticated
WITH CHECK ("userId"=private.current_app_user_id() AND EXISTS (SELECT 1 FROM public."Quiz" q JOIN public."Enrollment" e ON e."courseId"=q."courseId" WHERE q.id="quizId" AND e."userId"=private.current_app_user_id()));
GRANT SELECT, INSERT ON public."QuizAttempt" TO authenticated;

CREATE POLICY answer_read ON public."QuizAnswer" FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public."QuizAttempt" a WHERE a.id="attemptId" AND (a."userId"=private.current_app_user_id() OR private.current_app_role()='ADMIN'
 OR EXISTS (SELECT 1 FROM public."Quiz" q JOIN public."Course" c ON c.id=q."courseId" WHERE q.id=a."quizId" AND c."instructorId"=private.current_app_user_id()))));
CREATE POLICY answer_create ON public."QuizAnswer" FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public."QuizAttempt" a JOIN public."Question" q ON q."quizId"=a."quizId" WHERE a.id="attemptId" AND a."userId"=private.current_app_user_id() AND q.id="questionId"));
GRANT SELECT, INSERT ON public."QuizAnswer" TO authenticated;

CREATE POLICY push_read ON public."PushSubscription" FOR SELECT TO authenticated
USING ("userId"=private.current_app_user_id());
CREATE POLICY push_write ON public."PushSubscription" FOR INSERT TO authenticated
WITH CHECK ("userId"=private.current_app_user_id());
CREATE POLICY push_update ON public."PushSubscription" FOR UPDATE TO authenticated
USING ("userId"=private.current_app_user_id()) WITH CHECK ("userId"=private.current_app_user_id());
CREATE POLICY push_delete ON public."PushSubscription" FOR DELETE TO authenticated
USING ("userId"=private.current_app_user_id());
GRANT SELECT, INSERT, UPDATE, DELETE ON public."PushSubscription" TO authenticated;

CREATE POLICY notification_admin_read ON public."NotificationQueue" FOR SELECT TO authenticated
USING (private.current_app_role()='ADMIN');
REVOKE ALL ON public."NotificationQueue" FROM anon, authenticated;
