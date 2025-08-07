import type { AppCfg } from './type.ts';
import { nanoid } from 'nanoid';

class System {
    apps: AppCfg[] = [];

    registerApp(app: AppCfg) {
        if (!app.id) {
            app.id = nanoid(16);
        }
        this.apps.push(app);
    }

    getApps() {
        return this.apps;
    }
}

const system = new System();

export function useSystem() {
    return system;
}
