import * as PIXI from 'pixi.js';
import Game from '../game';

export class SpatialHash {
	public cellSize: number = 10;

	private buckets: number[][] = []; // { [id: number]: number[]} = [];

	// We use a double buffer to flip between data each frame
	private bufferedBuckets: number[][] = []; //{ [id: number]: number[]} = [];

	public getBucketIndexForPosition(pos:PIXI.IPoint) {
		return (
			((pos.x / this.cellSize) | 0) +
			((pos.y / this.cellSize) | 0) * (Game.SCREEN_WIDTH / this.cellSize));
	}

	public getBucketPositionForIndex(index: number) {
		const y = (index / (Game.SCREEN_WIDTH / this.cellSize)) | 0;
		const x = index - (y * (Game.SCREEN_WIDTH / this.cellSize));
		return [(x * this.cellSize) + (this.cellSize / 2), (y * this.cellSize) + (this.cellSize / 2)];
	}

	private _halfRad: number;
	public getBucketIndices(pos: PIXI.IPoint, radius: number = 1) {
		this._halfRad = radius / 2;
		return [
			// Central
			this.getBucketIndexForPosition(new PIXI.Point(pos.x, pos.y)),
			// W
			this.getBucketIndexForPosition(new PIXI.Point(pos.x - this._halfRad, pos.y)),
			// NW
			this.getBucketIndexForPosition(new PIXI.Point(pos.x - this._halfRad, pos.y - this._halfRad)),
			// N
			this.getBucketIndexForPosition(new PIXI.Point(pos.x, pos.y - this._halfRad)),
			// NE
			this.getBucketIndexForPosition(new PIXI.Point(pos.x + this._halfRad, pos.y - this._halfRad)),
			// E
			this.getBucketIndexForPosition(new PIXI.Point(pos.x + this._halfRad, pos.y)),
			// SE
			this.getBucketIndexForPosition(new PIXI.Point(pos.x + this._halfRad, pos.y + this._halfRad)),
			// S
			this.getBucketIndexForPosition(new PIXI.Point(pos.x, pos.y - this._halfRad)),
			// SW
			this.getBucketIndexForPosition(new PIXI.Point(pos.x - this._halfRad, pos.y + this._halfRad)),
		]
	}

	public addToBucket(agentId: number, position: PIXI.IPoint) {
		const idx = this.getBucketIndexForPosition(position);
		this.buckets[idx] = this.buckets[idx] || [];
		this.buckets[idx].push(agentId);
	}

	public addToBuffer(agentId: number, position: PIXI.IPoint) {
		const idx = this.getBucketIndexForPosition(position);
		this.bufferedBuckets[idx] = this.bufferedBuckets[idx] || [];
		this.bufferedBuckets[idx].push(agentId);
	}

	public getAgentsAtBucket(pos: PIXI.IPoint) {
		return this.buckets[this.getBucketIndexForPosition(pos)] || [];
	}

	private idToBucket = (id: number) => {
		return this.buckets[id] || [];
	}

	public getNeighboringIDsAtPos(pos: PIXI.IPoint, radius: number = 1) {
		return this.getBucketIndices(pos, radius)
			.map(this.idToBucket)
			.flat();
	}

	public clearBuckets() {
		this.buckets = [];
		this.bufferedBuckets = [];
	}

	public flip() {
		this.buckets = this.bufferedBuckets;
		this.bufferedBuckets = [];
	}
}