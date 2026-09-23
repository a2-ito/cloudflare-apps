"use client";

import { useEffect, useRef, useState } from "react";

type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
};

const INITIAL_BALL_COUNT = 5;

// Reset ボタンから canvas の描画ループ内の状態を初期化するため、window 経由で公開している。
declare global {
  interface Window {
    resetBalls?: () => void;
  }
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [friction, setFriction] = useState(1.0);
  const frictionRef = useRef(1.0);
  const gravityRef = useRef(false);
  const ballsRef = useRef<Ball[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const width = 600;
    const height = 400;

    const RESTITUTION = 0.9;
    const GRAVITY = 0.3;

    canvas.width = width;
    canvas.height = height;

    function createBall(x?: number, y?: number) {
      ballsRef.current.push({
        x: x ?? Math.random() * width,
        y: y ?? Math.random() * height,
        vx: (Math.random() * 5 + 2) * (Math.random() < 0.5 ? -1 : 1),
        vy: Math.random() * 2,
        radius: 10 + Math.random() * 10,
      });
    }

    function resetBalls() {
      ballsRef.current = [];
      for (let i = 0; i < INITIAL_BALL_COUNT; i++) {
        createBall();
      }
    }

    resetBalls();

    function handleBallCollision(b1: Ball, b2: Ball) {
      const dx = b2.x - b1.x;
      const dy = b2.y - b1.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = b1.radius + b2.radius;

      if (dist < minDist) {
        const tempVx = b1.vx;
        const tempVy = b1.vy;
        b1.vx = b2.vx;
        b1.vy = b2.vy;
        b2.vx = tempVx;
        b2.vy = tempVy;

        const restitution = frictionRef.current === 1 ? 1 : RESTITUTION;

        b1.vx *= restitution;
        b1.vy *= restitution;
        b2.vx *= restitution;
        b2.vy *= restitution;

        const overlap = minDist - dist;
        const nx = dx / dist;
        const ny = dy / dist;

        b1.x -= (nx * overlap) / 2;
        b1.y -= (ny * overlap) / 2;
        b2.x += (nx * overlap) / 2;
        b2.y += (ny * overlap) / 2;
      }
    }

    function update() {
      const balls = ballsRef.current;
      const restitution = frictionRef.current === 1 ? 1 : RESTITUTION;

      for (const ball of balls) {
        if (gravityRef.current) {
          ball.vy += GRAVITY;
        }

        ball.x += ball.vx;
        ball.y += ball.vy;

        // 摩擦
        if (frictionRef.current < 1) {
          ball.vx *= frictionRef.current;
          ball.vy *= frictionRef.current;
        }

        // 壁
        if (ball.x - ball.radius < 0 || ball.x + ball.radius > width) {
          ball.vx *= -restitution;
        }

        if (ball.y - ball.radius < 0 || ball.y + ball.radius > height) {
          ball.vy *= -restitution;
        }
      }

      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          handleBallCollision(balls[i], balls[j]);
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = "#888";
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, width, height);

      for (const ball of ballsRef.current) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#4f46e5";
        ctx.fill();
      }
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }

    loop();

    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      createBall(e.clientX - rect.left, e.clientY - rect.top);
    });

    // 🔥 リセットをグローバルに公開
    window.resetBalls = resetBalls;
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-3 bg-gray-100 dark:bg-black">
      <h1 className="text-2xl">BounceLab</h1>

      <div className="flex gap-3 text-sm">
        <div className="flex items-center gap-2 text-sm">
          <span>Friction</span>

          <button
            className="px-2 border rounded"
            onClick={() => {
              const v = Math.max(0.95, +(friction - 0.001).toFixed(3));
              setFriction(v);
              frictionRef.current = v;
            }}
          >
            −
          </button>

          <input
            type="number"
            step="0.001"
            min="0.95"
            max="1"
            value={friction}
            onChange={(e) => {
              const v = Number(e.target.value);
              setFriction(v);
              frictionRef.current = v;
            }}
            className="w-20 text-center border rounded"
          />

          <button
            className="px-2 border rounded"
            onClick={() => {
              const v = Math.min(1, +(friction + 0.001).toFixed(3));
              setFriction(v);
              frictionRef.current = v;
            }}
          >
            +
          </button>
        </div>

        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            onChange={(e) => {
              gravityRef.current = e.target.checked;
            }}
          />
          Gravity
        </label>

        <button
          className="px-3 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => {
            window.resetBalls?.();
          }}
        >
          Reset
        </button>
      </div>

      <canvas ref={canvasRef} className="border border-gray-500 bg-white" />
    </main>
  );
}
