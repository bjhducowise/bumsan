declare module "ZEPETO.Multiplay.Schema" {

	import { Schema, MapSchema, ArraySchema } from "@colyseus/schema"; 


	interface State extends Schema {
		players: MapSchema<Player>;
	}
	class Player extends Schema {
		sessionId: string;
		zepetoHash: string;
		zepetoUserId: string;
		transform: Transform;
		state: number;
		subState: number;
        isRide: any;
        gestureState: any;
	}
	class Transform extends Schema {
		position: Vector3;
		rotation: Vector3;
		clientId: string;
	}
	class Vector3 extends Schema {
		x: number;
		y: number;
		z: number;
	}
}