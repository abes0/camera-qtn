import * as THREE from "three";
import PThree from '../parent/pThree'
export default class CApp extends PThree {
  constructor() {
    super({wrapper: '#app', isFitScreen: true})
  }

  init() {
    this.addControls()
    this.mesh01 = this.initMesh({size: 60.0, face: 2.0, pos: {x: 0, y:0, z:0}});
    this.now = {
      x: 0,
      y: 0,
    };
    this.ease = 0.1;

    this.defaultCamPos = this.camera.position.clone()
    this.defaultCamDis = new THREE.Vector3().distanceTo(this.defaultCamPos)
    // for Debug
    this.mesh02Pos = new THREE.Vector3(this.defaultCamPos.x / 10, this.defaultCamPos.y / 10, this.defaultCamPos.z / 10)
    this.mesh02Dis = new THREE.Vector3().distanceTo(this.mesh02Pos)
    this.mesh02 = this.initMesh({size: 10.0, face: 2.0, pos: {x: 0, y:this.mesh02Pos.y, z:this.mesh02Pos.x}});
    

    const d1 = Math.sqrt(this.defaultCamPos.x * this.defaultCamPos.x + this.defaultCamPos.y * this.defaultCamPos.y + this.defaultCamPos.z * this.defaultCamPos.z)
    // console.log(this.defaultCamDis, d1);

  }

  initMesh(option = {}) {
    const {size, face, pos} = option
    const geo = new THREE.BoxGeometry(size, size, size)
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

    const camPos = this.defaultCamPos.clone()
    const time = this.clock.elapsedTime
    const sin = Math.sin(time)
    const cos = Math.cos(time)

    // 位置
    // Camera
    const nowPoint = this.camera.position
    const targetPoint = new THREE.Vector3(0, sin * this.defaultCamDis, cos * this.defaultCamDis)

    // forDebug
    // const nowPoint = this.mesh02.position
    // const targetPoint = new THREE.Vector3(0, sin * this.mesh02Dis, cos * this.mesh02Dis)

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
    console.log(this.camera.position.z)

    // for Debug
    // this.mesh02.quaternion.premultiply(qtn)
    // this.mesh02.position.set(targetPoint.x, targetPoint.y, targetPoint.z)
  }

  onResize() {
    // console.log('onResize');
  }
}
