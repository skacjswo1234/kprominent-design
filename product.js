// 현재 선택된 상품 정보
let currentProduct = null;
let currentAuthData = null;

// 본인인증 관련 변수
let isPhoneVerified = false;
let isCodeVerified = false;

// 상품 카드 클릭 이벤트
document.addEventListener('DOMContentLoaded', function() {
    // 결제 버튼 클릭 이벤트
    document.querySelectorAll('.product-payment-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.product-card');
            const category = card.getAttribute('data-category');
            const size = card.getAttribute('data-size');
            const price = parseInt(card.getAttribute('data-price'));
            
            // 상품 정보 저장
            currentProduct = {
                category: category,
                size: size,
                price: price,
                name: getProductName(category, size),
                description: getProductDescription(category, size)
            };
            
            // 본인인증 모달 표시
            showAuthModal();
        });
    });

    // Top 버튼 기능
    const topBtn = document.getElementById('topBtn');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            topBtn.classList.add('show');
        } else {
            topBtn.classList.remove('show');
        }
    });

    topBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
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

    // 본인인증 모달 요소
    const authModal = document.getElementById('authModal');
    const closeAuthModal = document.getElementById('closeAuthModal');
    const closeAuthBtn = document.getElementById('closeAuthBtn');
    const proceedToPaymentBtn = document.getElementById('proceedToPaymentBtn');
    const sendAuthBtn = document.getElementById('sendAuthBtn');
    const authStatusMessage = document.getElementById('authStatusMessage');
    const authCodeMessage = document.getElementById('authCodeMessage');

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
        document.getElementById('authAgree').checked = false;
    }

    // 본인인증 시작 버튼 클릭
    sendAuthBtn.addEventListener('click', function() {
        const authAgree = document.getElementById('authAgree');
        if (!authAgree.checked) {
            authStatusMessage.textContent = '본인인증 및 결제 진행에 동의해주세요.';
            authStatusMessage.className = 'auth-status-message error';
            return;
        }

        // PG사 심사 안내 모달 표시
        showPgNoticeModal();
    });

    // 포트원 본인인증 요청
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
                isCodeVerified = true;
                
                authStatusMessage.textContent = '본인인증이 완료되었습니다.';
                authStatusMessage.className = 'auth-status-message success';
                
                // 포트원에서 받은 인증 정보 저장
                currentAuthData = {
                    name: rsp.name,
                    phone: rsp.phone,
                    birth: rsp.birthday,
                    certUniqueKey: rsp.unique_key,
                    certUniqueNo: rsp.unique_key_no,
                    certType: rsp.cert_type,
                    verified: true
                };
                
                checkAuthComplete();
                
                authCodeMessage.textContent = '본인인증이 완료되었습니다. 결제를 진행할 수 있습니다.';
                authCodeMessage.className = 'auth-code-message success';
                
            } else {
                // 본인인증 실패
                authStatusMessage.textContent = '본인인증에 실패했습니다: ' + (rsp.error_msg || '알 수 없는 오류');
                authStatusMessage.className = 'auth-status-message error';
                
                if (rsp.error_code) {
                    console.error('포트원 본인인증 에러 코드:', rsp.error_code);
                }
            }
        });
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

    // 본인인증 완료 및 결제 진행 버튼
    proceedToPaymentBtn.addEventListener('click', function() {
        if (!isCodeVerified || !currentAuthData?.verified) {
            alert('본인인증을 완료해주세요.');
            return;
        }

        const authAgree = document.getElementById('authAgree');
        if (!authAgree.checked) {
            alert('본인인증 및 결제 진행에 동의해주세요.');
            return;
        }

        closeAuth();
        setTimeout(() => {
            showPaymentModal();
        }, 300);
    });

    // 본인인증 모달 닫기
    function closeAuth() {
        authModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeAuthModal.addEventListener('click', closeAuth);
    closeAuthBtn.addEventListener('click', closeAuth);
    authModal.addEventListener('click', function(e) {
        if (e.target === authModal) {
            closeAuth();
        }
    });

    // 결제 모달 요소
    const paymentModal = document.getElementById('paymentModal');
    const closePaymentModal = document.getElementById('closePaymentModal');

    // 결제 모달 표시
    function showPaymentModal() {
        if (!currentProduct) return;

        document.getElementById('paymentSummaryName').textContent = currentProduct.name;
        document.getElementById('paymentSummaryPrice').textContent = `${currentProduct.price.toLocaleString()}원`;

        paymentModal.classList.add('active');
        document.body.style.overflow = 'hidden';

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
        if (!currentProduct) return;

        const IMP = window.IMP;
        if (!IMP) {
            alert('결제 시스템을 불러올 수 없습니다. 페이지를 새로고침해주세요.');
            return;
        }

        // 실제 포트원 상점 ID로 변경 필요
        IMP.init('imp00000000'); // TODO: 실제 포트원 상점 ID로 변경

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

        document.getElementById('requestPayBtn').addEventListener('click', function() {
            requestPayment();
        });
    }

    // 결제 요청
    function requestPayment() {
        if (!currentProduct || !currentAuthData) {
            alert('결제 정보가 올바르지 않습니다.');
            return;
        }

        const IMP = window.IMP;

        IMP.request_pay({
            pg: 'html5_inicis', // PG사: html5_inicis(이니시스), kcp, kakaopay 등
            pay_method: 'card', // 결제 수단: card, trans, vbank 등
            merchant_uid: 'merchant_' + new Date().getTime(), // 주문번호 (고유값)
            name: currentProduct.name, // 상품명
            amount: currentProduct.price, // 결제 금액
            buyer_name: currentAuthData.name, // 구매자 이름
            buyer_tel: currentAuthData.phone, // 구매자 전화번호
            buyer_email: '', // 구매자 이메일 (선택사항)
            m_redirect_url: window.location.origin + '/payment/complete', // 결제 완료 후 리다이렉트 URL (선택사항)
        }, function(rsp) {
            if (rsp.success) {
                // 결제 성공
                closePayment();
                showPaymentSuccess();
                currentProduct = null;
                currentAuthData = null;
            } else {
                // 결제 실패
                alert('결제에 실패했습니다: ' + rsp.error_msg);
                console.log('결제 실패:', rsp);
            }
        });
    }

    // PG사 심사 안내 모달
    const pgNoticeModal = document.getElementById('pgNoticeModal');
    const closePgNoticeModal = document.getElementById('closePgNoticeModal');
    const closePgNoticeBtn = document.getElementById('closePgNoticeBtn');

    function showPgNoticeModal() {
        pgNoticeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closePgNoticeModalFunc() {
        pgNoticeModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    closePgNoticeModal.addEventListener('click', closePgNoticeModalFunc);
    closePgNoticeBtn.addEventListener('click', closePgNoticeModalFunc);
    pgNoticeModal.addEventListener('click', function(e) {
        if (e.target === pgNoticeModal) {
            closePgNoticeModalFunc();
        }
    });

    // 결제 성공 모달 표시
    const paymentSuccessModal = document.getElementById('paymentSuccessModal');
    const closePaymentSuccessModal = document.getElementById('closePaymentSuccessModal');
    const closePaymentSuccessBtn = document.getElementById('closePaymentSuccessBtn');

    function showPaymentSuccess() {
        paymentSuccessModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closePaymentSuccess() {
        paymentSuccessModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    closePaymentSuccessModal.addEventListener('click', closePaymentSuccess);
    closePaymentSuccessBtn.addEventListener('click', closePaymentSuccess);
    paymentSuccessModal.addEventListener('click', function(e) {
        if (e.target === paymentSuccessModal) {
            closePaymentSuccess();
        }
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (authModal.classList.contains('active')) {
                closeAuth();
            } else if (paymentModal.classList.contains('active')) {
                closePayment();
            } else if (pgNoticeModal.classList.contains('active')) {
                closePgNoticeModalFunc();
            } else if (paymentSuccessModal.classList.contains('active')) {
                closePaymentSuccess();
            }
        }
    });
});

// 상품명 생성 함수
function getProductName(category, size) {
    const categoryName = category === 'office' ? '사무실·상가' : '아파트·주택';
    const sizeName = size === '70+' ? '70평대 이상' : size + '평대';
    return `${categoryName} 디자인 (${sizeName})`;
}

// 상품 설명 생성 함수
function getProductDescription(category, size) {
    if (category === 'office') {
        return '사무실 및 상가 공간을 위한 전문 인테리어 디자인 서비스입니다.';
    } else {
        return '아파트 및 주택 공간을 위한 전문 인테리어 디자인 서비스입니다.';
    }
}

