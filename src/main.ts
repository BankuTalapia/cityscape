import {
  AbstractMesh,
  ArcRotateCamera, Camera, Color3, Color4, DirectionalLight, DynamicTexture,
  Engine, FreeCamera,
  HemisphericLight, LensRenderingPipeline, Material,
  Mesh,
  MeshBuilder, MultiMaterial,
  Scene,
  SceneLoader, StandardMaterial,
  Vector3
} from '@babylonjs/core';

const canvas: any = document.getElementById("renderCanvas");
const engine: Engine = new Engine(canvas, true);

const GridRadius = 15;
const HouseDensity = 0.2;

function createGrid(scene: Scene) {

  const myMaterial = new StandardMaterial("myMaterial", scene);

  myMaterial.emissiveColor = myMaterial.diffuseColor = new Color3(17/256, 49/256, 72/256);
  myMaterial.specularColor = new Color3(0, 0, 0);
  // new Color3(1, 1, 1);
  myMaterial.ambientColor = new Color3(0.1, 0.1, 0.1);
  myMaterial.backFaceCulling = false;

  const rect: Mesh = MeshBuilder.CreatePlane("floor", {width: 0.98, height: 0.98}, scene);
  rect.rotate(Vector3.Right(), Math.PI/2);


  rect.material = myMaterial;

  const radius = GridRadius;
  for (let x = -radius; x < radius; x++) {
    for (let z = -radius; z < radius; z++) {
      const name = `Box${x},${z}`;
      const square = rect.clone(name);
      square.position.x = x;
      square.position.z = z;
    }
  }

}

function createCamera(scene: Scene): ArcRotateCamera {
  const camera = new ArcRotateCamera('camera', 5 * Math.PI / 4, 0.7 * Math.PI / 2, 100,
      new Vector3(0, 0, 0), scene);

  const engine = scene.getEngine();
  const renderRect = engine.getRenderingCanvasClientRect();
  if (!renderRect) {
    throw new Error('No render rect');
  }
  camera.mode = Camera.ORTHOGRAPHIC_CAMERA;

  const distance = 10;
  const aspect = renderRect.height / renderRect.width;
  camera.orthoLeft = -distance/2;
  camera.orthoRight = distance / 2;
  camera.orthoBottom = camera.orthoLeft * aspect;
  camera.orthoTop = camera.orthoRight * aspect;

  // last param from this function is telling you which buton to use for panning, so no more need line 34
  camera.attachControl(canvas, true, false);
  // you don't need to call 2 time same function. it is enough 1 time
  // camera.attachControl(canvas, true, false);

  // using this property you can choose which axis to be use for panning
  camera.panningAxis = new Vector3(1, 1, 0);
  camera.upperBetaLimit = Math.PI / 2;
  camera.wheelPrecision = 0.1;
  camera.panningSensibility = 100;
  camera.inertia = 0.1;
  camera.panningInertia = 0.2;
  // never use variable with _ because they are private and can be changed durring development
  // camera._panningMouseButton = 0; // change functionality from left to right mouse button
  camera.angularSensibilityX = 500;
  camera.angularSensibilityY = 500;
  camera.minZ = 0.1;
  camera.maxZ = 50000;

  //camera

  // const cameraPosition = new Vector3(10, 5, -10);
  // const camera = new FreeCamera("Camera", cameraPosition, scene);
  // camera.attachControl(canvas, true);
  // camera.setTarget(Vector3.Zero());
  //
  // //Ortho camera
  // camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
  // camera.orthoTop = 3;
  // camera.orthoBottom = -3;
  // camera.orthoLeft = 3;
  // camera.orthoRight = -3;

  // var camera = new FreeCamera("Camera", cameraPosition, scene);
  // camera.attachControl(canvas, true);
  // camera.setTarget(Vector3.Zero());

  return camera;
}


