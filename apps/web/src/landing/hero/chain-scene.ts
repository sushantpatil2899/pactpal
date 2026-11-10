import {
  AdditiveBlending,
  AmbientLight,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  EdgesGeometry,
  Group,
  IcosahedronGeometry,
  Line,
  LineBasicMaterial,
  LineSegments,
  type Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  SRGBColorSpace,
  Texture,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
} from "three";
import { DARK } from "../../design/tokens";

/**
 * The hero's 3D scene: chat fragments stream in from the left, five council members orbit the
 * forge and vote, a new sealed block forms and locks onto the head of a chain that recedes into
 * the distance, and a light keeps running down the chain checking it. One cycle every few seconds.
 */

const ACCENT = new Color(DARK["color-accent"]);
const ACCENT_2 = new Color(DARK["color-accent-2"]);
const AI = new Color(DARK["color-ai"]);
const BLOCKS = 9;
const CYCLE_MS = 4200;
const FORGE = new Vector3(0.4, 0.35, 1.6);
const ORBIT = 0.95;
const MEMBERS = 5;

/** The hash shown on each block's face: short, like the app shows them. */
const HASHES = ["9f2c", "71ae", "c04d", "5be8", "e219", "a7d3", "3c91", "b40f", "68ea", "d15b"];
const EVENTS = ["MESSAGE", "SCOPE", "SIGNED", "INVOICE", "PAID", "DELIVERY", "OPENED", "APPROVED"];

/** Where block `i` of the chain rests: a gentle arc away to the right and into the distance. */
function slot(i: number): Vector3 {
  return new Vector3(1.9 + i * 1.32, 0.15 + Math.sin(i * 0.7) * 0.28, 0.6 - i * 1.05);
}

const ease = (t: number) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);
const window01 = (t: number, from: number, to: number) =>
  Math.min(Math.max((t - from) / (to - from), 0), 1);

