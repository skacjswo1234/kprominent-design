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
            const targetId = this.getAttribute('href');
            
            // 외부 페이지로 이동하는 링크는 기본 동작 허용
            if (!targetId.startsWith('#')) {
                // 모바일 메뉴 닫기
                const mobileNav = document.getElementById('mobileNav');
                const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                const mobileNavOverlay = document.getElementById('mobileNavOverlay');
                
                if (mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    mobileNavOverlay.classList.remove('active');
                }
                return; // 기본 동작(페이지 이동) 허용
            }
            
            // 같은 페이지 내 앵커 링크인 경우에만 스크롤 처리
            e.preventDefault();
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

    // 결제 단계별 데이터
    const paymentSteps = {
        1: {
            name: '인테리어 디자인 설계',
            price: 500000,
            description: '공간 분석부터 컨셉 기획, 상세 설계까지 전문 인테리어 디자인을 제공합니다. 고객의 라이프스타일에 맞는 최적의 공간을 설계합니다.',
            image: 'images/pc/h-2.png',
            features: [
                '현장 실측 및 공간 분석',
                '라이프스타일 분석 및 컨설팅',
                '인테리어 컨셉 기획 (2안)',
                '평면도 및 입면도 설계',
                '3D 시뮬레이션 제작',
                '자재 및 색상 제안',
                '가구 배치 계획',
                '조명 계획 및 설계',
                '수정 작업 2회 포함'
            ]
        },
        2: {
            name: '인테리어 시공',
            price: 2000000,
            description: '설계된 디자인을 실제 공간에 구현합니다. 전문 시공팀이 품질과 마감을 책임지며, 공사 진행 상황을 꼼꼼히 관리합니다.',
            image: 'images/pc/h-3.png',
            features: [
                '전문 시공팀 배치',
                '공사 일정 관리',
                '자재 구매 및 관리',
                '현장 감리 및 품질 관리',
                '전기/배관/도배/타일 시공',
                '가구 설치 및 마감 작업',
                '공사 중 수정 작업 2회',
                '공사 완료 검수'
            ]
        },
        3: {
            name: '완공 및 사후관리',
            price: 300000,
            description: '공사 완료 후 최종 점검 및 사후 관리를 제공합니다. 완벽한 마무리와 안심할 수 있는 A/S 서비스를 제공합니다.',
            image: 'images/pc/h-4.png',
            features: [
                '최종 완공 점검',
                '하자 보수 및 마무리 작업',
                '청소 및 정리',
                '사용 설명서 제공',
                'A/S 서비스 1년',
                '자재 보증서 제공',
                '정기 점검 서비스 (분기별)',
                '유지보수 상담'
            ]
        }
    };

    // 현재 선택된 결제 단계
    let currentPaymentStep = null;
    let currentAuthData = null;

    // 결제 상세 모달 요소
    const paymentDetailModal = document.getElementById('paymentDetailModal');
    const closePaymentDetailModal = document.getElementById('closePaymentDetailModal');
    const closePaymentDetailBtn = document.getElementById('closePaymentDetailBtn');
    const proceedToAuthBtn = document.getElementById('proceedToAuthBtn');

    // 본인인증 모달 요소
    const authModal = document.getElementById('authModal');
    const closeAuthModal = document.getElementById('closeAuthModal');
    const closeAuthBtn = document.getElementById('closeAuthBtn');
    const proceedToPaymentBtn = document.getElementById('proceedToPaymentBtn');
    const sendAuthBtn = document.getElementById('sendAuthBtn');
    const authStatusMessage = document.getElementById('authStatusMessage');
    const authCodeMessage = document.getElementById('authCodeMessage');

    // 본인인증 관련 변수
    let authTimerInterval = null;
    let authTimerSeconds = 300; // 5분
    let isPhoneVerified = false;
    let isCodeVerified = false;

    // 결제 모달 요소
    const paymentModal = document.getElementById('paymentModal');
    const closePaymentModal = document.getElementById('closePaymentModal');

    // 결제 버튼은 이제 상품 페이지로 이동하는 링크로 변경되었습니다.
    // 이벤트 리스너는 더 이상 필요하지 않습니다.

    // 결제 상세 화면 표시
    function showPaymentDetail(step) {
        const stepData = paymentSteps[step];
        if (!stepData) return;

        document.getElementById('detailModalTitle').textContent = `${stepData.name} - 결제 상세`;
        document.getElementById('detailStepName').textContent = stepData.name;
        document.getElementById('detailPrice').textContent = `${stepData.price.toLocaleString()}원`;
        document.getElementById('detailDescription').textContent = stepData.description;
        document.getElementById('detailImage').src = stepData.image;
        document.getElementById('detailImage').alt = stepData.name;

        const featuresList = document.getElementById('detailFeatures');
        featuresList.innerHTML = '';
        stepData.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });

        paymentDetailModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // 결제 상세 모달 닫기
    function closePaymentDetail() {
        paymentDetailModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    closePaymentDetailModal.addEventListener('click', closePaymentDetail);
    closePaymentDetailBtn.addEventListener('click', closePaymentDetail);
    paymentDetailModal.addEventListener('click', function(e) {
        if (e.target === paymentDetailModal) {
            closePaymentDetail();
        }
    });

    // 결제하기 버튼 클릭 -> 본인인증 화면으로
    proceedToAuthBtn.addEventListener('click', function() {
        closePaymentDetail();
        setTimeout(() => {
            showAuthModal();
        }, 300);
    });

    // 본인인증 모달 표시
    function showAuthModal() {
        authModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        resetAuthState();
        proceedToPaymentBtn.disabled = true;
    }

    // 본인인증 상태 초기화
    function resetAuthState() {
        isPhoneVerified = false;
        isCodeVerified = false;
        authStatusMessage.textContent = '';
        authStatusMessage.className = 'auth-status-message';
        authCodeMessage.textContent = '';
        authCodeMessage.className = 'auth-code-message';
        sendAuthBtn.disabled = false;
    }

    // 본인인증 시작 버튼 클릭
    sendAuthBtn.addEventListener('click', function() {
        // 동의 체크 확인
        const authAgree = document.getElementById('authAgree');
        if (!authAgree.checked) {
            authStatusMessage.textContent = '본인인증 및 결제 진행에 동의해주세요.';
            authStatusMessage.className = 'auth-status-message error';
            return;
        }

        // 포트원 본인인증 요청 (팝업 방식)
        requestPhoneAuth();
    });

    // 포트원 본인인증 요청 (공식 API 사용)
    function requestPhoneAuth() {
        const IMP = window.IMP;
        if (!IMP) {
            authStatusMessage.textContent = '인증 시스템을 불러올 수 없습니다. 페이지를 새로고침해주세요.';
            authStatusMessage.className = 'auth-status-message error';
            return;
        }

        // 포트원 본인인증 초기화 (실제 상점 ID로 변경 필요)
        IMP.init('imp00000000'); // TODO: 실제 포트원 상점 ID로 변경

        sendAuthBtn.disabled = true;
        authStatusMessage.textContent = '본인인증 창을 열고 있습니다...';
        authStatusMessage.className = 'auth-status-message';

        // 포트원 본인인증 API 호출 (팝업 방식)
        // 포트원 공식 본인인증: IMP.certification() 사용
        // 팝업 창에서 이름, 휴대폰 번호, 생년월일을 입력받습니다
        IMP.certification({
            pg: 'inicis', // 본인인증 PG사: inicis(이니시스), nice, kcp 등
            merchant_uid: 'cert_' + new Date().getTime(), // 본인인증 거래 고유번호
            popup: true, // 팝업 방식 사용
            m_redirect_url: window.location.origin + '/certification/complete' // 인증 완료 후 리다이렉트 URL (선택사항)
        }, function(rsp) {
            sendAuthBtn.disabled = false;
            
            if (rsp.success) {
                // 본인인증 성공
                isPhoneVerified = true;
                isCodeVerified = true; // 포트원 본인인증은 인증 완료 시 바로 완료 처리
                
                authStatusMessage.textContent = '본인인증이 완료되었습니다.';
                authStatusMessage.className = 'auth-status-message success';
                
                // 포트원에서 받은 인증 정보 저장
                currentAuthData = {
                    name: rsp.name, // 포트원에서 받은 이름
                    phone: rsp.phone, // 포트원에서 받은 휴대폰 번호
                    birth: rsp.birthday, // 포트원에서 받은 생년월일
                    certUniqueKey: rsp.unique_key, // 포트원 본인인증 고유키
                    certUniqueNo: rsp.unique_key_no, // 포트원 본인인증 고유번호
                    certType: rsp.cert_type, // 인증 수단 (phone, cert 등)
                    verified: true
                };
                
                // 결제 진행 버튼 활성화 확인
                checkAuthComplete();
                
                // 인증 완료 안내
                authCodeMessage.textContent = '본인인증이 완료되었습니다. 결제를 진행할 수 있습니다.';
                authCodeMessage.className = 'auth-code-message success';
                
            } else {
                // 본인인증 실패
                authStatusMessage.textContent = '본인인증에 실패했습니다: ' + (rsp.error_msg || '알 수 없는 오류');
                authStatusMessage.className = 'auth-status-message error';
                
                // 에러 코드별 안내
                if (rsp.error_code) {
                    console.error('포트원 본인인증 에러 코드:', rsp.error_code);
                }
            }
        });
    }

    // 인증번호 확인 버튼 클릭
    verifyCodeBtn.addEventListener('click', function() {
        const code = authCodeInput.value.trim();
        
        if (code.length !== 6) {
            authCodeMessage.textContent = '인증번호 6자리를 입력해주세요.';
            authCodeMessage.className = 'auth-code-message error';
            return;
        }

        // 인증번호 확인 (실제로는 서버에서 검증해야 함)
        verifyAuthCode(code);
    });

    // 인증번호 확인 (포트원 본인인증에서는 사용하지 않음)
    // 포트원 본인인증은 팝업에서 직접 인증을 완료하므로 이 함수는 사용되지 않습니다.
    function verifyAuthCode(code) {
        // 포트원 본인인증은 IMP.certification() 콜백에서 자동으로 처리됩니다.
        // 이 함수는 레거시 호환성을 위해 유지하지만 실제로는 호출되지 않습니다.
        console.log('포트원 본인인증은 팝업 방식으로 처리되므로 이 함수는 사용되지 않습니다.');
    }

    // 인증 타이머 시작
    function startAuthTimer() {
        authTimerSeconds = 300; // 5분
        updateTimerDisplay();
        
        authTimerInterval = setInterval(function() {
            authTimerSeconds--;
            updateTimerDisplay();
            
            if (authTimerSeconds <= 0) {
                stopAuthTimer();
                authCodeMessage.textContent = '인증 시간이 만료되었습니다. 다시 인증번호를 요청해주세요.';
                authCodeMessage.className = 'auth-code-message error';
                isPhoneVerified = false;
                isCodeVerified = false;
                authCodeGroup.style.display = 'none';
                authCodeInput.value = '';
            }
        }, 1000);
    }

    // 인증 타이머 업데이트
    function updateTimerDisplay() {
        const minutes = Math.floor(authTimerSeconds / 60);
        const seconds = authTimerSeconds % 60;
        authTimer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        if (authTimerSeconds <= 60) {
            authTimer.classList.add('warning');
        } else {
            authTimer.classList.remove('warning');
        }
    }

    // 인증 타이머 중지
    function stopAuthTimer() {
        if (authTimerInterval) {
            clearInterval(authTimerInterval);
            authTimerInterval = null;
        }
        authTimerSeconds = 300;
        authTimer.textContent = '05:00';
        authTimer.classList.remove('warning');
    }

    // 인증 완료 확인
    function checkAuthComplete() {
        if (isCodeVerified && document.getElementById('authAgree').checked) {
            proceedToPaymentBtn.disabled = false;
        } else {
            proceedToPaymentBtn.disabled = true;
        }
    }

    // 동의 체크박스 변경 시
    document.getElementById('authAgree').addEventListener('change', function() {
        checkAuthComplete();
    });


    // 본인인증 모달 닫기 함수 (전역 함수로 만들어서 HTML에서도 호출 가능하도록)
    window.closeAuthModal = function() {
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.classList.remove('active');
        }
        document.body.style.overflow = '';
        
        // 상태 초기화
        if (typeof resetAuthState === 'function') {
            resetAuthState();
        }
        
        const proceedToPaymentBtn = document.getElementById('proceedToPaymentBtn');
        if (proceedToPaymentBtn) {
            proceedToPaymentBtn.disabled = true;
        }
    };

    // 본인인증 모달 닫기 함수 (기존 함수명 유지)
    function closeAuth() {
        window.closeAuthModal();
    }

    // 본인인증 완료 및 결제 진행 버튼
    proceedToPaymentBtn.addEventListener('click', function() {
        // 본인인증 완료 확인
        if (!isCodeVerified || !currentAuthData?.verified) {
            alert('본인인증을 완료해주세요.');
            return;
        }

        const authAgree = document.getElementById('authAgree');
        if (!authAgree.checked) {
            alert('본인인증 및 결제 진행에 동의해주세요.');
            return;
        }

        // 결제 화면으로 이동 (인증 데이터는 이미 currentAuthData에 저장됨)
        closeAuth();
        setTimeout(() => {
            showPaymentModal();
        }, 300);
    });


    // 결제 모달 표시
    function showPaymentModal() {
        if (!currentPaymentStep) return;

        const stepData = paymentSteps[currentPaymentStep];
        document.getElementById('paymentSummaryName').textContent = stepData.name;
        document.getElementById('paymentSummaryPrice').textContent = `${stepData.price.toLocaleString()}원`;

        paymentModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // 포트원 결제 위젯 초기화
        initPortOnePayment();
    }

    // 결제 모달 닫기
    function closePayment() {
        paymentModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    closePaymentModal.addEventListener('click', closePayment);
    paymentModal.addEventListener('click', function(e) {
        if (e.target === paymentModal) {
            closePayment();
        }
    });

    // 포트원 결제 초기화
    function initPortOnePayment() {
        if (!currentPaymentStep) return;

        const stepData = paymentSteps[currentPaymentStep];
        
        // 포트원 결제 위젯 초기화
        // 실제 포트원 상점 ID는 운영 환경에서 설정해야 합니다
        const IMP = window.IMP;
        if (!IMP) {
            alert('결제 시스템을 불러올 수 없습니다. 페이지를 새로고침해주세요.');
            return;
        }

        // 실제 포트원 상점 ID로 변경 필요
        // 포트원 관리자 페이지에서 발급받은 상점 ID를 입력하세요
        IMP.init('imp00000000'); // TODO: 실제 포트원 상점 ID로 변경

        // 결제 위젯 영역에 결제 버튼 생성
        const widgetContainer = document.getElementById('portone-payment-widget');
        widgetContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <h4 style="margin-bottom: 30px; color: var(--text-dark);">결제 수단을 선택해주세요</h4>
                <div style="display: flex; flex-direction: column; gap: 15px; max-width: 400px; margin: 0 auto;">
                    <button id="requestPayBtn" style="
                        padding: 18px;
                        background: linear-gradient(135deg, var(--brown-primary) 0%, var(--brown-dark) 100%);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-size: 1.1rem;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3);
                    ">결제하기</button>
                    <p style="font-size: 0.9rem; color: var(--text-light); margin-top: 20px;">
                        결제는 포트원을 통해 안전하게 처리됩니다.
                    </p>
                </div>
            </div>
        `;

        // 결제 버튼 클릭 이벤트
        document.getElementById('requestPayBtn').addEventListener('click', function() {
            requestPayment();
        });
    }

    // 결제 요청
    function requestPayment() {
        if (!currentPaymentStep || !currentAuthData) {
            alert('결제 정보가 올바르지 않습니다.');
            return;
        }

        const stepData = paymentSteps[currentPaymentStep];
        const IMP = window.IMP;

        // 결제 요청
        // 실제 운영 시 포트원 관리자 페이지에서 설정한 PG사와 결제 수단을 사용하세요
        IMP.request_pay({
            pg: 'html5_inicis', // PG사: html5_inicis(이니시스), kcp, kakaopay 등
            pay_method: 'card', // 결제 수단: card, trans, vbank 등
            merchant_uid: 'merchant_' + new Date().getTime(), // 주문번호 (고유값)
            name: stepData.name, // 상품명
            amount: stepData.price, // 결제 금액
            buyer_name: currentAuthData.name, // 구매자 이름
            buyer_tel: currentAuthData.phone, // 구매자 전화번호
            buyer_email: '', // 구매자 이메일 (선택사항)
            m_redirect_url: window.location.origin + '/payment/complete', // 결제 완료 후 리다이렉트 URL (선택사항)
        }, function(rsp) {
            if (rsp.success) {
                // 결제 성공
                alert('결제가 완료되었습니다!');
                console.log('결제 성공:', rsp);
                
                // 결제 완료 후 처리
                closePayment();
                currentPaymentStep = null;
                currentAuthData = null;
                
                // 성공 메시지 표시 (선택사항)
                showPaymentSuccess();
            } else {
                // 결제 실패
                alert('결제에 실패했습니다: ' + rsp.error_msg);
                console.log('결제 실패:', rsp);
            }
        });
    }

    // 결제 성공 메시지 표시
    function showPaymentSuccess() {
        const successModal = document.createElement('div');
        successModal.className = 'modal-overlay active';
        successModal.style.display = 'flex';
        successModal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h3>결제 완료</h3>
                </div>
                <div class="modal-body" style="text-align: center; padding: 40px;">
                    <div style="font-size: 4rem; margin-bottom: 20px;">✓</div>
                    <h4 style="color: var(--brown-primary); margin-bottom: 15px;">결제가 성공적으로 완료되었습니다!</h4>
                    <p style="color: var(--text-light); line-height: 1.8;">
                        결제 내역은 이메일로 발송됩니다.<br>
                        문의사항이 있으시면 전화로 연락주세요.
                    </p>
                    <div style="margin-top: 30px; padding: 20px; background: var(--beige-light); border-radius: 10px;">
                        <p style="margin: 0; color: var(--text-dark);">
                            전화번호: <a href="tel:1877-0994" style="color: var(--brown-primary); font-weight: bold;">1877-0994</a>
                        </p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove(); document.body.style.overflow = '';">확인</button>
                </div>
            </div>
        `;
        document.body.appendChild(successModal);
        
        // 모달 외부 클릭 시 닫기
        successModal.addEventListener('click', function(e) {
            if (e.target === successModal) {
                successModal.remove();
                document.body.style.overflow = '';
            }
        });
    }

    // ESC 키로 모든 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const authModalEl = document.getElementById('authModal');
            if (paymentDetailModal && paymentDetailModal.classList.contains('active')) {
                closePaymentDetail();
            } else if (authModalEl && authModalEl.classList.contains('active')) {
                authModalEl.classList.remove('active');
                document.body.style.overflow = '';
                resetAuthState();
                if (proceedToPaymentBtn) {
                    proceedToPaymentBtn.disabled = true;
                }
            } else if (paymentModal && paymentModal.classList.contains('active')) {
                closePayment();
            }
        }
    });
});

