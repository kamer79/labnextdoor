const canvas = document.getElementById('circuitField');
const ctx = canvas && canvas.getContext('2d');

if (canvas && ctx) {
  let width = 0;
  let height = 0;
  let paths = [];
  let active = null;
  let nextActivation = 0;
  let previousIndex = -1;
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reducedMotion = reducedMotionQuery.matches;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const random = (min, max) => min + Math.random() * (max - min);
  const pick = (items) => items[Math.floor(Math.random() * items.length)];

  function makePath() {
    const xStep = Math.max(100, width / 9);
    const yStep = Math.max(82, height / 7);
    const xs = [];
    const ys = [];
    for (let x = 0; x <= width; x += xStep) xs.push(x);
    for (let y = 0; y <= height; y += yStep) ys.push(y);

    const points = [{ x: pick(xs), y: pick(ys) }];
    let x = points[0].x;
    let y = points[0].y;
    const turns = 4 + Math.floor(Math.random() * 5);
    for (let i = 0; i < turns; i += 1) {
      if (i % 2 === 0) {
        x = clamp(x + random(1.2, 2.8) * xStep * (Math.random() < .5 ? -1 : 1), 0, width);
      } else {
        y = clamp(y + random(1.2, 2.8) * yStep * (Math.random() < .5 ? -1 : 1), 0, height);
      }
      points.push({ x, y });
    }
    if (Math.random() > .45) points.push({ x, y: pick(ys) });
    points.push({ x: pick(xs), y: points[points.length - 1].y });
    return points;
  }

  function measure(points) {
    const segments = [];
    let length = 0;
    for (let i = 1; i < points.length; i += 1) {
      const from = points[i - 1];
      const to = points[i];
      const segmentLength = Math.max(Math.hypot(to.x - from.x, to.y - from.y), .001);
      segments.push({ from, to, length: segmentLength, start: length, end: length + segmentLength });
      length += segmentLength;
    }
    return { points, segments, length };
  }

  function rebuild() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paths = [];
    const count = Math.min(64, Math.max(42, Math.round((width * height) / 2200)));
    for (let i = 0; i < count; i += 1) {
      const path = measure(makePath());
      if (path.length > 180) paths.push(path);
    }
    nextActivation = performance.now() + 1200;
    active = null;
  }

  function pointAt(path, distance) {
    const target = clamp(distance, 0, path.length);
    const segment = path.segments.find(item => target <= item.end) || path.segments[path.segments.length - 1];
    const ratio = (target - segment.start) / segment.length;
    return {
      x: segment.from.x + (segment.to.x - segment.from.x) * ratio,
      y: segment.from.y + (segment.to.y - segment.from.y) * ratio,
    };
  }

  function drawPath(path) {
    ctx.beginPath();
    path.points.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
    ctx.strokeStyle = 'rgba(55,138,221,.16)';
    ctx.lineWidth = 1;
    ctx.lineJoin = 'round';
    ctx.stroke();
    path.points.forEach(point => {
      ctx.fillStyle = 'rgba(55,138,221,.22)';
      ctx.fillRect(point.x - 1.5, point.y - 1.5, 3, 3);
    });
  }

  function drawPulse(path, progress) {
    const distance = progress * path.length;
    const current = pointAt(path, distance);
    const trailStart = Math.max(0, distance - Math.min(150, path.length * .18));
    const trail = [pointAt(path, trailStart), pointAt(path, distance)];
    ctx.beginPath();
    trail.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
    ctx.strokeStyle = 'rgba(225,242,255,.48)';
    ctx.lineWidth = 3.5;
    ctx.shadowBlur = 14;
    ctx.shadowColor = '#E1F2FF';
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(current.x, current.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#E1F2FF';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#DDEEFF';
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function activate(index) {
    const path = paths[index];
    if (!path) return;
    previousIndex = index;
    active = { path, started: performance.now(), duration: clamp(path.length / 380, 1500, 2000) };
  }

  function nextPath() {
    const choices = paths.map((_, index) => index).filter(index => index !== previousIndex);
    activate(pick(choices.length ? choices : paths.map((_, index) => index)));
  }

  function distanceToPath(path, px, py) {
    let nearest = Infinity;
    path.segments.forEach(segment => {
      const { from, to } = segment;
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const ratio = clamp(((px - from.x) * dx + (py - from.y) * dy) / (dx * dx + dy * dy || 1), 0, 1);
      nearest = Math.min(nearest, Math.hypot(px - (from.x + ratio * dx), py - (from.y + ratio * dy)));
    });
    return nearest;
  }

  function frame(now) {
    ctx.clearRect(0, 0, width, height);
    paths.forEach(drawPath);
    if (!reducedMotion) {
      if (active) {
        const progress = clamp((now - active.started) / active.duration, 0, 1);
        drawPulse(active.path, progress);
        if (progress >= 1) {
          active = null;
          nextActivation = now + 2200 + Math.random() * 900;
        }
      } else if (now >= nextActivation) {
        nextPath();
      }
    }
    requestAnimationFrame(frame);
  }

  function handlePointer(event) {
    if (event.target.closest && event.target.closest('a,button')) return;
    const x = event.clientX;
    const y = event.clientY;
    let nearestIndex = -1;
    let nearest = Infinity;
    paths.forEach((path, index) => {
      const distance = distanceToPath(path, x, y);
      if (distance < nearest) { nearest = distance; nearestIndex = index; }
    });
    if (nearestIndex >= 0 && nearest < 80) activate(nearestIndex);
  }

  reducedMotionQuery.addEventListener?.('change', event => { reducedMotion = event.matches; active = null; });
  addEventListener('resize', rebuild, { passive: true });
  addEventListener('pointerup', handlePointer, { passive: true });
  rebuild();
  requestAnimationFrame(frame);
}
