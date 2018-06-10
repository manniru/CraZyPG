import { ShaderSlices } from './ShaderSlices';
import { ShaderParams } from '../core/constant';

const attribDefinesMap = {};
attribDefinesMap[ ShaderParams.ATTRIB_UV_NAME ] = 'HAS_UV';
attribDefinesMap[ ShaderParams.ATTRIB_NORMAL_NAME ] = 'HAS_NORMAL';
attribDefinesMap[ ShaderParams.ATTRIB_JOINT_0_NAME ] = 'HAS_SKIN';
attribDefinesMap[ ShaderParams.ATTRIB_COLOR_NAME ] = 'HAS_COLOR';

const ShaderFactory = {};

Object.assign( ShaderFactory, {

    parseVersion( v ) {

        return `#version ${v}\n`;

    },

    parseShaderName( name ) {

        return `#define SHADER_NAME ${name}`;

    },

    parseDefineObjFromPrimitive( primitive ) {

        const attributes = Object.keys( primitive.bufferInfo.attribs );
        const attributesInfluence = Object.keys( attribDefinesMap );
        return attributes.filter( a => attributesInfluence.indexOf( a ) > - 1 ).reduce( ( o, a ) => {

            o[ attribDefinesMap[ a ] ] = 1; // eslint-disable-line
            return o;

        }, {} );

    },

    parseDefineObjFromMaterial( material ) {

        const defineObj = {
            VERTEX_PRECISION: material.vertexPrecision,
            FRAGMENT_PRECISION: material.fragmentPrecision,
        };

        if ( material.baseTexture )
            defineObj.HAS_BASETEXTURE = 1;

        return defineObj;

    },

    parseDefineObj( defines ) {

        return `${Object.keys( defines ).map( key => `#define ${key} ${defines[ key ]}` ).join( '\n' )}\n`;

    },

    parsePrecision( p ) {

        return `precision ${p} float;\n
                precision ${p} int;\n\n`;

    },

    parseIncludes( src ) {

        const pattern = /^[ \t]*#include +<([\w\d.]+)>/gm;

        function replace( match, include ) {

            const slice = ShaderSlices[ include ];

            if ( slice === undefined )

                throw new TypeError( `can not find shader slice #include <${include}>` );

            return ShaderFactory.parseIncludes( replace );

        }

        return src.replace( pattern, replace );

    },

} );

export { ShaderFactory };
