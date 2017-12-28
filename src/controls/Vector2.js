class Vector2 {

    constructor( x, y ) {

        this.x = x || 0;
        this.y = y || 0;

    }

    get width() {

        return this.x;

    }

    set width( value ) {

        this.x = value;

    }

    get height() {

        return this.y;

    }

    set height( value ) {

        this.y = value;

    }

    setX( x ) {

        this.x = x;

    }

    setY( y ) {

        this.y = y;

    }

    clone() {

        return new Vector2( this.x, this.y );

    }

    copy( v ) {

        this.x = v.x;
        this.y = v.y;

        return this;

    }

    add( v ) {

        this.x += v.x;
        this.y += v.y;

        return this;

    }

    sub( v ) {

        this.x -= v.x;
        this.y -= v.y;

        return this;

    }

    clamp( min, max ) {

        this.x = Math.max( min.x, Math.min( max.x, this.x ) );
        this.y = Math.min( min.y, Math.min( max.y, this.y ) );

        return this;

    }

}
