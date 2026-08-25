/* ═══════════════════════════════════════════════════════════════════
   ZKK Consulting — hero 3D network background
   Slowly rotating node mesh. Skips entirely if the user prefers
   reduced motion, or if the hero canvas container isn't on the page.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var container = document.getElementById('heroCanvas');
  if (!container || typeof THREE === 'undefined') return;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return; // leave the container empty, hero still looks fine without it

  var W = container.clientWidth, H = container.clientHeight;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 1000);
  camera.position.z = 60;

  var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  container.appendChild(renderer.domElement);

  /* Colors pulled to match the site palette */
  var navy = new THREE.Color(0x1f3a5f);
  var accent = new THREE.Color(0x2e6e63);

  /* ── Node cluster ── */
  var NODE_COUNT = 60;
  var RADIUS = 34;
  var nodes = [];
  var nodeGeo = new THREE.SphereGeometry(0.55, 8, 8);
  var nodeMat = new THREE.MeshBasicMaterial({ color: accent });
  var group = new THREE.Group();
  scene.add(group);

  for (var i = 0; i < NODE_COUNT; i++) {
    var mesh = new THREE.Mesh(nodeGeo, nodeMat);
    var v = new THREE.Vector3(
      (Math.random() - 0.5) * RADIUS * 2,
      (Math.random() - 0.5) * RADIUS * 1.1,
      (Math.random() - 0.5) * RADIUS * 1.4
    );
    mesh.position.copy(v);
    mesh.userData.baseScale = 0.7 + Math.random() * 0.6;
    mesh.userData.pulseOffset = Math.random() * Math.PI * 2;
    group.add(mesh);
    nodes.push(mesh);
  }

  /* ── Connections between nearby nodes ── */
  var lineMat = new THREE.LineBasicMaterial({ color: navy, transparent: true, opacity: 0.35 });
  var linePositions = [];
  var MAX_DIST = 16;

  for (var a = 0; a < nodes.length; a++) {
    for (var b = a + 1; b < nodes.length; b++) {
      if (nodes[a].position.distanceTo(nodes[b].position) < MAX_DIST) {
        linePositions.push(
          nodes[a].position.x, nodes[a].position.y, nodes[a].position.z,
          nodes[b].position.x, nodes[b].position.y, nodes[b].position.z
        );
      }
    }
  }
  var lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  var lines = new THREE.LineSegments(lineGeo, lineMat);
  group.add(lines);

  /* ── Gentle mouse parallax ── */
  var targetRotX = 0, targetRotY = 0;
  window.addEventListener('mousemove', function (e) {
    targetRotY = ((e.clientX / window.innerWidth) - 0.5) * 0.25;
    targetRotX = ((e.clientY / window.innerHeight) - 0.5) * 0.15;
  });

  /* ── Animate ── */
  var clock = new THREE.Clock();
  function tick() {
    var t = clock.getElapsedTime();
    group.rotation.y += 0.0009;
    group.rotation.x += (targetRotX - group.rotation.x) * 0.02;
    group.rotation.y += (targetRotY * 0.5 - 0) * 0; // keep autorotate dominant

    nodes.forEach(function (n) {
      var s = n.userData.baseScale + Math.sin(t * 1.2 + n.userData.pulseOffset) * 0.18;
      n.scale.setScalar(s);
    });

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();

  /* ── Resize handling ── */
  window.addEventListener('resize', function () {
    var w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})();