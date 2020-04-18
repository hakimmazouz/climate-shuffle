import Assets from "./Assets";
import { DPR } from "./../../utils/const";
import { LoadingManager, Vector2, ShaderMaterial } from "three$";
import {
    SMAAEffect,
    SMAAImageLoader,
    EffectComposer,
    EffectPass,
    ChromaticAberrationEffect,
    VignetteEffect,
    BlendFunction,
    NoiseEffect,
    ShaderPass,
    RenderPass,
    BloomEffect,
} from "postprocessing";
import { distortion } from "./../config";
import { mapConstrain } from "./../../utils";

import distortionFrag from "./../shaders/lensedistortion.pass.frag";
import distortionVert from "./../shaders/chromaticaberration.vert";

export default class PostProcessing {
    constructor(renderer, scene, camera, onReady) {
        this.composer = new EffectComposer(renderer);
        this.loadingManager = new LoadingManager();
        this.smaaImageLoader = new SMAAImageLoader(this.loadingManager);
        this.renderer = renderer;
        this.camera = camera;
        this.scene = scene;

        this.effects = {};
        this.onReady = onReady;

        this.baseRGBShift = 0.0004;

        this.setupSMAA().then(this.configurePasses.bind(this));
    }

    setupSMAA() {
        return new Promise((resolve) => {
            this.loadingManager.onLoad = () => resolve(Assets);

            this.smaaImageLoader.load(([search, area]) => {
                Assets.set("smaa-search", search);
                Assets.set("smaa-area", area);
            });
        });
    }

    configurePasses() {
        this.renderPass = new RenderPass(this.scene, this.camera);
        this.createShaderPass();
        this.createEffectPass({
            rgb: new ChromaticAberrationEffect({
                offset: new Vector2(this.baseRGBShift, 0),
            }),
            noise: {
                effect: new NoiseEffect({
                    blendFunction: BlendFunction.REFLECT,
                }),
                config: (effect) => {
                    effect.blendMode.opacity.value = 0.25;
                },
            },
            // vignette: new VignetteEffect({
            //     // eskil: true,
            //     offset: 1,
            //     darkness: 0.6,
            // }),
            bloom: new BloomEffect(),
        });
        this.createSMAAPass();

        this.addPass(this.renderPass).addPass(this.effectPass);

        if (DPR > 1) {
            this.addPass(this.shaderPass, true);
        } else {
            this.addPass(this.smaaPass).addPass(this.shaderPass, true);
        }

        this.onReady.call();
    }

    addPass(pass, renderToScreen = false) {
        pass.renderToScreen = renderToScreen;
        this.composer.addPass(pass);
        return this;
    }

    /**
     * Creates effectpass and adds the effects
     *
     * Example:
     * { rgbSplit: new ChromaticAbberrationEffect() }
     *
     * @param {[index: string]: Effect} effectsConfig
     */
    createEffectPass(effectsConfig) {
        for (let key in effectsConfig) {
            const effectConfig = effectsConfig[key];
            if (effectConfig.config && effectConfig.effect) {
                effectConfig.config(effectConfig.effect);
                this.effects[key] = effectConfig.effect;
            } else {
                this.effects[key] = effectConfig;
            }
        }

        this.effectPass = new EffectPass(
            this.camera,
            ...Object.values(this.effects)
        );
        return this;
    }

    /**
     *
     * @param {string} name
     * @param {(effect: Effect) => void} callback
     */
    editEffect(name, callback) {
        callback.call(null, this.effects[name]);
        return this;
    }

    createShaderPass() {
        this.distortion = new ShaderMaterial({
            uniforms: {
                resolution: {
                    value: new Vector2(
                        window.innerWidth * DPR,
                        window.innerHeight * DPR
                        // window.innerWidth * 2,
                        // window.innerHeight * 2
                    ),
                },
                distortion: {
                    value: 1,
                },
                inputBuffer: {
                    value: new Vector2(),
                },
            },
            fragmentShader: distortionFrag,
            vertexShader: distortionVert,
        });
        this.shaderPass = new ShaderPass(this.distortion);
        this.unsubDistortion = distortion.subscribe((value) => {
            const rgbShiftAmplification = mapConstrain(
                -value,
                1,
                6,
                this.baseRGBShift,
                this.baseRGBShift * 6
            );
            if (this.effects.rgb)
                this.effects.rgb.offset.set(rgbShiftAmplification, 0);
            this.distortion.uniforms.distortion.value = value;
        });
    }

    createSMAAPass() {
        this.smaaPass = new EffectPass(
            this.camera,
            new SMAAEffect(Assets.get("smaa-search"), Assets.get("smaa-area"))
        );
    }
}
