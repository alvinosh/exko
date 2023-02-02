import * as THREE from "three";

export class Planet {
    name: string;

    mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;

    radius: number;
    distance: number;
    orbital_speed: number;
    position: THREE.Vector3;

    ring_mesh: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>;
    ring_material: THREE.MeshBasicMaterial;

    constructor(
        name: string,
        radius: number,
        color: THREE.ColorRepresentation,
        distance: number,
        orbital_speed: number,
    ) {

        const geometry = new THREE.SphereGeometry(radius,64,32);
        const material = new THREE.MeshBasicMaterial({ color:color });

        const ring_geometry = new THREE.RingGeometry( distance - 5, distance + 5, 64 );
        this.ring_material = new THREE.MeshBasicMaterial({ color:0x0000000, side: THREE.DoubleSide });


        this.name = name;
        this.position = new THREE.Vector3(distance, 0, 0);
        this.radius = radius;
        this.distance = distance;
        this.orbital_speed = orbital_speed;

        this.mesh = new THREE.Mesh(geometry, material);
        this.ring_mesh = new THREE.Mesh(ring_geometry, this.ring_material);

        this.rotate(Math.random() * 10)
        this.ring_mesh.rotateX(Math.PI / 2);


        this.updatePosition();
    }

    public add(scene: THREE.Scene) {
        scene.add(this.mesh);
        scene.add(this.ring_mesh);
    }

    public highlight() {
       this.ring_material = new THREE.MeshBasicMaterial({ color:0xffffff, side: THREE.DoubleSide,transparent: true, opacity: 0.5,});
       this.ring_mesh.material = this.ring_material;
    }

    public unhighlight() {
        this.ring_material = new THREE.MeshBasicMaterial({ color:0xffffff, side: THREE.DoubleSide,transparent: true, opacity: 0.1,});
        this.ring_mesh.material = this.ring_material;
    }

    public rotate(delta: number) {
        const angle = delta * this.orbital_speed;

        const cosbx = Math.cos(angle) * this.position.x;
        const cosbz = Math.cos(angle) * this.position.z;
        const sinbx = Math.sin(angle) * this.position.x;
        const sinbz = Math.sin(angle) * this.position.z;

        this.position.x = cosbx - sinbz;
        this.position.z = sinbx + cosbz;

        this.updatePosition();
    }

    private updatePosition() {
        this.mesh.position.x = this.position.x;
        this.mesh.position.y = this.position.y;
        this.mesh.position.z = this.position.z;
    }

}

