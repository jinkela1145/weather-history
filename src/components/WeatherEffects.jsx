
import React, { useEffect, useRef } from 'react';

const WeatherEffects = ({ condition, intensity = 'medium', isDay = true, isDusk = false }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        // Resize canvas
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        // Particle configuration based on condition and intensity
        const getParticleConfig = () => {
            let count = 0;
            let speed = 0;
            let type = 'none';

            const lowerCondition = condition.toLowerCase();

            if (lowerCondition.includes('rain')) {
                type = 'rain';
                count = intensity === 'heavy' ? 800 : intensity === 'light' ? 100 : 400;
                speed = intensity === 'heavy' ? 15 : intensity === 'light' ? 8 : 12;
            } else if (lowerCondition.includes('snow')) {
                type = 'snow';
                count = intensity === 'heavy' ? 400 : intensity === 'light' ? 50 : 200;
                speed = intensity === 'heavy' ? 3 : intensity === 'light' ? 1 : 2;
            }

            return { type, count, speed };
        };

        const config = getParticleConfig();

        // Initialize particles
        for (let i = 0; i < config.count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                length: Math.random() * 20 + 10,
                speed: Math.random() * config.speed + config.speed / 2,
                opacity: Math.random() * 0.5 + 0.1
            });
        }

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw particles
            if (config.type === 'rain') {
                ctx.strokeStyle = 'rgba(174, 194, 224, 0.5)';
                ctx.lineWidth = 1;
                particles.forEach(p => {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x, p.y + p.length);
                    ctx.stroke();

                    p.y += p.speed;
                    if (p.y > canvas.height) {
                        p.y = -p.length;
                        p.x = Math.random() * canvas.width;
                    }
                });
            } else if (config.type === 'snow') {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                particles.forEach(p => {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, Math.random() * 2 + 1, 0, Math.PI * 2);
                    ctx.fill();

                    p.y += p.speed;
                    p.x += Math.sin(p.y * 0.01) * 0.5; // Drift

                    if (p.y > canvas.height) {
                        p.y = -5;
                        p.x = Math.random() * canvas.width;
                    }
                });
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [condition, intensity]);

    // Background Gradients
    const getBackground = () => {
        if (isDusk) return 'linear-gradient(to bottom, #3b2f4a, #1a1425)'; // Purple/Orange dusk
        if (!isDay) return 'linear-gradient(to bottom, #0b131e, #000000)'; // Night

        // Day variations
        const lowerCondition = condition.toLowerCase();
        if (lowerCondition.includes('rain') || lowerCondition.includes('cloud')) {
            return 'linear-gradient(to bottom, #cfd9df, #e2ebf0)'; // Cloudy Grey/Blue
        }
        return 'linear-gradient(to bottom, #4facfe, #00f2fe)'; // Sunny Blue
    };

    // Sun/Glow Effect
    const isSunny = condition.toLowerCase().includes('sun') || condition.toLowerCase().includes('clear');

    return (
        <div className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000">
            {/* Base Background Layer - Handled by parent or here? keeping purely effects here usually better, but for full screen takeover: */}
            {/* We will let App/WeatherPage handle main BG color, this component adds overlays */}

            {/* Sun Glow */}
            {isDay && isSunny && !isDusk && (
                <div
                    className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px] opacity-60"
                    style={{ background: 'radial-gradient(circle, rgba(255,210,100,0.8) 0%, rgba(255,255,255,0) 70%)' }}
                />
            )}

            {/* Dusk Glow */}
            {isDusk && (
                <div
                    className="absolute bottom-0 left-0 w-full h-[40vh] opacity-60"
                    style={{ background: 'linear-gradient(to top, rgba(255,100,50,0.3), transparent)' }}
                />
            )}

            <canvas ref={canvasRef} className="absolute inset-0" />
        </div>
    );
};

export default WeatherEffects;
