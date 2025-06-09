let isDragging = false;
let startY = 0;
let currentY = 0;
let lastBloodDrop = 0;
let maxDragReached = false;

document.addEventListener('DOMContentLoaded', () => {
    const deadSkin = document.getElementById('dead-skin');
    const flesh = document.getElementById('flesh');
    const bloodContainer = document.getElementById('blood-container');

    function createBloodDrop(x, y) {
        const drop = document.createElement('div');
        drop.className = 'blood-drop';
        drop.style.left = `${x}px`;
        drop.style.top = `${y}px`;
        bloodContainer.appendChild(drop);
        
        const size = 2 + Math.random() * 3;
        const speed = 0.5 + Math.random() * 0.8;
        drop.style.width = `${size}px`;
        drop.style.height = `${size}px`;
        drop.style.animation = `bloodDrip ${speed}s ease-in infinite`;
        
        setTimeout(() => {
            bloodContainer.removeChild(drop);
        }, speed * 1000);
    }

    function handleStart(e) {
        isDragging = true;
        const touch = e.type === 'touchstart' ? e.touches[0] : e;
        startY = touch.clientY - deadSkin.offsetTop;
        deadSkin.classList.add('dragging');
        flesh.style.display = 'block';
        maxDragReached = false;
        e.preventDefault();
    }

    function handleMove(e) {
        if (!isDragging) return;
        
        const touch = e.type === 'touchmove' ? e.touches[0] : e;
        currentY = Math.max(0, touch.clientY - startY);
        currentY = Math.min(currentY, 500);

        deadSkin.style.transform = `translateY(${currentY}px)`;
        flesh.style.height = `${currentY}px`;

        // 检查是否达到最大拖动距离
        if (currentY >= 480 && !maxDragReached) {
            maxDragReached = true;
            setTimeout(() => {
                window.location.href = 'mayuchen1.html';
            }, 500);
        }

        // 根据拖动距离调整血滴生成
        const now = Date.now();
        const dropInterval = Math.max(20, 80 - currentY * 0.2);
        
        if (now - lastBloodDrop > dropInterval) {
            const dropCount = Math.floor(1 + currentY / 40);
            for (let i = 0; i < dropCount; i++) {
                const spreadX = 15 + Math.random() * 30;
                const spreadY = currentY + 80 + Math.random() * 10;
                createBloodDrop(spreadX, spreadY);
            }
            lastBloodDrop = now;
        }
        e.preventDefault();
    }

    function handleEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        deadSkin.classList.remove('dragging');
        
        if (!maxDragReached) {
            deadSkin.style.transform = 'translateY(0)';
            flesh.style.height = '0';
            flesh.style.display = 'none';
        }
        e.preventDefault();
    }

    // 鼠标事件
    deadSkin.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);

    // 触摸事件
    deadSkin.addEventListener('touchstart', handleStart, { passive: false });
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd, { passive: false });
});

// 添加血滴动画样式
const style = document.createElement('style');
style.textContent = `
@keyframes bloodDrip {
    0% {
        transform: scale(1);
        opacity: 0.8;
    }
    50% {
        transform: scale(0.9) translateY(100px);
        opacity: 0.6;
    }
    100% {
        transform: scale(0.7) translateY(200px);
        opacity: 0;
    }
}

.blood-drop {
    position: absolute;
    background: radial-gradient(circle at 50% 30%, 
        rgba(255, 0, 0, 0.8),
        rgba(200, 0, 0, 0.9)
    );
    border-radius: 50%;
    box-shadow: 
        0 0 4px rgba(255, 0, 0, 0.5),
        0 0 6px rgba(255, 0, 0, 0.3);
    transform-origin: center top;
}
`;
document.head.appendChild(style);