-- Quiz submission and score calculation run through the authenticated server API.
-- Prevent direct Data API clients from inserting forged grades or answer rows.
REVOKE INSERT, UPDATE, DELETE ON public."QuizAttempt" FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public."QuizAnswer" FROM anon, authenticated;
GRANT SELECT ON public."QuizAttempt" TO authenticated;
GRANT SELECT ON public."QuizAnswer" TO authenticated;
