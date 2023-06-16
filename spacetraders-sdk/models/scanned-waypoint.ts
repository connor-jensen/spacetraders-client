/* tslint:disable */
/* eslint-disable */
/**
 * SpaceTraders API
 * SpaceTraders is an open-universe game and learning platform that offers a set of HTTP endpoints to control a fleet of ships and explore a multiplayer universe.  The API is documented using [OpenAPI](https://github.com/SpaceTradersAPI/api-docs). You can send your first request right here in your browser to check the status of the game server.  ```json http {   \"method\": \"GET\",   \"url\": \"https://api.spacetraders.io/v2\", } ```  Unlike a traditional game, SpaceTraders does not have a first-party client or app to play the game. Instead, you can use the API to build your own client, write a script to automate your ships, or try an app built by the community.  We have a [Discord channel](https://discord.com/invite/jh6zurdWk5) where you can share your projects, ask questions, and get help from other players.   
 *
 * The version of the OpenAPI document: 2.0.0
 * Contact: joel@spacetraders.io
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


// May contain unused imports in some cases
// @ts-ignore
import { Chart } from './chart';
// May contain unused imports in some cases
// @ts-ignore
import { WaypointFaction } from './waypoint-faction';
// May contain unused imports in some cases
// @ts-ignore
import { WaypointOrbital } from './waypoint-orbital';
// May contain unused imports in some cases
// @ts-ignore
import { WaypointTrait } from './waypoint-trait';
// May contain unused imports in some cases
// @ts-ignore
import { WaypointType } from './waypoint-type';

/**
 * A waypoint that was scanned by a ship.
 * @export
 * @interface ScannedWaypoint
 */
export interface ScannedWaypoint {
    /**
     * Symbol of the waypoint.
     * @type {string}
     * @memberof ScannedWaypoint
     */
    'symbol': string;
    /**
     * 
     * @type {WaypointType}
     * @memberof ScannedWaypoint
     */
    'type': WaypointType;
    /**
     * Symbol of the system.
     * @type {string}
     * @memberof ScannedWaypoint
     */
    'systemSymbol': string;
    /**
     * Position in the universe in the x axis.
     * @type {number}
     * @memberof ScannedWaypoint
     */
    'x': number;
    /**
     * Position in the universe in the y axis.
     * @type {number}
     * @memberof ScannedWaypoint
     */
    'y': number;
    /**
     * List of waypoints that orbit this waypoint.
     * @type {Array<WaypointOrbital>}
     * @memberof ScannedWaypoint
     */
    'orbitals': Array<WaypointOrbital>;
    /**
     * 
     * @type {WaypointFaction}
     * @memberof ScannedWaypoint
     */
    'faction'?: WaypointFaction;
    /**
     * The traits of the waypoint.
     * @type {Array<WaypointTrait>}
     * @memberof ScannedWaypoint
     */
    'traits': Array<WaypointTrait>;
    /**
     * 
     * @type {Chart}
     * @memberof ScannedWaypoint
     */
    'chart'?: Chart;
}


