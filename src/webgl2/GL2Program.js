export class GL2Program {

    constructor( vertexShader, fragmentShader ) {

        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
        this.uniformSetter = null;
        this.attributeSetter = null;

    }

}
