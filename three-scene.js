// ===== THREE.JS 3D SCENES - ALL SECTIONS =====
if (typeof THREE === 'undefined') {
  console.warn('Three.js not loaded');
} else {
  initAllScenes();
}

function createRenderer(canvas) {
  if (!canvas) return null;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  const section = canvas.parentElement;
  renderer.setSize(section.offsetWidth, section.offsetHeight);
  return renderer;
}

function resizeRenderer(renderer, canvas) {
  const section = canvas.parentElement;
  renderer.setSize(section.offsetWidth, section.offsetHeight);
}

// ===== SHARED: FLOATING PARTICLES =====
function createParticles(scene, count, spread, colors, size = 0.05) {
  const positions = new Float32Array(count * 3);
  const cols = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i*3]   = (Math.random()-0.5)*spread.x;
    positions[i*3+1] = (Math.random()-0.5)*spread.y;
    positions[i*3+2] = (Math.random()-0.5)*spread.z;
    const c = colors[Math.floor(Math.random()*colors.length)];
    cols[i*3]=c.r; cols[i*3+1]=c.g; cols[i*3+2]=c.b;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions,3));
  geo.setAttribute('color', new THREE.BufferAttribute(cols,3));
  const mat = new THREE.PointsMaterial({ size, vertexColors:true, transparent:true, opacity:0.6, sizeAttenuation:true });
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);
  return pts;
}

// ===== SHARED: WIREFRAME MESH =====
function createWire(geo, color, opacity=0.2) {
  return new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, wireframe:true, transparent:true, opacity }));
}

