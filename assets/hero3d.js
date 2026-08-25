/* ═══════════════════════════════════════════════════════════════════
   ZKK Consulting — 3D network background
   Runs once for the hero, once for the footer.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (typeof THREE === 'undefined') return;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  function initNetwork(containerId, nodeCount) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var W = container.clientWidth, H = container.clientHeight;
    if (!W || !H) return;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 1000);
    camera.position.z = 60;

    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    var navy = new THREE.Color(0x1f3a5f);
    var accent = new THREE.Color(0xb8860b);

    /*0x2e6e63 is the green
    #594b07 is gold
    #b8860b nicer gold
    */ 

    var nodes = [];
    var nodeGeo = new THREE.SphereGeometry(0.55, 8, 8);
    var nodeMat = new THREE.MeshBasicMaterial({ color: accent });
    var group = new THREE.Group();
    scene.add(group);

    var RADIUS = 34, MAX_DIST = 16;

    for (var i = 0; i < nodeCount; i++) {
      var mesh = new THREE.Mesh(nodeGeo, nodeMat);
      mesh.position.set(
        (Math.random() - 0.5) * RADIUS * 2,
        (Math.random() - 0.5) * RADIUS * 1.1,
        (Math.random() - 0.5) * RADIUS * 1.4
      );
      mesh.userData.baseScale = 0.7 + Math.random() * 0.6;
      mesh.userData.pulseOffset = Math.random() * Math.PI * 2;
      group.add(mesh);
      nodes.push(mesh);
    }

    var lineMat = new THREE.LineBasicMaterial({ color: navy, transparent: true, opacity: 0.35 });
    var linePositions = [];
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
    group.add(new THREE.LineSegments(lineGeo, lineMat));

    var clock = new THREE.Clock();
    function tick() {
      var t = clock.getElapsedTime();
      group.rotation.y += 0.0009;
      nodes.forEach(function (n) {
        var s = n.userData.baseScale + Math.sin(t * 1.2 + n.userData.pulseOffset) * 0.18;
        n.scale.setScalar(s);
      });
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }
    tick();

    window.addEventListener('resize', function () {
      var w = container.clientWidth, h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }

  initNetwork('heroCanvas', 60);
  initNetwork('footerCanvas', 28);
})();