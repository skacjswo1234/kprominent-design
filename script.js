// 문의폼 제출 처리
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 개인정보 동의 체크 확인
    const privacyAgree = document.getElementById('privacyAgree');
    if (!privacyAgree.checked) {
        alert('개인정보 수집 및 이용에 동의해주세요.');
        privacyAgree.focus();
        return;
    }
    
    // 안내 모달 표시 (문의하기 버튼 클릭 시)
    const noticeModal = document.getElementById('noticeModal');
    const authNotice = document.getElementById('authNotice');
    authNotice.style.display = 'block'; // 본인인증 안내 문구 표시
    noticeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// 스크롤 애니메이션 (선택사항)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 이미지 섹션에 애니메이션 적용
document.addEventListener('DOMContentLoaded', function() {
    const imageSections = document.querySelectorAll('.image-section');
    imageSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Top 버튼 기능
    const topBtn = document.getElementById('topBtn');
    
    // 스크롤 시 Top 버튼 표시/숨김
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            topBtn.classList.add('show');
        } else {
            topBtn.classList.remove('show');
        }
    });

    // Top 버튼 클릭 시 맨 위로 스크롤
    topBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 네비게이션 링크 클릭 시 스크롤
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }

            // 모바일 메뉴 닫기
            const mobileNav = document.getElementById('mobileNav');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const mobileNavOverlay = document.getElementById('mobileNavOverlay');
            
            if (mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileNavOverlay.classList.remove('active');
            }
        });
    });

    // 모바일 메뉴 토글
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');

    mobileMenuBtn.addEventListener('click', function() {
        mobileNav.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        mobileNavOverlay.classList.toggle('active');
    });

    mobileNavOverlay.addEventListener('click', function() {
        mobileNav.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
    });

    // 개인정보 처리방침 모달
    const privacyModal = document.getElementById('privacyModal');
    const privacyLink = document.getElementById('privacyLink');
    const closePrivacyModal = document.getElementById('closePrivacyModal');
    const closePrivacyModalBtn = document.getElementById('closePrivacyModalBtn');

    // 모달 열기
    privacyLink.addEventListener('click', function(e) {
        e.preventDefault();
        privacyModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // 스크롤 방지
    });

    // 모달 닫기
    function closeModal() {
        privacyModal.classList.remove('active');
        document.body.style.overflow = ''; // 스크롤 복원
    }

    closePrivacyModal.addEventListener('click', closeModal);
    closePrivacyModalBtn.addEventListener('click', closeModal);

    // 모달 외부 클릭 시 닫기
    privacyModal.addEventListener('click', function(e) {
        if (e.target === privacyModal) {
            closeModal();
        }
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && privacyModal.classList.contains('active')) {
            closeModal();
        }
    });

    // 본인인증 버튼 클릭 이벤트
    const verifyBtn = document.getElementById('verifyBtn');
    const noticeModal = document.getElementById('noticeModal');
    const closeNoticeModal = document.getElementById('closeNoticeModal');
    const closeNoticeModalBtn = document.getElementById('closeNoticeModalBtn');

    // 본인인증 버튼 클릭 시 안내 모달 표시
    verifyBtn.addEventListener('click', function() {
        const authNotice = document.getElementById('authNotice');
        authNotice.style.display = 'none'; // 본인인증 버튼 클릭 시에는 숨김
        noticeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // 안내 모달 닫기
    function closeNoticeModalFunc() {
        noticeModal.classList.remove('active');
        document.body.style.overflow = '';
        // 모달 닫을 때 본인인증 안내 문구도 숨김
        const authNotice = document.getElementById('authNotice');
        authNotice.style.display = 'none';
    }

    closeNoticeModal.addEventListener('click', closeNoticeModalFunc);
    closeNoticeModalBtn.addEventListener('click', closeNoticeModalFunc);

    // 안내 모달 외부 클릭 시 닫기
    noticeModal.addEventListener('click', function(e) {
        if (e.target === noticeModal) {
            closeNoticeModalFunc();
        }
    });

    // ESC 키로 안내 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && noticeModal.classList.contains('active')) {
            closeNoticeModalFunc();
        }
    });
});

