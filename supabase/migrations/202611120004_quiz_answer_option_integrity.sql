CREATE UNIQUE INDEX IF NOT EXISTS "Option_id_questionId_key"
  ON public."Option"(id, "questionId");
DO $$ BEGIN
  ALTER TABLE public."QuizAnswer"
    ADD CONSTRAINT "QuizAnswer_selectedOption_question_fkey"
    FOREIGN KEY ("selectedOptionId", "questionId")
    REFERENCES public."Option"(id, "questionId") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
