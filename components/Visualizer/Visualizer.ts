import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Mesh,
  Group,
  MeshStandardMaterial,
  Vector2,
  Vector3,
  Vector4,
  AnimationMixer,
  Clock,
  ACESFilmicToneMapping,
  UnsignedByteType,
  sRGBEncoding,
  GridHelper,
  PMREMGenerator,
  Color,
  DirectionalLight,
  LoadingManager,
  Texture,
  TextureLoader,
  MOUSE,
  Quaternion,
  Matrix4,
  Spherical,
  Box3,
  Sphere,
  Raycaster,
  MathUtils,
  Material,
  SphereBufferGeometry,
  MeshBasicMaterial,
 } from "three";


import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import CameraControls from 'camera-controls';
const subsetTHREE = {
  MOUSE: MOUSE,
  Vector2: Vector2,
  Vector3: Vector3,
  Vector4: Vector4,
  Quaternion: Quaternion,
  Matrix4: Matrix4,
  Spherical: Spherical,
  Box3: Box3,
  Sphere: Sphere,
  Raycaster: Raycaster,
  MathUtils: {
    DEG2RAD: MathUtils.DEG2RAD,
    clamp: MathUtils.clamp,
  },
};
CameraControls.install({ THREE: subsetTHREE });

interface ViewState {
  posX: number,
  posY: number,
  posZ: number,
  targetX: number,
  targetY: number,
  targetZ: number
}

interface Annotation {
  el: HTMLElement,
  position: Vector3
}

export default class Visualizer {
  canvas: any;
  modelName?: string;
  camX: number;
  camY: number;
  camZ: number;
  offsetX: number;
  offsetY: number;
  offsetZ: number;
  spOffsetX: number;
  spOffsetY: number;
  spOffsetZ: number;
  followMouse?: boolean;
  targetX: number;
  targetY: number;
  targetZ: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  positionX: number;
  positionY: number;
  positionZ: number;
  useDirectionalLight?: boolean;
  directionalLightX: number;
  directionalLightY: number;
  directionalLightZ: number;
  scale: number;
  minDistance?: number;
  maxDistance?: number;
  animated?: boolean;
  envName?: string;
  envBgName?: string;
  useEnvBg?: boolean;
  toneMappingExposure?: number;
  showGrid?: boolean;
  autoRotate?: boolean;
  disableScroll?: boolean;

  camera: PerspectiveCamera;
  controls: CameraControls;
  scene: Scene;
  renderer: WebGLRenderer;
  objects: (Mesh|Group)[]  = [];
  materials: MeshStandardMaterial[] = [];
  commonMaterial: MeshStandardMaterial = new MeshStandardMaterial();
  modelPath: string;
  envPath: string;
  envBgPath: string;
  mx: number = 0;
  my: number = 0;
  lastMx: number = 0;
  lastMy: number = 0;
  cameraOffset!: Vector3
  polarMove: number = 0.001

  fadingDuration: number = 1
  fadingProgress: number = 0
  fadingStarted: boolean = false

  annotations: Annotation[] = []

  mixer!: AnimationMixer;
  clock: Clock;

  public loadFinished: boolean = false;

