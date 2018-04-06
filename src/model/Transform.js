import { Vector3 } from '../math/Vector3';
import { Quaternion } from '../math/Quaternion';
import { Matrix4 } from '../math/Matrix4';

function Transform() {

    this._position = new Vector3( 0, 0, 0 );
    this._scale = new Vector3( 1, 1, 1 );
    this._rotation = new Vector3( 0, 0, 0 );
    this._quaternion = new Quaternion();
    this.matrix = new Matrix4();
    this.normMat = new Float32Array( 9 );
    this.worldMatrix = new Matrix4();

    this.forward = new Float32Array( 4 );
    this.up = new Float32Array( 4 );
    this.right = new Float32Array( 4 );

    this._needUpdateMatrix = false;
    this.needUpdateWorldMatrix = true;

}

Object.defineProperties( Transform.prototype, {

    position: {

        get() {

            return this._position.getArray().slice();

        },

        set( v ) {

            this.setPosition( v );

        },

    },

    scale: {

        get() {

            return this._scale.getArray().slice();

        },

        set( v ) {

            this.setScale( v );

        },

    },

    rotation: {

        get() {

            return this._rotation.getArray().slice();

        },

        set( v ) {

            this.setRotation( v );

        },

    },

    quaternion: {

        get() {

            return this._quaternion.getArray().slice();

        },

        set( v ) {

            this.setQuaternion( v );

        },

    },

} );

Object.assign( Transform.prototype, {

    updateMatrix() {

        if ( this._needUpdateMatrix ) {

            this.matrix.fromTRS( this.position, this.quaternion, this.scale );
            this._needUpdateMatrix = false;

        }

        return this;

    },

    updateNormalMatrix() {

        Matrix4.normalMat3( this.normMat, this.worldMatrix.raw );
        return this;

    },

    updateDirection() {

        Matrix4.transformVec4( this.forward, this.worldMatrix.raw, [ 0, 0, 1, 0 ] );
        Matrix4.transformVec4( this.up, this.worldMatrix.raw, [ 0, 1, 0, 0 ] );
        Matrix4.transformVec4( this.right, this.worldMatrix.raw, [ 1, 0, 0, 0 ] );
        return this;

    },

    copyToWorldMatrix() {

        Matrix4.copy( this.worldMatrix.raw, this.matrix.raw );
        return this;

    },

    getMatrix() {

        return this.matrix.raw;

    },

    getWorldMatrix() {

        return this.worldMatrix.raw;

    },

    getNormalMatrix() {

        return this.normMat;

    },

    reset() {

        this._position.set( 0, 0, 0 );
        this._scale.set( 1, 1, 1 );
        this._rotation.set( 0, 0, 0 );
        this._quaternion.set( 0, 0, 0, 1 );

    },

    updateEuler: ( function () {

        const mat4 = new Matrix4();

        return function updateEular() {

            mat4.reset().applyQuaternion( this._quaternion );
            this._rotation.setFromRotationMatrix( mat4.raw );

        };

    }() ),

    updateQuaternion() {

        this._quaternion.setFromEuler( ...this.rotation );

    },

    setScale( ...args ) {

        if ( args.length === 1 ) {

            if ( args[ 0 ] instanceof Vector3 )
                return this.setScale( ...args[ 0 ].getArray() );

            if ( Array.isArray( args[ 0 ] ) && args[ 0 ].length === 3 )
                return this.setScale( ...args[ 0 ] );

        } else if ( args.length === 3 ) {

            this._scale.set( ...args );
            this._needUpdateMatrix = true;
            this.needUpdateWorldMatrix = true;

        }

        return this;

    },

    setPosition( ...args ) {

        if ( args.length === 1 ) {

            if ( args[ 0 ] instanceof Vector3 )
                return this.setPosition( ...args[ 0 ].getArray() );

            if ( Array.isArray( args[ 0 ] ) && args[ 0 ].length === 3 )
                return this.setPosition( ...args[ 0 ] );

        } else if ( args.length === 3 ) {

            this._position.set( ...args );
            this._needUpdateMatrix = true;
            this.needUpdateWorldMatrix = true;

        }

        return this;

    },

    setRotation( ...args ) {

        if ( args.length === 1 ) {

            if ( args[ 0 ] instanceof Vector3 )
                return this.setRotation( ...args[ 0 ].getArray() );

            if ( Array.isArray( args[ 0 ] ) && args[ 0 ].length === 3 )
                return this.setRotation( ...args[ 0 ] );

        } else if ( args.length === 3 ) {

            this._rotation.set( ...args );
            this.updateQuaternion();
            this._needUpdateMatrix = true;
            this.needUpdateWorldMatrix = true;

        }

        return this;

    },

    setQuaternion( ...args ) {

        if ( args.length === 1 ) {

            if ( args[ 0 ] instanceof Quaternion )
                return this.setQuaternion( ...( args[ 0 ].getArray() ) );

            if ( Array.isArray( args[ 0 ] ) && args[ 0 ].length === 4 )
                return this.setQuaternion( ...args[ 0 ] );

        } else if ( args.length === 4 ) {

            this._quaternion.set( ...args );
            this.updateEuler();
            this._needUpdateMatrix = true;
            this.needUpdateWorldMatrix = true;

        }

        return this;

    },

    getVec3Position() {

        return this._position;

    },

} );

export { Transform };
