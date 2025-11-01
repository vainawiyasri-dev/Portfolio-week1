/* tiny selectors */
const $ = (s, ctx=document) => ctx.querySelector(s);
const $$ = (s, ctx=document) => Array.from(ctx.querySelectorAll(s));

/* PARTICLES (lightweight) */
(function particles(){
  const canvas = $('#particles');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w,h,parts;
  function resize(){
    w=canvas.width=innerWidth;
    h=canvas.height=innerHeight;
    parts = Array.from({length: Math.max(8, Math.round((w*h)/100000))}, ()=>({ x: Math.random()*w, y: Math.random()*h, r: 0.6+Math.random()*1.6, vx: (Math.random()-0.5)*0.25, vy: (Math.random()-0.5)*0.25, a: 0.08+Math.random()*0.38 }));
  }
  function frame(){
    ctx.clearRect(0,0,w,h);
    parts.forEach(p=>{
      p.x += p.vx; p.y += p.vy;
      if(p.x<0) p.x = w; if(p.x>w) p.x = 0;
      if(p.y<0) p.y = h; if(p.y>h) p.y = 0;
      ctx.beginPath();
      ctx.fillStyle = `rgba(110,231,183,${p.a})`;
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(frame);
  }
  window.addEventListener('resize', resize);
  resize(); frame();
})();

/* GREETING */
(function greeting(){
  const g = $('#greeting'), e = $('#emoji');
  if(!g) return;
  const h = new Date().getHours();
  if(h>=5 && h<12){ g.textContent='Good Morning'; e.textContent='🌤️' }
  else if(h>=12 && h<17){ g.textContent='Good Afternoon'; e.textContent='☀️' }
  else if(h>=17 && h<21){ g.textContent='Good Evening'; e.textContent='🌆' }
  else { g.textContent='Good Night'; e.textContent='🌙' }
})();

/* TYPING EFFECT */
(function typing(){
  const el = $('#typed'); if(!el) return;
  const phrases = ['AI Enthusiast','Full Stack Developer','Content Creator','Tech Writer'];
  let pi=0, xi=0, deleting=false;
  const speed=80, del=40, pause=900;
  function step(){
    const full = phrases[pi];
    if(!deleting){
      xi++; el.textContent = full.slice(0, xi);
      if(xi >= full.length){ deleting = true; setTimeout(step, pause); return; }
      setTimeout(step, speed);
    } else {
      xi--; el.textContent = full.slice(0, xi);
      if(xi <= 0){ deleting = false; pi = (pi+1)%phrases.length; setTimeout(step, 300); return; }
      setTimeout(step, del);
    }
  }
  setTimeout(step, 250);
})();

/* NAV TOGGLE & SMOOTH SCROLL (left-side mobile) */
(function navAndScroll(){
  const navToggle = $('#navToggle'), navList = $('#navList'), anchors = $$('[data-scroll]');
  if(navToggle){
    navToggle.addEventListener('click', ()=> navList.classList.toggle('show'));
    document.addEventListener('click', (e)=>{
      if(!navList || !navToggle) return;
      if(navList.classList.contains('show') && !navList.contains(e.target) && !navToggle.contains(e.target)){
        navList.classList.remove('show');
      }
    });
  }
  anchors.forEach(a => a.addEventListener('click', e=>{
    e.preventDefault();
    if(navList) navList.classList.remove('show');
    const href = a.getAttribute('href');
    if(!href || !href.startsWith('#')) return;
    const t = document.querySelector(href);
    if(t) t.scrollIntoView({behavior:'smooth',block:'start'});
  }));
})();

/* REVEAL ON SCROLL & SKILL BARS */
(function revealAndSkills(){
  const sections = $$('section');
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting) en.target.classList.add('reveal');
    });
  }, {threshold: 0.12});
  sections.forEach(s=>obs.observe(s));

  const skillCards = $$('.skill-card');
  skillCards.forEach(card=>{
    const fill = card.querySelector('.skill-fill');
    const percent = card.getAttribute('data-fill') || '60';
    card.addEventListener('click', ()=>{
      const expanded = card.getAttribute('aria-expanded') === 'true';
      skillCards.forEach(c => {
        c.setAttribute('aria-expanded','false');
        const f = c.querySelector('.skill-fill');
        if(f) f.style.width = '0';
      });
      if(!expanded){
        card.setAttribute('aria-expanded','true');
        setTimeout(()=> fill.style.width = percent + '%', 90);
      }
    });
    card.addEventListener('keydown', (e)=>{
      if(e.key==='Enter' || e.key===' ') { e.preventDefault(); card.click(); }
    });
  });
})();

/* PROJECT TILT (keeps micro-tilt) */
(function projectTilt(){
  $$('.project').forEach(p=>{
    p.addEventListener('mousemove', (ev)=>{
      const r = p.getBoundingClientRect();
      const cx = r.left + r.width/2, cy = r.top + r.height/2;
      const dx = (ev.clientX - cx)/(r.width/2), dy = (ev.clientY - cy)/(r.height/2);
      p.style.transform = `perspective(900px) rotateX(${(-dy)*6}deg) rotateY(${dx*6}deg) translateY(-6px)`;
    });
    p.addEventListener('mouseleave', ()=> p.style.transform = '');
    p.addEventListener('keydown', (ev)=> { if(ev.key==='Enter'){ const a = p.querySelector('a'); if(a) window.open(a.href,'_blank'); }});
  });
})();

/* TIMELINE: reveal items and animate a vertical fill */
(function timeline(){
  const timeline = $('#timeline');
  if(!timeline) return;
  const items = $$('.timeline-item');
  const line = timeline.querySelector('.timeline-line');

  // IntersectionObserver to reveal items
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        en.target.classList.add('visible');
      }
    });
  }, {threshold:0.2});

  items.forEach(it => io.observe(it));

  // Fill progress based on how far user scrolled through timeline area
  function updateFill(){
    const rect = timeline.getBoundingClientRect();
    const timelineTop = Math.max(0, window.innerHeight - rect.top);
    const total = rect.height + window.innerHeight;
    let progress = Math.min(1, Math.max(0, timelineTop / total));
   
    timeline.style.setProperty('--tl-progress', progress);
  }

  window.addEventListener('scroll', updateFill);
  window.addEventListener('resize', updateFill);
  updateFill();
})();

/* SCROLL-TO-TOP BUTTON */
(function topButton(){
  const btn = $('#toTop');
  if(!btn) return;
  window.addEventListener('scroll', ()=> {
    if(window.scrollY > 320) btn.style.display = 'block';
    else btn.style.display = 'none';
  });
  btn.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));
})();

/* CONTACT FORM VALIDATION */
(function contactForm(){
  const form = $('#contactForm'), msg = $('#formMsg');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    msg.textContent = '';
    const name = form.name.value.trim(), email = form.email.value.trim(), message = form.message.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!name){ msg.textContent = 'Please enter your name.'; form.name.focus(); return; }
    if(!email || !emailRegex.test(email)){ msg.textContent = 'Please enter a valid email.'; form.email.focus(); return; }
    msg.textContent = 'Thanks! Message received.';
    form.reset();
    setTimeout(()=> msg.textContent = '', 4000);
  });
})();

/* FOOTER YEAR  */
(function setYear(){
  const yEl = document.querySelector('#year');
  if(yEl) yEl.textContent = new Date().getFullYear();
})();
