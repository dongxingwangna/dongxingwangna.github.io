import type { DefineSetupFnComponent, PublicProps } from 'vue';

/**
 * app 配置信息
 */
export interface AppCfg {
    /**
     * app标识
     */
    id: string;
    /**
     * 图标
     */
    icon: string;
    /**
     * 名字
     */
    name: string;
    /**
     * 入口
     */
    main: DefineSetupFnComponent<
        Record<string, any>,
        {},
        {},
        Record<string, any> & {},
        PublicProps
    >;
}
