document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
    const msg = document.getElementById('authMessage');
    const submitBtn = document.getElementById('loginSubmit');

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');

    if (mobileMenuBtn && mobileNav && mobileNavOverlay) {
        mobileMenuBtn.addEventListener('click', function () {
            mobileNav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            mobileNavOverlay.classList.toggle('active');
        });
        mobileNavOverlay.addEventListener('click', function () {
            mobileNav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            mobileNavOverlay.classList.remove('active');
        });
    }

    function showError(text) {
        msg.textContent = text;
        msg.hidden = false;
        msg.classList.add('auth-message--error');
        msg.classList.remove('auth-message--ok');
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        msg.hidden = true;

        const userId = document.getElementById('userId').value.trim();
        const password = document.getElementById('password').value;

        submitBtn.disabled = true;
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, password }),
            });
            const data = await res.json().catch(function () {
                return {};
            });
            if (!res.ok) {
                showError(data.error || '로그인에 실패했습니다.');
                return;
            }
            window.location.href = 'product.html';
        } catch (err) {
            showError('네트워크 오류가 발생했습니다.');
        } finally {
            submitBtn.disabled = false;
        }
    });
});
