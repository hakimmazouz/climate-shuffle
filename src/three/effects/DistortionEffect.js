import { Uniform } from "three$";
import { Effect, EffectAttribute } from "postprocessing";

import fragment from "./../shaders/lensedistortion.frag.glsl";

export class DistortionEffect extends Effect {
    constructor() {
        super("DistortionEffect", fragment, {
            // attributes: EffectAttribute.CONVOLUTION,
            uniforms: new Map([["distortion", new Uniform(-6)]]),
        });
    }
}