  constructor(props: Partial<Visualizer>) {
    Object.assign(this, props)
    this.camX ??= 2
    this.camY ??= 2
    this.camZ ??= 3
    this.targetX ??= 0
    this.targetY ??= 1
    this.targetZ ??= 0
    this.offsetX ??= 0
    this.offsetY ??= 0
    this.offsetZ ??= 0
    this.spOffsetX ??= this.offsetX
    this.spOffsetY ??= this.offsetY
    this.spOffsetZ ??= this.offsetZ
    this.rotationX ??= 0
    this.rotationY ??= 0
    this.rotationZ ??= 0
    this.positionX ??= 0
    this.positionY ??= 0
    this.positionZ ??= 0
    this.directionalLightX ??= 5
    this.directionalLightY ??= 5
    this.directionalLightZ ??= 5
    this.scale ??= 1
    this.minDistance ??= 1.2
    this.maxDistance ??= 7
    this.toneMappingExposure ??= 1.2

    this.modelPath = `/models/${this.modelName}`;
    this.envPath = this.envName ? `/equirectangular/${this.envName}` : '/equirectangular/aircraft_workshop_01_1k.hdr'
    this.envBgPath = this.envBgName ? `/equirectangular/${this.envBgName}` : this.envPath
    this.clock = new Clock(false)
    this.renderer = new WebGLRenderer({
      antialias: true,
      canvas: this.canvas,
      alpha: true
    })
    this.renderer.physicallyCorrectLights = true;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = this.toneMappingExposure;
    this.renderer.outputEncoding = sRGBEncoding;

    this.scene = new Scene()
    this.scene.name = 'myScene';
    // this.scene.background = new Color(0x000000)

    this.camera = new PerspectiveCamera(40, 1, 0.1, 1500);
    this.camera.position.set(this.camX, this.camY, this.camZ);

    if (this.showGrid) {
      const grid = new GridHelper(100, 100, 0xcccccc, 0x555555)
      this.scene.add(grid)
    }

    this.controls = new CameraControls(this.camera, this.canvas)
    this.controls.setTarget(this.targetX, this.targetY, this.targetZ)
    this.controls.minDistance = this.minDistance
    this.controls.maxDistance = this.maxDistance
    this.controls.dampingFactor = 0.12
    if (this.disableScroll) {
      this.controls.mouseButtons.wheel = CameraControls.ACTION.NONE
      this.controls.touches.one = CameraControls.ACTION.NONE
      this.controls.touches.two = CameraControls.ACTION.TOUCH_ROTATE
    }
    document.addEventListener('mousemove', e => {
      this.mx = (e.pageX / window.innerWidth - 0.5 ) * 2;
      this.my = (e.pageY / window.innerHeight - 0.5) * 2;
    })

    // デフォルト位置調整用
    // this.controls.addEventListener('update', (e:any) => {
    //   const pos = this.controls.getPosition(new Vector3())
    //   const target = this.controls.getTarget(new Vector3())
    //   console.log(`
    //   view: {
    //     posX: ${pos.x},
    //     posY: ${pos.y},
    //     posZ: ${pos.z},
    //     targetX: ${target.x},
    //     targetY: ${target.y},
    //     targetZ: ${target.z},
    //   }
    //   `)
    // })

    // 追加ライト
    if (this.useDirectionalLight) {
      const dirLight = new DirectionalLight(0xffffff, 1.5 )
      dirLight.position.set(this.directionalLightX, this.directionalLightY, this.directionalLightZ)
      this.scene.add(dirLight)
    }

    // TODO: 先に初期化だけしておいて非同期処理が終わってからマテリアルやシーン背景などのテクスチャを更新
    const envPathExt = this.envPath.split('.').pop()
    let envLoader: EXRLoader | RGBELoader
    if (envPathExt === 'exr') {
      envLoader = new EXRLoader()
    } else {
      envLoader = new RGBELoader()
    }
    envLoader.setDataType(UnsignedByteType).load(this.envPath, texture => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;

      if (this.useEnvBg) {
        if (this.envPath === this.envBgPath) {
          this.scene.background = envMap;
        } else {
          envLoader.setDataType(UnsignedByteType).load(this.envBgPath, (bgTexture) => {
            const bgMap = pmremGenerator.fromEquirectangular(bgTexture).texture;
            this.scene.background = bgMap;
          })
        }
      }
      this.scene.environment = envMap;
      this.renderer.render(this.scene, this.camera)
      this.objects = this.initObjects();
    })

    const pmremGenerator = new PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();

