import * as THREE from "three";

export class Planet {
    mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
    radius: number;
    distance: number;
    orbital_speed: number;
    position: THREE.Vector3;

    private updatePosition() {
        this.mesh.position.x = this.position.x;
        this.mesh.position.y = this.position.y;
        this.mesh.position.z = this.position.z;
    }

    constructor(

        radius: number,
        color: THREE.ColorRepresentation,
        distance: number,
        orbital_speed: number,
    ) {

        const geometry = new THREE.SphereGeometry(radius,64,32);
        const material = new THREE.MeshBasicMaterial({ color:color });

        this.mesh = new THREE.Mesh(geometry, material);
        this.position = new THREE.Vector3(distance, 0, 0);
        this.radius = radius;
        this.distance = distance;
        this.orbital_speed = orbital_speed;

        this.rotate(Math.random() * 10)

        this.updatePosition();
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
}

