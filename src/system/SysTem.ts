import type { AppCfg } from './type.ts';
import { nanoid } from 'nanoid';
import { ref } from 'vue';
import { filter } from 'lodash-es';

class System {
    apps: AppCfg[] = [];
    runApps = ref<(Pick<AppCfg, 'id' | 'name'> & { runId: string })[]>([]);

    registerAppId() {
        return nanoid(16);
    }

    registerApp(app: AppCfg) {
        this.apps.push(app);
    }

    getApps() {
        return this.apps;
    }

    runApp(app: AppCfg) {
        const runId = nanoid(16);
        this.runApps.value.push({
            name: app.name,
            id: app.id,
            runId: runId,
        });
    }

    stopApp(runId: string) {
        this.runApps.value = filter(this.runApps.value, (app) => app.runId !== runId);
    }

    getRunApp() {
        return this.runApps.value;
    }
}

const system = new System();

export function useSystem() {
    return system;
}
