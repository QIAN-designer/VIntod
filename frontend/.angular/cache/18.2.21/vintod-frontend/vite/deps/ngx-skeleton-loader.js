import {
  CommonModule,
  NgClass,
  NgStyle
} from "./chunk-DDS4TOI3.js";
import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  NgModule,
  computed,
  inject,
  input,
  isDevMode,
  numberAttribute,
  setClassMetadata,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵdeclareLet,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction5,
  ɵɵreadContextLet,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵstoreLet,
  ɵɵtemplate
} from "./chunk-M4AHXPGC.js";
import "./chunk-LWQBS4VX.js";
import {
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// node_modules/ngx-skeleton-loader/fesm2022/ngx-skeleton-loader.mjs
var _c0 = ["*"];
var _c1 = (a0, a1, a2, a3, a4) => ({
  "custom-content": a0,
  circle: a1,
  progress: a2,
  "progress-dark": a3,
  pulse: a4
});
function NgxSkeletonLoaderComponent_For_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0);
  }
}
function NgxSkeletonLoaderComponent_For_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 0);
    ɵɵtemplate(1, NgxSkeletonLoaderComponent_For_3_Conditional_1_Template, 1, 0);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    const appearanceValue_r2 = ɵɵreadContextLet(0);
    const animationValue_r3 = ɵɵreadContextLet(1);
    ɵɵproperty("ngClass", ɵɵpureFunction5(5, _c1, appearanceValue_r2 === "custom-content", appearanceValue_r2 === "circle", animationValue_r3 === "progress", animationValue_r3 === "progress-dark", animationValue_r3 === "pulse"))("ngStyle", ctx_r0.styles());
    ɵɵattribute("aria-label", ctx_r0.ariaLabel())("aria-valuetext", ctx_r0.loadingText());
    ɵɵadvance();
    ɵɵconditional(appearanceValue_r2 === "custom-content" ? 1 : -1);
  }
}
var NGX_SKELETON_LOADER_CONFIG = new InjectionToken("ngx-skeleton-loader.config");
var NgxSkeletonLoaderComponent = class _NgxSkeletonLoaderComponent {
  constructor() {
    this.#config = inject(NGX_SKELETON_LOADER_CONFIG, {
      optional: true
    });
    this.count = input(this.#config?.count || 1, {
      transform: numberAttribute
    });
    this.loadingText = input(this.#config?.loadingText || "Loading...");
    this.appearance = input(this.#config?.appearance || "line");
    this.animation = input(this.#config?.animation || "progress");
    this.ariaLabel = input(this.#config?.ariaLabel || "loading");
    this.theme = input(this.#config?.theme || null);
    this.items = computed(() => {
      let count = this.count() || 1;
      if (this.appearance() === "custom-content") {
        if (isDevMode() && count !== 1) {
          console.error(`\`NgxSkeletonLoaderComponent\` enforces elements with "custom-content" appearance as DOM nodes. Forcing "count" to "1".`);
          count = 1;
        }
      }
      return [...Array(count)].map((_, index) => index);
    });
    this.styles = computed(() => {
      const theme = this.theme();
      if (this.#config?.theme?.extendsFromRoot) {
        return __spreadValues(__spreadValues({}, this.#config?.theme), theme);
      }
      return theme;
    });
  }
  /**
   * Injects the `NgxSkeletonLoaderConfig` configuration object, which is optional.
   * This configuration object provides various options for customizing the behavior
   * and appearance of the `NgxSkeletonLoaderComponent`.
   */
  #config;
  static {
    this.ɵfac = function NgxSkeletonLoaderComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _NgxSkeletonLoaderComponent)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _NgxSkeletonLoaderComponent,
      selectors: [["ngx-skeleton-loader"]],
      inputs: {
        count: [1, "count"],
        loadingText: [1, "loadingText"],
        appearance: [1, "appearance"],
        animation: [1, "animation"],
        ariaLabel: [1, "ariaLabel"],
        theme: [1, "theme"]
      },
      standalone: true,
      features: [ɵɵStandaloneFeature],
      ngContentSelectors: _c0,
      decls: 4,
      vars: 2,
      consts: [["aria-busy", "true", "aria-valuemin", "0", "aria-valuemax", "100", "role", "progressbar", "tabindex", "-1", 1, "skeleton-loader", 3, "ngClass", "ngStyle"]],
      template: function NgxSkeletonLoaderComponent_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵprojectionDef();
          ɵɵdeclareLet(0)(1);
          ɵɵrepeaterCreate(2, NgxSkeletonLoaderComponent_For_3_Template, 2, 11, "div", 0, ɵɵrepeaterTrackByIdentity);
        }
        if (rf & 2) {
          ɵɵstoreLet(ctx.appearance());
          ɵɵadvance();
          ɵɵstoreLet(ctx.animation());
          ɵɵadvance();
          ɵɵrepeater(ctx.items());
        }
      },
      dependencies: [NgClass, NgStyle],
      styles: ['.skeleton-loader[_ngcontent-%COMP%]{box-sizing:border-box;overflow:hidden;position:relative;background:#eff1f6 no-repeat;border-radius:4px;width:100%;height:20px;display:inline-block;margin-bottom:10px;will-change:transform}.skeleton-loader[_ngcontent-%COMP%]:after, .skeleton-loader[_ngcontent-%COMP%]:before{box-sizing:border-box}.skeleton-loader.circle[_ngcontent-%COMP%]{width:40px;height:40px;margin:5px;border-radius:50%}.skeleton-loader.progress[_ngcontent-%COMP%], .skeleton-loader.progress-dark[_ngcontent-%COMP%]{transform:translateZ(0)}.skeleton-loader.progress[_ngcontent-%COMP%]:after, .skeleton-loader.progress[_ngcontent-%COMP%]:before, .skeleton-loader.progress-dark[_ngcontent-%COMP%]:after, .skeleton-loader.progress-dark[_ngcontent-%COMP%]:before{box-sizing:border-box}.skeleton-loader.progress[_ngcontent-%COMP%]:before, .skeleton-loader.progress-dark[_ngcontent-%COMP%]:before{animation:_ngcontent-%COMP%_progress 2s ease-in-out infinite;background-size:200px 100%;position:absolute;z-index:1;top:0;left:0;width:200px;height:100%;content:""}.skeleton-loader.progress[_ngcontent-%COMP%]:before{background-image:linear-gradient(90deg,#fff0,#fff9,#fff0)}.skeleton-loader.progress-dark[_ngcontent-%COMP%]:before{background-image:linear-gradient(90deg,transparent,rgba(0,0,0,.2),transparent)}.skeleton-loader.pulse[_ngcontent-%COMP%]{animation:_ngcontent-%COMP%_pulse 1.5s cubic-bezier(.4,0,.2,1) infinite;animation-delay:.5s}.skeleton-loader.custom-content[_ngcontent-%COMP%]{height:100%;background:none}@media (prefers-reduced-motion: reduce){.skeleton-loader.pulse[_ngcontent-%COMP%], .skeleton-loader.progress-dark[_ngcontent-%COMP%], .skeleton-loader.custom-content[_ngcontent-%COMP%], .skeleton-loader.progress[_ngcontent-%COMP%]:before{animation:none}.skeleton-loader.progress[_ngcontent-%COMP%]:before, .skeleton-loader.progress-dark[_ngcontent-%COMP%], .skeleton-loader.custom-content[_ngcontent-%COMP%]{background-image:none}}@media screen and (min-device-width: 1200px){.skeleton-loader[_ngcontent-%COMP%]{-webkit-user-select:none;user-select:none;cursor:wait}}@keyframes _ngcontent-%COMP%_progress{0%{transform:translate3d(-200px,0,0)}to{transform:translate3d(calc(200px + 100vw),0,0)}}@keyframes _ngcontent-%COMP%_pulse{0%{opacity:1}50%{opacity:.4}to{opacity:1}}'],
      changeDetection: 0
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxSkeletonLoaderComponent, [{
    type: Component,
    args: [{
      selector: "ngx-skeleton-loader",
      imports: [NgClass, NgStyle],
      changeDetection: ChangeDetectionStrategy.OnPush,
      standalone: true,
      template: `@let appearanceValue = appearance();
@let animationValue = animation();
@for (item of items(); track item) {
  <div
    class="skeleton-loader"
    [attr.aria-label]="ariaLabel()"
    aria-busy="true"
    aria-valuemin="0"
    aria-valuemax="100"
    [attr.aria-valuetext]="loadingText()"
    role="progressbar"
    tabindex="-1"
    [ngClass]="{
      'custom-content': appearanceValue === 'custom-content',
      circle: appearanceValue === 'circle',
      progress: animationValue === 'progress',
      'progress-dark': animationValue === 'progress-dark',
      pulse: animationValue === 'pulse'
    }"
    [ngStyle]="styles()"
    >
    @if (appearanceValue  === 'custom-content') {
      <ng-content></ng-content>
    }
  </div>
}
`,
      styles: ['.skeleton-loader{box-sizing:border-box;overflow:hidden;position:relative;background:#eff1f6 no-repeat;border-radius:4px;width:100%;height:20px;display:inline-block;margin-bottom:10px;will-change:transform}.skeleton-loader:after,.skeleton-loader:before{box-sizing:border-box}.skeleton-loader.circle{width:40px;height:40px;margin:5px;border-radius:50%}.skeleton-loader.progress,.skeleton-loader.progress-dark{transform:translateZ(0)}.skeleton-loader.progress:after,.skeleton-loader.progress:before,.skeleton-loader.progress-dark:after,.skeleton-loader.progress-dark:before{box-sizing:border-box}.skeleton-loader.progress:before,.skeleton-loader.progress-dark:before{animation:progress 2s ease-in-out infinite;background-size:200px 100%;position:absolute;z-index:1;top:0;left:0;width:200px;height:100%;content:""}.skeleton-loader.progress:before{background-image:linear-gradient(90deg,#fff0,#fff9,#fff0)}.skeleton-loader.progress-dark:before{background-image:linear-gradient(90deg,transparent,rgba(0,0,0,.2),transparent)}.skeleton-loader.pulse{animation:pulse 1.5s cubic-bezier(.4,0,.2,1) infinite;animation-delay:.5s}.skeleton-loader.custom-content{height:100%;background:none}@media (prefers-reduced-motion: reduce){.skeleton-loader.pulse,.skeleton-loader.progress-dark,.skeleton-loader.custom-content,.skeleton-loader.progress:before{animation:none}.skeleton-loader.progress:before,.skeleton-loader.progress-dark,.skeleton-loader.custom-content{background-image:none}}@media screen and (min-device-width: 1200px){.skeleton-loader{-webkit-user-select:none;user-select:none;cursor:wait}}@keyframes progress{0%{transform:translate3d(-200px,0,0)}to{transform:translate3d(calc(200px + 100vw),0,0)}}@keyframes pulse{0%{opacity:1}50%{opacity:.4}to{opacity:1}}\n']
    }]
  }], null, null);
})();
var NgxSkeletonLoaderModule = class _NgxSkeletonLoaderModule {
  static forRoot(config) {
    return {
      ngModule: _NgxSkeletonLoaderModule,
      providers: [{
        provide: NGX_SKELETON_LOADER_CONFIG,
        useValue: config
      }]
    };
  }
  static {
    this.ɵfac = function NgxSkeletonLoaderModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _NgxSkeletonLoaderModule)();
    };
  }
  static {
    this.ɵmod = ɵɵdefineNgModule({
      type: _NgxSkeletonLoaderModule,
      imports: [CommonModule, NgxSkeletonLoaderComponent],
      exports: [NgxSkeletonLoaderComponent]
    });
  }
  static {
    this.ɵinj = ɵɵdefineInjector({
      imports: [CommonModule]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxSkeletonLoaderModule, [{
    type: NgModule,
    args: [{
      imports: [CommonModule, NgxSkeletonLoaderComponent],
      exports: [NgxSkeletonLoaderComponent]
    }]
  }], null, null);
})();
export {
  NGX_SKELETON_LOADER_CONFIG,
  NgxSkeletonLoaderComponent,
  NgxSkeletonLoaderModule
};
//# sourceMappingURL=ngx-skeleton-loader.js.map
