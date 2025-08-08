import type { AppCfg } from './type.ts';
import { nanoid } from 'nanoid';
import { ref } from 'vue';

class System {
    apps: AppCfg[] = [];
    runApps = ref<string[]>([]);

    registerApp(app: AppCfg) {
        if (!app.id) {
            app.id = nanoid(16);
        }
        this.apps.push(app);
    }

    getApps() {
        return this.apps;
    }

    runApp(app: AppCfg) {
        this.runApps.value.push(app.name);
    }

    getRunApp() {
        return this.runApps.value;
    }
}

const system = new System();

export function useSystem() {
    return system;
}
