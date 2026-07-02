-- 1. 프로필 테이블 생성 (profiles)
-- auth.users 테이블과 1:1 관계를 맺으며, 유저 정보가 삭제되면 자동 삭제(ON DELETE CASCADE)됩니다.
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS(Row Level Security) 설정
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 정책 생성: 사용자는 자신의 프로필 정보만 읽고 쓸 수 있습니다.
CREATE POLICY "사용자는 본인의 프로필만 조회할 수 있습니다." 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "사용자는 본인의 프로필만 수정할 수 있습니다." 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- 2. 회원가입 시 프로필 자동 생성을 위한 트리거 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id, username, phone, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        NEW.email
    );
    RETURN NEW;
END;
$$;

-- 트리거 연결
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. 회원탈퇴를 위한 SECURITY DEFINER 함수 생성
-- 클라이언트 사이드에서 안전하게 본인 계정을 완전히 삭제할 수 있게 해줍니다.
CREATE OR REPLACE FUNCTION public.delete_own_account()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- auth.users에서 삭제하면 profiles 테이블에서도 CASCADE 제약조건에 의해 연쇄 삭제됩니다.
    DELETE FROM auth.users
    WHERE id = auth.uid();
END;
$$;-- 4. 아이디(이메일) 찾기를 위한 SECURITY DEFINER 함수 생성
-- 이름과 연락처를 입력받아 일치하는 가입 이메일을 안전하게 반환합니다.
CREATE OR REPLACE FUNCTION public.find_email_by_name_and_phone(p_name TEXT, p_phone TEXT)
RETURNS TABLE (email TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN QUERY
    SELECT p.email
    FROM public.profiles p
    WHERE p.username = p_name 
      AND regexp_replace(p.phone, '[^0-9]', '', 'g') = regexp_replace(p_phone, '[^0-9]', '', 'g');
END;
$$;

-- 5. 비밀번호 재설정을 위한 SECURITY DEFINER 함수 생성
-- 이메일, 이름, 연락처가 일치하는 경우 안전하게 비밀번호를 변경해 줍니다.
CREATE OR REPLACE FUNCTION public.reset_password_by_identity(
    p_email TEXT,
    p_name TEXT,
    p_phone TEXT,
    p_new_password TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- profiles 테이블에서 이메일, 이름, 전화번호(숫자만 비교)가 모두 일치하는 유저 ID 조회
    SELECT p.id INTO v_user_id
    FROM public.profiles p
    WHERE p.email = p_email 
      AND p.username = p_name 
      AND regexp_replace(p.phone, '[^0-9]', '', 'g') = regexp_replace(p_phone, '[^0-9]', '', 'g');
    
    -- 일치하는 유저가 없으면 false 반환
    IF v_user_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- auth.users 테이블의 encrypted_password를 extensions.crypt 및 extensions.gen_salt를 사용하여 업데이트
    UPDATE auth.users
    SET encrypted_password = extensions.crypt(p_new_password, extensions.gen_salt('bf'))
    WHERE id = v_user_id;
    
    RETURN TRUE;
END;
$$;
