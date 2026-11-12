-- Public catalog policies call these helpers; anonymous users resolve to no application profile.
GRANT USAGE ON SCHEMA private TO anon;
GRANT EXECUTE ON FUNCTION private.current_app_user_id() TO anon;
GRANT EXECUTE ON FUNCTION private.current_app_role() TO anon;