    window.addEventListener('resize', this.onResize.bind(this));
    this.onResize();
    this.animate();
  }

  public setNextView(state: ViewState) {
    this.controls.setPosition(state.posX, state.posY, state.posZ, true)
    this.controls.setTarget(state.targetX, state.targetY, state.targetZ, true)
  }

  private initObjects() {
    const objects:(Mesh|Group)[] = [];

    // glTFファイルをロード
    const _this = this
    const manager = new LoadingManager();
    manager.onStart = function (url, itemsLoaded, itemsTotal) {
      console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    }
    manager.onLoad = function () {
      console.log('Loading complete!');
      _this.loadFinished = true
      _this.clock.start()
    };
    manager.onProgress = function (url, itemsLoaded, itemsTotal) {
      console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    };


    const gltfLoader = new GLTFLoader(manager)
    const dracoLoader = new DRACOLoader(manager)
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.1/')
    gltfLoader.setDRACOLoader(dracoLoader)
    gltfLoader.load(this.modelPath, gltf => {
      gltf.scene.scale.set(this.scale, this.scale, this.scale)
      gltf.scene.rotation.set(this.rotationX, this.rotationY, this.rotationZ)
      gltf.scene.position.set(this.positionX, this.positionY, this.positionZ)
      this.scene.add(gltf.scene)

      this.scene.traverseVisible((o) => {
        if (o.type === 'Mesh') {
          const mesh = o as Mesh
          const material = mesh.material as MeshStandardMaterial

          const hasSameMaterial = this.materials.some(val => {
            return val.uuid === material.uuid
          })

          if (!hasSameMaterial) {
            material.userData.usedMesh = []
            material.userData.realOpacity = material.opacity
            material.opacity = 0
            material.userData.realEnvMapIntensity = material.envMapIntensity
            material.envMapIntensity = 0
            material.userData.realTransparent = material.transparent
            material.transparent = true

            this.materials.push(material)
          }
          material.userData.usedMesh.push(mesh)
        }
      })
      const animations = gltf.animations

      if (this.animated) {
        const animations = gltf.animations;
        this.mixer = new AnimationMixer(gltf.scene)

        const action = this.mixer.clipAction(animations[0])
        action.play()
        console.log(action)
      }
      objects.push(gltf.scene)
    })


    return objects;
  }

  updateColorMap(meshName: string, filePath: string) {
    console.log(this.objects)
    const mesh = this.objects[0].children.find((obj): obj is Mesh => {
      return obj.name === meshName
    })
    if (mesh) {
      interface MapMaterial extends Material{
        map: Texture
      }
      console.log(mesh.material)
      const material: MapMaterial = mesh.material as MapMaterial

      const loader = new TextureLoader()
      loader.load(filePath, texture => {
        console.log(texture)
        if (material.map) {
          material.map = texture
        }
      })
    }
  }

  updateMeshMaterial(meshName: string, materialName: string) {
    const material = this.materials.find(mat => {
      return mat.name === materialName
    })

    if (!material) {
      throw new Error('No such material!')
    }

    this.scene.traverseVisible(o => {
      if (o.type === 'Mesh' && o.name == meshName) {
        const mesh = o as Mesh
        mesh.material = material
      }
    })
  }

  updateMaterialColor(materialName: string, color: {r: number, g: number, b: number}) {

    const materials = this.materials.filter(mat => {
      return mat.name === materialName
    })
    if (materials.length == 0) {
      console.error(materialName)
      throw new Error('No such material!')
    }
    materials.forEach(material => {
      material.color.r = color.r
      material.color.g = color.g
      material.color.b = color.b
    })
  }

  updateFading(delta: number) {
    this.fadingProgress += delta / this.fadingDuration
    if (this.fadingProgress > 1) {
      this.fadingProgress = 1
      this.materials.forEach(material => {
        material.transparent = material.userData.realTransparent
      })
    }

    this.materials.forEach(material => {
      material.opacity = this.fadingProgress * material.userData.realOpacity
      material.envMapIntensity = this.fadingProgress * material.userData.realEnvMapIntensity
    })
  }

  public addAnnotation(annotation: {el: HTMLElement, x: number, y: number, z: number}) {
    const symbol = new Mesh(
      new SphereBufferGeometry(0.1, 10, 10),
      new MeshBasicMaterial({
        color: 0xFF0000,
        transparent: true,
        opacity: 0
      })
    )

    symbol.position.x = annotation.x
    symbol.position.y = annotation.y
    symbol.position.z = annotation.z
    symbol.name = 'annotationSymbol'
    this.scene.add(symbol)


    const el = annotation.el
    const position = new Vector3(annotation.x, annotation.y, annotation.z)
    this.annotations.push({
      el,
      position
    })
  }

  private onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(width, height)

    const aspect = width / height;
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    if (aspect < 1) {
      this.cameraOffset = new Vector3(this.spOffsetX, this.spOffsetY, this.spOffsetZ)
    } else {
      this.cameraOffset = new Vector3(this.offsetX, this.offsetY, this.offsetZ)
    }
    this.controls.setFocalOffset(this.cameraOffset.x, this.cameraOffset.y, this.cameraOffset.z, true)
  }

  private animate() {
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.animate.bind(this))

    const delta = this.clock.getDelta()
    if (this.autoRotate) {
      this.controls.rotate(-0.002, this.polarMove, true)
      if (this.controls.polarAngle > MathUtils.degToRad(150)) {
        this.polarMove = -0.001
      }
      if (this.controls.polarAngle < MathUtils.degToRad(30)) {
        this.polarMove = 0.001
      }
    }

    const raycaster = new Raycaster()
    const camPos = new Vector3()
    this.controls.getPosition(camPos)

    // アノテーション位置調整
    this.annotations.forEach(annotation => {
      const sv = annotation.position.clone().project(this.camera)
      sv.x = Math.round((0.5 + sv.x / 2) * (this.canvas.width / window.devicePixelRatio))
      sv.y = Math.round((0.5 - sv.y / 2) * (this.canvas.height / window.devicePixelRatio))
      annotation.el.style.transform = `translate(${sv.x}px, ${sv.y}px)`
      if (this.fadingProgress < 1) {
        annotation.el.style.opacity = "0"
      } else {
        raycaster.set(camPos, new Vector3().subVectors(annotation.position, camPos).normalize())
        const intersects = raycaster.intersectObjects(this.scene.children, true)
        const annotationBehindObject = (intersects[0].object.name !== 'annotationSymbol')
        annotation.el.style.opacity = annotationBehindObject ? "0.15" : "1"
      }
    })

    this.controls.update(delta)


    // マウスにスムーズに追従する
    if (this.followMouse) {
      const mx = this.lastMx + ( this.mx - this.lastMx) / 10
      const my = this.lastMy + ( this.my - this.lastMy) / 10
      this.camera.rotateY( -mx /10)
      this.camera.rotateX( -my /10)
      this.lastMx = mx
      this.lastMy = my
    }

    if (this.loadFinished && this.fadingProgress < 1) {
      // 初回ロード時にラグが発生して途中からフェードイン始まってしまう対策
      if (!this.fadingStarted) {
        this.fadingStarted = true
      } else {
        this.updateFading(delta)
      }
    }

    if (this.mixer){
      this.mixer.update(delta)
    }
  }
}
// 透明度周りの問題を解決できるかも
// gltf.scene.traverse((node: any) => {
//   if (node.isLight) {
//     // this.state.addLights = false;
//   } else if (node.isMesh) {
//     // TODO(https://github.com/mrdoob/three.js/pull/18235): Clean up.
//     node.material.depthWrite = !node.material.transparent;
//   }
// });
