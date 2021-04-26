import {
  ArcRotateCamera,
  Engine,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  Scene,
  SceneLoader,
  Vector3
} from '@babylonjs/core';

const canvas: any = document.getElementById("renderCanvas");
const engine: Engine = new Engine(canvas, true);

function createScene(): Scene {
  const scene: Scene = new Scene(engine);

  const camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
  camera.attachControl(canvas, true);

  const light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

  const sphere: Mesh = MeshBuilder.CreateSphere("sphere", {diameter: 0.01}, scene);

  return scene;

  SceneLoader.ImportMesh(['Building1'], "./assets/", "building1.gltf", scene,
      (meshes, particleSystems, skeletons) => {
        camera.target = meshes[0].position;
      });
}

const scene: Scene = createScene();
engine.runRenderLoop(() => {
  scene.render();
});
