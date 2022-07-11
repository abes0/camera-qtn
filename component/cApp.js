import * as THREE from "three";
import PThree, {LCamera} from '../parent/pThree'
export default class CApp extends PThree {
  constructor() {
    super({wrapper: '#app', isFitScreen: false})
  }

  setParam() {
    this.param.camera.x = 5
    this.param.camera.z = 100
    this.param.camera.far = 200
    this.param.camera.near = 20
  }

  init() {
    this.mesh = this.initMesh({size: 10.0, face: 2.0, pos: {x: 0, y:0, z: 0}});
    this.now = {
      x: 0,
      y: 0,
    };
    this.ease = 0.1;

    this.defaultCamPos = this.camera.position.clone()
    this.defaultCamDis = new THREE.Vector3().distanceTo(this.defaultCamPos)

    // second camera
    const _cameraParam = Object.assign(this.param.camera)
    _cameraParam.far = 400
    _cameraParam.z = 200
    this._camera = new LCamera({param: _cameraParam }).get()

    // helpers
    this.addControls(this._camera)
    this.addCameraHelper(this.camera)

    this.cameraHelper = new THREE.CameraHelper(this.camera)
    this.cameraHelper.setColors(new THREE.Color(0xff0000), new THREE.Color(0x00ff00), new THREE.Color(0x0000ff), new THREE.Color(0xff00ff), new THREE.Color(0x00ffff))
    this.scene.add(this.cameraHelper)
  }

  initMesh(option = {}) {
    const {size, face, pos} = option
    // const geo = new THREE.BoxGeometry(size, size, size)
    const geo = new THREE.ConeGeometry(size, size, 32)
    const mat = new THREE.MeshNormalMaterial({
      // color: 0xaabbee,
      // emissive: 0x072534,
      flatShading: true,
    });
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(pos.x, pos.y, pos.z)
    this.scene.add(mesh)
    return mesh
  }
  onMousemove({x, y}) {
    // console.log('onMousemove');
  }

  render() {
    this.now.x += (this.mouse.x - this.now.x) * this.ease;
    this.now.y += (this.mouse.y - this.now.y) * this.ease;

    const time = this.clock.elapsedTime
    const sin = Math.sin(time)
    const cos = Math.cos(time)

    // 位置
    // Camera
    const nowPoint = this.camera.position
    const targetPoint = new THREE.Vector3(sin * this.defaultCamDis, sin * this.defaultCamDis, cos * this.defaultCamDis)

    // ベクトル
    const nowSubVec = new THREE.Vector3().subVectors(nowPoint, new THREE.Vector3(0, 0, 0)).normalize()
    const targetSubVec = new THREE.Vector3().subVectors(targetPoint, new THREE.Vector3(0, 0, 0)).normalize()

    const axisVec = new THREE.Vector3().crossVectors(nowSubVec, targetSubVec)
    axisVec.normalize()

    const dot = nowSubVec.dot(targetSubVec)
    const radian = Math.acos(dot)
    const qtn = new THREE.Quaternion().setFromAxisAngle(axisVec, radian)

    // Camera
    this.camera.quaternion.premultiply(qtn)
    this.camera.position.set(targetPoint.x, targetPoint.y, targetPoint.z)

    if(this.cameraHelper) {
      this.cameraHelper.update()
    }

    this._camera.updateProjectionMatrix()
    this.renderer.render( this.scene, this.camera );
    this.renderer.render(this.scene, this._camera);
  }

  onResize() {
    // console.log('onResize');
  }
}
