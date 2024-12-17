import {Component, Prop, UI} from "@intelinvest/platform/src/app/ui";

/**
 * Пример компонента
 */
@Component({
    // language=Vue
    template: `
    <div>
        <v-card
      class="mx-auto"
      max-width="360"
    >
            <v-card-title>Событие: {{ label }}</v-card-title>
            <v-card-text>
            <div v-for="(value, key) in event" :key="key">
                {{ key }} : {{ value ? value : 'Нет данных' }}
            </div>
            </v-card-text>
            </v-card>
    </div>
    `
})
export class EventInfo extends UI {
    @Prop({ type: String, default: 'Нет заголовка' }) private label!: string;
    @Prop({ type: Object, required: false}) private event!: object;
}