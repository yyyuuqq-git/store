// ESM CDN을 통해 Supabase SDK를 가져옵니다.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// 기본 설정 변수 (사용자가 여기에 직접 입력할 수도 있고, UI 상에서 설정하여 localStorage에 저장할 수도 있습니다.)
const DEFAULT_SUPABASE_URL = 'https://akuhwcdoinfnqpslxqow.supabase.co'; 
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_A0y6unG1oksAg2uYOCIRdQ_x1u0wxvE';

export let supabase = null;

// Supabase 클라이언트 초기화 함수
export function initSupabaseClient(url = null, anonKey = null) {
    let storageUrl = localStorage.getItem('supabase_url');
    let storageKey = localStorage.getItem('supabase_anon_key');
    
    // "undefined", "null" 문자열이나 빈 값 방지
    if (storageUrl === 'undefined' || storageUrl === 'null' || !storageUrl) storageUrl = null;
    if (storageKey === 'undefined' || storageKey === 'null' || !storageKey) storageKey = null;

    const finalUrl = url || storageUrl || DEFAULT_SUPABASE_URL;
    const finalKey = anonKey || storageKey || DEFAULT_SUPABASE_ANON_KEY;

    if (finalUrl && finalKey) {
        try {
            supabase = createClient(finalUrl, finalKey);
            localStorage.setItem('supabase_url', finalUrl);
            localStorage.setItem('supabase_anon_key', finalKey);
            return true;
        } catch (e) {
            console.error('Supabase client initialization failed, falling back to defaults:', e);
            supabase = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);
            localStorage.setItem('supabase_url', DEFAULT_SUPABASE_URL);
            localStorage.setItem('supabase_anon_key', DEFAULT_SUPABASE_ANON_KEY);
            return true;
        }
    }
    return false;
}

// 초기 로드 시 자동으로 초기화 시도
initSupabaseClient();

// --- 1. 회원가입 (Sign Up) ---
export async function signUp(email, password, name, phone, metadata = {}) {
    if (!supabase) throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
    
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            // raw_user_meta_data 필드에 이름과 전화번호를 저장합니다.
            // SQL 트리거에 의해 public.profiles 테이블로 자동 이전됩니다.
            data: {
                name: name,
                phone: phone,
                ...metadata
            }
        }
    });
    
    if (error) throw error;
    return data;
}

// --- 2. 로그인 (Sign In) ---
export async function signIn(email, password) {
    if (!supabase) throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
    
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    
    if (error) throw error;
    return data;
}

// --- 3. 로그아웃 (Sign Out) ---
export async function signOut() {
    if (!supabase) throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

// --- 4. 아이디 찾기 (Find Email) ---
export async function findEmail(name, phone) {
    if (!supabase) throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
    
    // SQL Editor에서 생성한 find_email_by_name_and_phone RPC 함수를 호출합니다.
    const { data, error } = await supabase.rpc('find_email_by_name_and_phone', {
        p_name: name,
        p_phone: phone
    });
    
    if (error) throw error;
    
    // 일치하는 이메일이 있으면 이메일을 반환하고, 없으면 null을 반환합니다.
    return data && data.length > 0 ? data[0].email : null;
}

// --- 5. 비밀번호 변경 (Update Password) ---
export async function updatePassword(newPassword) {
    if (!supabase) throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
    
    const { data, error } = await supabase.auth.updateUser({
        password: newPassword
    });
    
    if (error) throw error;
    return data;
}

// --- 6. 회원탈퇴 (Delete Account) ---
export async function deleteAccount() {
    if (!supabase) throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
    
    // SQL Editor에서 생성한 delete_own_account RPC 함수를 호출합니다.
    const { data, error } = await supabase.rpc('delete_own_account');
    
    if (error) throw error;
    
    // 회원탈퇴 성공 시, 클라이언트 세션도 로그아웃 처리하여 정리합니다.
    await signOut();
    return data;
}

// --- 7. 현재 로그인된 유저 프로필 가져오기 ---
export async function getCurrentUserProfile() {
    if (!supabase) return null;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    // RLS 정책에 따라 현재 로그인한 사용자는 자신의 프로필 데이터만 가져올 수 있습니다.
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
    if (error) {
        console.warn('프로필 테이블 조회 실패:', error.message);
        // 프로필 테이블 조회가 실패하더라도 기본 Auth 정보는 리턴
        return {
            id: user.id,
            email: user.email,
            username: user.user_metadata?.name || '사용자',
            phone: user.user_metadata?.phone || ''
        };
    }
    
    return data;
}

// --- 8. 비밀번호 찾기 및 재설정 (Reset Password by Identity) ---
export async function resetPasswordByIdentity(email, name, phone, newPassword) {
    if (!supabase) throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
    
    const { data, error } = await supabase.rpc('reset_password_by_identity', {
        p_email: email,
        p_name: name,
        p_phone: phone,
        p_new_password: newPassword
    });
    
    if (error) throw error;
    return data; // 성공 시 true, 실패 시 false 반환
}

// --- 9. 상품 목록 조회 (Supabase products 테이블) ---
export async function fetchProducts() {
    if (!supabase) return [];
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) {
            console.warn('상품 테이블 조회 실패 (로컬 더미 폴백 작동):', error.message);
            return [];
        }
        
        // 데이터 형식 변환 (DB 스네이크 케이스 -> JS 카멜 케이스)
        return (data || []).map(p => ({
            id: p.id,
            category: p.category,
            subCategory: p.sub_category,
            subCategoryName: p.sub_category_name,
            name: p.name,
            desc: p.description,
            originalPrice: Number(p.original_price),
            discountRate: Number(p.discount_rate),
            price: Number(p.price),
            rating: Number(p.rating || 5.0),
            reviews: Number(p.reviews || 0),
            tip: p.tip,
            target: p.target,
            delivery: p.delivery,
            bg: p.bg || 'linear-gradient(135deg, #f5f0eb, #e3d3c4)',
            svg: p.svg,
            featured: p.rating >= 4.9
        }));
    } catch (e) {
        console.warn('상품 테이블 조회 중 오류 (로컬 더미 폴백 작동):', e);
        return [];
    }
}

// --- 10. 관리자 신규 상품 등록 (Supabase products 테이블) ---
export async function insertProduct(productData) {
    if (!supabase) throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
    
    // JS 카멜 케이스 -> DB 스네이크 케이스 매핑
    const dbData = {
        id: productData.id,
        category: productData.category,
        sub_category: productData.subCategory,
        sub_category_name: productData.subCategoryName,
        name: productData.name,
        description: productData.desc,
        original_price: productData.originalPrice,
        discount_rate: productData.discountRate,
        price: productData.price,
        rating: productData.rating || 5.0,
        reviews: productData.reviews || 0,
        tip: productData.tip,
        target: productData.target,
        delivery: productData.delivery,
        bg: productData.bg,
        svg: productData.svg
    };

    const { data, error } = await supabase
        .from('products')
        .insert([dbData])
        .select();
        
    if (error) throw error;
    return data;
}