function initAllScenes() {
  const mouse = { x:0, y:0 };
  window.addEventListener('mousemove', e => {
    mouse.x = (e.clientX/window.innerWidth - 0.5)*2;
    mouse.y = -(e.clientY/window.innerHeight - 0.5)*2;
  });

  const palette = [
    new THREE.Color('#6c63ff'),
    new THREE.Color('#f093fb'),
    new THREE.Color('#00f2fe'),
    new THREE.Color('#a89cff'),
  ];

  // ============================================================
  // HERO
  // ============================================================
  (function heroScene() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const renderer = createRenderer(canvas);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth/canvas.offsetHeight, 0.1, 100);
    camera.position.z = 5;

    const pts = createParticles(scene, 200, {x:20,y:12,z:10}, palette, 0.06);

    const ico = createWire(new THREE.IcosahedronGeometry(1.4,1), 0x6c63ff, 0.25);
    ico.position.set(3.5,0,-1); scene.add(ico);

    const tk = createWire(new THREE.TorusKnotGeometry(0.7,0.22,100,16), 0xf093fb, 0.2);
    tk.position.set(-4,1.5,-2); scene.add(tk);

    const oct = createWire(new THREE.OctahedronGeometry(0.8), 0x00f2fe, 0.2);
    oct.position.set(-3,-2,-1); scene.add(oct);

    [
      {r:2.5,c:0x6c63ff,p:[2,-1,-3]},
      {r:1.8,c:0xf093fb,p:[-2,2,-4]},
      {r:3.2,c:0x00f2fe,p:[0,0,-5]},
    ].forEach(d => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(d.r,0.007,16,100),
        new THREE.MeshBasicMaterial({color:d.c,transparent:true,opacity:0.3})
      );
      ring.position.set(...d.p);
      ring.rotation.x = Math.random()*Math.PI;
      scene.add(ring);
    });

    window.addEventListener('resize', () => { resizeRenderer(renderer,canvas); camera.aspect=canvas.offsetWidth/canvas.offsetHeight; camera.updateProjectionMatrix(); });
    const clock = new THREE.Clock();
    (function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      ico.rotation.x=t*0.3; ico.rotation.y=t*0.4;
      tk.rotation.x=t*0.2; tk.rotation.y=t*0.3;
      oct.rotation.x=t*0.4; oct.rotation.z=t*0.2;
      pts.rotation.y=t*0.02; pts.rotation.x=t*0.01;
      camera.position.x += (mouse.x*0.4 - camera.position.x)*0.04;
      camera.position.y += (mouse.y*0.3 - camera.position.y)*0.04;
      camera.lookAt(scene.position);
      renderer.render(scene,camera);
    })();
  })();

  // ============================================================
  // ABOUT — DNA helix + particles
  // ============================================================
  (function aboutScene() {
    const canvas = document.getElementById('aboutCanvas');
    if (!canvas) return;
    const renderer = createRenderer(canvas);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth/canvas.offsetHeight, 0.1, 100);
    camera.position.z = 5;

    createParticles(scene, 120, {x:18,y:10,z:8}, palette, 0.05);

    // DNA helix
    const helixGroup = new THREE.Group();
    for (let i = 0; i < 60; i++) {
      const angle = (i/60)*Math.PI*6;
      const y = (i/60)*8 - 4;
      [1,-1].forEach(side => {
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(0.06,8,8),
          new THREE.MeshBasicMaterial({color: side===1 ? 0x6c63ff : 0xf093fb, transparent:true, opacity:0.7})
        );
        sphere.position.set(Math.cos(angle)*1.2*side, y, Math.sin(angle)*1.2*side);
        helixGroup.add(sphere);
      });
      if (i%5===0) {
        const pts2 = [
          new THREE.Vector3(Math.cos(angle)*1.2, y, Math.sin(angle)*1.2),
          new THREE.Vector3(-Math.cos(angle)*1.2, y, -Math.sin(angle)*1.2),
        ];
        const line = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(pts2),
          new THREE.LineBasicMaterial({color:0xa89cff,transparent:true,opacity:0.3})
        );
        helixGroup.add(line);
      }
    }
    helixGroup.position.set(4, 0, -2);
    scene.add(helixGroup);

    const dodeca = createWire(new THREE.DodecahedronGeometry(1.2), 0x00f2fe, 0.15);
    dodeca.position.set(-4, 1, -3); scene.add(dodeca);

    window.addEventListener('resize', () => { resizeRenderer(renderer,canvas); camera.aspect=canvas.offsetWidth/canvas.offsetHeight; camera.updateProjectionMatrix(); });
    const clock = new THREE.Clock();
    (function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      helixGroup.rotation.y = t*0.3;
      dodeca.rotation.x=t*0.2; dodeca.rotation.y=t*0.3;
      camera.position.x += (mouse.x*0.3 - camera.position.x)*0.03;
      camera.position.y += (mouse.y*0.2 - camera.position.y)*0.03;
      camera.lookAt(scene.position);
      renderer.render(scene,camera);
    })();
  })();

  // ============================================================
  // SKILLS — floating cubes + grid
  // ============================================================
  (function skillsScene() {
    const canvas = document.getElementById('skillsCanvas');
    if (!canvas) return;
    const renderer = createRenderer(canvas);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth/canvas.offsetHeight, 0.1, 100);
    camera.position.z = 5;

    createParticles(scene, 100, {x:18,y:10,z:8}, palette, 0.05);

    // Floating cubes
    const cubes = [];
    for (let i = 0; i < 8; i++) {
      const size = Math.random()*0.5+0.2;
      const cube = createWire(new THREE.BoxGeometry(size,size,size), [0x6c63ff,0xf093fb,0x00f2fe][i%3], 0.3);
      cube.position.set((Math.random()-0.5)*14, (Math.random()-0.5)*8, (Math.random()-0.5)*4-2);
      cube.userData = { speed: Math.random()*0.5+0.2, offset: Math.random()*Math.PI*2 };
      scene.add(cube);
      cubes.push(cube);
    }

    // Grid plane
    const gridHelper = new THREE.GridHelper(20, 20, 0x6c63ff, 0x6c63ff);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.05;
    gridHelper.position.y = -4;
    scene.add(gridHelper);

    const tetra = createWire(new THREE.TetrahedronGeometry(1.2), 0xf093fb, 0.2);
    tetra.position.set(-4.5, 2, -2); scene.add(tetra);

    window.addEventListener('resize', () => { resizeRenderer(renderer,canvas); camera.aspect=canvas.offsetWidth/canvas.offsetHeight; camera.updateProjectionMatrix(); });
    const clock = new THREE.Clock();
    (function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      cubes.forEach(c => {
        c.rotation.x = t*c.userData.speed;
        c.rotation.y = t*c.userData.speed*0.7;
        c.position.y += Math.sin(t*c.userData.speed + c.userData.offset)*0.003;
      });
      tetra.rotation.x=t*0.3; tetra.rotation.z=t*0.2;
      camera.position.x += (mouse.x*0.3 - camera.position.x)*0.03;
      camera.position.y += (mouse.y*0.2 - camera.position.y)*0.03;
      camera.lookAt(scene.position);
      renderer.render(scene,camera);
    })();
  })();

  // ============================================================
  // EXPERIENCE — orbit spheres
  // ============================================================
  (function expScene() {
    const canvas = document.getElementById('expCanvas');
    if (!canvas) return;
    const renderer = createRenderer(canvas);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth/canvas.offsetHeight, 0.1, 100);
    camera.position.z = 5;

    createParticles(scene, 100, {x:18,y:10,z:8}, palette, 0.05);

    // Orbit system
    const orbitGroup = new THREE.Group();
    orbitGroup.position.set(3.5, 0, -1);

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.3,16,16),
      new THREE.MeshBasicMaterial({color:0x6c63ff,transparent:true,opacity:0.8})
    );
    orbitGroup.add(core);

    const orbitData = [
      {r:1.2, color:0xf093fb, speed:1.2},
      {r:1.9, color:0x00f2fe, speed:0.7},
      {r:2.6, color:0xa89cff, speed:0.4},
    ];
    const orbiters = [];
    orbitData.forEach(d => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(d.r, 0.006, 8, 64),
        new THREE.MeshBasicMaterial({color:d.color,transparent:true,opacity:0.2})
      );
      ring.rotation.x = Math.PI/2 + Math.random()*0.5;
      orbitGroup.add(ring);

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.1,8,8),
        new THREE.MeshBasicMaterial({color:d.color,transparent:true,opacity:0.9})
      );
      dot.userData = {radius:d.r, speed:d.speed, angle:Math.random()*Math.PI*2, tilt:ring.rotation.x};
      orbitGroup.add(dot);
      orbiters.push(dot);
    });
    scene.add(orbitGroup);

    const ico2 = createWire(new THREE.IcosahedronGeometry(1,1), 0x6c63ff, 0.15);
    ico2.position.set(-4,-1,-3); scene.add(ico2);

    window.addEventListener('resize', () => { resizeRenderer(renderer,canvas); camera.aspect=canvas.offsetWidth/canvas.offsetHeight; camera.updateProjectionMatrix(); });
    const clock = new THREE.Clock();
    (function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      orbitGroup.rotation.y = t*0.2;
      orbiters.forEach(o => {
        o.userData.angle += o.userData.speed * 0.01;
        o.position.x = Math.cos(o.userData.angle)*o.userData.radius;
        o.position.z = Math.sin(o.userData.angle)*o.userData.radius;
      });
      ico2.rotation.x=t*0.2; ico2.rotation.y=t*0.3;
      camera.position.x += (mouse.x*0.3 - camera.position.x)*0.03;
      camera.position.y += (mouse.y*0.2 - camera.position.y)*0.03;
      camera.lookAt(scene.position);
      renderer.render(scene,camera);
    })();
  })();

  // ============================================================
  // HOBI — scattered stars + comet
  // ============================================================
  (function hobiScene() {
    const canvas = document.getElementById('hobiCanvas');
    if (!canvas) return;
    const renderer = createRenderer(canvas);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth/canvas.offsetHeight, 0.1, 100);
    camera.position.z = 5;

    createParticles(scene, 150, {x:20,y:12,z:10}, palette, 0.055);

    // Comet trail
    const cometPts = [];
    for (let i = 0; i < 30; i++) cometPts.push(new THREE.Vector3(-i*0.15, i*0.05, 0));
    const comet = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(cometPts),
      new THREE.LineBasicMaterial({color:0x00f2fe,transparent:true,opacity:0.4})
    );
    comet.position.set(-3,2,-2);
    scene.add(comet);

    const shapes = [
      createWire(new THREE.IcosahedronGeometry(0.9,1), 0x6c63ff, 0.2),
      createWire(new THREE.OctahedronGeometry(0.8), 0xf093fb, 0.2),
      createWire(new THREE.TetrahedronGeometry(0.9), 0x00f2fe, 0.2),
    ];
    shapes[0].position.set(4,1,-2);
    shapes[1].position.set(-4,-1,-3);
    shapes[2].position.set(3,-2,-1);
    shapes.forEach(s => scene.add(s));

    window.addEventListener('resize', () => { resizeRenderer(renderer,canvas); camera.aspect=canvas.offsetWidth/canvas.offsetHeight; camera.updateProjectionMatrix(); });
    const clock = new THREE.Clock();
    (function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      shapes.forEach((s,i) => { s.rotation.x=t*(0.2+i*0.1); s.rotation.y=t*(0.3+i*0.05); });
      comet.position.x = Math.sin(t*0.5)*5;
      comet.position.y = Math.cos(t*0.3)*2;
      comet.rotation.z = t*0.5;
      camera.position.x += (mouse.x*0.3 - camera.position.x)*0.03;
      camera.position.y += (mouse.y*0.2 - camera.position.y)*0.03;
      camera.lookAt(scene.position);
      renderer.render(scene,camera);
    })();
  })();

  // ============================================================
  // PROJECTS — holographic planes
  // ============================================================
  (function projectsScene() {
    const canvas = document.getElementById('projectsCanvas');
    if (!canvas) return;
    const renderer = createRenderer(canvas);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth/canvas.offsetHeight, 0.1, 100);
    camera.position.z = 5;

    createParticles(scene, 120, {x:18,y:10,z:8}, palette, 0.05);

    // Holographic floating planes
    const planes = [];
    for (let i = 0; i < 5; i++) {
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5+Math.random(), 1+Math.random()),
        new THREE.MeshBasicMaterial({
          color:[0x6c63ff,0xf093fb,0x00f2fe][i%3],
          transparent:true, opacity:0.06, side:THREE.DoubleSide
        })
      );
      plane.position.set((Math.random()-0.5)*14, (Math.random()-0.5)*8, (Math.random()-0.5)*3-3);
      plane.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
      plane.userData = { rotSpeed: (Math.random()-0.5)*0.01 };
      scene.add(plane);
      planes.push(plane);
    }

    const tk2 = createWire(new THREE.TorusKnotGeometry(0.8,0.25,80,12), 0x6c63ff, 0.18);
    tk2.position.set(-4.5, 1.5, -2); scene.add(tk2);

    const ico3 = createWire(new THREE.IcosahedronGeometry(1,1), 0xf093fb, 0.18);
    ico3.position.set(4.5, -1.5, -2); scene.add(ico3);

    window.addEventListener('resize', () => { resizeRenderer(renderer,canvas); camera.aspect=canvas.offsetWidth/canvas.offsetHeight; camera.updateProjectionMatrix(); });
    const clock = new THREE.Clock();
    (function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      planes.forEach(p => { p.rotation.x+=p.userData.rotSpeed; p.rotation.y+=p.userData.rotSpeed*0.7; });
      tk2.rotation.x=t*0.2; tk2.rotation.y=t*0.3;
      ico3.rotation.x=t*0.3; ico3.rotation.y=t*0.2;
      camera.position.x += (mouse.x*0.3 - camera.position.x)*0.03;
      camera.position.y += (mouse.y*0.2 - camera.position.y)*0.03;
      camera.lookAt(scene.position);
      renderer.render(scene,camera);
    })();
  })();

  // ============================================================
  // EDUCATION — rising pillars
  // ============================================================
  (function eduScene() {
    const canvas = document.getElementById('eduCanvas');
    if (!canvas) return;
    const renderer = createRenderer(canvas);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth/canvas.offsetHeight, 0.1, 100);
    camera.position.z = 5;

    createParticles(scene, 100, {x:18,y:10,z:8}, palette, 0.05);

    // Pillars
    const pillars = [];
    for (let i = 0; i < 6; i++) {
      const h = Math.random()*3+1;
      const pillar = createWire(new THREE.CylinderGeometry(0.08,0.08,h,8), [0x6c63ff,0xf093fb,0x00f2fe][i%3], 0.25);
      pillar.position.set((i-2.5)*2.5, -3, -3);
      pillar.userData = { targetY: -3+h/2, speed: Math.random()*0.02+0.01 };
      scene.add(pillar);
      pillars.push(pillar);
    }

    const dodeca2 = createWire(new THREE.DodecahedronGeometry(1.1), 0x6c63ff, 0.18);
    dodeca2.position.set(4.5, 1, -2); scene.add(dodeca2);

    window.addEventListener('resize', () => { resizeRenderer(renderer,canvas); camera.aspect=canvas.offsetWidth/canvas.offsetHeight; camera.updateProjectionMatrix(); });
    const clock = new THREE.Clock();
    (function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      pillars.forEach((p,i) => {
        p.position.y = Math.sin(t*p.userData.speed*30 + i)*0.3 + p.userData.targetY;
        p.rotation.y = t*0.3;
      });
      dodeca2.rotation.x=t*0.2; dodeca2.rotation.y=t*0.25;
      camera.position.x += (mouse.x*0.3 - camera.position.x)*0.03;
      camera.position.y += (mouse.y*0.2 - camera.position.y)*0.03;
      camera.lookAt(scene.position);
      renderer.render(scene,camera);
    })();
  })();

  // ============================================================
  // CONTACT — wave + particles
  // ============================================================
  (function contactScene() {
    const canvas = document.getElementById('contactCanvas');
    if (!canvas) return;
    const renderer = createRenderer(canvas);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth/canvas.offsetHeight, 0.1, 100);
    camera.position.z = 5;

    createParticles(scene, 120, {x:18,y:10,z:8}, palette, 0.05);

    // Wave grid
    const waveGeo = new THREE.PlaneGeometry(16, 10, 30, 20);
    const waveMat = new THREE.MeshBasicMaterial({ color:0x6c63ff, wireframe:true, transparent:true, opacity:0.07 });
    const wave = new THREE.Mesh(waveGeo, waveMat);
    wave.rotation.x = -Math.PI/3;
    wave.position.y = -3;
    scene.add(wave);

    const tk3 = createWire(new THREE.TorusKnotGeometry(0.7,0.2,80,12), 0xf093fb, 0.2);
    tk3.position.set(4.5, 1.5, -2); scene.add(tk3);

    const oct2 = createWire(new THREE.OctahedronGeometry(1), 0x00f2fe, 0.18);
    oct2.position.set(-4.5, -1, -2); scene.add(oct2);

    window.addEventListener('resize', () => { resizeRenderer(renderer,canvas); camera.aspect=canvas.offsetWidth/canvas.offsetHeight; camera.updateProjectionMatrix(); });
    const clock = new THREE.Clock();
    (function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      // Animate wave vertices
      const pos = waveGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        pos.setZ(i, Math.sin(x*0.5 + t)*0.3 + Math.cos(y*0.5 + t*0.7)*0.2);
      }
      pos.needsUpdate = true;
      tk3.rotation.x=t*0.2; tk3.rotation.y=t*0.3;
      oct2.rotation.x=t*0.3; oct2.rotation.z=t*0.2;
      camera.position.x += (mouse.x*0.3 - camera.position.x)*0.03;
      camera.position.y += (mouse.y*0.2 - camera.position.y)*0.03;
      camera.lookAt(scene.position);
      renderer.render(scene,camera);
    })();
  })();
}