function showWorldAxis(size, heightAboveGround, scene) {
  var makeTextPlane = function(text, color, size) {
    var dynamicTexture = new DynamicTexture("DynamicTexture", 50, scene, true);
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
    var plane = Mesh.CreatePlane("TextPlane", size, scene, true);
    const material = new StandardMaterial("TextPlaneMaterial", scene);
    material.specularColor = new Color3(0, 0, 0);
    material.diffuseTexture = dynamicTexture;
    material.backFaceCulling = false;
    plane.material = material;
    return plane;
  };
  var axisX = Mesh.CreateLines("axisX", [
    new Vector3(0, heightAboveGround, 0), new Vector3(size, heightAboveGround, 0), new Vector3(size * 0.95, 0.05 * size + heightAboveGround, 0),
    new Vector3(size, heightAboveGround, 0), new Vector3(size * 0.95, -0.05 * size + heightAboveGround, 0)
  ], scene);
  axisX.color = new Color3(1, 0, 0);
  var xChar = makeTextPlane("X", "red", size / 10);
  xChar.position = new Vector3(0.9 * size, -0.05 * size + heightAboveGround, 0);
  var axisY = Mesh.CreateLines("axisY", [
    Vector3.Zero(), new Vector3(0, size, 0), new Vector3(-0.05 * size, size * 0.95, 0),
    new Vector3(0, size, 0), new Vector3(0.05 * size, size * 0.95, 0)
  ], scene);
  axisY.color = new Color3(0, 1, 0);
  var yChar = makeTextPlane("Y", "green", size / 10);
  yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);
  var axisZ = Mesh.CreateLines("axisZ", [
    new Vector3(0, heightAboveGround, 0), new Vector3(0, heightAboveGround, size), new Vector3(0, -0.05 * size + heightAboveGround, size * 0.95),
    new Vector3(0, heightAboveGround, size), new Vector3(0, 0.05 * size + heightAboveGround, size * 0.95)
  ], scene);
  axisZ.color = new Color3(0, 0, 1);
  var zChar = makeTextPlane("Z", "blue", size / 10);
  zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
};

function instantiateHouse(baseHouse, baseWindows, windowOnMat, windowOffMat, x, z) {
  const newHouse = baseHouse.clone(`house${x},${z}`);
  newHouse.position.x = baseHouse.position.x + x;
  newHouse.position.z = baseHouse.position.z + z;
  baseWindows.forEach((baseWindow) => {
    const name = `window${x},${z}-${baseWindow.name}`;
    const window = baseWindow.clone(name);
    window.position.x = baseWindow.position.x + x;
    window.position.z = baseWindow.position.z + z;
    window.material = (Math.random() > 0.5) ? windowOnMat : windowOffMat;
  });
}

function createGeometry(scene: Scene) {

  createGrid(scene);

  // MeshBuilder.CreateSphere("sphere", {diameter: 2.0}, scene);

  SceneLoader.ImportMesh(['building1', 'window1', 'window2', 'window3', 'window4', 'window5', 'window6'],
      "./assets/", "building1.babylon", scene,
      (meshes, particleSystems, skeletons) => {
        // camera.target = meshes[0].position;
        let windowOnMaterial;
        let windowOffMaterial;
        let house: AbstractMesh|null = null;
        let windows: AbstractMesh[] = [];
        for (let mesh of meshes) {
          if (mesh.name == "building1") {
            house = mesh;
            const material = meshes[0].material;
            for (let childMat of (material as MultiMaterial).getChildren()) {
              if (childMat) {
                if (childMat.name == "window-on") {
                  windowOnMaterial = childMat;
                } else if (childMat.name == "window-off") {
                  windowOffMaterial = childMat;
                }
                childMat.transparencyMode = Material.MATERIAL_OPAQUE;
                childMat.backFaceCulling = false;
              }
            }
          } else if (mesh.name.indexOf("window") >= 0) {
            windows.push(mesh);
          }
        }
        if (!house) {
          return;
        }
        for (let myWindow of windows) {
          myWindow.material = (Math.random() > 0.5) ? windowOnMaterial : windowOffMaterial;
        }

        for (let x = -GridRadius; x< GridRadius; x++) {
          for (let z = -GridRadius; z< GridRadius; z++) {
            if (x == 0 && z == 0) {
              continue;
            }
            if (Math.random() < HouseDensity) {
              instantiateHouse(house, windows, windowOnMaterial, windowOffMaterial, x, z);
            }
          }
        }


      });
}

function createShader(scene: Scene, camera: Camera) {
  var lensEffect = new LensRenderingPipeline('lens', {
    edge_blur: 0.0,
    chromatic_aberration: 0.0,
    distortion: 1.0,
    dof_focus_distance: 7,
    dof_aperture: 0.05,			// set this very high for tilt-shift effect
    grain_amount: 1.0,
    dof_pentagon: true,
    dof_gain: 20.0,
    dof_threshold: 1.0,
    dof_darken: 0
  }, scene, 1.0, [camera]);
}

function createScene(): Scene {
  const scene: Scene = new Scene(engine);

  let camera = createCamera(scene);

  createShader(scene, camera);

  const light1: DirectionalLight = new DirectionalLight("light1", new Vector3(1.0, -0.3, 1.0).normalize(), scene);
  light1.intensity = 1.0;
  // const light2: DirectionalLight = new DirectionalLight("light2", new Vector3(-0.8, -1, -0.6).normalize(), scene);
  // light2.intensity = 0.2;

  // grid


  scene.clearColor = new Color4(16/256, 38/256, 59/256);

  createGeometry(scene);
  // showWorldAxis(300, 100, scene);

  return scene;
}

const scene: Scene = createScene();
engine.runRenderLoop(() => {
  scene.render();
});
