// 动画参数
const ball = document.getElementById('ZX_RAYER');
const ball2 = document.getElementById('LXY_FREELY');


class animation
{
    constructor(ball,dx,dy,x,y)
    {
        this.ball = ball;
        this.x = x;
        this.y = y;
        this.dx = dx; // 水平速度
        this.dy = dy; // 垂直速度
        this.ballSize = 5;
        this.container = document.querySelector('body');

        this.ball.addEventListener('mouseenter', () => {
            this.ball.classList.add('hovered');
        });

        // 鼠标离开：结束悬停
        this.ball.addEventListener('mouseleave', () => {
            this.ball.classList.remove('hovered');
        });

        this.ball.addEventListener('click', () => {
            this.ball.classList.remove('active');
        })
    }

    animate() {

        requestAnimationFrame(this.animate.bind(this));
        if(!this.ball.classList.contains('hovered')) {
            // 更新位置
            this.x += this.dx;
            this.y += this.dy;

            // 检查水平边界碰撞
            if (this.x + this.ballSize >= this.container.clientWidth - 160 || this.x <= 0) {
                this.dx = -this.dx;
                // 确保球不会卡在边界中
                if (this.x <= 0) this.x = 0;
                if (this.x + this.ballSize >= this.container.clientWidth) this.x = this.container.clientWidth - this.ballSize;
            }

            // 检查垂直边界碰撞
            if (this.y + this.ballSize >= this.container.clientHeight - 140 || this.y <= 0) {
                this.dy = -this.dy;
                // 确保球不会卡在边界中
                if (this.y <= 0) this.y = 0;
                if (this.y + this.ballSize >= this.container.clientHeight) this.y = this.container.clientHeight - this.ballSize;
            }

            // 应用新位置
            this.ball.style.left = `${this.x}px`;
            this.ball.style.top = `${this.y}px`;
        }

    }

}
const ball_1 = new animation(ball,2,2,375,275);
const ball_2 = new animation(ball2,-1.5,-2,100,120);
ball_1.animate();
ball_2.animate();