/** A block's face: its place in the log, an event name and a hash, drawn once to a texture. */
function faceTexture(n: number): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 160;
  const g = canvas.getContext("2d");
  if (g) {
    g.fillStyle = "rgba(4, 19, 14, 0.0)";
    g.fillRect(0, 0, 256, 160);
    g.font = "600 26px ui-monospace, Menlo, monospace";
    g.fillStyle = DARK["color-accent"];
    g.fillText(`#${String(412 + n).padStart(4, "0")}`, 20, 44);
    g.font = "500 22px ui-monospace, Menlo, monospace";
    g.fillStyle = "rgba(238, 242, 246, 0.82)";
    g.fillText(EVENTS[n % EVENTS.length] ?? "", 20, 88);
    g.fillStyle = "rgba(238, 242, 246, 0.5)";
    g.fillText(
      `${HASHES[n % HASHES.length] ?? ""}…${HASHES[(n + 3) % HASHES.length] ?? ""}`,
      20,
      128,
    );
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

interface Block {
  group: Group;
  face: MeshBasicMaterial;
  body: MeshStandardMaterial;
  edge: LineBasicMaterial;
}

export class ChainScene {
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(34, 1, 0.1, 100);
  private readonly world = new Group();
  private readonly blocks: Block[] = [];
  private readonly members: Mesh[] = [];
  private readonly rays: Line[] = [];
  private readonly links: Line;
  private readonly pulse: Mesh;
  private readonly forgeLight = new PointLight(ACCENT, 0, 9);
  private readonly dust: Points;
  private readonly dustSpeed: Float32Array;
  private readonly box = new BoxGeometry(1, 0.62, 0.62);
  private frame = 0;
  private start = performance.now();
  private last = performance.now();
  private made = BLOCKS;
  private scroll = 0;
  private pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  private wide = true;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.scene.add(this.world);
    this.scene.add(new AmbientLight(0xffffff, 0.35));
    const key = new DirectionalLight(0xffffff, 1.4);
    key.position.set(-3, 5, 6);
    this.scene.add(key);
    this.forgeLight.position.copy(FORGE);
    this.world.add(this.forgeLight);

    for (let i = 0; i < BLOCKS; i++) this.blocks.push(this.makeBlock(i));
    this.blocks.forEach((block, i) => {
      block.group.position.copy(slot(i));
    });

    const linkPoints = new Float32Array(BLOCKS * 3);
    const linkGeometry = new BufferGeometry();
    linkGeometry.setAttribute("position", new BufferAttribute(linkPoints, 3));
    this.links = new Line(
      linkGeometry,
      new LineBasicMaterial({ color: ACCENT_2, transparent: true, opacity: 0.55 }),
    );
    this.world.add(this.links);

    this.pulse = new Mesh(
      new IcosahedronGeometry(0.07, 1),
      new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 }),
    );
    this.world.add(this.pulse);

    const ring = new Mesh(
      new TorusGeometry(ORBIT, 0.004, 6, 120),
      new MeshBasicMaterial({ color: AI, transparent: true, opacity: 0.35 }),
    );
    ring.position.copy(FORGE);
    ring.rotation.x = Math.PI / 2.4;
    this.world.add(ring);
    for (let i = 0; i < MEMBERS; i++) {
      const hue = AI.clone().offsetHSL(i * 0.035 - 0.07, 0, i * 0.03);
      const member = new Mesh(
        new IcosahedronGeometry(0.06, 2),
        new MeshBasicMaterial({ color: hue }),
      );
      this.members.push(member);
      this.world.add(member);
      const rayGeometry = new BufferGeometry();
      rayGeometry.setAttribute("position", new BufferAttribute(new Float32Array(6), 3));
      const ray = new Line(
        rayGeometry,
        new LineBasicMaterial({ color: hue, transparent: true, opacity: 0 }),
      );
      this.rays.push(ray);
      this.world.add(ray);
    }

    const count = 520;
    const positions = new Float32Array(count * 3);
    this.dustSpeed = new Float32Array(count);
    for (let i = 0; i < count; i++) this.respawn(positions, i, true);
    const dustGeometry = new BufferGeometry();
    dustGeometry.setAttribute("position", new BufferAttribute(positions, 3));
    this.dust = new Points(
      dustGeometry,
      new PointsMaterial({
        color: new Color(DARK["color-accent-ink"]),
        size: 0.035,
        transparent: true,
        opacity: 0.85,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    );
    this.world.add(this.dust);
  }

  private makeBlock(n: number): Block {
    const group = new Group();
    const body = new MeshStandardMaterial({
      color: new Color("#0c1a17"),
      emissive: ACCENT,
      emissiveIntensity: 0.06,
      metalness: 0.2,
      roughness: 0.28,
      transparent: true,
      opacity: 0.92,
    });
    group.add(new Mesh(this.box, body));
    const edge = new LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.9 });
    group.add(new LineSegments(new EdgesGeometry(this.box), edge));
    const face = new MeshBasicMaterial({
      map: faceTexture(n),
      transparent: true,
      depthWrite: false,
    });
    const plane = new Mesh(new PlaneGeometry(0.88, 0.55), face);
    plane.position.z = 0.311;
    group.add(plane);
    this.world.add(group);
    return { group, face, body, edge };
  }

  /** Puts a chat fragment back at the far left, ready to drift in towards the forge. */
  private respawn(positions: Float32Array, i: number, anywhere: boolean): void {
    positions[i * 3] = anywhere ? -7 + Math.random() * 7 : -7 - Math.random() * 2;
    positions[i * 3 + 1] = -2.2 + Math.random() * 4.6;
    positions[i * 3 + 2] = -2.5 + Math.random() * 4;
    this.dustSpeed[i] = 0.6 + Math.random() * 1.4;
  }

  resize(width: number, height: number): void {
    if (width === 0 || height === 0) return;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.wide = width / height > 1.1;
    this.camera.fov = this.wide ? 34 : 46;
    this.camera.updateProjectionMatrix();
  }

  /** How far the hero has scrolled away, 0 to 1: the camera pulls back and turns along the chain. */
  setScroll(progress: number): void {
    this.scroll = progress;
  }

  setPointer(x: number, y: number): void {
    this.pointer.tx = x;
    this.pointer.ty = y;
  }

  /** Draws one frame at `elapsed` milliseconds into the loop. */
  private draw(elapsed: number, delta: number): void {
    const t = (elapsed % CYCLE_MS) / CYCLE_MS;
    const cycle = Math.floor(elapsed / CYCLE_MS);
    while (this.made < BLOCKS + cycle) this.advance();

    // The camera: framed on the forge and the chain, eased towards the pointer, pulled by scroll.
    this.pointer.x += (this.pointer.tx - this.pointer.x) * 0.05;
    this.pointer.y += (this.pointer.ty - this.pointer.y) * 0.05;
    const s = ease(this.scroll);
    const base = this.wide ? new Vector3(2.2, 1.1, 8.6) : new Vector3(2.6, 0.6, 13);
    this.camera.position.set(
      base.x + this.pointer.x * 0.6 + s * 2.5,
      base.y + this.pointer.y * 0.4 + s * 1.6,
      base.z - s * 3.2,
    );
    this.camera.lookAt(this.wide ? 3.6 + s * 3 : 3, 0.2 - s * 0.4, -1.2 - s * 2.5);
    this.world.position.x = this.wide ? 3.3 : -0.6;
    this.world.scale.setScalar(this.wide ? 1.18 : 1);

    // Gather, vote, forge, lock: the newest block forms at the forge and slides onto the head.
    const vote = window01(t, 0.42, 0.58);
    const forge = ease(window01(t, 0.58, 0.72));
    const lock = ease(window01(t, 0.74, 0.98));
    const head = this.blocks[0];
    if (head) {
      const from = FORGE;
      const to = slot(0);
      head.group.position.lerpVectors(from, to, lock);
      head.group.scale.setScalar(0.001 + forge);
      head.group.rotation.y = (1 - forge) * 1.6 + Math.sin(elapsed / 900) * 0.04;
      head.body.emissiveIntensity = 0.06 + (1 - lock) * forge * 0.9;
      head.edge.opacity = 0.5 + forge * 0.5;
    }
    for (let i = 1; i < this.blocks.length; i++) {
      const block = this.blocks[i];
      if (!block) continue;
      block.group.position.lerpVectors(slot(i - 1), slot(i), lock);
      block.group.scale.setScalar(1);
      block.group.rotation.y = Math.sin(elapsed / 1400 + i) * 0.06 - 0.18;
      block.group.position.y += Math.sin(elapsed / 1100 + i * 0.9) * 0.04;
      const fade = i === this.blocks.length - 1 ? 1 - lock : 1;
      block.body.opacity = 0.92 * fade;
      block.edge.opacity = (0.9 - i * 0.06) * fade;
      block.face.opacity = fade;
      block.body.emissiveIntensity = 0.06;
    }
    this.forgeLight.intensity = forge * (1 - lock) * 26 + vote * 4;

    // The council: five members orbiting the forge; while voting, each draws a ray to it.
    this.members.forEach((member, i) => {
      const a = elapsed / 1600 + (i / MEMBERS) * Math.PI * 2;
      member.position.set(
        FORGE.x + Math.cos(a) * ORBIT,
        FORGE.y + Math.sin(a) * ORBIT * Math.cos(Math.PI / 2.4),
        FORGE.z + Math.sin(a) * ORBIT * Math.sin(Math.PI / 2.4) * -1,
      );
      member.scale.setScalar(1 + vote * 0.5 * Math.sin(Math.PI * vote));
      const ray = this.rays[i];
      if (!ray) return;
      const p = ray.geometry.getAttribute("position") as BufferAttribute;
      p.setXYZ(0, member.position.x, member.position.y, member.position.z);
      p.setXYZ(1, FORGE.x, FORGE.y, FORGE.z);
      p.needsUpdate = true;
      (ray.material as LineBasicMaterial).opacity = Math.sin(Math.PI * vote) * 0.9;
    });

    // The chain's links, and a light running down them: the log being checked.
    const link = this.links.geometry.getAttribute("position") as BufferAttribute;
    this.blocks.forEach((block, i) => {
      link.setXYZ(i, block.group.position.x, block.group.position.y, block.group.position.z);
    });
    link.needsUpdate = true;
    const run = (elapsed / 2600) % 1;
    const at = run * (BLOCKS - 2);
    const k = Math.floor(at);
    const a = this.blocks[k]?.group.position;
    const b = this.blocks[k + 1]?.group.position;
    if (a && b) this.pulse.position.lerpVectors(a, b, at - k);

    // Chat fragments drift in from the left towards the forge, faster as the vote begins.
    const dust = this.dust.geometry.getAttribute("position") as BufferAttribute;
    const arr = dust.array as Float32Array;
    const pull = 0.35 + vote * 1.4 + forge * 0.6;
    for (let i = 0; i < this.dustSpeed.length; i++) {
      const ix = i * 3;
      const dx = FORGE.x - (arr[ix] ?? 0);
      const dy = FORGE.y - (arr[ix + 1] ?? 0);
      const dz = FORGE.z - (arr[ix + 2] ?? 0);
      const d = Math.hypot(dx, dy, dz);
      const v = ((this.dustSpeed[i] ?? 1) * pull * delta) / 1000;
      if (d < 0.25) {
        this.respawn(arr, i, false);
        continue;
      }
      arr[ix] = (arr[ix] ?? 0) + (dx / d) * v * 1.6;
      arr[ix + 1] = (arr[ix + 1] ?? 0) + (dy / d) * v * 0.7;
      arr[ix + 2] = (arr[ix + 2] ?? 0) + (dz / d) * v * 0.7;
    }
    dust.needsUpdate = true;

    this.renderer.render(this.scene, this.camera);
  }

  /** The cycle ended: the head stays in the chain, and the oldest block comes back as the new one. */
  private advance(): void {
    const oldest = this.blocks.pop();
    if (!oldest) return;
    oldest.face.map?.dispose();
    oldest.face.map = faceTexture(this.made);
    oldest.face.needsUpdate = true;
    oldest.body.opacity = 0.92;
    oldest.face.opacity = 1;
    oldest.group.scale.setScalar(0.001);
    oldest.group.position.copy(FORGE);
    this.blocks.unshift(oldest);
    this.made++;
  }

  /** Runs the loop until `stop`. */
  play(): void {
    if (this.frame !== 0) return;
    const tick = (now: number) => {
      const delta = Math.min(now - this.last, 50);
      this.last = now;
      this.draw(now - this.start, delta);
      this.frame = requestAnimationFrame(tick);
    };
    this.last = performance.now();
    this.frame = requestAnimationFrame(tick);
  }

  stop(): void {
    cancelAnimationFrame(this.frame);
    this.frame = 0;
  }

  /** One still frame, mid-vote, for reduced motion. */
  still(): void {
    this.draw(CYCLE_MS * 0.5, 16);
  }

  dispose(): void {
    this.stop();
    this.scene.traverse((object) => {
      if (object instanceof Mesh || object instanceof Line || object instanceof Points) {
        (object.geometry as BufferGeometry).dispose();
        const material = object.material as Material | Material[];
        for (const m of Array.isArray(material) ? material : [material]) {
          if ("map" in m && m.map instanceof Texture) m.map.dispose();
          m.dispose();
        }
      }
    });
    this.renderer.dispose();
  }
}
