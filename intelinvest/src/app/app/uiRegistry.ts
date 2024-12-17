import {EventInfo} from "../components/eventInfo";
import {UI} from "@intelinvest/platform/src/app/ui";

/**
 * Реестр стандартных UI-компонентов, фильтров и директив
 */
export class UIRegistry {

    /**
     * Инициализация реестра компонентов, фильтров и директив
     */
    static init(): void {
        // TODO инициализация глобальных компонентов тут
        // компоненты
        UI.component("event-info", EventInfo);
    }
}
